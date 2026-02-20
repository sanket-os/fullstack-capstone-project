const { 
    registerUser, 
    loginUser,
    logoutUser,
    currentUser,
    forgetPassword,
    resetPassword,
} = require("../controllers/UserController");
const { validateJWTToken } = require("../middlewares/authorizationMiddleware");

const validateRequest = require("../middlewares/validateRequest");
const {
  registerSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} = require("../validators/user.schema")

const router = require("express").Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", 
  validateRequest(loginSchema),
 loginUser);
router.get("/getCurrentUser", validateJWTToken, currentUser);
router.post("/forgetPassword", validateRequest(forgetPasswordSchema), forgetPassword);
router.post("/resetPassword", validateRequest(resetPasswordSchema), resetPassword);

router.post("/logout", logoutUser);

module.exports = router;