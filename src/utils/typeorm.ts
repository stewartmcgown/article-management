import { SearchParserResult } from 'search-query-parser';
import { getConnection, Like, ObjectLiteral } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

/**
 * Gets keys from a typeorm managed entity.
 *
 * @param type the class to get props from
 * @returns array of keys
 */
// tslint:disable-next-line: ban-types
export function getEntityKeys<T>(type: new () => T): string[] {
    return getConnection().getMetadata(type).columns.map(meta => meta.propertyName);
}

// tslint:disable-next-line: ban-types
export function getColumnMetadata<T>(type: new () => T): ColumnMetadata[] {
    return getConnection().getMetadata(type).columns;
}

export function getAllRelations<T>(type: new () => T): string[] {
    return getConnection().getMetadata(type).relations.map(rel => rel.propertyName);
}

export function searchParserToWhere<T>(query: SearchParserResult, type: new () => T): ObjectLiteral {
    const columns = getColumnMetadata(type);
    const searchKeys = {};

    if (query && query.offsets) {
        query.offsets.forEach(o => {
            if (o.keyword) {
                const column = columns.find(c => c.propertyName === o.keyword);
                let value = o.value;

                if (typeof column.type === 'function') {
                    value = !(typeof typeMap[column.type.name] === 'function') || typeMap[column.type.name](value);
                }

                searchKeys[o.keyword] = (typeof value === 'string' ? Like(`%${value}%`) : value);
            }
        });
    }

    return searchKeys;
}

export const typeMap = {
    Boolean: v => !!(v === 'true'),
    Number: v => Number.isInteger(v) ? Number.parseInt(v, 10) : Number.parseFloat(v),
};
