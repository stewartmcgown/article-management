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
        /** @type {Article} */
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

        this.article = new Article(this.article)

        return this.article.isFullSubmission()
    }


    async upload() {
        if (!this.verify()) throw new Error("Could not verify article")

        const metadata = {}

        // Prepare folder
        metadata.googleDocFolder = await GoogleWrapper.createFolder({ 
            title: this.article.title
         })

        // Original doc copy
        metadata.googleDoc = await GoogleWrapper.uploadFile({
            ...this.data,
            title: this.article.title,
            parent_id: metadata.googleDocFolder.id,
            convert: true
        })

        // Async call for original copy creation
        GoogleWrapper.uploadFile({
            ...this.data,
            title: this.article.title + " (Original Copy)",
            parent_id: metadata.googleDocFolder.id,

        }).then(x => x)

        // Postprocess the article, add date and other props
        this.article.id = metadata.googleDoc.id
        this.article.folderId = metadata.googleDocFolder.id

        // Append row
        //console.log(Object.values(this.article))
        SheetUtils.pushJSONToSheet(this.article, SheetNames.articleDatabase)

        
    }
}

module.exports = ArticleCreator