const SheetUtils = require("./utils/SheetUtils");
const Article = require("./Article");
const Editor = require("./people/Editor");
const EmailService = require("./emails/EmailService");
const Response = require('./responses/Response')
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
   * Use these static members to get the name the sheet you need
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
  static createArticle(article) {

  }

  /**
   * Updates an article in the database with the given properties.
   * 
   * This is a general update, so general update email will be sent.
   * 
   * @param {String} ID id of article to update
   * @param {Object} properties prop
   */
  static updateArticle(data) {
    if (!data.id || !data.properties) throw new Error('Missing arguments @ updateArticle')
    let id = data.id, properties = data.properties
    let article = AMSSheetUtilsWrapper.getArticleById(id)

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
   * 
   * @param {Article} article 
   */
  static deleteArticle(article) {

  }

  /**
   * 
   * @param {Editor} editor 
   */
  static createEditor(editor) {

  }

  /**
   * 
   * @param {Editor} editor 
   * @param {Object} properties 
   */
  static updateEditor(editor, properties) {

  }

  /**
   * @return {Array.<Article>} all articles in JSON format
   */
  static getAllArticles() {
    return SheetUtils.getSheetAsJSON(this.ids.database)
      .map((a) => new Article(a))
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

class AMSSheetUtilsWrapper {
  static getArticleById(id) {
    const data = SheetUtils.getSheetAsJSON(AMS.ids.database)
    const rows = data.filter(r => r.ID == id)
    if (!rows) return null
    else if (rows[0]) return new Article(rows[0])
    else return null
  }

  /**
   * 
   * @param {String} id 
   * @param {Array} rowData 
   */
  static updateArticleById(id, rowData) {
    SheetUtils.updateMatchingRow({ID: id}, rowData, AMS.articleDatabase)
  }

}


module.exports = AMS