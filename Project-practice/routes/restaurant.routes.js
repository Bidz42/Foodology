const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require('../middleware/checker');
const Restaurant = require('../models/Restaurant.model');

//get all restaurants
router.get("/list", (req, res) => {
  Restaurant.find()
    .populate("user")
    .then(restaurants => {
      const loggedInNavigation = req.session.hasOwnProperty('currentUser');
      res.render('restaurant/restaurants', { restaurants, loggedInNavigation })
      })
    .catch(err => console.error(err))
});

//create a restaurant
router.get("/create", isLoggedIn, (req, res) => {
  const loggedInNavigation = true;
  res.render('restaurant/new-restaurant', {loggedInNavigation})
});

router.post("/create", isLoggedIn, (req, res) => {
  const { name, cuisine, stars } = req.body;
  const { _id } = req.session.currentUser;
  Restaurant.create({ user:_id , name, cuisine, reviews })
    .then(newRestaurant =>{
          res.redirect('/restaurant/restaurants')
    })
    .catch(err => console.error(err))
});

//get single restaurant
router.get("/:restaurantId", (req, res) => {
  const  _id = req.session?.currentUser?._id; 
  const { restaurantId } = req.params;
  Restaurant.findOne({id: restaurantId})
    .populate("user reviews") 
    .populate({ 
      path: 'reviews',
      populate: {
        path: "user", 
        model: "User",
      } 
    })
    .then(restaurant => {
        const loggedInNavigation = req.session.hasOwnProperty('currentUser'); 
        const isNotOwner = _id !== restaurant.user._id.toString() && req.session.hasOwnProperty('currentUser');
        res.render('restaurant/restaurant-details', { restaurant, isNotOwner, loggedInNavigation })
    })
    .catch(err => console.error(err))
});

//edit a restaurant
router.get("/edit/:restaurantId", isLoggedIn, (req, res) => {
  const loggedInNavigation = true;
  res.render('restaurant/edit-restaurant', {loggedInNavigation})
});

router.post("/edit/:roomId", isOwner, (req, res) => {
  const { restaurantId } = req.params;
  const restaurantUpdate = req.body;

  if(restaurantUpdate.imageUrl === ''){
    Restaurant.findById(restaurantId)
      .then(restaurants => {
            return Restaurant.updateOne({name: restaurantUpdate.name, cuisine: restaurantUpdateInfo.cuisine})
      })
      .then(() => res.redirect('/restaurant/restaurants'))
  }
  if (restaurantUpdate.name === ''){
    Restaurant.findById(restaurantId)
      .then(restaurants => {
        return Restaurant.updateOne({cuisine: restaurantUpdate.cuisine, imageUrl: restaurantUpdateInfo.imageUrl})
      })
      .then(() => res.redirect('/restaurant/restaurants'))
  }
  if (restaurantUpdate.cuisine === ''){
    Restaurant.findById(restaurantId)
      .then(restaurants => {
        return Restaurant.updateOne({name: restaurantUpdate.name, imageUrl: restaurantUpdateInfo.imageUrl})
      })
      .then(() => res.redirect('/restaurant/restaurants'))
  }
  else{
    Restaurant.findByIdAndUpdate(restaurantId, restaurantUpdate, {new: true})
      .then(() => {
        res.redirect('/restaurant/restaurants');
      })
      .catch(err => console.error(err))
  }
});

//delete a restaurant
router.post("/delete/:restaurantId", isOwner, (req, res) => {
  const { restaurantId } = req.params;
  Room.findByIdAndDelete(restaurantId)
    .then(() => res.redirect('/restaurant/restaurants'))
    .catch(err => console.error(err))
});

module.exports = router;