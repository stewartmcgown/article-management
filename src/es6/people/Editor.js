const Positions = Object.freeze({
    Editor: "Editor"
})

const Levels = Object.freeze({
    Junior: "Junior",
    Senior: "Senior",
    Admin: "Admin"
})

module.exports =  class Editor {
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
}