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
     * Fetch a given sheet as an array
     */
    static getSheetAsArray(id) {
        return SpreadsheetApp.openById(id).getActiveSheet().getDataRange().getValues()
    }

    /**
     * Generic function to return any Google Sheet as an array of
     * JSON objects
     * 
     * @returns A JSON organised array of the sheet using the headers
     */
    static getSheetAsJSON(sheetName) {
        if (!this.specialNames.includes(sheetName))
            return false
        
        let id = this.getSheetIdByName(sheetName),
        data = this.getSheetAsArray(id),
        out = []

        for (let i = 1, row = data[i]; i < data.length; i++) {
            let inner = {}
            for (let j = 0; j < row.length; j++) {
                let header = this.camelize(data[0][j])
                inner[header] = row[j]
            }
            
        }
        
    }

    static get specialNames() {
        return [
            "Editor Logins",
            "Article DB Keys"
        ]
    }

    /**
     * Turn any string to camelcase
     * @author CMS
     * @see https://stackoverflow.com/a/2970667
     */
    static camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
          if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
          return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
      }
}