import consola from 'consola';

import { Article } from '../../api/models/Article';

export interface Infringement {
    item: string;
}

export interface AnalysisResult {
    articleId: string;

    infringements: Infringement[];
}

export class Analyser {
    constructor(private article: Article) { }

    public async analyse(): Promise<AnalysisResult> {
        consola.info(`Analysing ${this.article.title}`);

        return {
            articleId: this.article.id,
            infringements: [],
        };
    }
}
