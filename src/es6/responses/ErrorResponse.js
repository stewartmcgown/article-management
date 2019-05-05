module.exports = class ErrorResponse {
  /**
   * Represents an error returned by the system
   *
   * @param {String} error
   * @param {String} message
   */
  constructor(error) {
    this.error = error
  }
}
