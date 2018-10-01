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

  static get allowedRoutes() {
    return {
      "GET": {
        "articles": ["list"],
        "article": ["info"],
        "authentication": ["authenticate"]
      },
      "POST": {
        "article": ["update", "delete"]
      }
    }
  }

  /**
   * Creates an array for appending to a key sheet. Usually called
   * by Authentication classes
   * 
   * @param {Object} data to create row from
   * @param {String} data.key the generated key
   * @param {String} data.email the email tied to the key
   * @param {Boolean} [data.keepLoggedIn=false] should the token last for longer than usual
   * 
   * @returns {Array} key sheet row 
   *  [DateTime, data.email, data.key, data.keepLoggedIn]
   */
  static createKeySheetRow(data) {
    if (!data.key) throw new Error(`Missing Key @ ${this.createKeySheetRow.name}`)
    if (!data.email) throw new Error(`Missing Email @ ${this.createKeySheetRow.name}`)

    data.keepLoggedIn = data.keepLoggedIn || false

    return [
      new Date(),
      data.email,
      data.key,
      data.keepLoggedIn
    ]
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