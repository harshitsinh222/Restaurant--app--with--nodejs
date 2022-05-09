var express = require("express");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)
const { celebrate, Joi, Segments } = require("celebrate");
const exphbs = require("express-handlebars");
var path = require("path"); // Using Path
var app = express();
app.use(express.static(path.join(__dirname, "public"))); // Connecting to the segments
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs"); //Able to render hbs file
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

var port = process.env.PORT || 8000;

var db = require("./db/methods");
const {
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
} = require("./db/methods");

//STEP 2: Calling the database connection method
db.initialize();

app.get("/", (req, res) => {
  res.send("Welcome to the project of Web Framework 1 Course!!");
});

//STEP 2: Add new restaurant by calling db.addNewRestaurant(updatedData) method
app.post("/api/restaurants", async function (req, res) {
  var data = req.body;

  let updatedData = {
    address: {
      building: data.Building,
      coord: [parseInt(data.Coord1), parseInt(data.Coord2)],
      street: data.Street,
      zipcode: data.Zipcode,
    },
    borough: data.Borough,
    cuisine: data.Cuisine,
    grades: [
      {
        date: data.Date,
        grade: data.Grade,
        score: data.Score,
      },
    ],
    name: data.Name,
    restaurant_id: data.Restaurant_id,
  };

  let result = await db.addNewRestaurant(updatedData);
  console.log(result);

  result ? res.send(result) : res.status(404).send("Error inserting data!!");
});

//STEP 2: Call db.getAllRestaurants(page, perPage, borough) to use route for paginaton through URL
app.get(
  "/api/restaurants",
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number().required(),
      perPage: Joi.number().required(),
      borough: Joi.string().required(),
    },
  }),
  async (req, res) => {
    var page = req.query.page;
    var perPage = req.query.perPage;
    var borough = req.query.borough;

    let temp = await db.getAllRestaurants(page, perPage, borough);

    temp ? res.send(temp) : res.status(404).send("Error fetching data!");
  }
);

//STEP 2: Call getRestaurantById(id) to get restaurants by id
app.get("/api/restaurants/:_id", async (req, res) => {
  let id = req.params._id;
  let result = await getRestaurantById(id);

  result ? res.send(result) : res.status(404).send("Error getting data!!");
});

//STEP 2: Call updateRestaurantById(data, id) to update restaurants data by id
app.put("/api/restaurants", async (req, res) => {
  let id = req.body._id;
  var data = {
    borough: req.body.Borough,
    cuisine: req.body.Cuisine,
    name: req.body.Name,
  };

  let result = await updateRestaurantById(data, id);

  result ? res.send(result) : res.status(404).send("Error updating data!!");
});

//STEP 2: Call deleteRestaurantById(id) to delete a restaurant by id
app.delete("/api/restaurants", async (req, res) => {
  let id = req.body._id;
  let result = await deleteRestaurantById(id);

  result ? res.send(result) : res.status(404).send("Error deleting data!!");
});

//STEP 3: Access the pagination route through form using .hbs file
app.get("/step3", (req, res) => {
  res.render("./pages/step3", { title: "Pagination", layout: false });
});

//STEP 3: Fetching the values from step 3 form to demo pagination
app.post("/api/restaurantsForm", async (req, res) => {
  var page = req.body.page;
  var perPage = req.body.perPage;
  var borough = req.body.Borough;

  let temp = await db.getAllRestaurants(page, perPage, borough);
  temp
    ? res.send(temp)
    : res.status(404).send("Error fetching data by pagination!!");
});

app.get("/addForm", (req, res) => {
  res.render("./pages/addform", { title: "Add Form", layout: false });
});

//Demo JWT token accessing to ensure security of our app
let databse = [
  {
    name: "sachin",
    work: "Java Developer",
    password: "sachin1234",
  },
  {
    name: "harshit",
    work: "Web Developer",
    password: "harshit1234",
  },
];

// A demo get route
app.get("/", (req, res) => {
  res.json({
    route: "/",
    authentication: false,
  });
});

// Login route
app.post("/login", (req, res) => {
  // Get the name to the json body data
  const name = req.body.name;

  // Get the password to the json body data
  const password = req.body.password;

  // Make two variable for further use
  let isPresent = false;
  let isPresnetIndex = null;

  // iterate a loop to the data items and check what data are matched.
  for (let i = 0; i < databse.length; i++) {
    // If data name are matched so check the password are correct or not
    if (databse[i].name === name && databse[i].password === password) {
      // If both are correct so make isPresent variable true
      isPresent = true;

      // And store the data index
      isPresnetIndex = i;

      // Break the loop after matching successfully
      break;
    }
  }

  // If isPresent is true, then create a token and pass to the response
  if (isPresent) {
    // The jwt.sign method is used to create token
    const token = jwt.sign(databse[isPresnetIndex], "secret");

    // Pass the data or token in response
    res.json({
      login: true,
      token: token,
      data: databse[isPresnetIndex],
    });
  } else {
    // If isPresent is false return the error
    res.json({
      login: false,
      error: "please check name and password.",
    });
  }
});

// Verify route
app.get("/auth", (req, res) => {
  // Get token value to the json body
  const token = req.body.token;

  // If the token is present
  if (token) {
    // Verify the token using jwt.verify method
    const decode = jwt.verify(token, "secret");

    //Return response with decode data
    res.json({
      login: true,
      data: decode,
    });
  } else {
    // Return response with error
    res.json({
      login: false,
      data: "error",
    });
  }
});

app.listen(port, () => {
  console.log("App is running on port " + port);
});
