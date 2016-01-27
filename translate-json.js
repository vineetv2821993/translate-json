var jsonfile = require('jsonfile');

/**
 * Constructor
 * @param {type} API_KEY
 * @returns {translateJSON}
 */
function translateJSON(API_KEY) {
    translateJSON.prototype.API_KEY = API_KEY;
    this.googleTranslate = require('google-translate')(API_KEY);
}

translateJSON.prototype.API_KEY = 'API_KEY';
translateJSON.prototype.googleTranslate = null;

/**
 *Check if function
 * @param {type} functionToCheck
 * @returns {Boolean}
 */
translateJSON.prototype.isFunction = function (functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
/**
 *Check if object
 * @param {type} objectToCheck
 * @returns {Boolean}
 */
translateJSON.prototype.isObject = function (objectToCheck) {
    var getType = {};
    return objectToCheck && getType.toString.call(objectToCheck) === '[object Object]';
}

/**
 *Show every single data in object
 * @param {type} obj
 * @returns {String}
 */
translateJSON.prototype.showObject = function (obj) {
    var self = this;
    var result = "";
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (self.isObject(obj[p])) {
                result += self.showObject(obj[p]);
            }
            else if (self.isFunction(obj[p])) {
                //Do Nothing
            }
            else {
                result += p + " , " + obj[p] + "\n";
            }
        }
    }
    return result;
}
/**
 *Alter every single data in object
 * @param {type} obj
 * @param {type} alterFunction
 * @returns {unresolved}
 */
translateJSON.prototype.alterObject = function (obj) {
    var self = this;
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (self.isObject(obj[p])) {
                self.alterObject(obj[p]);
            }
            else if (self.isFunction(obj[p])) {
                //Do Nothing
            }
            else {
                obj[p] = obj[p]; //Here alter the stuff
            }
        }
    }
    return obj;
}
/**
 *Alter every single data in object and push to array
 * @param {type} obj
 * @param {type} array
 * @returns {unresolved}
 */
translateJSON.prototype.objectToArrayUtil = function (obj, array) {
    var self = this;
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (self.isObject(obj[p])) {
                self.objectToArrayUtil(obj[p], array);
            }
            else if (self.isFunction(obj[p])) {
                //Do Nothing
            }
            else {
                array.push(obj[p]); //Here push
            }
        }
    }
    return array;
}
/**
 * Convert object to array
 * @param {type} obj
 * @returns {unresolved|type}
 */
translateJSON.prototype.objectToArray = function (obj) {
    var self = this;
    return self.objectToArrayUtil(obj, new Array());
}

/**
 *Fill object with given array
 * @param {type} obj
 * @param {type} array
 * @returns {unresolved}
 */
translateJSON.prototype.fillObjWithArray = function (obj, array, index) {
    var self = this;
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (self.isObject(obj[p])) {
                self.fillObjWithArray(obj[p], array, index);
            }
            else if (self.isFunction(obj[p])) {
                //Do Nothing
            }
            else {
                obj[p] = array[index.ref].translatedText; //Here property in an array
                index.ref++;
            }
        }
    }
    return obj;
}
/**
 *
 * @param {type} obj
 * @param {type} lang
 * @param {type} callback
 * @returns {unresolved}
 */
translateJSON.prototype.translateObject = function (obj, lang, callback) {
    var self = this;
    var strings = self.objectToArray(obj);
    //Pass obj, lang by value
    self.googleTranslate.translate(strings, lang, function (err, translation) {
        if (!err) {
            callback(null, translation);
        }
        else {
            callback(err, null);
        }
    });

    return obj;
}
/**
 * In callback get translation data in success
 * @param {type} obj
 * @param {type} lang
 * @param {type} file
 * @param {type} callback
 * @returns {undefined}
 */
translateJSON.prototype.translateObjectAndWrite = function (obj, lang, file, callback) {
    var self = this;
    self.translateObject(obj, lang, function (err, translation) {
        if (!err) {
            //Avoiding pass by value
            var index = {
                ref: 0
            }
            self.fillObjWithArray(obj, translation, index);
            //Writing to file
            jsonfile.writeFile(file, obj, function (err) {
                if (err) {
                    callback(err, null);
                }
                else {
                    callback(null, translation);
                }
            });
        }
        else {
            callback(err, null);
        }
    });
}
module.exports = translateJSON;
