const Person = require("./Person")

module.exports = class Author extends Person {
	/*
	 * Construct an author object. Structure can be seen
	 * here {@link https://docs.google.com/document/d/1nkLn0BRqyT5ZotY4YFy-L_2w5WFMvFJZsgGdFQlqSRU/edit#heading=h.ka3h5e2bi6ly}
	 *
	 * @param {Object} data
	 * @param {String} data.name
	 */
	constructor(data) {
		super(data.name, data.email)
        this.school = data.school
		this.biography = data.biography
		this.country = data.country
		this.teacher = data.teacher
		this.profile = data.profile
	}
}
