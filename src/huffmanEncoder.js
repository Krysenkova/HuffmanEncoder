import Node from './node.js';

/**
 * Huffman encoder class
 * Some ideas for implementation taken from https://developpaper.com/js-implementation-of-huffman-tree/
 *
 */
export default class HuffmanEncoder {
    /**
     * Static method creates a huffman tree from symbols.
     * @param {[number, number][]} symbols Array with pairs of symbol value and symbol count.
     * @returns {Node} Root node of the huffman tree.
     */
    static getTree(symbols) {
        // save symbols as nodes in a map
        const nodes = symbols.map(
            ([symbolValue, symbolsNumber]) => new Node({
                symbolValue,
                symbolsNumber,
            }),
        );
        let huffmanTree = [...nodes].sort(this.sortNodes);
        while (huffmanTree.length > 1) {
            const [first, second, ...rest] = huffmanTree;
            const parentNode = new Node({
                count: first.symbolsNumber + second.symbolsNumber,
                value: -1,
            });
            parentNode.left = first;
            parentNode.right = second;

            huffmanTree = [...rest, parentNode].sort(this.sortNodes);
        }
        return huffmanTree[0];
    }

    /**
     * Static method creates an array with codes for every symbol in the Huffman tree.
     * @param {Node} rootNode Root node of a huffman tree.
     * @returns {Map<number, string>} Map of symbol values with corresponding binary codes.
     */
    static getCodes(rootNode) {
        const codes = new Map();
        this.getCodesRecursive(rootNode, codes, '');
        return codes;
    }

    /**
     * Static method encodes the vlc code pairs and the source data itself.
     * @param {Map<number, string>} codes Map of symbol values with corresponding binary codes.
     * @param {DataView} sourceData Source data to be encoded using the code pairs.
     * @returns {string} Huffman encoded binary data as a string of bits.
     */
    static encodeData(codes, sourceData) {
        const sourceBytes = Array.from(Array(sourceData.byteLength))
            .map((_, index) => sourceData.getUint8(index));

        const encodedHuffmanCode = sourceBytes
            .map((byteData) => codes.get(byteData))
            .reduce((a, b) => `${a}${b}`, '');
        const vlcHeader = [...codes.entries()]
            .map(([symbol, code]) => this.makeSymbolCodePair(symbol, code, code.length))
            .reduce((a, b) => `${a}${b}`, '');

        return `${this.convertToBits(16, vlcHeader.length)}${vlcHeader}${encodedHuffmanCode}`;
    }

    /**
     * created pairs from symbol and binary code
     * @param symbol symbol
     * @param code code corresponding the symbol
     * @param codeLength length
     * @returns {string} pair of symbol and code
     */
    static makeSymbolCodePair(symbol, code, codeLength) {
        return `${this.convertToBits(8, codeLength)}${this.convertToBits(8, symbol)}${code}`;
    }

    /**
     * merges two smallest nodes in a tree
     * @param nodeOne the smallest node number one
     * @param nodeTwo the smallest node number two
     * @returns {number} merged node
     */
    static sortNodes(nodeOne, nodeTwo) {
        return nodeOne.symbolValue - nodeTwo.symbolValue;
    }

    /**
     * recursive methode to get a path
     * @param root root node of a tree
     * @param map map with symbol values and binary codes
     * @param path path to the root
     */
    static getCodesRecursive(root, map, path) {
        const {
            left,
            right,
            symbolValue,
        } = root;
        const isLast = !left && !right;
        if (isLast && symbolValue !== -1) {
            map.set(symbolValue, path);
            return;
        }
        if (left) {
            this.getCodesRecursive(left, map, `${path}0`);
        } else {
            this.getCodesRecursive(right, map, `${path}1`);
        }
    }

    /**
     * converts symbol value to bits
     * @param length length
     * @param value value for conversion
     * @returns {string} string of bits
     */
    static convertToBits(length, value) {
        return value.toString().padStart(length, '0');
    }
}
