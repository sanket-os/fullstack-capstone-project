const { 
    registerUser, 
    loginUser,
    logoutUser,
    currentUser,
    forgetPassword,
    resetPassword,
} = require("../controllers/userController");
const { validateJWTToken } = require("../middlewares/authorizationMiddleware");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getCurrentUser", validateJWTToken, currentUser);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);

router.post("/logout", logoutUser);

module.exports = router;