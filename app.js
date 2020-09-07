//jshunt esversion:6

const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

//setup connection to mongodb

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//specify the schema, and what your DB will contain
const articleSchema = {
    title: String,
    content: String
};

//use mongoose to specify
const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////////Requests Targeting All Articles//////////////////////////////////////////

app.route("/articles")

//Get the Values in our MongoDB
.get(function (req, res) {
    Article.find(function (err, foundArticle) {
        if (!err) {
            res.send(foundArticle);
        } else {
            res.send(err);
        }

    });
})

//create a new value and title for our MongoDB 
.post(function (req, res) {
    console.log();
    console.log();
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function (err) {
        if (!err) {
            res.send(foundArticle);
        } else {
            res.send(err);
        }
    });
})

//Delete all of MongoDBs values and containments
.delete(function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("Successfully deleted all articles");
        } else {
            res.send(err);
        }
    });
});


//////////////////////////////////////////Requests Targeting All Articles//////////////////////////////////////////



app.route("/articles/:articleTitle")

// req.params.articleTitle = "Jack-Bauer"

.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.");
        }
    });
})

.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated article.");
            }
        }
    );
})

.patch(function(req, res){

    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully patched article!")
            } else {
                res.send(err);
            }
        }
    );
})

.delete(function(req, res){

    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if (!err){
                res.send("Successfully deleted entry!")
            } else {
                res.send(err);
            }
        }
    );
});


app.listen(3000, function () {
    console.log("server started on port 3000");
});


// {
//     "_id": ObjectId("5f546bda52c09e14b1e8ae40"),
//     "title": "REST",
//     "content": "REST is short for REpresentational State Transfer. It's an architectural style for designing APIs."
// }

// /* 2 */
// {
//     "_id": ObjectId("5c139771d79ac8eac11e754a"),
//     "title": "API",
//     "content": "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
// }

// /* 3 */
// {
//     "_id": ObjectId("5c1398aad79ac8eac11e7561"),
//     "title": "Bootstrap",
//     "content": "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
// }

// /* 4 */
// {
//     "_id": ObjectId("5c1398ecd79ac8eac11e7567"),
//     "title": "DOM",
//     "content": "The Document Object Model is like an API for interacting with our HTML"
// }

// /* 5 */
// {
//     "_id": ObjectId("5f5480ec6d8c803ac041475f"),
//     "title": "Chuck Norris",
//     "content": "Chuck Norris made tears cry",
//     "__v": 0
// }