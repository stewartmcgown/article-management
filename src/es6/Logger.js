const SheetUtils = require("./utils/SheetUtils")

const LogSheet = "Logs"
const Text = {
    Unauthorised: "Unauthorised",
    Failure: "Failure"
}

module.exports = class Logger {
    /**
     * Log an action
     * 
     * @param {String} action 
     * @param {String} email 
     * @param {String} result
     */
    static async log(action, email, result="Success") {
        SheetUtils.pushRowToSheet([new Date(), action, email, result], LogSheet)
    }

    static async unauthorised(action, email) {
        Logger.log(action, email, Text.Unauthorised)
    }

    static async failure(action, email) {
        Logger.log(action, email, Text.Failure)
    }
}