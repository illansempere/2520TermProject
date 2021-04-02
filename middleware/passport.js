const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const TwitchStrategy = require("passport-twitch-new").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userController = require("../controller/auth_controller");
const userModel = require("../models/userModel").userModel;
const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

const GithubLogin = new GitHubStrategy({
  clientID: '0c6e2b00c3a6cdd8a777',
  clientSecret: '92ce6f0655b5941ec120742bc5b54051ce32e34b',
  callbackURL: "http://localhost:3001/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
  let user = userController.authController.getUserByGithubIdOrCreate(profile)
  return cb(null, user);
}
)

const TwitchLogin = new TwitchStrategy({
  clientID: '0brq9iwqnrtyhdvs4ccfyim7dvvvnj',
  clientSecret: 'qu321hwzgj8xa96jwf5k26gl72jznu',
  callbackURL: "http://localhost:3001/auth/twitch/callback",
  scope: "user_read"
},
function(token, tokenSecret, profile, cb) {
  let user = userController.authController.getUserByTwitchIdOrCreate(profile)
  return cb(null, user);
}
);

const GoogleLogin = new GoogleStrategy({
  clientID: '802760890108-6p1lgb49ul5pkpibi8eavjsatchj4bb8.apps.googleusercontent.com',
  clientSecret: '_C7CGc-hH6hBfwBZdQw75CL2',
  callbackURL: "http://localhost:3001/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  let user = userController.authController.getUserByGoogleIdOrCreate(profile)
  return cb(null, user);
}
)

module.exports = passport.use(GithubLogin),
                 passport.use(localLogin),
                 passport.use(TwitchLogin),
                 passport.use(GoogleLogin);