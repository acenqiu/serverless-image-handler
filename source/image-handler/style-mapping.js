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
    }

}

// Exports
module.exports = StyleMapping;