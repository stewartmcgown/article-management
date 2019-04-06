const ExtendableError = require("./ExtendableError");
const GoogleWrapper = require("./GoogleWrapper")
const {
    partialMatch,
    swapObjectKeys,
    camelize,
    JSONToAlignedArray
} = require("./Utils")
const cache = require("memory-cache")

/**
 * Convert a valueRange object to a JSON object organised
 * by sheet name
 * 
 * @param {Array.<Object>} ranges 
 */
const valueRangesToJSON = (ranges) => {
    if (!(ranges instanceof Array)) throw new TypeError()
    const o = {}
    ranges.forEach(x => { 
        o[x.range.split("!")[0]] = arrayToJSON(x.values)
    })
    return o
}

const arrayToJSON = (data) => {
    const out = []

    for (let i = 1; i < data.length; i++) {
        let inner = {},
            row = data[i]
        for (let j = 0; j < row.length; j++) {
            let header = camelize(data[0][j]),
                item = row[j].toString()

            inner[header] = item
        }
        out.push(inner)
    }

    return out
}

class SheetUtils {

    static set sheet(id) {
        this.sheetID = id
    }

    static async getLastRevision(id) {
        return await GoogleWrapper.getLastRevision(id)
    }

    /**
     * 
     * @param {Array.<String>} sheets 
     * @param {Boolean} enableCache 
     */
    static async getSheetsAsJSON(sheets, enableCache) {
        if (!(sheets instanceof Array)) throw new TypeError("Missing argument @ getSheetAsArray")
        const cacheKey = this.cacheKey(...sheets)

        if (cache.get(cacheKey) && enableCache) {
            console.log(`[Cache] Hit: ${cacheKey}`)
            return cache.get(cacheKey)
        }

        let values = await GoogleWrapper.getSheetsValues(this.sheetID, ...sheets)
        values = valueRangesToJSON(values)

        // Process cache miss
        if (enableCache) {
            console.log(`[Cache] Miss: ${cacheKey}`);
            cache.put(cacheKey, values, 10000)
        }

        return values
    }

    /**
     * Fetch a given sheet as an array
     * @param {String} sheetName
     * @param {Boolean} enableCache
     * @returns {Array.<Array>}
     */
    static async getSheetAsArray(sheetName, enableCache = false, cacheTimeout = 10000) {
        if (!sheetName) throw new TypeError("sheetName cannot be null")
        const cacheKey = this.cacheKey(sheetName)

        if (cache.get(cacheKey) && enableCache) {
            console.log(`[Cache] Hit: ${cacheKey}`)
            return cache.get(cacheKey)
        }


        const values = await GoogleWrapper.getSheetValues(this.sheetID, sheetName)

        // Process cache miss
        if (enableCache) {
            console.log(`[Cache] Miss: ${cacheKey}`);
            cache.put(cacheKey, values, cacheTimeout)
        }

        return values

    }

    /**
     * Generic function to return any Google Sheet as an array of
     * JSON objects
     * 
     * @returns {Array.<Object>} A JSON organised array of the sheet using the headers
     * @throws {TypeError} if no sheet can be found.
     */
    static async getSheetAsJSON(sheetName, enableCache = false) {
        if (!sheetName) throw new TypeError("Missing argument @ getSheetAsJSON")

        const data = await this.getSheetAsArray(sheetName, enableCache)
        if (!data) throw new TypeError("Data can not be null")

        return arrayToJSON(data)
    }
    /**
     * Using a property, check if a given sheet contains a matching row
     * with the same value as the properties value
     * 
     * @param {String} sheetName name of the sheet to search
     * @param {Object} properties contains key-value pairs to search for
     * @param {Boolean} allowMultiple should we return multiple results
     * 
     * @return {Array.<Object>} matching row(s)
     */
    static async getMatchingRowsFromSheet(sheetName, properties) {
        if (!properties || !sheetName) throw new Error("Missing arguments @ getMatchingRowsFromSheet")

        let sheet = await this.getSheetAsJSON(sheetName)

        // Will locate all rows that match the given properties
        let rows = sheet.filter(r => partialMatch(r, properties))

        if (!rows) {
            return []
        }
        return rows
    }

    static async removeMatchingRowFromSheet(sheetName, properties) {
        if (!sheetName || !properties) throw new TypeError(`Missing arguments. Was given sheetName: ${sheetName}, properties: ${uniqueValue}`)
        const data = await this.getSheetAsJSON(sheetName)
        let rowNumber = data.findIndex(r => partialMatch(r, properties)) + 1
        if (rowNumber === 0) return
        GoogleWrapper.removeRow({
            id: this.sheetID,
            sheetName,
            rowNumber
        })
    }

    /**
     * Find a row that matches a list of identifiers. If it matches,
     * update it with the new row.
     * 
     * @param {String} properties id of the row
     * @param {Array} row overwriting data
     * @param {String} sheetName sheet to look in
     */
    static async updateMatchingRow(properties, row, sheetName) {
        if (!properties || !row || !sheetName) throw new Error("Missing arguments @ SheetUtils.updateMatchingRow")
        const data = await this.getSheetAsJSON(sheetName)
        let rowNumber = data.findIndex(r => partialMatch(r, properties)) + 2
        if (rowNumber === 0) return
        //sheet.getActiveSheet().getRange(rowNumber, 1, 1, sheet.getLastColumn()).setValues(rangeRow)
        GoogleWrapper.updateRow({
            id: this.sheetID,
            sheetName,
            rowNumber,
            row
        })
    }

    /**
     * Find a row that matches a list of identifiers. If it matches,
     * update it with the new row.
     * 
     * @param {String} properties id of the row
     * @param {Object} row overwriting data
     * @param {String} sheetName sheet to look in
     */
    static async updateMatchingRowWithJSON(properties, row, sheetName) {
        if (!properties || !row || !sheetName) throw new Error("Missing arguments @ SheetUtils.updateMatchingRow")
        
        const data = await this.getSheetAsJSON(sheetName)
        let rowNumber = data.findIndex(r => partialMatch(r, properties)) + 2
        if (rowNumber === 0) return

        // Convert object to aligned row
        const data_array = await this.getSheetAsArray(sheetName)
        row = JSONToAlignedArray(row, data_array[0])
        GoogleWrapper.updateRow({
            id: this.sheetID,
            sheetName,
            rowNumber,
            row
        })
    }

    /**
     * Finds the matching row number of the given sheet.
     * 
     * @param {Object} identifiers 
     * @param {String} sheetName 
     * @param {Number} offset
     * 
     * @throws {Error} Missing parameter error
     */
    static async getMatchingRowRange(identifiers, sheetName, offset = 0) {
        if (!identifiers || !sheetName) throw new Error("Missing parameters @ getMatchingRowRange")

        /** @type {Array.<Object>} */
        let data = await this.getSheetAsJSON(sheetName)

        // Should be replaced with a recursive algorithm
        let number = data.findIndex((o) => {
            return Object.keys(identifiers).every(k => {
                if (typeof o[k] === "object") {
                    return Object.keys(identifiers[k]).every(c => {
                        return o[k][c] == identifiers[k][c]
                    })
                } else {
                    return identifiers[k] == o[k]
                }
            })
        })

        if (offset) {
            number += offset
        }

        return number
    }

    /**
     * Push a new row to a sheet
     * @param {Array} row
     * @param {String} sheetName 
     */
    static async pushRowToSheet(row, sheetName) {
        if (!(row instanceof Array)) throw new TypeError("Row must be an array")
        return GoogleWrapper.appendRow({
            id: this.sheetID,
            sheetName,
            row
        })
    }

    /**
     * Push an array of rows to a sheet. Using the Lock system, we can ensure
     * that no collisions are made during data entry.
     * 
     * @param {Array.<Array>} rows data to push
     * @param {String} sheetName name of sheet
     */
    static async pushRowsToSheet(rows, sheetName) {
        if (!(rows instanceof Array))
            return new Error("Rows must be an array")

        for (let row of rows) {
            SheetUtils.pushRowToSheet(row, sheetName)
        }
    }

    static async pushJSONToSheet(obj, sheetName) {
        if (!obj) throw new TypeError("Object cannot be null")

        const sheet = await SheetUtils.getSheetAsArray(sheetName, true, 86400)

        const inverted = swapObjectKeys(sheet[0].map(v => camelize(v)))
        const row = new Array(inverted.length)

        Object.keys(obj).forEach(k => {
            if (inverted[k]) {
                row[inverted[k]] = obj[k]
            }
        })

        SheetUtils.pushRowToSheet(row, sheetName).then(x => x)
    }

    /**
     * Create a memcache key
     * 
     * @param  {...any} str keys to add
     */
    static cacheKey(...str) {
        const n = (a, b) => `${a}-${b}`
        return str.reduce((p, c) => p ? p = n(p, c) : p = n(this.sheetID, c))
    }
}

class MissingArgumentError extends ExtendableError {}
class MalformedPropertyError extends ExtendableError {}

module.exports = SheetUtils