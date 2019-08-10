import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { Subject, Type } from '../Article';
import { Author } from '../Author';
import { AbstractDTO } from './AbstractDTO';

@Exclude()
export class ArticleDTO extends AbstractDTO {
    @Expose()
    @IsNotEmpty()
    public title: string;

    @Expose()
    @IsNotEmpty()
    public type: Type;

    @Expose()
    @IsNotEmpty()
    public subject: Subject;

    @Expose()
    public notes: string;

    @Expose()
    public copyright: string;

    @Expose()
    @IsNotEmpty()
    public summary: string;

    @Expose()
    public reason: string;

    @Expose()
    @IsNotEmpty()
    public authors: Author[];
}
