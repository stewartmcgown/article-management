import SheetUtils from "./SheetUtils";

/**
 * Handles all AMS specific actions when called by the Router.
 * 
 * @author Stewart McGown
 * @see https://drive.google.com/open?id=1nkLn0BRqyT5ZotY4YFy-L_2w5WFMvFJZsgGdFQlqSRU
 */
export default class AMS {
  constructor() {

  }

  /**
   * Use these static members to get the name the sheet you need
   */
  static get baseAuthSheet() { return "Editor Logins" }
  static get keySheet() { return "Article Management 2 Keys Distributed" }
  static get authTokenSheet() { return "Article Management 2 Authentication Internals" }
  static get articleDatabase() { return "Article Database" }

  /**
   * 
   * @param {Article} article 
   */
  static createArticle(article) {

  }

  static updateArticle() {

  }

  static deleteArticle() {

  }

  static createEditor() {

  }

  static updateEditor() {

  }

  /**
   * @return {Array.<Object>} all articles in JSON format
   */
  static getAllArticles() {
    // Apps script code to get stuff
    return SheetUtils.getSheetAsJSON(this.articleDatabase)
  }

  /**
   * @param {String} id 
   * @return {Array} rows matching the ID
   */
  static getInfo(id) {
    return SheetUtils.getMatchingRowsFromSheet(id)
  }

  /**
   * Search all parts of the API for a given query.
   * @param {String} query 
   */
  static doSearch(query) {
    let collected = []

    
  }
}