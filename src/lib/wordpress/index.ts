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

export interface WordpressMedia {
    date?: any; //  The date the object was published, in the site's timezone.
    date_gmt?: any; //  The date the object was published, as GMT.
    slug?: any; //  An alphanumeric identifier for the object unique to its type.
    status?: 'publish' | 'future' | 'draft' | 'pending' | 'private'; //  A named status for the object.
    title?: any; //  The title for the object.
    author?: any; //  The ID for the author of the object.
    comment_status?: 'open' | 'closed'; //  Whether or not comments are open on the object.
    ping_status?: 'open' | 'closed'; //  Whether or not the object can be pinged.
    meta?: any; //  Meta fields.
    template?: any; //  The theme file to use to display the object.
    alt_text?: any; //  Alternative text to display when attachment is not displayed.
    caption?: any; //  The attachment caption.
    description?: any; //  The attachment description.
    post?: any; //  The ID for the associated post of the attachment.
}

@Service()
export class WordpressService {

    private client: WPAPI;

    constructor(private driveService: Drive) {
        this.client = new WPAPI({
            endpoint: env.wordpress.url,
            username: env.wordpress.user,
            password: env.wordpress.password,
        });
    }

    public async publishArticle(article: Article): Promise<any> {
        const post = await this.articleToPost(article);

        const result = await this.client.posts().create(post);

        post.content = undefined; // Garbage collection

        return result;
    }

    private async uploadImage(article: Article, imageBuffer: any): Promise<any> {
        const mediaRequest: WordpressMedia = {
            title: `Image for ${article.title}`,
        };

        const result = await this.client.media().create({

        });
    }

    private async articleToPost(article: Article): Promise<WordpressPost> {
        const buffer = await this.driveService.downloadFile({
            id: article.docId,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        const mammothOptions = {
            /*convertImage: mammoth.images.imgElement((image) => {
                return image.read('base64').then((imageBuffer) => {
                    return {
                        src: "data:" + image.contentType + ";base64," + imageBuffer
                    };
                });
            }),*/
        };

        const { value } = await mammoth.convertToHtml({
            buffer,
        }, mammothOptions);

        return {
            title: article.title,
            content: value,
        };
    }
}
