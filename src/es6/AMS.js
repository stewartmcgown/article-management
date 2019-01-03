const SheetUtils = require("./utils/SheetUtils");
const Article = require("./Article");
const Editor = require("./people/Editor");
const EmailService = require("./emails/EmailService");
const Response = require('./responses/Response')
const ErrorResponse = require("./responses/ErrorResponse")
const { objectToKeyValues, stemFlatten, get } = require("./utils/Utils")

const Strings = {
  FUNCTIONALITY_NOT_IMPLEMENTED: "Functionality not yet implemented.",
  MISSING_BODY: "Request body missing.",
  SUCCESS: "Success"
}

Object.freeze(Strings)

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
    return new ErrorResponse({
      message: Strings.FUNCTIONALITY_NOT_IMPLEMENTED
    })
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
    if (!data.id || !data.properties) return new ErrorResponse(Strings.MISSING_BODY)
    let id = data.id, properties = data.properties
    let article = await Articles.getArticleById(id)

    if (!article)
      return new Response({
        message: "Article not found",
        id
      })

    let modified = objectToKeyValues(stemFlatten(article.assignProperties(properties)))

    let rowData = article.toRow()
    Articles.updateArticleById(id, rowData)
    
    // Update the author
    EmailService.send({
      to: article.author.email,
      type: "updateArticle",
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
      reason: "deleteArticle",
      message: { id: article.id }
    })
  }

  /**
   * 
   * @param {Object} partialEditor
   */
  static async createEditor(partialEditor) {
    if (!partialEditor) throw new TypeError("Editor cannot be undefined")
    if (!partialEditor.email || !partialEditor.name) return new ErrorResponse("Editors must have an email and a name", partialEditor)
    const editor = new Editor(partialEditor)

    const existing = await SheetUtils.getMatchingRowsFromSheet(AMS.baseAuthSheet, { email: editor.email })
    if (existing.length !== 0 || !(existing instanceof Array)) return new ErrorResponse("Email already in use")

    await SheetUtils.pushRowToSheet(editor.toRow(), AMS.baseAuthSheet)

    // Update the author
    EmailService.send({
      to: editor.email,
      type: "createEditor",
      data: {
        editor
      }
    })

    return new Response({
      reason: "createEditor",
      message: editor
    })
  }

  /**
   * 
   * @param {Editor} editor partial editor object
   * @param {Object} properties 
   */
  static async updateEditor(data) {
    if (!data.email || !data.properties) return new ErrorResponse("You must specify a partial Editor object and properties to update it with.")
    let email = data.email, properties = data.properties
    let editor = await Editors.getEditorByEmail(email)

    if (!editor) return new ErrorResponse("Unable to find editor", editor)

    editor.assignProperties(properties)
    await Editors.updateEditorByEmail(editor.email, editor.toRow())

    return new Response({
      reason: "updatedEditor",
      message: editor,
    })
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

class Articles {
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
    SheetUtils.updateMatchingRow({id}, rowData, AMS.articleDatabase)
  }

}

class Editors {
  static async getEditorByEmail(email) {
    const data = await SheetUtils.getSheetAsJSON(AMS.baseAuthSheet)
    const rows = data.filter(e => e.email == email)
    if (rows[0]) return new Editor(rows[0])
    else return null
  }

  static async updateEditorByEmail(email, rowData) {
    SheetUtils.updateMatchingRow({email}, rowData, AMS.baseAuthSheet)
  }
}

module.exports = AMS