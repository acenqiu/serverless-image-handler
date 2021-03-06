class StyleMapping {

    // Constructor
    constructor() {
        this.edits = {};
    }

    /**
     * @param {Object} event - The request body.
     */
    process(event) {
        const path = event.path;

        const matched = path.match(/!([\w_-]+)/);
        if (matched == null) {
            this.edits = undefined;
            return;
        }

        const style = matched[1].replace('_webp', '');
        const styleDefault = 'image/resize,m_mfit,w_640,h_640,limit_0/auto-orient,1/quality,q_80';
        const styleDefine = process.env['STYLE_' + style.toUpperCase()] || styleDefault;
        const pipelines = styleDefine.split('/');
        pipelines.forEach(pipeline => {
            const [ feature, ...args ] = pipeline.split(',');
            switch (feature) {
                case 'resize':
                    this.parseResize(args);
                    break;
                case 'auto-orient':
                    this.parseAutoOrient(args);
                    break;
                case 'blur':
                    this.parseBlur(args);
                    break;
                case 'format':
                    this.parseFormat(args);
                    break;
                case 'quality':
                    this.parseQuality(args);
                    break;
                default:
                    break;
            }
        });

        console.log(this.edits);
    }

    parseResize(args) {
        const options = { withoutEnlargement: true };

        args.forEach(arg => {
            if (arg.startsWith('m_')) {
                // todo: m_pad, m_fixed
                const fit = { m_lfit: 'inside', m_mfit: 'outside', m_fill: 'cover' }[arg];
                if (fit) options.fit = fit;
            } else if (arg.startsWith('w_')) {
                options.width = parseInt(arg.replace('w_', ''));
            } else if (arg.startsWith('h_')) {
                options.height = parseInt(arg.replace('h_', ''));
            } else if (arg.startsWith('limit_')) {
                options.withoutEnlargement = arg === 'limit_1';
            }
        });

        this.edits.resize = options;
    }

    parseAutoOrient(args) {
        if (args[0] === '1') this.edits.rotate = null;
    }
    
    parseBlur(args) {
        this.edits.blur = null;

        args.forEach(arg => {
            if (arg.startsWith('r_')) {
                this.edits.blur = 1 + parseFloat(arg.replace('r_', '')) / 2;
            }
        });
    }

    // https://help.aliyun.com/document_detail/44705.html?spm=a2c4g.11186623.2.15.7aa551b05grBvA#concept-exc-qp5-vdb
    parseQuality(args) {
        if (args.length > 0) {
            this.edits.jpeg = {
                quality: parseInt(args[0].toLowerCase().replace('q_', '')),
                force: false
            }
        }
    }

    parseFormat(args) {
        this.edits.toFormat = args[0];
    }

}

// Exports
module.exports = StyleMapping;