const express = require('express');
const app = express();

//serve static files
app.use(express.static("public"));

let cities = [
    {
        name: 'Berlin',
        country: "DE"
    },
    {
        name: 'Varna',
        country: "Bulgaria"
    },
    {
        name: "Halifax",
        country: 'Canada'
    }
];

app.get('/cities', (req, res) => {
    // console.log('/cities route has been hit!!!!'); // this is not a responce so we are commenting it out
    res.json(cities); // this is how we send a response 

})


app.listen(8080, () => console.log("Server is running"));