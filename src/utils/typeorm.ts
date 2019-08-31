import { getConnection } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

/**
 * Gets keys from a typeorm managed entity.
 *
 * @param type the class to get props from
 * @returns array of keys
 */
// tslint:disable-next-line: ban-types
export function getEntityKeys(type: Function): string[] {
    return getConnection().getMetadata(type).columns.map(meta => meta.propertyName);
}

// tslint:disable-next-line: ban-types
export function getColumnMetadata(type: Function): ColumnMetadata[] {
    return getConnection().getMetadata(type).columns;
}

export const typeMap = {
    Boolean: v => !!(v === 'true'),
    Number: v => Number.isInteger(v) ? Number.parseInt(v, 10) : Number.parseFloat(v),
};
