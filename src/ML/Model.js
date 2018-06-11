import * as tf from '@tensorflow/tfjs';
import { bag } from './bag_of_words';
import { words } from "./common_words";
var Tokenizer = require('tokenize-text');
var tokenize = new Tokenizer();
var Snowball = require('snowball');


var model = null;

export const keywordsGenerator = {


    loadClassifier: async function () {

        const m = await tf.loadModel('https://raw.githubusercontent.com/MoeMaher/ml-keywords-extractor/master/out/model.json');
        // const m = await tf.loadModel('app://media/maher/Windows/Users/mohamed mahre/Desktop/keywords-extract/out/model.json');
        model = m;
        console.log('model Loaded')
    },
    LabelEncode: function (strings) {
        let encoded = [];
        strings.forEach(function (word) {
            encoded.push(bag.indexOf(word))
        })
        return encoded
    },
    oneHotEncode: function (labelEncodedWords) {
        let max = 11000;
        return splitArray(labelEncodedWords.map(function (word) {
            let zeros = Array.apply(null, Array(max)).map(Number.prototype.valueOf, 0);
            zeros[word] = 1;

            return zeros;
        }), 1);
    },
    predict: async function (doc, confidenceRatio, stemmed = false) {
        let tokens = tokenize.words()(doc);
        let inWords = tokens.map((word) => word.value).filter((word) => {
            return bag.includes(word)
        })
        let test_integer_encoded = this.LabelEncode(inWords);
        let X = this.oneHotEncode(test_integer_encoded)
        // X = splitArray(X,1);
        if(inWords.length === 0){
            return [];
        }
        let pred = model.predict(tf.tensor(X));
        let output = null;
        await pred.data().then((predData) => {
            let outWords = [];
            predData.forEach((prediction, i) => {
                if (prediction > confidenceRatio && !words.includes(inWords[i]) && !outWords.includes(inWords[i])) {
                    let approvedWord = inWords[i];
                    if(stemmed){
                        let stemmer = new Snowball('English');
                        stemmer.setCurrent(approvedWord);
                        stemmer.stem();
                        outWords.push(stemmer.getCurrent());
                    } else {
                        outWords.push(approvedWord)
                    }
                }
            })
            output = outWords;
        });
        return output;
    }
}
function splitArray(array, part) {
    var tmp = [];
    for(var i = 0; i < array.length; i += part) {
        tmp.push(array.slice(i, i + part));
    }
    return tmp;
}

