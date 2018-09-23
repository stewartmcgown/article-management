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