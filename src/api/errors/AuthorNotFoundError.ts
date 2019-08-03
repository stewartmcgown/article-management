import { HttpError } from 'routing-controllers';

export class AuthorNotFoundError extends HttpError {
    constructor() {
        super(404, 'Author not found!');
    }
}
