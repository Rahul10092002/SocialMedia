const router = require("express").Router();
const postController = require("../controllers/postController");
const requireuser = require("../middlewares/requireuser");

router.post("/", requireuser, postController.createPostController);
router.put("/", requireuser, postController.updatePostController);
router.post("/like", requireuser, postController.likeAndUnlikePost);
router.delete("/", requireuser, postController.deletePost);

module.exports = router;
