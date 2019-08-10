/**
 * Public endpoints shouldn't get to know any details about
 * marking grid etc.
 */
export interface ArticleCreateResponse {
    id: string;

    title: string;
}
