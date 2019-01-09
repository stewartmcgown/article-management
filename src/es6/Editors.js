const Editor = require("./people/Editor")

class Editors {
    static async getEditorByEmail(email) {
        const data = await SheetUtils.getSheetAsJSON(AMS.baseAuthSheet)
        const rows = data.filter(e => e.email == email)
        if (rows[0]) return new Editor(rows[0])
        else return null
    }

    static async updateEditorByEmail(email, rowData) {
        SheetUtils.updateMatchingRow({ email }, rowData, AMS.baseAuthSheet)
    }
}

module.exports = Editors