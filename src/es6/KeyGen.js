export default class KeyGen {
    static generate() {
        return Math.floor(1e5 + Math.random() * 9e5)
    }
}