import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { logout, login, signup, checkAuth } from "../controller/auth.controller.js";
import passport from "../lib/passport.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", protectRoute, checkAuth);

router.get("/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login", "email"],
})
);

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    req.session.save(() => {
      res.redirect("http://localhost:3000/");  // Edit for correct redirect link
    });
  }
);

export default router;