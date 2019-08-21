import { plagiarism } from 'grammarly-api';
import { Service } from 'typedi';

import { Article } from '../../api/models/Article';
import { ArticleService } from '../../api/services/ArticleService';
import { Logger } from '../../decorators/Logger';
import { sleep } from '../../utils';
import { LoggerInterface } from '../logger';

@Service()
export class PlagiarismService {
    private queue: Article[] = [];
    private running = false;

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        private articleService: ArticleService
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
            const text = await this.articleService.getText(current);
            const { hasPlagiarism } = await plagiarism(text);

            if (hasPlagiarism) {
                this.log.info(`[${current.id}] Plagiarism detected`);
            }

            await sleep(1000);
        }
    }
}
