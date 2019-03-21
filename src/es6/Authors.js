const Author = require("./people/Author")
const SheetUtils = require("./utils/SheetUtils")

class Authors {
    static async getAuthorByEmail(email) {
        const data = await SheetUtils.getSheetAsJSON("Logins")
        const rows = data.filter(e => e.email == email)
        if (rows[0]) return new Author(rows[0])
        else return null
    }

    static async updateAuthorByEmail(email, rowData) {
        SheetUtils.updateMatchingRow({ email }, rowData, "Logins")
    }
}

module.exports = Authors