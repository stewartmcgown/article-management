module.exports =  class Editor {
    /**
     * Constructs an editor object
     * 
     * @param {Object} data 
     * @param {String} data.id
     * @param {String} data.name
     * @param {String} data.email
     */
    constructor(data) {
        this.id = data.id || null
        this.name = data.name || null
        this.email = data.email || null
    }
}