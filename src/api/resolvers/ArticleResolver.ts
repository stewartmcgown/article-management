import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';

import { Article } from '../models/Article';
import { ArticleService } from '../services/ArticleService';

@Service()
@Resolver(of => Article)
export class ArticleResolver {

    constructor(
        private articleService: ArticleService
    ) { }

    @Query(returns => [Article])
    public articles(): Promise<any> {
        return this.articleService.find();
    }

}
