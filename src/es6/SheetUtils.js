import ExtendableError from "./ExtendableError";

export default class SheetUtils {
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

    static getSheetIdByName(sheetName) {
        let file; //Retrieve the ID
        const files = DriveApp.getFilesByName(sheetName);

        // Check if the doc exists. If it doesn't, return nothing
        if (files.hasNext())
            file = files.next()
        else
            return ""

        return file.getId()
    }

    /**
     * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} a matching sheet
     */
    static getSheetByName(sheetName) {
        let sheet = this.getSheetIdByName(sheetName)
        if (!sheet)
            return new Error(`No Sheet '${sheetName}' found @ ${this.getSheetByName.name}`)

        return SpreadsheetApp.openById(sheet)
    }

    /**
     * Fetch a given sheet as an array
     * @returns {Array}
     */
    static getSheetAsArray(id) {
        return SpreadsheetApp.openById(id).getActiveSheet().getDataRange().getValues()
    }

    /**
     * Generic function to return any Google Sheet as an array of
     * JSON objects
     * 
     * @returns {Array} A JSON organised array of the sheet using the headers
     */
    static getSheetAsJSON(sheetName) {
        let id = this.getSheetIdByName(sheetName),
            data = this.getSheetAsArray(id),
            out = [],
            delimiter = ','

        for (let i = 1; i < data.length; i++) {
            let inner = {}, row = data[i]
            for (let j = 0; j < row.length; j++) {
                let header = this.camelize(data[0][j]), item = row[j].toString()

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
    * @returns {Array<Object>} matching row(s)
    */
    static getMatchingRowsFromSheet(sheetName, properties) {
        if (!properties) throw new MissingArgumentError(`'property'`)


        let sheet = this.getSheetAsJSON(sheetName)

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

    static removeMatchingRowsFromSheet() {

    }

    /**
     * Push a new row to a sheet
     * @param {Array} row
     * @param {String} sheetName 
     */
    static pushRowToSheet(row, sheetName) {
        this.getSheetByName(sheetName).appendRow(row)
    }

    /**
     * Push an array of rows to a sheet. Using the Lock system, we can ensure
     * that no collisions are made during data entry.
     * 
     * @param {Array<Array>} rows data to push
     * @param {String} sheetName name of sheet
     */
    static pushRowsToSheet(rows, sheetName) {
        /*if (!(rows instanceof Array))
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

        lock.releaseLock()*/
    }

    /**
     * Turn any string to camelcase
     * @author CMS
     * @see https://stackoverflow.com/a/2970667
     */
    static camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
            return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }
}

class MissingArgumentError extends ExtendableError { }
class MalformedPropertyError extends ExtendableError { }