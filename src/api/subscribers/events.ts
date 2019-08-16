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
        assigned: 'onArticleAssigned',
    },
    pin: {
        issued: 'onPinIssued',
    },
    subject: {
        created: 'onSubjectCreate',
    },
};

export interface PinIssuedEvent {
    pin: string;

    user: User;
}
