export default class AMSCrypto {
    /**
     * Generates a random secure string to use as an auth token
     * 
     * @returns secure string
     */
    static generateRandomString() {
        const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        /*let array = new Array(40)
        
        new Crypto().getRandomValues(array)

        array = array.map(x => validChars.charCodeAt(x % validChars.length));
        return String.fromCharCode.apply(null, array);*/

        return validChars;
    }
}