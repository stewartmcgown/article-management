const Article = require("./Article")
const SheetUtils = require("./utils/SheetUtils")
const AMS = require("./AMS")
const GoogleWrapper = require("./utils/GoogleWrapper")

/**
 * An article creator that creates articles
 */
class ArticleCreator {
    /**
     * 
     * @param {Object} body 
     */
    constructor(body) {
        this._articleData = body
        
        this.article = new Article(body)

        this._verified = false
    }

    upload() {
        SheetUtils.pushRowToSheet(this.article.toRow(), AMS.articleDatabase)
    }

    /**
     * An article must contain the values specified in the Article class
     */
    verify() {
        if (this.article == undefined) {
            throw new Error("No article given")
        }

        this._verified = Article.isValid(this.article)
        return this._verified

    }

    static upload(data) {
        GoogleWrapper.uploadFile(data)
    }
}

module.exports = ArticleCreator