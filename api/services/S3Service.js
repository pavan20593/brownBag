'use strict';

//npm Modules
var knox = require('knox');

//client specifications to connect to S3
var client = knox.createClient({
    key: sails.config.connections.s3Credentials.key,
    secret: sails.config.connections.s3Credentials.secret,
    bucket: sails.config.connections.s3Credentials.bucket
});

var error = require("../errors/errors.js");


class S3Service {

    /**
     * uploadFileToS3: It is an function for To upload file into the s3 bucket.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */
    uploadFileToS3(params, callback) {

        params.file.upload({
            saveAs: params.s3fileName,
            adapter: require('skipper-s3'),
            key: sails.config.connections.s3Credentials.key,
            secret: sails.config.connections.s3Credentials.secret,
            bucket: sails.config.connections.s3Credentials.bucket
        }, function whenDone(error, uploadedFiles) {
            if (error) {
                return callback(error.inconvenienceMessage());
            }
            return callback(null, uploadedFiles);
        });
    }

    /**
     * removeFileFromS3: It is an function for To remove a file from the s3 bucket.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */
    removeFileFromS3(params, callback) {
        client.deleteFile(params.fileS3Url, function(err, response) {
            if (err) {
                return callback(error.inconvenienceMessage());
            } else if (response.statusCode != 204) {
                return callback(error.inconvenienceMessage());
            } else {
                return callback(null, params);
            }
        });
    }
}

module.exports = S3Service;