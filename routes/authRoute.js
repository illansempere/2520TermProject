const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const router = express.Router();


//LOCAL
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});


//GITHUB
router.get("/github", forwardAuthenticated, (req, res) => res.redirect("https://github.com/login/oauth/authorize?client_id=0c6e2b00c3a6cdd8a777"));

router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/reminders');
  });

//TWITCH
router.get("/twitch", forwardAuthenticated,
 (req, res) => res.redirect("https://id.twitch.tv/oauth2/authorize?client_id=0brq9iwqnrtyhdvs4ccfyim7dvvvnj&redirect_uri=http://localhost:3001/auth/twitch/callback&response_type=token&scope=user_read"));

router.get("/twitch",
 passport.authenticate("twitch"));

router.get("/twitch/callback",
 passport.authenticate("twitch", { failureRedirect: "/auth/login" }),
 function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/reminders");
});

//GOOGLE
router.get('/google', forwardAuthenticated,
 (req,res) => res.redirect("https://accounts.google.com/o/oauth2/v2/auth?client_id=802760890108-6p1lgb49ul5pkpibi8eavjsatchj4bb8.apps.googleusercontent.com&redirect_uri=http://localhost:3001/auth/google/callback&response_type=code&scope=profile"))

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/reminders');
  });

module.exports = router;