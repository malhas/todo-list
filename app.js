const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const list = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    const day = date.getDate();
    res.render("list", {listTitle: day, list: list});
});

app.post('/', function(req, res) {
    list.push(req.body.newItem);
    res.redirect("/");
})


app.listen(port, () => {
    console.log("Server is running");
});