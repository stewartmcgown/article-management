const { assignExisting } = require("../utils/Utils")
const Person = require("./Person")

const Positions = Object.freeze({
    Editor: "Editor",
    Production: "Production",
})

const Levels = Object.freeze({
    Junior: "Junior",
    Senior: "Senior",
    Admin: "Admin"
})

const Enums = Object.freeze({
    level: Object.values(Levels),
    position: Object.values(Positions)
})

/**
 * Before assigning a property, validate it against these criteria
 */
const Attributes = Object.freeze({
    name: "",
    email: "",
    position: p => Positions[p] ? p : Positions.Editor,
    level: l => Levels[l] ? l : Levels.Junior,
    totalEdited: 0,
    currentlyEditing: 0,
    subjects: [],
})

module.exports = class Editor {
    /**
     * Constructs an editor object
     * 
     * @param {Object} data 
     * @param {String} data.name
     * @param {String} data.email
     * @param {String} data.position
     * @param {String} data.level
     * @param {Number} data.totalEditied
     * @param {Number} data.currentlyEditing
     * @param {Array} data.subjects
     */
    constructor(row) {
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
                    this[a] = Attributes[a]
                }
            }
        })
    }

    printSubjects() {
        return this.subjects.join(",")
    }

    toRow() {
        return [
            this.name,
            this.email,
            this.position,
            this.level,
            this.totalEdited,
            this.currentlyEditing,
            this.printSubjects()
        ]
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
            .filter(p => Enums[p] ? Enums[p].includes(properties[p]) : true)
            .forEach(p => allowed[p] = properties[p])
        assignExisting(this, allowed)
        return allowed
    }
}