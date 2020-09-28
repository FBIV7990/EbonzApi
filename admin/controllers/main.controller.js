var router = require('express').Router();
const jwtadmin = require("../../_helpers/jwt-admin");
// split up route handling
router.use(jwtadmin());
router.use("/", require("./admin.controller"));
router.use("/users", require("./user.controller"));
router.use("/categories", require("./category.controller"));
router.use("/subcategories", require("./subcategory.controller"));
router.use("/properties", require("./property.controller"));
router.use("/posts", require("./post.controller"));
router.use("/favorites", require("./favorite.controller"));
router.use("/suggestions", require("./suggestion.controller"));
router.use("/reviews", require("./review.controller"));
router.use("/friends", require("./friend.controller"));
router.use("/conversations", require("./conversation.controller"));
router.use("/feedbacks",require('./feedback.controller'));
router.use("/contactus", require("./contactUs.controller"));
router.use("/career", require("./career.controller"));
router.use("/slider",require("./slider.controller"));
router.use("/faqs",require("./faqs.controller"));
router.use("/color",require("./color.controller"));
// etc.

module.exports = router;