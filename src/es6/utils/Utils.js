class Utils {
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

/**
 * 
 * @param {Object} target object to update
 * @param {Object} source source of properties
 */
const assignExisting = (target, source) => {
    Object.keys(source).filter(key => key in target)
        .forEach(key => {
            target[key] instanceof Object ?
                assignExisting(target[key], source[key]) :
                target[key] = source[key]
        })
}

/**
 * 
 * @param {String} dateString 
 */
const parseDateString = (dateString) => {
    let d = dateString.split('-')
    if (d.length != 3)
        return dateString
    else
        return new Date(d[2], d[1], d[0])
}

/**
 * Convert an object to an array of key value pairs
 * 
 * { 
 *  title: "Hello",
 *  length: 100
 * }
 * 
 * would map to:
 * 
 * [
 *  {key: "title", value: "Hello"},
 *  {key: "length", value: 100}
 * ]
 * 
 * @param {Object} o 
 * @return {Array.<Object>}
 */
const objectToKeyValues = (o, h) => Object.keys(o).map(k => {
    return {
        key: k,
        value: o[k]
    }
})

/**
 * Recursively flatten an object and concatenate the names
 * 
 * @param {Object} o 
 * @param {String} [stem]
 */
const stemFlatten = (o, stem) => {
    let out = {}
    Object.keys(o).forEach(k => {
        if (o[k] instanceof Object) {
            Object.assign(out, stemFlatten(o[k], k))
        } else {
            out[`${stem ? `${stem}_` : ""}${k}`] = o[k]
        }
    })
    return out
}

module.exports = {
    Utils,
    assignExisting,
    stemFlatten,
    objectToKeyValues,
    parseDateString
}