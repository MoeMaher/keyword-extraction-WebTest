export const LabelEncoder = (function() {
    /*
    *   Intialize private instance variable as a WeakMap to
    *   store private data for an object or to hide implementation details
    */
    const _labels = new WeakMap();

    class LabelEncoder {
        /*
       * LabelEncoder class
       * Encode labels with value between 0 and n_classes-1.
       */

        constructor() {

            // Initializing the instance variable labels to store the labels used
            _labels.set(this, []);
        }

        /**
         * Fit the label Encoder to the input array.
         * @param array
         * @returns {Promise<void>}
         */
        async fit(array) {
            let labels = []
            array.forEach((item) => {
                (!labels.includes(item)) ? labels.push(item) : null
            })
            _labels.set(this, labels)
        }

        /**
         * return the classes that's used for encoding.
         * @returns {any}
         */
        labels() {
            return _labels.get(this)
        }

        /**
         * Return the encoded version of the array with the unknown labels are set to -1
         * @param array
         * @returns {Promise<Array>}
         */
        async transform(array) {
            let encoded = []
            let labels  = _labels.get(this)
            array.forEach(function (item) {
                encoded.push(labels.indexOf(item))
            })
            return encoded
        }

        /**
         * Return the decoded version on the input array
         * @param array
         * @returns {Promise<Array>}
         */
        async inverse_transform(array) {
            let decoded = []
            let labels  = _labels.get(this)
            array.forEach(function (item) {
                (item === -1)?decoded.push(null):decoded.push(labels[item])
            })
            return decoded
        }

        /**
         * return the String that define this encoder, can be saved and loaded later.
         * @returns {string}
         */
        toJSONString() {
            return JSON.stringify(_labels.get(this))
        }

        /**
         * takes a string that is returned from toJSONString() function and load the encoder
         * @param JSONString
         */
        loadFromJSONString(JSONString) {
            _labels.set(this, JSON.parse(JSONString))
        }

    }

    return LabelEncoder;
}());

export const OneHotEncoder = (function() {

    const _max = new WeakMap();


    class OneHotEncoder {
        /*
       * OneHotEncoder class
       * Encode categorical integer features using a one-hot aka one-of-K scheme.
       */

        constructor() {
            _max.set(this, 0);
        }

        /**
         * Fit the label Encoder to the input array.
         * @returns {Promise<void>}
         * @param matrix
         */
        async fit(matrix) {
            if(matrix && typeof matrix === 'object' && matrix.constructor === Array) {
                matrix.map((item) => {
                    if (typeof item === 'number' && isFinite(item)) {
                        return this.setMax(item)
                    } else {
                        if (item && typeof item === 'object' && item.constructor === Array) {
                            return this.transform(item)
                        }
                    }

                })
            }
        }

        setMax(item) {
            let max = _max.get(this);
            if(item > max) {
                _max.set(this,item);
            }
        }

        /**
         * Return the encoded version of the array with the unknown labels are set to -1
         * @returns {Promise<Array>}
         * @param matrix
         */
        async transform(matrix) {
            if(matrix && typeof matrix === 'object' && matrix.constructor === Array) {
                return matrix.map((item) => {
                    if (typeof item === 'number' && isFinite(item)) {
                        return this.OHencode(item)
                    } else {
                        if (item && typeof item === 'object' && item.constructor === Array) {
                            return this.transform(item)
                        }
                    }

                })
            }
        }

        OHencode(item) {
            let zeros = Array.apply(null, Array(_max.get(this))).map(Number.prototype.valueOf, 0);
            zeros[item] = 1;
            return zeros;
        }

        /**
         * Return the decoded version on the input array
         * @param array
         * @returns {Promise<Array>}
         */
        async inverse_transform(array) {
            let decoded = []
            let labels  = _labels.get(this)
            array.forEach(function (item) {
                (item === -1)?decoded.push(null):decoded.push(labels[item])
            })
            return decoded
        }

        /**
         * return the String that define this encoder, can be saved and loaded later.
         * @returns {string}
         */
        toJSONString() {
            return JSON.stringify(_labels.get(this))
        }

        /**
         * takes a string that is returned from toJSONString() function and load the encoder
         * @param JSONString
         */
        loadFromJSONString(JSONString) {
            _labels.set(this, JSON.parse(JSONString))
        }

    }

    return LabelEncoder;
}());


function curryPartial(mainFunction, ...atts) {
    let numOfAtrNeeded = mainFunction.length;
    debugger
    if(numOfAtrNeeded <= atts.length){
        return mainFunction.apply(this, atts);
    } else {
        return (()=>{
            var newStateAtts = atts.slice();
            var func;
            return func = (...attributes) => {
                var newStateAttsInside = newStateAtts.slice();
                attributes.forEach((attr)=>{newStateAttsInside.push(attr)})
                if(numOfAtrNeeded <= newStateAttsInside.length){
                    return mainFunction.apply(this, newStateAttsInside);
                } else {
                    let smallScope
                    return smallScope = ((...inputs)=>{
                        newStateAtts = newStateAttsInside.slice();
                        return func.apply(smallScope, inputs);
                    });
                }
            }
        })()
    }
}
