const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const mongodb_password = process.env.MONGODB_PASSWORD

const list = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://admin:'+mongodb_password+'@cluster0.3goysx3.mongodb.net/?retryWrites=true&w=majority');

const itemsSchema = {
    name: String,
};
const Item = mongoose.model('Item', itemsSchema);


app.get('/', function(req, res) {
    const day = date.getDate();
    Item.find({}, function (err, items) {
        if (err) {
            console.log(err);
        } else {
            console.log(items);
            res.render("list", {listTitle: day, list: items});
        }
    });
});

app.post('/', function(req, res) {
    const newItem = new Item({ name: req.body.newItem });
    newItem.save().then(() => console.log('saved new item'));
    res.redirect("/");
})


app.listen(port, () => {
    console.log("Server is running");
});