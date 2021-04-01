// Require packages and set the port
const express = require('express');
const port = 3002;
const app = express();

const bodyParser = require('body-parser');
const routes = require('./routes/routes');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));



routes(app);

app.get("/public/script.js", function (req, res) {
    res.sendFile(__dirname + "/public/script.js");
});

// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
 
    console.log(`Server listening on port ${server.address().port}`);
});

