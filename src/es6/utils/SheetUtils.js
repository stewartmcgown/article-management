const ExtendableError = require("./ExtendableError");
const GoogleWrapper = require("./GoogleWrapper")

module.exports = class SheetUtils {

    static set sheet(id) {
        this.sheetID = id
    }

    /**
     * Find the longest array in a list
     * @param {Array<Array>} a 
     */
    static maxLength(a) {
        let max = 0
        if (a[0] instanceof Array) {
            for (let b of a) {
                if (b.length > max)
                    max = b.length
            }
        }
        return max
    }

    /**
     * Fetch a given sheet as an array
     * @param {String} sheetName
     * @returns {Array}
     */
    static async getSheetAsArray(sheetName) {
        if (!sheetName) throw new TypeError("Missing argument @ getSheetAsArray")
        const values = await GoogleWrapper.getSheetValues(this.sheetID, sheetName)
        return values
    }

    /**
     * Generic function to return any Google Sheet as an array of
     * JSON objects
     * 
     * @returns {Array.<Object>} A JSON organised array of the sheet using the headers
     */
    static async getSheetAsJSON(sheetName) {
        if (!sheetName) throw new TypeError("Missing argument @ getSheetAsJSON")

        const data = await this.getSheetAsArray(sheetName)
        if (!data) throw new TypeError("Data can not be null")

        let out = [], delimiter = ','

        for (let i = 1; i < data.length; i++) {
            let inner = {},
                row = data[i]
            for (let j = 0; j < row.length; j++) {
                let header = this.camelize(data[0][j]),
                    item = row[j].toString()

                if (item.indexOf(delimiter) != -1)
                    item = item.split(delimiter)

                inner[header] = item
            }
            out.push(inner)
        }

        return out
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
        let rows = sheet
            .filter(o => {
                return Object.keys(properties).every(key => properties[key] == o[key])
            })

        if (!rows) {
            throw new Error(`No matching row for property ${JSON.stringify(properties)} @ getMatchingRowsFromSheet (!rows)`)
        } else if (rows.length === 0) {
            return new Error(`No matching row for property ${JSON.stringify(properties)}  @ getMatchingRowsFromSheet`)
        }

        return rows
    }

    static async removeMatchingRowFromSheet(sheetName, uniqueValue) {
        if (!sheetName || !uniqueValue) throw new TypeError(`Missing arguments. Was given sheetName: ${sheetName}, properties: ${uniqueValue}`)
        GoogleWrapper.removeRow({
            id: this.sheetID,
            sheetName,
            uniqueValue
        })
    }

    /**
     * Find a row that matches a list of identifiers. If it matches,
     * update it with the new row.
     * 
     * @param {String} id id of the row
     * @param {Array} row overwriting data
     * @param {String} sheetName sheet to look in
     */
    static async updateMatchingRow(id, row, sheetName) {
        if (!id || !row || !sheetName) throw new Error("Missing arguments @ SheetUtils.updateMatchingRow")
        //sheet.getActiveSheet().getRange(rowNumber, 1, 1, sheet.getLastColumn()).setValues(rangeRow)
        GoogleWrapper.updateRow({
            id: this.sheetID,
            uniqueValue: id,
            sheetName,
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
     * @param {Array<Array>} rows data to push
     * @param {String} sheetName name of sheet
     */
    static async pushRowsToSheet(rows, sheetName) {
        if (!(rows instanceof Array))
            return new Error("Rows must be an array")

        let sheet = this.getSheetByName(sheetName),
            lock = LockService.getScriptLock()

        try {
            lock.waitLock(10000); // wait 10 seconds for others' use of the code section and lock to stop and then proceed
        } catch (e) {
            Logger.log('Could not obtain lock after 30 seconds.');
            return new Error("Server busy.")
        }

        sheet = sheet.getActiveSheet()

        sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, this.maxLength(rows))
            .setValues(rows);

        SpreadsheetApp.flush()

        lock.releaseLock()
    }

    /**
     * Turn any string to camelcase
     * @author CMS
     * @see https://stackoverflow.com/a/2970667
     */
    static camelize(str) {
        if (str == "ID")
            return str.toLowerCase()
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }
}

class MissingArgumentError extends ExtendableError {}
class MalformedPropertyError extends ExtendableError {}