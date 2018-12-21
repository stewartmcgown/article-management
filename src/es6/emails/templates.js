module.exports =  class Templates {
    static templateKey(key) {
        return  `<!doctype html><html><body>
                    <p><strong>Your authentication key is: ${key}</strong>

                    <p>If you didn't request this key, don't worry, as no one can gain access to your account
                    without it.
                </body></html>`
    }

    static genericUpdate() {
        
    }
}