export default class Node {
    constructor({
        symbolsNumber,
        symbolValue,
    }) {
        this.symbolsNumber = symbolsNumber; // how many symbols
        this.symbolValue = symbolValue; // what the symbol
        this.left = null; // left child
        this.right = null; // right child
    }
}
