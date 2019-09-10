import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'routing-controllers/node_modules/class-transformer';

import { IsNonPrimitiveArray } from '../../../decorators/Validate';
import * as Enums from '../enums';
import { Subject } from '../Subject';
import { AbstractDTO } from './AbstractDTO';
import { AuthorDTO } from './AuthorDTO';

/**
 * Allowed formats for conversion to Google Doc
 */
export const ALLOWED_FORMATS = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    'application/vnd.ms-word.template.macroenabled.12',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.sun.xml.writer',
    'application/vnd.ms-word.document.macroenabled.12',
    'text/rtf',
    'text/plain',
    'application/x-vnd.oasis.opendocument.text',
    'application/msword',
    'application/pdf',
    'application/rtf',
    'text/html',
    'application/vnd.oasis.opendocument.text',
    'text/richtext',
];

/**
 * Allowed formats for images
 */
export const ALLOWED_PHOTO_FORMATS = [
    'image/jpeg',
    'image/png',
    'image/webp',
];

/**
 * Maximum size of uploaded articles
 */
export const MAX_SIZE = 10485760;

export const MAX_PHOTO_SIZE = 10485760;

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
