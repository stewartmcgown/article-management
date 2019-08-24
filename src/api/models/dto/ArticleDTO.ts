import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'routing-controllers/node_modules/class-transformer';

import { IsNonPrimitiveArray } from '../../../decorators/Validate';
import * as Enums from '../enums';
import { Subject } from '../enums/Subject';
import { AbstractDTO } from './AbstractDTO';
import { AuthorDTO } from './AuthorDTO';

@Exclude()
export class ArticleDTO extends AbstractDTO {
    @Expose()
    @IsNotEmpty()
    public title: string;

    @Expose()
    @IsNotEmpty()
    public type: Enums.Type;

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
    @ValidateNested({
        each: true,
    })
    @IsNonPrimitiveArray()
    @Type(() => AuthorDTO)
    public authors: AuthorDTO[];
}
