import { Service } from 'typedi';

import { Article } from '../../api/models/Article';
import { events } from '../../api/subscribers/events';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Analyser, AnalysisResult } from './Analyser';

/**
 * The Copyright Service
 *
 * Makes an attempt to find any copyright protected content in a submission.
 *
 * @author Stewart McGown <stewart@twistedcore.co.uk>
 * @version 0.0.1
 */
@Service()
export class CopyrightService {

    private analysisJobs: Map<string, Analyser> = new Map();

    constructor(@EventDispatcher() private eventDispatcher: EventDispatcherInterface) { }

    /**
     * Analyse an article for copyright infringement.
     *
     * @param article an article to analyse
     */
    public add(article: Article): void {
        const analyser = new Analyser(article);

        analyser.analyse()
            .then(result => this.submitResult(result));

        this.analysisJobs.set(article.id, analyser);
    }

    protected submitResult(result: AnalysisResult): void {
        this.analysisJobs.delete(result.articleId);
        this.eventDispatcher.dispatch(events.article.copyrightUpdated, result);
    }

}
