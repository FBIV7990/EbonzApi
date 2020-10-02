const Joi = require("@hapi/joi");
const db = require("../_helpers/db");

const User = db.User;
const Favorite = db.Favorite;
const Post = db.Post;

module.exports = {
  add,
  remove,
  get,
  addSubCategory,
  removeSubCategory,
};

async function add(req, res) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.string().alphanum().min(24).max(24).required(),
      postId: Joi.string().required().min(24).max(24).required(),
    });
    const favParam = req.body;
    const { error, value } = schema.validate(favParam);
    if (error) {
      throw error;
    }
    const { userId, postId } = favParam;
    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    if (user && post) {
      return await Favorite.updateOne(
        { _id: userId },
        { $addToSet: { posts: postId } }
      )
        .then(async (res) => {
          if (res.n == 1 && res.nModified == 1) {
            await Post.updateOne({ _id: postId }, { $inc: { likes: 1 } });
          }
          if (res.n == 0) {
            const Fav = new Favorite();
            Fav._id = userId;
            Fav.user = userId;
            Fav.posts = [postId];
            Fav.save();
            await Post.updateOne({ _id: postId }, { $inc: { likes: 1 } });
          }

          return { success: true, message: "Added to favorites" };
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    } else return { success: false, message: "User or post not found" };
  } catch (err) {
    throw err;
  }
}

async function addSubCategory(req, res) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.string().alphanum().min(24).max(24).required(),
      subcategoryId: Joi.string().required().min(24).max(24).required(),
    });
    const favParam = req.body;
    const { error, value } = schema.validate(favParam);
    if (error) {
      throw error;
    }
    const { userId, subcategoryId } = favParam;
    const user = await User.findById(userId);
    if (user) {
      return await Favorite.updateOne(
        { _id: userId },
        { $addToSet: { subcategories: subcategoryId } }
      )
        .then(async (res) => {
          console.log(res);
          if (res.n == 0) {
            const Fav = new Favorite();
            Fav._id = userId;
            Fav.user = userId;
            Fav.subcategories = [subcategoryId];
            Fav.save();
          }
          return { success: true, message: "Added to favorites" };
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    }
    return { success: false, message: "User not Found" };
  } catch (err) {
    throw err;
  }
}
async function removeSubCategory(req, res) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.string().alphanum().min(24).max(24).required(),
      subcategoryId: Joi.string().required().min(24).max(24).required(),
    });
    const favParam = req.body;
    const { error, value } = schema.validate(favParam);
    if (error) {
      throw error;
    }
    const { userId, subcategoryId } = favParam;
    return Favorite.updateOne(
      { _id: userId },
      { $pull: { subcategories: subcategoryId } }
    )
      .then(async (res) => {
        return { success: true, message: "Removed from favorites" };
      })
      .catch((err) => {
        return { message: err };
      });
  } catch (err) {
    throw err;
  }
}

async function remove(req) {
  try {
    const schema = Joi.object().keys({
      userId: Joi.string().alphanum().min(24).max(24).required(),
      postId: Joi.string().required().min(24).max(24).required(),
    });
    const favParam = req.body;
    const { error, value } = schema.validate(favParam);
    if (error) {
      throw error;
    }
    const { userId, postId } = favParam;
    return Favorite.updateOne({ _id: userId }, { $pull: { posts: postId } })
      .then(async (res) => {
        if (res.n == 1 && res.nModified == 1) {
          await Post.updateOne({ _id: postId }, { $inc: { likes: -1 } });
        }

        return { success: true, message: "Removed from favorites" };
      })
      .catch((err) => {
        return err;
      });
  } catch (err) {
    throw err;
  }
}

async function get(params) {
  const schema = Joi.object().keys({
    id: Joi.string().alphanum().min(24).max(24).required(),
    posts: Joi.bool(),
    subcategories: Joi.bool(),
  });
  const favParam = params;
  const { error, value } = schema.validate(favParam);
  if (error) {
    throw error;
  }

  try {
    if (params.id) {
      if (params.subcategories && params.posts) {
        const favorites = await Favorite.findById(params.id)
          .populate("posts")
          .populate("subcategories", "_id category_id name description");
        return {
          success: true,
          subcategories: favorites && favorites.subcategories,
          posts: favorites && favorites.posts,
        };
      } else if (params.subcategories) {
        const favorites = await Favorite.findById(params.id).populate(
          "subcategories",
          "_id category_id name description"
        );
        return {
          success: true,
          subcategories: favorites && favorites.subcategories,
        };
      } else if (params.posts) {
        const favorites = await Favorite.findById(params.id).populate("posts");
        return { success: true, posts: favorites && favorites.posts };
      } else {
        const favorites = await Favorite.findById(params.id);
        return { success: true, favorites };
      }
    } else return { success: true, message: "ID not specified" };
  } catch (err) {
    console.log(err);
    throw err;
  }
}
