export default class EmailService {
    /**
     * @param {Object} options
     * @param {String} options.to
     * @param {String} [options.type="generic"]
     * @param {Integer} [options.key]
     * @param {String} [options.name="Submissions - Young Scientists Journal"]
     * @param {String} [options.payload]
     * @param {String} [options.body]
     */
    static send(options) {
        let to, name, subject, htmlBody

        if (options.type === "key") options.key = options.payload

        to = options.to || null
        name = options.name || "Submissions - Young Scientists Journal"
        subject = options.key ? `Authentication Key: ${options.key}` : "Article Management System"
        htmlBody = options.body || (options.key ? this.templateKey(options.key) : "")

        MailApp.sendEmail({
            to: to,
            name: name,
            subject: subject,
            htmlBody: htmlBody
        })
    }

    static templateKey(key) {
        return  `<!doctype html><html><body>
                    <p><strong>Your authentication key is: ${key}</strong>

                    <p>If you didn't request this key, don't worry, as no one can gain access to your account
                    without it.
                </body></html>`
    }
}