var md5 = require("md5");
var chance = require('chance').Chance();

module.exports = {
    encrypt: function(item) {
        return md5(item);
    },

    createTempPassword: function() {
        return chance.string({ pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length: sails.config.globals.tempPasswordLengthForForgotPassword });
    },

    getFileExtension: function(fullFileName) {
        var fileExtensionArray = fullFileName.split(".");
        var fileExtensionArrayLength = fileExtensionArray.length;
        var fileExtension = fileExtensionArray[fileExtensionArrayLength - 1];
        return (fileExtension.toLowerCase());
    }
}