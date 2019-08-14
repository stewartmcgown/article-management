import { HttpError } from 'routing-controllers';

export class ArticleNotPublishedError extends HttpError {
    constructor() {
        super(500, 'Article not published!');
    }
}
