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
}