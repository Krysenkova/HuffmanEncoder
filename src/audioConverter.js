import HuffmanEncoder from './huffmanEncoder.js';

export default class AudioConverter {
    /**
     * Loads an audio file and creates sourceData.
     * @param {string} url Relative path to an audio file.
     */
    async loadFile(url) {
        const response = await fetch(url);
        const audioData = await response.arrayBuffer();
        this.sourceData = new DataView(audioData);
    }

    /**
     * Finds all symbols in sourceData and calculates their respective count.
     * @returns {[number, number][]} Array with pairs of symbol value and symbol count.
     */
    getSymbolCount() {
        const messageLen = this.sourceData.byteLength;
        const symbolCount = new Map();

        for (let i = 0; i < messageLen; i += 1) {
            const key = this.sourceData.getUint8(i);
            // eslint-disable-next-line no-bitwise
            symbolCount.set(key, (symbolCount.get(key) | 0) + 1);
        }

        return [...symbolCount.entries()];
    }

    /**
     * Converts current audio source data to huffman-encoded data and presents the user with a
     * downloadable file.
     */
    downloadCompressed() {
        const symbolCount = this.getSymbolCount();

        // Create huffman tree
        const rootNode = HuffmanEncoder.getTree(symbolCount);
        // Get huffman codes from tree
        const codes = HuffmanEncoder.getCodes(rootNode);
        // Get binary data as string from source data using huffman code
        const encodedString = HuffmanEncoder.encodeData(codes, this.sourceData);

        // Generate array buffer from huffman encoded data string
        const byteLen = Math.floor(encodedString.length / 8);
        const encodedBuffer = new ArrayBuffer(byteLen);
        const dataView = new DataView(encodedBuffer);

        for (let i = 0; i < byteLen; i += 1) {
            const bitString = encodedString.substring(i * 8, (i + 1) * 8);
            const byteValue = parseInt(bitString, 2);
            dataView.setUint8(i, byteValue);
        }

        // Download huffman-encoded audio file
        const file = new Blob([encodedBuffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.textContent = 'Download audio.huff';
        a.href = url;
        a.download = 'audio.huff';
        document.body.appendChild(a);
    }
}
