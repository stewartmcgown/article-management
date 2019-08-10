import { Exclude, Expose } from 'class-transformer';

import { Subject, Type } from '../Article';
import { Author } from '../Author';

@Exclude()
export class ArticleDTO {
    @Expose() public title: string;

    @Expose() public type: Type;

    @Expose() public subject: Subject;

    @Expose() public notes: string;

    @Expose() public copyright: string;

    @Expose() public summary: string;

    @Expose() public reason: string;

    @Expose() public authors: Author[];
}
