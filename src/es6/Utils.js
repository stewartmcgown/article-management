
export default class Utils {
    /**
     * Safely access nested object properties
     * 
     * @param {Array.<Object>} p path to desired object
     * @param {Object} o context object in which to search 
     * 
     * @returns the desired object or null if no such object is found.
     * 
     * @author A. Sharif
     * @see https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
     */
    static get(p, o) {
        return p.reduce((xs, x) =>
            (xs && xs[x]) ? xs[x] : null, o)
    }
}
