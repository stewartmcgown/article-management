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
     * @param {}
     */
    constructor(data) {
        this.name = data.name
        this.email = data.email
        this.position = data.position 
        this.level = data.level
        this.totalEdited = data.totalEdited
        this.currentlyEditing = data.currentlyEditing
        this.subjects = data.subjects

    }
}