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

module.exports = class Editor extends Person {
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
    constructor(data) {
        super(data.name, data.email)
        this.name = data.name
        this.email = data.email
        this.position = data.position || Positions.Editor
        this.level = data.level || Levels.Junior
        this.totalEdited = data.totalEdited || 0
        this.currentlyEditing = data.currentlyEditing || 0
        this.subjects = data.subjects || []
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