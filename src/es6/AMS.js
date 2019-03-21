const SheetUtils = require("./utils/SheetUtils");
const Article = require("./Article");
const Editor = require("./people/Editor");
const Editors = require("./Editors")
const Authors = require("./Authors")
const EmailService = require("./emails/EmailService");
const Response = require('./responses/Response')
const ErrorResponse = require("./responses/ErrorResponse")
const { objectToKeyValues, stemFlatten, get, partialSearch, partialMatch, flatSearch } = require("./utils/Utils")
const searchQueryParser = require("search-string")
const ArticleCreator = require("./ArticleCreator")

const Strings = {
  FUNCTIONALITY_NOT_IMPLEMENTED: "Functionality not yet implemented.",
  MISSING_BODY: "Request body missing.",
  SUCCESS: "Success",
  INTERNAL_ERROR: "Internal Error",
  NOT_FOUND: "Article not found"
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
  static get logSheet() { return "Logs" }
  static get statusSheet() { return "States" }

  /**
   * Process the modified attributes of an article.
   * 
   * This will include sending emails, tidying up database entries etc.
   * 
   * @param {Object} modified 
   */
  static processModified(modified) {

  }

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
   * Submissions should be structured as follows:
   * {
   *  article: Article,
   *  author: Author,
   *  data: Binary
   * }
   * 
   * @param {Object} body Request body, hopefully containing an article.
   * @param {Article} body.article dd
   */
  static async createArticle({ article, author, data }) {
    const ac = new ArticleCreator(article)
    
    const status = ac.verify()
    if (!status) {
      return new ErrorResponse({
        error: "Missing properties"
      })
    }

    ac.upload()
    
    console.log(article)
    return new Response({ message: "Article successfully submitted" })
    
  }

  static async getAllStates({data, level}) {
    let states = await SheetUtils.getSheetAsJSON(AMS.statusSheet)

    if (!states) {
      return new ErrorResponse(Strings.INTERNAL_ERROR)
    }

    return states
  }

  static async getArticle({data, params}) {
    if (!params.id) return new ErrorResponse(Strings.MISSING_BODY)

    let article = await SheetUtils.getMatchingRowsFromSheet(AMS.articleDatabase, {
      id: params.id
    })

    if (!article) return new ErrorResponse(Strings.NOT_FOUND)
    else if (!article[0]) return new ErrorResponse(Strings.NOT_FOUND)
    else article = article[0]

    // Post processing
    article.modifiedDate = await SheetUtils.getLastRevision(article.id)

    return new Response({
      message: article,
      reason: Strings.SUCCESS
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
  static async updateArticle({data, level}) {
    if (!data.id || !data.properties) return new ErrorResponse(Strings.MISSING_BODY)
    let id = data.id, properties = data.properties
    let article = await Articles.getArticleById(id)

    if (!article) {
      return new ErrrorResponse("Article not found")
    }
    
    if (properties.editor) {
      let editor = await Editors.getEditorByEmail(properties.editor.email)

      if (!editor) {
        return new ErrorResponse("Editor not found")
      }
    }

    let modified = objectToKeyValues(stemFlatten(article.assignProperties(properties)))

    AMS.processModified(modified) // Can be async as we don't rely on return

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

  static async assignArticle(article) {

  }


  /**
   * Delete an article.
   * 
   * @param {Article} article Article to delete. May be partial.
   */
  static async deleteArticle({ data, params}) {
    if (!params.id) throw new TypeError("Article cannot be undefined")
    await SheetUtils.removeMatchingRowFromSheet(AMS.articleDatabase, {id})

    return new Response({
      reason: "deleteArticle",
      message: { id: params.id }
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
  static async updateEditor({data}) {
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


  static async getAllSubjects(body, { q }) {
    
  }

  /**
   * @param {String} [query] search terms
   * @return {Array.<Article>} all articles in JSON format
   */
  static async getAllArticles({data, params}) {
    if (!params) return new ErrorResponse()
    const q = params.q
    const articles = await SheetUtils.getSheetAsJSON(AMS.articleDatabase)
    let out = []
    if (typeof q === "string") {
      let b = {}, parsed = AMS.parseQueryString(q)
      if (parsed.conditionArray.length === 0) {
        b = q
        return flatSearch(articles.map((a) => new Article(a)), b, true)
      } else {
        parsed.conditionArray.forEach(x => b[x.keyword] = x.value)
        return partialSearch(articles.map((a) => new Article(a)), b, true) // TODO: allow negated search terms
      }
      
    } else {
      out = articles.map((a) => new Article(a))
    }

    return out
    
  }

  /**
   * Find all the editors. Optionally search with a query
   *  
   * @param {Object} body 
   * @param {Object} o
   * @param {String} [o.q] query
   * @returns {Array.<Editor>} list of editors
   */
  static async getAllEditors({data, params}) {
    const q = params.q
    const data = await SheetUtils.getSheetAsJSON(AMS.baseAuthSheet)
    let out = []
    if (typeof q === "string") {
      // TODO: modularise this
      let b = {}, parsed = AMS.parseQueryString(q)
      if (parsed.conditionArray.length === 0) {
        b = q
        return flatSearch(data.map((a) => new Editor(a)), b, true)
      } else {
        parsed.conditionArray.forEach(x => b[x.keyword] = x.value)
        return partialSearch(data.map((a) => new Editor(a)), b, true) // TODO: allow negated search terms
      }

    } else {
      out = data.map((a) => new Editor(a))
    }

    return out
  }

  static async getEditorByEmail({data, params}) {
    const email = params.email
    const q = `email:${email}`,
    results = AMS.getAllEditors(null, { q })

    return results[0] || new ErrorResponse("editorNotFound", `No editor found matching ${email}`)
  }

  /**
   * @param {String} id 
   * @return {Array} rows matching the ID
   */
  static async getInfo(id) {
    return await SheetUtils.getMatchingRowsFromSheet(id)
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

  /**
   * Query strings should be in the form of:
   * 
   * property:value property2:value etc..
   * 
   * @param {String} query 
   * @return {Object} a parsed query object
   */
  static parseQueryString(query) {
    return searchQueryParser.parse(query)
  }

  static getMatchingArray() {
    
  }

  /**
   * Get the authors profile picture
   * 
   * @param {String} email 
   * @return {String} url of profile picture
   */
  static getAuthorProfile(email) {

  }

  /**
   * Get last revision based on ID
   * 
   * @param {String} id 
   */
  static async getLastRevision(id) {
    SheetUtils.getLastRevision(id)
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



module.exports = AMS