const aws = require("aws-sdk");
const fs = require("fs");

let secrets = require("./secrets");

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("req.file isn't there");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            // ^ PUT request for file (Object)
            // v info on the file
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("AWS putObject successful.");
            next();
            // fs.unlink(path, () => {});
            // ^ deletes the /uploads images
        })
        .catch((err) => {
            console.log("Error in upload putObject in s3.js: ", err);
            res.sendStatus(500);
        });
};
