var router = require("express").Router();
const jwt = require("../_helpers/jwt");
// split up route handling
router.use(jwt());
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
router.use("/notifications", require("./notification.controller"));
router.use("/feedbacks", require("./feedback.controller"));
router.use("/contactus", require("./contactUs.controller"));
router.use("/career", require("./career.controller"));
router.use("/locations", require("./location.controller"));
router.use("/slider", require("./slider.controller"));
router.use("/color", require("./color.controller"));
router.use("/enquiry", require("./email.controller"));
// etc.

module.exports = router;
