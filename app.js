const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const lodash = require('lodash');
const mongodb_password = process.env.MONGODB_PASSWORD

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://admin:'+mongodb_password+'@cluster0.3goysx3.mongodb.net/?retryWrites=true&w=majority');

const itemsSchema = {
    name: String,
};
const Item = mongoose.model('Item', itemsSchema);

const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model('List', listSchema);


app.get('/', function(req, res) {
    const day = date.getDate();
    Item.find({}, function (err, items) {
            if (err) {
                console.log("Error: "+err);
                res.render("list", {listTitle: "Today", list: {}});
            } else {
               console.log(items);
               res.render("list", {listTitle: "Today", list: items});
        }
    });
});


app.post('/create', function(req, res) {
    console.log(req.body.listTitle);
    if (req.body.listTitle === "Today") {
        const newItem = new Item({ name: req.body.newItem });
        newItem.save().then(() => console.log('saved new item'));
        res.redirect("/");
    }
    else {
        List.findOneAndUpdate(
            { name: lodash.toLower(req.body.listTitle) },
            { $push: {items: {
                name: req.body.newItem
            }}},
            function(err) {
                if(err) console.log(err);
            }
        );
        res.redirect('/'+lodash.toLower(req.body.listTitle));
    };
});


app.post('/delete', function(req, res) {
    console.log(req.body.checkedItem)
    if (req.body.listTitle === "Today") {
        Item.deleteOne({_id: req.body.checkedItem}, function(err) {
            if (err) console.log(err);
        });
        res.redirect("/");
    }
    else {
        List.findOneAndUpdate(
            { name: lodash.toLower(req.body.listName) },
            { $pull: {items: {
                _id: req.body.checkedItem
            }}},
            function(err) {
                if(err) console.log(err);
            }
        );
        res.redirect("/"+lodash.toLower(req.body.listName));
    }
})


app.get("/:customList", function (req, res) {
    List.findOne({name: req.params.customList}, function(err, list) {
        if(list === null) {
            console.log("List not found");
            const newList = new List({ name: req.params.customList });
            newList.save().then(() => console.log('saved new list'));
            res.redirect("/"+req.params.customList);
        }
        else if (err) {
            if (err) console.log("Error: "+err);
            res.render("list", {listTitle: lodash.upperFirst(req.params.customList), list: {} });
        } else {
            console.log(list);
            console.log(list.items)
            res.render("list", {listTitle: lodash.upperFirst(req.params.customList), list: list.items });
        }
    });

})

app.listen(port, () => {
    console.log("Server is running");
});