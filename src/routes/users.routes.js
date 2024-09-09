const { Router, json } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const upload = multer(uploadConfig.MULTER);

const userRoutes = Router();

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

userRoutes.post("/", usersController.create);
userRoutes.put("/", ensureAuthenticated ,usersController.update);
userRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);
userRoutes.delete("/", ensureAuthenticated ,usersController.delete);

module.exports = userRoutes;