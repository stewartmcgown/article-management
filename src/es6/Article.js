const Author = require("./people/Author");
const Editor = require("./people/Editor");
const State = require("./State")
const {
    parseDateString,
    assignExisting
} = require("./utils/Utils");

const Strings = {
    IMMUTABLE: "_IMMUTABLE"
}

const Enums = Object.freeze({
    status: [new State("In Review", ""),
            new State("Failed Data Check", ""),
            new State("Passed Data Check", ""),
            new State("Technical Review", ""),
            new State("Revisions Requested", ""),
            new State("Ready to Publish", ""),
            new State("Published", ""),
            new State("Submitted", ""),
            new State("Rejected", ""),
            new State("Final Review", ""),
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
const Attributes = Object.freeze({
    date: "",
        title: "",
        subject: "",
        type: "",
        status: "Submitted",
        id: "",
        deadline: a => a ? new Date(a) : null,
        notes: "",
        folderId: "",
        markingGrid: "",
        copyright: "None",
        trashed: t => parseTrashed(t),
        summary: "",
        reason: "",
        modified: "",
})

const parseTrashed = (t) => t === "TRUE" ? true : false

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
    constructor(row, editors, authors, includeHidden = false) {
        Object.keys(Attributes).forEach(a => {
            if (row[a]) {
                if (Attributes[a] instanceof Function) {
                    this[a] = Attributes[a](row[a])
                } else {
                    this[a] = row[a]
                }
            } else {
                if (Attributes[a] instanceof Function) {
                    this[a] = Attributes[a]()
                } else {
                this[a] = Attributes[a]}
            }
        })

        // Redefine immutable properties
        /*Object.defineProperties(this, {
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
        })*/

        this.setLink()
        this.setAuthor(row.authors, authors)
        this.setEditor(row.editors, editors)
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
            this.author.email,
            this.status,
            this.id,
            this.editor.email,
            this.deadline,
            this.notes,
            this.folderId,
            this.markingGrid,
            this.copyright,
            this.trashed,
            this.summary,
            this.reason,
            this.modified
        ]

        console.log(data)

        return data.map(o => !o ? "" : o)
    }

    /**
     * 
     * @param {Array.<String>} emails 
     * @param {Array.<Author>} authors 
     */
    setAuthor(emails = "", authors = []) {
        emails = emails.split(",")
        this.authors = authors.filter(j => emails.includes(j.email)) || { email: emails[0] }
    }

    setEditor(emails = "", editors = []) {
        emails = emails.split(",")
        this.editors = editors.filter(j => emails.includes(j.email)) || { email: emails[0] }
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
            .filter(p => Enums[p] ? (p == "status" ? Enums[p].some(s => s.name == properties[p]) : Enums[p].includes(properties[p]) && Enums[p] != Strings.IMMUTABLE) : true)
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

    /**
     * Is this article ready to be uploaded?
     * 
     * Submitted articles must consist of these properties:
     * 
     * 
     * 
     * @return {Boolean} true if ready
     */
    isFullSubmission() {
        const minimumProps = [
            "title",
            "subject",
            "type",
            "summary",
            "reason",
        ]

        return minimumProps.every(p => !!this[p])
    }
}