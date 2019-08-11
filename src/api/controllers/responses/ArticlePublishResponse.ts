import { Article } from '../../models/Article';

export interface ArticlePublishResponse {
    article: Article;

    wordpress: any;
}
