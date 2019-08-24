import { EventSubscriber, On } from 'event-dispatch';
import Container from 'typedi';

import { CopyrightService } from '../../lib/copyright';
import { AnalysisResult } from '../../lib/copyright/Analyser';
import { PlagiarismService } from '../../lib/plagiarism';
import { ArticleSender } from '../../mail/ArticleSender';
import { Article } from '../models/Article';
import { Editor } from '../models/Editor';
import { ArticleService } from '../services/ArticleService';
import { events } from './events';

export interface ArticleAssignedEvent {
    article: Article;

    editor: Editor;
}

@EventSubscriber()
export class ArticleEventSubscriber {
    private articleSender: ArticleSender;
    private copyrightService: CopyrightService;
    private articleService: ArticleService;
    private plagiarismService: PlagiarismService;

    constructor() {
        this.articleSender = Container.get(ArticleSender);
        this.copyrightService = Container.get(CopyrightService);
        this.articleService = Container.get(ArticleService);
        this.plagiarismService = Container.get(PlagiarismService);
    }

    @On(events.article.created)
    public onArticleCreate(article: Article): void {
        this.articleSender.sendArticle(article, {
            isNew: true,
        });

        this.copyrightService.add(article);
        this.plagiarismService.add(article);
    }

    @On(events.article.updated)
    public onArticleUpdated(article: Article): void {
        this.articleSender.sendArticle(article);
    }

    @On(events.article.copyrightUpdated)
    public onCopyrightUpdated(result: AnalysisResult): void {
        this.articleService.updateCopyright(result);
    }

    @On(events.article.assigned)
    public onArticleAssigned(event: ArticleAssignedEvent): void {
        console.log(event);
    }
}
