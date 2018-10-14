export default class AMSCrypto {

    /**
     * Generates a random secure string to use as an auth token
     * 
     * @returns secure string
     */
    static generateRandomString(length) {
        let validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

        let array = new Array(length)

        while (length) {
            length--
            array[length] = Math.floor(Math.random() * 256)
        }

        array = array.map(x => validChars.charCodeAt(x % validChars.length));
        return String.fromCharCode(...array)
    }

    static generateKey() {
        return Math.floor(1e5 + Math.random() * 9e5)
    }
}