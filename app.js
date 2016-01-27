/**
 *
 *Language codes (https://developers.google.com/translate/v2/using_rest#target)
 *English en
 *Hindi	hi
 *Japanese ja
 *Chinese Simplified zh-CN
 *Spanish es
 *Russian ru
 */
var translateJSON = require('./translate-json');
//Define object and language here ;  This is for a test

//Test Data
var jsonString = '{' +
        '"TEXT":"Hello World",' +
        '"VALUE": {' +
        '"PREV":"Hello",' +
        '"NEXT":"World"' +
        '}' +
        '}';
var obj = JSON.parse(jsonString);
var lang = 'hi';
var file = 'translation_' + lang + '.json';
//Google translate API Key (https://developers.google.com/translate/v2/using_rest)
var API_KEY = 'API_KEY';
//Create translator object
var translator = new translateJSON(API_KEY);

//Calling translator writing
translator.translateObjectAndWrite(obj, lang, file, function (err, translation) {
    if (!err) {
        console.log('File Write Success. Translated Data : ', JSON.stringify(translation));
    }
    else {
        console.log('File Write Fail : ', JSON.stringify(err));
    }
});

