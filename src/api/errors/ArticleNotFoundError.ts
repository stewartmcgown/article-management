import { HttpError } from 'routing-controllers';

export class ArticleNotFoundError extends HttpError {
    constructor() {
        super(404, 'Article not found!');
    }
}
