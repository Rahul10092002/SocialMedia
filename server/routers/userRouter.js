const requireUser = require("../middlewares/requireuser");
const UserController = require("../controllers/userController");
const router = require("express").Router();

router.post(
  "/follow",
  requireUser,
  UserController.followOrUnfollowUserController
);
router.get("/getFeedData", requireUser, UserController.getPostsOfFollowing);
router.get("/getMyPost", requireUser, UserController.getMyPost);
router.get("/getUserPost", requireUser, UserController.getUserPost);
router.delete("/", requireUser, UserController.deleteMyProfile);
router.get("/getmyinfo", requireUser, UserController.getMyInfo);
router.put("/", requireUser, UserController.updateUserProfile);
router.post("/getUserProfile", requireUser, UserController.getUserProfile);
module.exports = router;
