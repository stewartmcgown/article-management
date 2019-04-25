const SheetUtils = require("./utils/SheetUtils");
const Article = require("./Article");
const Editor = require("./people/Editor");
const Editors = require("./Editors")
const Authors = require("./Authors")
const EmailService = require("./emails/EmailService");
const Response = require('./responses/Response')
const ErrorResponse = require("./responses/ErrorResponse")
const Errors = require('./Errors.js')
const {
  objectToKeyValues,
  stemFlatten,
  get,
  partialSearch,
  partialMatch,
  flatSearch,
  JSONToAlignedArray,
  mapToSpecificProperty
} = require("./utils/Utils")
const searchQueryParser = require("search-string")
const ArticleCreator = require("./ArticleCreator")
const SheetNames = require("./Sheets")
const GoogleWrapper = require("./utils/GoogleWrapper")
const Logger = require("./Logger")

/**
 * Handles all AMS specific actions when called by the Router.
 * 
 * @author Stewart McGown
 * @see https://drive.google.com/open?id=1nkLn0BRqyT5ZotY4YFy-L_2w5WFMvFJZsgGdFQlqSRU
 */

class AMS {
  constructor() {
    SheetUtils.sheet = AMS.rootAppID
    GoogleWrapper.root = AMS.rootFolderID
  }

  static get rootAppID() {
    return "17yVLJ8L836_vKIEnkxIBN1DIxnX6PgvvfinLTFZyPAI"
  }

  static get rootFolderID() {
    return "1dOuWu8QiLUH2FxgAYzICMx3k91Iw3Ouw"
  }

  /**
   * Use these static async members to get the name the sheet you need
   */
  static get baseAuthSheet() {
    return "Logins"
  }
  static get keySheet() {
    return "Keys"
  }
  static get authTokenSheet() {
    return "AuthTokens"
  }
  static get articleDatabase() {
    return "Database"
  }
  static get logSheet() {
    return "Logs"
  }
  static get statusSheet() {
    return "States"
  }
  static get authorSheet() {
    return "Authors"
  }

  /**
   * Process the modified attributes of an article.
   * 
   * This will include sending emails, tidying up database entries etc.
   * 
   * @param {Object} modified 
   */
  static processModified(article, modified) {
    // Handle editor/author changes
    if (modified.editors) modified.editors = mapToSpecificProperty(modified.editors, "email")
    if (modified.authors) modified.authors = mapToSpecificProperty(modified.authors, "email")

    modified = objectToKeyValues(stemFlatten(modified))

    // Update the author
    EmailService.send({
      to: article.authors.map(a => a.email),
      type: "updateArticle",
      data: {
        article,
        modified
      }
    })

    // Update the editors
    EmailService.send({
      to: article.editors.map(a => a.email),
      type: "updateArticle",
      data: {
        article,
        modified,
        isForEditor: true
      }
    })
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
   *  data: { 
   *    encoded: Binary,
   *    mimeType: String
   * }
   * 
   * @param {Object} body Request body, hopefully containing an article.
   * @param {Article} body.article dd
   */
  static async createArticle({
    data,
    params
  }) {
    if (!data) {
      return new ErrorResponse(Errors.MISSING_BODY)
    }

    const creator = new ArticleCreator(data)

    try {
      await creator.upload()

      return new Response({
        message: "Article successfully submitted"
      })
    } catch (e) {
      return new ErrorResponse(Errors.MALFORMED_ARTICLE)
    }

  }

  static async getAllStates({
    data,
    level
  }) {
    let states = await SheetUtils.getSheetAsJSON(AMS.statusSheet)

    if (!states) {
      return new ErrorResponse(Errors.INTERNAL_ERROR)
    }

    return states
  }

  static async getArticle({
    data,
    params
  }) {
    if (!params.id) return new ErrorResponse(Errors.MISSING_BODY)

    let article = await SheetUtils.getMatchingRowsFromSheet(AMS.articleDatabase, {
      id: params.id
    })

    if (!article) return new ErrorResponse(Errors.NOT_FOUND)
    else if (!article[0]) return new ErrorResponse(Errors.NOT_FOUND)
    else article = article[0]

    // Post processing
    article.modifiedDate = await SheetUtils.getLastRevision(article.id)

    return new Response({
      message: article,
      reason: Errors.SUCCESS
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
  static async updateArticle({
    data,
    level,
    user
  }) {
    if (!data.id || !data.properties) return new ErrorResponse(Errors.MISSING_BODY)
    let id = data.id,
      properties = data.properties
    let article = await Articles.getArticleById(id)

    if (!article || article instanceof ErrorResponse) {
      return new ErrorResponse(Errors.NOT_FOUND)
    }

    if (properties.editors) {
      const emails = properties.editors.map(e => e.email)
      let editors = await Editors.getEditorsByEmails(emails)

      if (editors.length != properties.editors.length) {
        return new ErrorResponse(Errors.EDITOR_NOT_FOUND)
      }

      properties.editors = editors
    }

    let modified = article.assignProperties(properties)

    AMS.processModified(article, modified) // Can be async as we don't rely on return

    Articles.updateArticle(article)

    Logger.log("Update", user.email, `${article.id} updated`)

    return new Response({
      reason: "Successful Update",
      message: article
    })
  }

  static async assignArticle(article) {

  }


  /**
   * Delete an article.
   * 
   * @param {Article} article Article to delete. May be partial.
   */
  static async deleteArticle({
    data,
    params
  }) {
    if (!params.id) throw new TypeError("Article cannot be undefined")
    await SheetUtils.removeMatchingRowFromSheet(AMS.articleDatabase, {
      id
    })

    return new Response({
      reason: "deleteArticle",
      message: {
        id: params.id
      }
    })
  }

  /**
   * 
   * @param {Object} partialEditor
   */
  static async createEditor({
    data,
    params
  }) {
    if (!data) throw new TypeError("Editor cannot be undefined")
    if (!data.email || !data.name) return new ErrorResponse(Errors.EDITOR_MISSING_PARAMS)
    const editor = new Editor(data)

    const existing = await SheetUtils.getMatchingRowsFromSheet(AMS.baseAuthSheet, {
      email: editor.email
    })
    if (existing.length !== 0 || !(existing instanceof Array)) return new ErrorResponse(Errors.EDITOR_EMAIL_IN_USE)

    

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
  static async updateEditor({
    data,
    user,
    level
  }) {
    if (!data.email || !data.properties) return new ErrorResponse(Errors.MISSING_BODY)
    let email = data.email,
      properties = data.properties
    let editor = await Editors.getEditorByEmail(email)

    if (!editor) return new ErrorResponse(Errors.EDITOR_NOT_FOUND)

    // If you aren't an admin, you can only edit yourself
    if (editor.email != user.email && level < 3) return new ErrorResponse(Errors.EDITOR_EDIT_UNAUTHORISED)

    editor.assignProperties(properties)
    await Editors.updateEditorByEmail(editor.email, editor.toRow())

    Logger.log(`Editor '${editor.email}' was updated.`, user.email, "Success")

    return new Response({
      reason: "updatedEditor",
      message: editor,
    })
  }


  static async getAllSubjects(body, {
    q
  }) {

  }

  static async getAllArticles({
    data,
    params
  }) {
    if (!params) return new ErrorResponse()
    const q = params.q

    const sheet = await SheetUtils.getSheetsAsJSON([AMS.articleDatabase, AMS.baseAuthSheet, AMS.authorSheet], true)
    /** @type {Array.<Article>} */
    let articles = sheet[AMS.articleDatabase]

    /** @type {Array.<Author>} */
    const authors = sheet[AMS.authorSheet]

    /** @type {Array.<Editor>} */
    const editors = Editors.fromSheet(sheet[AMS.baseAuthSheet], articles)

    articles = articles.map(a => new Article(a, editors, authors))

    let out = []
    if (typeof q === "string") {
      let b = {},
        parsed = AMS.parseQueryString(q)
      if (parsed.conditionArray.length === 0) {
        b = q
        out = flatSearch(articles, b, true)
      } else {
        parsed.conditionArray.forEach(x => b[x.keyword] = x.value)
        console.log(b)
        out = partialSearch(articles, b, true) // TODO: allow negated search terms
      }

    } else {
      out = articles
    }

    // Insert authors


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
  static async getAllEditors({
    data,
    params
  }) {
    const q = params.q
    let sheets = await SheetUtils.getSheetsAsJSON([AMS.baseAuthSheet, AMS.articleDatabase], true)
    let sheet = Editors.fromSheet(sheets[AMS.baseAuthSheet], sheets[AMS.articleDatabase])
    let out = []
    if (typeof q === "string") {
      // TODO: modularise this
      let b = {},
        parsed = AMS.parseQueryString(q)
      if (parsed.conditionArray.length === 0) {
        b = q
        return flatSearch(sheet.map((a) => new Editor(a)), b, true)
      } else {
        parsed.conditionArray.forEach(x => b[x.keyword] = x.value)
        return partialSearch(sheet.map((a) => new Editor(a)), b, true) // TODO: allow negated search terms
      }

    } else {
      out = sheet.map((a) => new Editor(a))
    }

    return out
  }

  static async getEditorByEmail({
    data,
    params
  }) {
    const email = params.email
    const q = `email:${email}`,
      results = AMS.getAllEditors(null, {
        q
      })

    return results[0] || new ErrorResponse(Errors.EDITOR_NOT_FOUND)
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
    const sheet = await SheetUtils.getSheetsAsJSON([AMS.articleDatabase, AMS.baseAuthSheet, AMS.authorSheet], true)
    /** @type {Array.<Article>} */
    let articles = sheet[AMS.articleDatabase]
    /** @type {Array.<Author>} */
    const authors = sheet[AMS.authorSheet]
    /** @type {Array.<Editor>} */
    const editors = sheet[AMS.baseAuthSheet]

    let article = articles.find(a => a.id == id)

    if (!article) return new ErrorResponse(Errors.NOT_FOUND)

    return new Article(article, editors, authors)
  }

  static async updateArticle(article) {
    const out = {
      ...article
    }

    out.authors = article.authors.map(au => au.email)
    out.editors = article.editors.map(ed => ed.email)

    SheetUtils.updateMatchingRowWithJSON({
      id: article.id
    }, out, AMS.articleDatabase)
  }

}



module.exports = AMS