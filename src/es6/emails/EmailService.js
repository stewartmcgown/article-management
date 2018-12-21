const updateTemplate = ""
const Templates = require('./templates');

const templates = Object.freeze({
    update: updateTemplate
})

module.exports =  class EmailService {
    /**
     * @param {Object} options
     * @param {String} options.to
     * @param {String} [options.type="generic"]
     * @param {Object} [options.data]
     * @param {String} [options.name="Submissions - Young Scientists Journal"]
     * @param {String} [options.body]
     */
    static send(options) {
        let to, name, subject, htmlBody

        to = options.to
        name = options.name || "Submissions - Young Scientists Journal"
        subject = options.key ? `Authentication Key: ${options.key}` : "Article Management System"
        
        if (options.body) htmlBody = options.body
        else if (options.type && options.data) htmlBody = templates[options.type](options.data)
        else if (options.key) htmlBody = Templates.templateKey(options.key)

        MailApp.sendEmail({ to, subject, htmlBody, name })
    }
    
}