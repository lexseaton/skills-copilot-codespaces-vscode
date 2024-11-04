// Create web server
// Load the express module
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs');
var path = require('path');

// Use the body-parser middleware to parse POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set the path to the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the path to the static files directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a variable to store the comments
var comments = [];

// Load the comments from the comments file
fs.readFile('comments.json', 'utf8', function (err, data) {
  if (err) {
    console.log(err);
  } else {
    comments = JSON.parse(data);
  }
});

// Define a route to the home page
app.get('/', function (req, res) {
  // Render the home page
  res.render('index', { comments: comments });
});

// Define a route to handle form submission
app.post('/submit', function (req, res) {
  // Get the name and comment from the POST data
  var name = req.body.name;
  var comment = req.body.comment;

  // Create a new comment object
  var newComment = {
    name: name,
    comment: comment
  };

  // Add the new comment to the comments array
  comments.push(newComment);

  // Write the comments array to the comments file
  fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
    if (err) {
      console.log(err);
    } else {
      // Redirect to the home page
      res.redirect('/');
    }
  });
});

// Start the server
app.listen(3000, function () {
  console.log('Server is running on http://localhost:3000');
});