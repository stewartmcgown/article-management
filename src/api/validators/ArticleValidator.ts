import { ValidationError } from 'class-validator';

import {
    ALLOWED_FORMATS, ALLOWED_PHOTO_FORMATS, MAX_PHOTO_SIZE, MAX_SIZE
} from '../models/dto/ArticleDTO';

/**
 * Validate an article file.
 *
 * @param file an article file
 * @param photos photos
 * @returns true if an article validated
 * @throws validation errors if the article failed
 */
export const validateArticleFiles = (file: Express.Multer.File, photos: Express.Multer.File[]): boolean => {
    const errors: ValidationError[] = [];

    /** @rule Files must be one of ALLOWED_FORMATS */
    if (!ALLOWED_FORMATS.includes(file.mimetype)) {
        errors.push({
            property: 'article',
            constraints: {
                mimeType: `MimeType must be one of [${ALLOWED_FORMATS.join(', ')}]`,
            },
            children: [],
        });
    }

    /** @rule Articles must be larger than 0 bytes and smaller than MAX_SIZE */
    if (file.size <= 0 || file.size > MAX_SIZE) {
        errors.push({
            property: 'article',
            constraints: {
                size: `Files must be less than ${MAX_SIZE} bytes`,
            },
            children: [],
        })
    }

    photos.forEach((photo, index) => {
        if (!ALLOWED_PHOTO_FORMATS.includes(photo.mimetype)) {
            errors.push({
                property: `photo[${index}]`,
                constraints: {
                    mimeType: `MimeType must be one of [${ALLOWED_PHOTO_FORMATS.join(', ')}]`,
                },
                children: [],
            });
        }

        if (photo.size <= 0 || photo.size > MAX_PHOTO_SIZE) {
            errors.push({
                property: `photo[${index}]`,
                constraints: {
                    size: `Photos must be less than ${MAX_PHOTO_SIZE} bytes`,
                },
                children: [],
            });
        }
    })

    if (errors.length) { throw errors; }

    return true;
}
