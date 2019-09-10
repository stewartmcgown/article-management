import { validateSync } from 'class-validator';
import consola from 'consola';
import { attemptUpdate } from 'protected-ts';
import { plainToClass } from 'routing-controllers/node_modules/class-transformer';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import uuid from 'uuid';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { validate, validated } from '../../decorators/Validate';
import { env } from '../../env';
import { AnalysisResult } from '../../lib/copyright/Analyser';
import { Drive } from '../../lib/google/Drive';
import { WordpressService } from '../../lib/wordpress';
import { getAllRelations } from '../../utils/typeorm';
import { ArticlePublishResponse } from '../controllers/responses/ArticlePublishResponse';
import { Article } from '../models/Article';
import { Author } from '../models/Author';
import { ArticleDTO } from '../models/dto/ArticleDTO';
import { AuthorDTO } from '../models/dto/AuthorDTO';
import { Editor } from '../models/Editor';
import { User } from '../models/User';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { events } from '../subscribers/events';
import { validateArticleFiles } from '../validators/ArticleValidator';
import { AuthorService } from './AuthorService';

@Service()
export class ArticleService {
    constructor(
        @OrmRepository() private articleRepository: ArticleRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface,
        private driveService: Drive,
        private wordpressService: WordpressService,
        private authorService: AuthorService
    ) {

    }

    public find(searchKeys: object): Promise<Article[]> {
        this.log.info('Find all articles');

        return this.articleRepository.find({
            relations: getAllRelations(Article),
            where: {
                ...searchKeys,
            },
        });
    }

    public findOne(id: string): Promise<Article | undefined> {
        this.log.info('Find one article');
        return this.articleRepository.findOne(id, {
            relations: getAllRelations(Article),
        });
    }

    @validated()
    public async create(
        @validate() articleDto: ArticleDTO,
        file: Express.Multer.File,
        photos: Express.Multer.File[]
    ): Promise<Article> {
        if (articleDto.authors.length < 1 || articleDto.authors.some(a => validateSync(a).length > 0)) {
            throw new Error();
        }

        validateArticleFiles(file, photos);

        // DTO -> Class
        articleDto.authors = plainToClass<Author, AuthorDTO[]>(Author, articleDto.authors);

        const findAuthorOrAuthor = async (author) => ((await this.authorService.findByEmail(author.email)) || author);
        articleDto.authors = await Promise.all(articleDto.authors.map(author => findAuthorOrAuthor(author)));

        const article = plainToClass<Article, ArticleDTO>(Article, articleDto);

        this.log.info('Create a new article => ', article.toString());

        const folderId = await this.driveService.createFolder({
            name: article.title,
            parentId: env.google.parent,
        });

        article.folderId = folderId;

        const docId = await this.driveService.createFile({
            name: article.title,
            file,
            mimeType: 'application/vnd.google-apps.document',
            parentId: folderId,
        });

        article.docId = docId;

        const markingGridId = await this.driveService.copy({
            source: env.google.marking_grid,
            dest: folderId,
            name: `Marking Grid for ${article.title}`,
        });

        article.markingGridId = markingGridId;

        // Process permissions asynchronously
        for (const { email } of article.authors) {
            this.driveService.shareFile({
                id: docId,
                role: 'writer',
                email,
            });
        }

        article.id = uuid.v4();
        const newArticle = await this.articleRepository.save(article);
        this.eventDispatcher.dispatch(events.article.created, newArticle);
        return newArticle;
    }

    public async update(id: string, updates: Article, user: User): Promise<Article> {
        this.log.info('Update a article');
        const article = await this.articleRepository.findOne(id);
        attemptUpdate(article, updates, {
            fail: true,
            ruleArgs: {
                roles: [user.level],
            },
        });

        return this.articleRepository.save(article);
    }

    public async delete(id: string): Promise<void> {
        this.log.info('Delete a article');
        await this.articleRepository.delete(id);
        return;
    }

    public async publish(id: string): Promise<ArticlePublishResponse> {
        const article = await this.articleRepository.findOne(id);
        const wordpress = await this.wordpressService.publishArticle(article);

        article.wordpressId = wordpress.id;
        this.articleRepository.save(article);

        return {
            article,
            wordpress,
        };
    }

    /**
     * Get the details of a published article
     *
     * @param id id of an article
     */
    public async getPublished(id: string): Promise<ArticlePublishResponse> {
        const article = await this.articleRepository.findOne(id);

        if (!article) {
            return undefined;
        }

        const wordpress = await this.wordpressService.getArticle(article);

        return {
            article,
            wordpress,
        };
    }

    /**
     * Receive a copyright event and update the article related to it.
     *
     * @param result a result of a copyright analysis
     * @internal
     */
    public async updateCopyright(result: AnalysisResult): Promise<void> {
        const article = await this.articleRepository.findOne(result.articleId);

        consola.log(article.title);
    }

    /**
     * @param id of an article
     * @param editors to assign
     * @param remove if this is for a removal operation
     *
     * TODO: Implement removal
     */
    public async assign(
        id: string,
        editors: Editor[],
        remove = false
    ): Promise<Article> {
        const article = await this.findOne(id);

        if (!article) {
            return article;
        }

        const existingEditors = article.editors.reduce((map, obj) => {
            map[obj.id] = obj;
            return map;
        }, {});

        editors.forEach(editor => {
            if (!existingEditors[editor.id]) {
                article.editors.push(editor);
            }
        });

        await this.articleRepository.save(article);

        article.editors.forEach(editor => {
            if (!existingEditors[editor.id]) {
                this.eventDispatcher.dispatch(events.article.assigned, {
                    article,
                    editor,
                });
            }
        });

        return article;
    }

    /**
     * Get the plain text of an article
     *
     * @param article to get text from
     */
    public async getText(article: Article): Promise<string> {
        const { docId } = article;

        const file = await this.driveService.exportFile({
            id: docId,
            mimeType: 'text/plain',
        });

        return Buffer.from(file).toString('utf-8');
    }
}
