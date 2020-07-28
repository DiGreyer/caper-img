const express = require("express");
const app = express();
const db = require("./db");
const s3 = require("./s3");
const config = require("./config");

//serve static files
app.use(express.static("public"));

////////// multer boilerplate//////////////

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

///////////end of multer boilerplate ///////////////

//get request for db images
app.get("/images", (req, res) => {
    return db
        .getImages()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("There is an error in db.getImages: ", err);
        });
});

//upload images
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("File: ", req.file);
    console.log("Input: ", req.body);
    let awsUrl = config.s3Url;
    awsUrl += req.file.filename;
    req.body.url = awsUrl;

    if (req.file) {
        return db
            .addImages(
                req.body.url,
                req.body.username,
                req.body.title,
                req.body.description
            )
            .then((id) => {
                if (id) {
                    res.json(req.body);
                } else {
                    res.sendStatus(500);
                }
            });
    } else {
        res.json({
            success: false,
        });
    }
});

// GET /image-post

app.post("/image-post", (req, res) => {
    console.log("The req.body in POST /image-post: ", req.body);
    let finalJson = [];
    return db
        .getImage(req.body.id)
        .then((result) => {
            console.log("This is the getImage result: ", result.rows);
            finalJson.push(result.rows[0]);
            console.log("finalJson stage 1: ", finalJson);
        })
        .then(() => {
            return db.getComments(req.body.id).then((result) => {
                console.log("This is the getComments result: ", result.rows);
                finalJson.push(result.rows);
                console.log("finalJson stage 2: ", finalJson);
                res.json(finalJson);
            });
        })
        .catch((err) => {
            console.log("Error server POST /image-post: ", err);
        });
});

app.post("/image-post", (req, res) => {
    console.log("The req.body in POST /image-post: ", req.body);
    let finalJson = [];
    return db
        .getImage(req.body.id)
        .then((result) => {
            console.log("This is the getImage result: ", result.rows);
            finalJson.push(result.rows[0]);
            console.log("finalJson stage 1: ", finalJson);
        })
        .then(() => {
            return db.getComments(req.body.id).then((result) => {
                console.log("This is the getComments result: ", result.rows);
                finalJson.push(result.rows);
                console.log("finalJson stage 2: ", finalJson);
                res.json(finalJson);
            });
        })
        .catch((err) => {
            console.log("Error server POST /image-post: ", err);
        });
});

app.post("/post-comment", (req, res) => {
    console.log("The req.body in POST /post-comment: ", req.body);
    return db
        .addComment(req.body.poster, req.body.comment, req.body.image_id)
        .then((result) => {
            console.log("This is the result of addComment: ", result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("Error in POST /post-comment: ", err);
        });
});

app.listen(8080, () => console.log("Server is running"));
