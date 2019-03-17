const Author = require("./people/Author");
const Editor = require("./people/Editor");
const {
    parseDateString,
    assignExisting
} = require("./utils/Utils");

const Strings = {
    IMMUTABLE: "_IMMUTABLE"
}

const Enums = Object.freeze({
    status: ["In Review",
        "Failed Data Check",
        "Passed Data Check",
        "Technical Review",
        "Revisions Requested",
        "Ready to Publish",
        "Published"
    ],
    type: [
        "Review Article",
        "Blog",
        "Original Research",
        "Magazine Article",
    ],
    /** @type {Array} */
    subject: [
        "Biology",
        "Chemistry",
        "Computer Science",
        "Engineering",
        "Environmental & Earth Science",
        "Materials Science",
        "Mathematics",
        "Medicine",
        "Physics",
        "Policy & Ethics"
    ],
    id: Strings.IMMUTABLE, 
    date: Strings.IMMUTABLE,

})

/**
 * Before assigning a property, validate it against these criteria
 */
const Preprocessing = Object.freeze({

})

module.exports = class Article {
    /**
     * Constructs an article from a given sheet row. The sheet row
     * is a JSON object passed by the SheetUtils class.
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
        this.date = row.date || null
        this.title = row.articleTitle || null
        this.subject = row.articleSubject || null
        this.type = row.articleType || null
        this.status = row.status || null
        this.id = row.id || null
        this.deadline = row.deadline ? new Date(row.deadline) : null
        this.notes = row.additionalNotes || null
        this.folderId = row.folderID || null
        this.markingGrid = row.markingGrid || null
        this.copyright = row.copyright || null
        this.possibleStates = Enums.status

        // Redefine immutable properties
        Object.defineProperties(this, {
            id: {
                configurable: true,
                value: this.id,
                enumerable: true,
                writable: false
            },
            date: {
                configurable: true,
                value: this.date,
                enumerable: true,
                writable: false
            }
        })

        this.setLink()
        this.setAuthor(row.email, row.authorName, row.authorSchool)
        this.setEditor(row.editor, row.editorEmail)
    }

    /**
     * Convert this object in to a DB row
     */
    toRow() {
        const data= [
            this.date,
            this.title,
            this.subject,
            this.type,
            this.author.name,
            this.author.school,
            this.author.email,
            this.status,
            this.id,
            this.editor.name,
            this.editor.email,
            this.deadline,
            this.notes,
            this.folderId,
            this.markingGrid,
            this.copyright
        ]

        return data.map(o => !o ? "" : o)
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
            email,
            name,
            school
        })
    }

    setEditor(name, email) {
        this.editor = new Editor({
            name,
            email
        })
    }

    setLink() {
        this.link = `https://docs.google.com/document/d/${this.id}/edit`
    }

    /**
     * Checks if all the properties have correct values and assigns them
     * to the article
     * @param {Object} properties 
     * @return {Object} the properties that got changed
     */
    assignProperties(properties) {
        let allowed = {}
        Object.keys(properties)
            .filter(p => Enums[p] ? Enums[p].includes(properties[p]) && Enums[p] != Strings.IMMUTABLE : true)
            .forEach(p => allowed[p] = properties[p])
        assignExisting(this, allowed)
        return allowed
    }

    /**
     * Is this article valid for a submission?
     * @param {Article} article 
     * @return {Boolean} is the article valid
     */
    static isValid(article) {
        return true
    }
}