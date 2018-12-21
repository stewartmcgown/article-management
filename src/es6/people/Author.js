module.exports =  class Author {
    /**
     * Construct an author object. Structure can be seen
     * here {@link https://docs.google.com/document/d/1nkLn0BRqyT5ZotY4YFy-L_2w5WFMvFJZsgGdFQlqSRU/edit#heading=h.ka3h5e2bi6ly}
     *
     * @param {Object} data 
     * @param {String} data.id
     * @param {String} data.name
     */
    constructor(data) {
        this.id = data.id || null
        this.name = data.name || null
        this.email = data.email || null
        this.school = data.school || null
    }
}