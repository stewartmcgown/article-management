module.exports =  class ErrorResponse {
    /**
     * @param {String} error
     * @param {String} message
     */
    constructor(error, message) {
        this.error = {}
        this.error.error = error
        this.error.message = message
    }
}