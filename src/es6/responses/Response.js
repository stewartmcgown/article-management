/**
 *  
 */
export default class Response {
    /**
     * 
     * @param {Object} data 
     * @param {Object} data.message
     * @param {String} data.reason
     */
    constructor(data) {
      this.message = data.message
      this.reason = data.reason
    }
  }