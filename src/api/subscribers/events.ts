import { User } from '../models/User';

/**
 * events
 * ---------------------
 * Define all your possible custom events here.
 */
export const events = {
    editor: {
        created: 'onEditorCreate',
    },
    author: {
        created: 'onAuthorCreate',
    },
    article: {
        created: 'onArticleCreate',
        updated: 'onArticleUpdate',
        copyrightUpdated: 'onArticleCopyrightUpdate',
    },
    pin: {
        issued: 'onPinIssued',
    },
};

export interface PinIssuedEvent {
    pin: string;

    user: User;
}
