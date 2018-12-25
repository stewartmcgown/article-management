const SheetUtils = require("./utils/SheetUtils");
const Article = require("./Article");
const Editor = require("./people/Editor");
const EmailService = require("./emails/EmailService");
const Response = require('./responses/Response')
const ErrorResponse = require("./responses/ErrorResponse")
const { objectToKeyValues, stemFlatten } = require("./utils/Utils")

/**
 * Handles all AMS specific actions when called by the Router.
 * 
 * @author Stewart McGown
 * @see https://drive.google.com/open?id=1nkLn0BRqyT5ZotY4YFy-L_2w5WFMvFJZsgGdFQlqSRU
 */

class AMS {
  constructor() {
    SheetUtils.sheet = AMS.rootAppID
  }

  static get rootAppID() { return "17yVLJ8L836_vKIEnkxIBN1DIxnX6PgvvfinLTFZyPAI"}

  /**
   * Use these static async members to get the name the sheet you need
   */
  static get baseAuthSheet() { return "Logins" }
  static get keySheet() { return "Keys" }
  static get authTokenSheet() { return "AuthTokens" }
  static get articleDatabase() { return "Database" }

  /**
   * Completely handles the creation of a single article.
   * 
   * 1. First, the article is processed to check for any missing
   * information. If there is any, it will attempt to fix that.
   * 
   * 2. Next, the article is added to the Google Drive.
   * 
   * 3. The article's information is added to the database.
   * 
   * 4. Emails relating to the article are sent.
   * 
   * @param {Article} article 
   */
  static async createArticle(article) {

  }

  /**
   * Updates an article in the database with the given properties.
   * 
   * This is a general update, so general update email will be sent.
   * 
   * @param {Object} data
   * @param {Number} level
   */
  static async updateArticle(data, level) {
    if (!data.id || !data.properties) return new ErrorResponse("Missing Request Body")
    let id = data.id, properties = data.properties
    let article = await AMSSheetUtilsWrapper.getArticleById(id)

    if (!article)
      return new Response({
        message: "Article not found",
        id
      })

    let modified = objectToKeyValues(stemFlatten(article.assignProperties(properties)))

    let rowData = article.toRow()
    AMSSheetUtilsWrapper.updateArticleById(id, rowData)
    
    // Update the author
    EmailService.send({
      to: article.author.email,
      type: "update",
      data: { article, modified }
    })

    // notify the editor

    return new Response({
      reason: "Successful Update",
      message: article,

    })
  }


  /**
   * Delete an article.
   * 
   * @param {Article} article Article to delete. May be partial.
   */
  static async deleteArticle(article) {
    if (!article) throw new TypeError("Article cannot be undefined")
    await SheetUtils.removeMatchingRowFromSheet(AMS.articleDatabase, {id: article.id})

    return new Response({
      reason: "Successful Deletion",
      message: { id: article.id }
    })
  }

  /**
   * 
   * @param {Editor} editor 
   */
  static async createEditor(editor) {

  }

  /**
   * 
   * @param {Editor} editor 
   * @param {Object} properties 
   */
  static async updateEditor(editor, properties) {

  }

  /**
   * @return {Array.<Article>} all articles in JSON format
   */
  static async getAllArticles() {
    const data = await SheetUtils.getSheetAsJSON(AMS.articleDatabase)
    
    return data.map((a) => new Article(a))
  }

  /**
   * @param {String} id 
   * @return {Array} rows matching the ID
   */
  static async getInfo(id) {
    return SheetUtils.getMatchingRowsFromSheet(id)
  }

  /**
   * Search all parts of the API for a given query.
   * @param {String} query 
   */
  static async doSearch(query) {
    let collected = []

  }

  /**
   * Do all the tasks that are to be executed at a regular interval
   */
  static async doScheduledTasks() {
    /**
     * Clean up old keys
     */
  }
}

class AMSSheetUtilsWrapper {
  static async getArticleById(id) {
    const data = await SheetUtils.getSheetAsJSON(AMS.articleDatabase)
    const rows = data.filter(r => r.id == id)
    if (!rows) return null
    else if (rows[0]) return new Article(rows[0])
    else return null
  }

  /**
   * 
   * @param {String} id 
   * @param {Array} rowData 
   */
  static async updateArticleById(id, rowData) {
    SheetUtils.updateMatchingRow(id, rowData, AMS.articleDatabase)
  }

}

module.exports = AMS