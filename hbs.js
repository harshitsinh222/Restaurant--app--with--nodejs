var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
const exphbs = require('express-handlebars');

var path = require('path'); // Using Path
app.use(express.static(path.join(__dirname, 'public'))); // Connecting to the segments
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');  //Able to render hbs file
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json



mongoose.connect(database.url);
var b ;
var Book = require('./models/books');
const { json } = require('body-parser');

var a = Book.find(function(err, books) {
  
	// if there is an error retrieving, send the error otherwise send data
	return books ;

	


	// return all books in JSON format
});

console.log(a.obj);
app.use(express.urlencoded({ extended: true }));
app.get("/api/book-info/hbs", (req, res,next) => {

  res.render('./pages/hbs',{ data :
    Book.find(function(err, books) {
      console.log(books[0].title);
      // if there is an error retrieving, send the error otherwise send data
      return books[0] ;
    
     
    
    
      // return all books in JSON format
    }), layout: false });

});
app.listen(port, () => {  //Listening to the port
  console.log(`Example app listening at http://localhost:${port}`)
})