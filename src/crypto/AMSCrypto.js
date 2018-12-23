const TokenGenerator = require("uuid-token-generator")

module.exports =  class AMSCrypto {

    /**
     * Generates a random secure string to use as an auth token
     * 
     * @returns secure string
     */
    static generateRandomString(length) {
        return new TokenGenerator(512).generate()
    }

    static generateKey() {
        return new TokenGenerator(128, "0123456789").generate().substr(0, 6)
    }
}