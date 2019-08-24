/**
 * A Mapped document consists of a translation between
 * the lines of an original file
 */
export interface MappedDocument {
    /**
     * A key which relates to the line in the original
     * document.
     */
    [key: number]: LineMapping;
}
export interface LineMapping {
    originalLine: number;
    mappedStartPos: number;
    mappedEndPos: number;
}
