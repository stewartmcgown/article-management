import ExtendableError from "./ExtendableError";

export default class SheetUtils {
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
     * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
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
    * @param {Array<Object>} properties contains key-value pairs to search for
    * @param {Boolean} allowMultiple should we return multiple results
    * 
    * @returns {Array<Object>} matching row(s)
    */
    static getMatchingRowsFromSheet(sheetName, properties) {
        let sheet = this.getSheetAsJSON(sheetName)

        if (!properties) throw new MissingArgumentError(`'property'`)
        if (!properties.key || !properties.value) throw new MalformedPropertyError()

        let rows = sheet
            .filter(o => { return o[properties.key] == properties.value })
            

        if (!rows) {
            throw new Error(`No matching row for property @ getMatchingRowFromSheet`)
        } else if (rows.length === 0) {
            return new Error(`No matching row for property @ getMatchingRowFromSheet`)
        }

        return rows
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

class MissingArgumentError extends ExtendableError {}
class MalformedPropertyError extends ExtendableError {}