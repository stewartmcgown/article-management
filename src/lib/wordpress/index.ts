import mammoth from 'mammoth';
import { extension } from 'mime-types';
import { Service } from 'typedi';
import WPAPI from 'wpapi';

import { ArticleNotPublishedError } from '../../api/errors/ArticleNotPublishedError';
import { Article } from '../../api/models/Article';
import { env } from '../../env';
import { Drive } from '../google/Drive';

export interface WordpressPost {
    id?: number;
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
    format?:
    | 'standard'
    | 'aside'
    | 'chat'
    | 'gallery'
    | 'link'
    | 'image'
    | 'quote'
    | 'status'
    | 'video'
    | 'audio'; // The format for the object.
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

export interface MammothImage {
    src: string;

    class: string;
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

    /**
     * Publishes an article to the remote Wordpress instance.
     *
     * @param article the article to publish
     */
    public async publishArticle(article: Article): Promise<WordpressPost> {
        const post = await this.articleToPost(article);

        const result = await this.client.posts().create(post);

        post.content = undefined; // Garbage collection

        return result;
    }

    /**
     * Get an article from the remote Wordpress instance.
     *
     * Article must have a wordpressId, or it is not published.
     *
     * @param article to fetch
     * @return the remote post
     * @throws {ArticleNotPublishedError} if the article is not published
     */
    public async getArticle(article: Article): Promise<WordpressPost> {
        if (!article.wordpressId) {
            throw new ArticleNotPublishedError();
        }

        let post: WordpressPost;

        try {
            post = await this.client
                .posts()
                .id(article.wordpressId)
                .get();
        } catch {
            throw new ArticleNotPublishedError();
        }

        return post;
    }

    private async uploadImage(
        title: string,
        contentType: string,
        binary: string
    ): Promise<any> {
        const mediaRequest: WordpressMedia = {
            title,
        };

        const result = await this.client
            .media()
            .file(Buffer.from(binary, 'binary'), mediaRequest.title)
            .create(mediaRequest);

        return result;
    }

    /**
     * @param article the article containing the image
     * @return a function resulting in a promise that is used by Mammoth to
     *          convert images into HTML, by first inserting them in
     *          to the wordpress Media library.
     */
    private getConvertImage(article: Article): () => Promise<MammothImage> {
        const boundImageUpload = this.uploadImage.bind(this);

        return mammoth.images.inline(element => {
            return element
                .read('binary')
                .then(binary => {
                    return boundImageUpload(
                        `Image for ${article.title}.${extension(
                            element.contentType
                        )}`,
                        element.contentType,
                        binary
                    );
                })
                .then(uploadResult => {
                    if (uploadResult.error !== undefined) {
                        throw new Error(uploadResult.message);
                    }

                    return {
                        src: uploadResult.source_url,
                        class: 'wp-image-' + uploadResult.id,
                    };
                })
                .catch(err => {
                    throw err;
                });
        });
    }

    private async articleToPost(article: Article): Promise<WordpressPost> {
        const buffer = await this.driveService.exportFile({
            id: article.docId,
            mimeType:
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        const mammothOptions = {
            convertImage: this.getConvertImage(article),
        };

        const { value } = await mammoth.convertToHtml(
            {
                buffer,
            },
            mammothOptions
        );

        return {
            title: article.title,
            content: value,
        };
    }
}
