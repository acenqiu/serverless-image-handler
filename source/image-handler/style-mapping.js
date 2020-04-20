class StyleMapping {

    // Constructor
    constructor() {
        this.edits = {};
    }

    /**
     * @param {Object} event - The request body.
     */
    process(event) {
        this.edits.grayscale = true;
        this.edits.toFormat = 'jpeg';
    }

}

// Exports
module.exports = StyleMapping;