const router = require("express").Router();
const Review = require("../models/Review.model");
const User = require("../models/User.model");
const Restaurant = require("../models/Restaurant.model");
const { isLoggedIn, isLoggedOut, isOwner } = require("../middleware/checker");


// post a review on the restaurant page
router.post('/create/:restaurantId', async (req, res) => {
  const { comment } = req.body;
  const { restaurantId } = req.params;
  const restaurant = await Restaurant.findOne({_id: restaurantId}); // find restaurant in DB
  Review.create({ user: req.session.currentUser._id, comment})
  .then(async (newReview) => {
      await restaurant.reviews.push(newReview._id) // add review id to restaurant 'reviews' property
      await restaurant.save(); // save restaurant with new review id to the DB
  })
  .then(() => res.redirect(`/restaurant/${restaurantId}`))
  .catch(err => console.error(err))
})

 

// router.post("/:reviewId", isOwner, (req, res) => {
//   const { reviewId } = req.params;
//   const reviewUpdate = req.body; 
//     Review.findByIdAndUpdate(reviewId, reviewUpdate, {new: true})
//       .then(() => {
//         res.redirect('/restaurant/:restaurantId');
//       })
//       .catch(err => console.error(err))
// });

// router.get('/review-edit/:id', isLoggedIn, (req,res) => {
//     Review.findById(req.params.id)
//     .populate('user')
//     .then( review => {console.log(review)
//         if(req.session.user._id===review.user._id.toString()){
//         res.render('comments/review-edit', review)
//         }else{
//             res.render('review-edit', {
//                 errorMessage: 'You are not the owner of this review.'
//               })
//         }
//     })
//     .catch(Err => console.log('error', Err))
// });

// router.post('/review-edit/:id', isLoggedIn, (req,res) => {
//     const {comment} =req.body;
//     Review.findByIdAndUpdate(req.params.id,{comment})
//     .then(()=>res.redirect('/rooms/rooms'))
//     .catch(Err => console.log('error', Err))
// });

//   router.post('/review/:id/delete', isLoggedIn,(req, res, next) => {

//     Review.findById(req.params.id)
//     .then( review => {
//         if(req.session.user._id===review.user._id.toString()){
//         Review.findByIdAndDelete(req.params.id)
//         .then(()=>res.redirect('/rooms/rooms'))
//         }else{
//             res.render('/rooms/rooms', {
//                 errorMessage: 'You are not the owner of this review.'
//               })
//         }
//     })
//     .catch( (err) => next(err));
//   })

module.exports = router;