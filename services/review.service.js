const Joi = require("@hapi/joi");
const db = require("../_helpers/db");

const User = db.User;
const Review = db.Review;
const Post = db.Post;

module.exports = {
  add,
  remove,
  get
};

async function add(req, res) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.string()
        .alphanum()
        .min(24)
        .max(24)
        .required(),
      postId: Joi.string()
        .required()
        .min(24)
        .max(24)
        .required(),
      review: Joi.string()
        .required()
        .min(1)
        .max(100)
        .required()
    });
    const reviewParam = req.body;
    const { error, value } = schema.validate(reviewParam);
    if (error) {
      throw error;
    }
    const { userId, postId, review } = reviewParam;
    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    if (user && post) {
      return await Review.updateOne(
        { _id: postId },
        {
          $addToSet: {
            reviews: {
              userId: userId,
              date: new Date(),
              text: review
            }
          }
        }
      )
        .then(async res => {
          if (res.n == 1 && res.nModified == 1) {
            await Post.updateOne({ _id: postId }, { $inc: { reviews: 1 } });
          } else if (res.n == 0) {
            const rev = new Review();
            rev._id = postId;
            rev.reviews = [{ userId: userId, date: new Date(), text: review }];
            rev.save();
            await Post.updateOne({ _id: postId }, { $inc: { reviews: 1 } });
          }
          console.log('review added')
          return { success: true, message: "Review submitted" };
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    }
    else {
      return { success: false, message: "Review not submitted" };
    }
  } catch (err) {
    throw err;
  }
}

async function remove(req) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.string()
        .alphanum()
        .min(24)
        .max(24)
        .required(),
      postId: Joi.string()
        .required()
        .min(24)
        .max(24)
        .required(),
      reviewId: Joi.string()
        .required()
        .min(24)
        .max(24)
        .required()
    });
    const reviewParam = req.body;
    const { error, value } = schema.validate(reviewParam);
    if (error) {
      throw error;
    }
    const { userId, postId, reviewId } = reviewParam;

    return await Review.findOne(
      { _id: postId },
      { reviews: { $elemMatch: { _id: reviewId, userId: userId } } }
    )
      .then(async rev => {
        if (!rev) {
          return { success: false, message: "Review not found." };
        }
       else if (rev.reviews.length>0) {
          rev.reviews[0].deleted = true;
          rev.save();
          await Post.updateOne({ _id: postId }, { $inc: { reviews: -1 } });
          return { success: true, message: "Review deleted" };
        }
        else   return { success: false, message: "Review not found." };
      })
      .catch(err => {
        console.log(err);
        return { success: true, message: "Error in deleting review" };
      });
  } catch (err) {
    throw err;
  }
}

async function get(params) {
  const schema = Joi.object().keys({
    userId: Joi.string()
      .alphanum()
      .min(24)
      .max(24)
      .required(),
    postId: Joi.string()
      .alphanum()
      .min(24)
      .max(24)
      .required()
  });

  const { error, value } = schema.validate(params);
  if (error) {
    throw error;
  }
  try {
    const post = await Post.findById(params.postId);

    if (post.userId == params.userId) {     
      const revs = await Review.findOne({ _id: params.postId }).populate("reviews.userId", "profile");
   const reviews=revs&&revs.reviews.filter(review=>{
      if(review.deleted==false)
      return review;
     
   })
      return { success: true, reviews: reviews };
    } else {
      const revs = await Review.findOne(
        { _id: params.postId }).populate("reviews.userId", "profile");
        const reviews=revs&&revs.reviews.filter(review=>{
          if(review.deleted==false)
          return review;
        })
      return { success: true, reviews:reviews };
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}
