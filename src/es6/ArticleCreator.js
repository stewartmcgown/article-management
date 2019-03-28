const Article = require("./Article")
const SheetUtils = require("./utils/SheetUtils")
const SheetNames = require("./Sheets")
const GoogleWrapper = require("./utils/GoogleWrapper")

/**
 * An article creator that creates articles
 */
class ArticleCreator {

    /**
     * 
     * @param {Object} creator
     * @param {Object} creator.article
     * @param {Object} creator.data containing binary 'data' and a 'mimeType'
     * @param {Object} creator.author
     */
    constructor({ article, author, data}) {
        this.article = article
        this.data = data

        this._verified = false
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


    async upload() {
        const metadata = {}

        // Two copies
        metadata.googleDoc = await GoogleWrapper.uploadFile({
            ...this.data,
            title: this.article.title
        })

        // Async call for original copy creation
        GoogleWrapper.uploadFile({
            ...this.data,
            title: this.article.title,
            convert: true
        }).then(x => x)

        // Append row
        //console.log(Object.values(this.article))
        SheetUtils.pushJSONToSheet(this.article, SheetNames.articleDatabase)
    }
}

module.exports = ArticleCreator