import { Service } from 'typedi';

import { Article } from '../../api/models/Article';
import { ArticleService } from '../../api/services/ArticleService';
import { AuthService } from '../../auth/AuthService';
import { Logger } from '../../decorators/Logger';
import { sleep } from '../../utils';
import { plagiarism } from '../grammarly';
import { LoggerInterface } from '../logger';

@Service()
export class PlagiarismService {
    private queue: Article[] = [];
    private running = false;

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        private articleService: ArticleService,
        private authService: AuthService
    ) {
        this.running = true;
        this.run();
    }

    public add(article: Article): void {
        this.queue.push(article);
    }

    public stop(): void {
        this.running = false;
    }

    /**
     * Loops and checks for updates to the queue
     */
    private async run(): Promise<void> {
        while (this.running) {
            const current = this.queue.pop();

            if (current !== undefined) {
                const text = await this.articleService.getText(current);
                const { hasPlagiarism } = await plagiarism(text);

                if (hasPlagiarism) {
                    this.log.info(`[${current.id}] Plagiarism detected`);
                    const article = await this.articleService.findOne(current.id);
                    article.hasPlagiarism = hasPlagiarism;
                    await this.articleService.update(article.id, article, await this.authService.getServiceUser());
                }
            }

            await sleep(10000);
        }
    }
}
