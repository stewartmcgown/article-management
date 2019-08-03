import { HttpError } from 'routing-controllers';

export class EditorNotFoundError extends HttpError {
    constructor() {
        super(404, 'Editor not found!');
    }
}
