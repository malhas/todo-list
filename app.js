const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
var list = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var day = today.toLocaleDateString("en-UK", options);

    res.render("list", {day: day, list: list});
});

app.post('/', function(req, res) {
    list.push(req.body.newItem);
    res.redirect("/");
})


app.listen(port, () => {
    console.log("Server is running");
});