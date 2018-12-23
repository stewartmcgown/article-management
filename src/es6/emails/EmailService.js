const updateTemplate = ""
const Templates = require('./templates');
const GoogleWrapper = require("../utils/GoogleWrapper")
const base64url = require('base64url');


const templates = Object.freeze({
    update: updateTemplate
})

module.exports = class EmailService {
    /**
     * @param {Object} options
     * @param {String} options.to
     * @param {String} [options.type="generic"]
     * @param {Object} [options.data]
     * @param {String} [options.name="Submissions - Young Scientists Journal"]
     * @param {String} [options.body]
     */
    static send(options) {
        let to, from, subject, htmlBody, name

        to = "stewart@twistedcore.co.uk"//options.to
        from = options.name || "Submissions - Young Scientists Journal"
        subject = options.key ? `Authentication Key: ${options.key}` : "Article Management System"

        if (options.body) htmlBody = options.body
        else if (options.type && options.data) htmlBody = templates[options.type] instanceof Function ? template[options.type](options.data) : ""
        else if (options.key) htmlBody = Templates.templateKey(options.key)

        const message = this.encode({
            to,
            subject,
            htmlBody,
            from,
            name
        })

        GoogleWrapper.sendMail(message)
    }

    /**
     * 
     * @param {Object} options
     * @param {String} options.to
     * @param {String} options.from
     * @param {String} options.subject
     * @param {String} options.message 
     */
    static encode({
        to,
        subject,
        htmlBody,
        from,
        name
    }) {
        let str = ["Content-Type: text/html; charset=\"UTF-8\"\n",
            "MIME-Version: 1.0\n",
            "Content-Transfer-Encoding: 7bit\n",
            "to: ", to, "\n",
            "from: ", from, "\n",
            "subject: ", subject, "\n\n",
            htmlBody
        ].join('')

        return base64url(str)

    }

}