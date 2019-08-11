import mammoth from 'mammoth';
import { Service } from 'typedi';
import WPAPI from 'wpapi';

import { Article } from '../../api/models/Article';
import { env } from '../../env';
import { Drive } from '../../google/Drive';

export interface WordpressPost {
    date?: any; // The date the object was published, in the site's timezone.
    date_gmt?: any; // The date the object was published, as GMT.
    slug?: any; // An alphanumeric identifier for the object unique to its type.
    status?: 'publish' | 'future' | 'draft' | 'pending' | 'private'; // A named status for the object.
    password?: any; // A password to protect access to the content and excerpt.
    title: any; // The title for the object.
    content: any; // The content for the object.
    author?: any; // The ID for the author of the object.
    excerpt?: any; // The excerpt for the object.
    featured_media?: any; // The ID of the featured media for the object.
    comment_status?: 'open' | 'closed'; // Whether or not comments are open on the object.
    ping_status?: 'open' | 'closed'; // Whether or not the object can be pinged.
    format?: 'standard' | 'aside' | 'chat' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio'; // The format for the object.
    meta?: any; // Meta fields.
    sticky?: any; // Whether or not the object should be treated as sticky.
    template?: any; // The theme file to use to display the object.
    categories?: any; // The terms assigned to the object in the category taxonomy.
    tags?: any; // The terms assigned to the object in the post_tag taxonomy.
}

@Service()
export class WordpressService {

    private client: WPAPI;

    constructor(private driveService: Drive) {
        this.client = new WPAPI({
            endpoint: env.wordpress.url,
        });
    }

    public async publishArticle(article: Article): Promise<any> {
        const post = await this.articleToPost(article);

        await this.client.posts().create(post);

        return {
            success: true,
        };
    }

    private async articleToPost(article: Article): Promise<WordpressPost> {
        const buffer = await this.driveService.downloadFile({
            id: article.docId,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        const content = await mammoth.convertToHtml({
            buffer,
        });

        return {
            title: article.title,
            content,
        };
    }
}
