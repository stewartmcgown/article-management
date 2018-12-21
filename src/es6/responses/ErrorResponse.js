module.exports =  class ErrorResponse {
    /**
     * @param {String} error
     * @param {String} message
     */
    constructor(error, message) {
        this.error = error
        this.message = message
    }
}