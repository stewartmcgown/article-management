const Person = require('./Person')

module.exports = class Teacher extends Person {
  /*
   * Represents a teacher
   *
   * @param {Object} data
   * @param {String} data.name
   * @param {String} data.email
   */
  constructor(data) {
    super(data.name, data.email)
  }
}
