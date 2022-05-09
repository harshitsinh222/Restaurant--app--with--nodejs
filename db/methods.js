var mongoose = require("mongoose");
var database = require("../config/database");
var Rest = require("../models/restaurants");

module.exports = {
  initialize: function () {
    mongoose.connect(database.url);
  },
  addNewRestaurant: function (temp) {
    return Rest.create(temp);
  },
  getAllRestaurants: function (page, perPage, borough) {
    let filterQuery = {};
    if (borough) {
      filterQuery.borough = borough;
    }
    //console.log(perPage, page, borough);
    let result = Rest.find(filterQuery)
      // .sort({ restaurant_id: 1 }).collation({ locale: "en_US", numericOrdering: true })
      .limit(perPage)
      .skip(perPage * page);
    return result;
  },
  getRestaurantById: function (id) {
    return Rest.findById(id);
  },
  updateRestaurantById: function (data, id) {
    return Rest.findByIdAndUpdate(id, data);
  },
  deleteRestaurantById: function (id) {
    return Rest.deleteOne({
      _id: id,
    });
  },
};
