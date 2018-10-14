import Author from "./people/Author";

export const Statuses = Object.freeze({

})

export default class Article {
    /**
     * Constructs an article from a given sheet row. The sheet row
     * is a JSON object from passed by the SheetUtils class.
     * 
     * The resulting structure should look like the described
     * structure in {@link https://docs.google.com/document/d/1nkLn0BRqyT5ZotY4YFy-L_2w5WFMvFJZsgGdFQlqSRU/edit#heading=h.m03wrfbkeob7}
     * 
     * 
     * @param {Object} row 
     * @param {String} row.date
     * @param {String} row.articleTitle
     * @param {String} row.articleSubject
     * @param {String} row.aritcleType
     * @param {String} row.authorName
     * @param {String} row.authorSchool
     * @param {String} row.email
     * @param {String} row.status
     * @param {String} row.ID
     * @param {String} row.editor
     * @param {String} row.editorEmail
     * @param {String} row.deadline
     * @param {String} row.additionalNotes
     * @param {String} row.folderID
     * @param {String} row.markingGrid
     * @param {String} row.copyright
     */
    constructor(row) {
        this.date = row.date ? new Date(row.date) : null
        this.title = row.articleTitle || null
        this.subject = row.articleSubject || null
        this.type = row.aritcleType || null
        this.status = row.status || null
        this.id = row.ID || null
        this.deadline = row.deadline ? new Date(row.deadline) : null
        this.markingGrid = row.markingGrid || null
        this.copyright = row.copyright || null

        this.setLink()
        this.setAuthor(row.email, row.authorName, row.authorSchool)
        this.setEditor()
    }

    /**
     * Using the authorName, authorSchool and email, 
     * create an author object and set it.
     * 
     * @param {String} email
     * @param {String} name
     * @param {String} school
     */
    setAuthor(email, name, school) {
        this.author = new Author({
            email: email,
            name: name,
            school: school
        })
    }

    setEditor() {
        this.editor = new 
    }

    setLink() {
        this.link = `https://docs.google.com/document/d/${this.id}/edit`
    }
}