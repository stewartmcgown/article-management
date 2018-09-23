class AMS {
  constructor() {
    
  }

  verifyAPICredentials(sessionKey) {

  }

  getSheetIdByName(sheetName) {
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
  getSheetAsArray(id) {
      return SpreadsheetApp.openById(id).getActiveSheet().getDataRange().getValues()
  }

  getAllArticles() {
      // Apps script code to get stuff
      const data = this.getSheetAsArray(this.getDatabaseId());
      
      const articles = [];

      for (let i = 1; i < data.length; i++) {
          const article = new Article();
          article.fromRow(data[i])
          articles.push(article)
      }

      return articles
  }
}

// Construct a test object
const test = {
  "parameter": {
      "pages": null
  },
  "contextPath": "",
  "contentLength": -1,
  "queryString": "",
  "parameters": {},
  "pathInfo": "articles/list"
}

doGet(test);