const express = require("express");
const app = express();
const db = require("./db");

//serve static files
app.use(express.static("public"));

// let cities = [
//     {
//         name: "Berlin",
//         country: "DE",
//     },
//     {
//         name: "Varna",
//         country: "Bulgaria",
//     },
//     {
//         name: "Halifax",
//         country: "Canada",
//     },
// ];

// app.get("/cities", (req, res) => {
//     // console.log('/cities route has been hit!!!!'); // this is not a responce so we are commenting it out
//     res.json(cities); // this is how we send a response
// });

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

app.listen(8080, () => console.log("Server is running"));
