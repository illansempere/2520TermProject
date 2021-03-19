let database = require("../database");
let userModel = require("../models/userModel").userModel;

let authController = {
  login: (req, res) => {
    res.render("/auth/login");
  },

  register: (req, res) => {
    res.render("/register");
  },

  loginSubmit: (req, res) => {
    // implement
  },

  registerSubmit: (req, res) => {
    // implement
  },
  getUserByGoogleIdOrCreate: (profile) => {
    let user = userModel.OUTSIDEfindById(profile['id']);
    if (user) {
      return user;
    }
  
    let createdUser = userModel.createUserWithOutsideId(profile['id'],profile['displayName'],'Google');
    user = userModel.OUTSIDEfindById(profile['id']);
    if (user) {
      return user;
    }
  },
  getUserByGithubIdOrCreate: (profile) => {
    let user = userModel.OUTSIDEfindById(profile['id']);
    if (user) {
      return user;
    }
  
    let createdUser = userModel.createUserWithOutsideId(profile['id'],profile['displayName'],'Github');
    user = userModel.OUTSIDEfindById(profile['id']);
    if (user) {
      return user;
    }
  },
  getUserByTwitchIdOrCreate: (profile) => {
    let user = userModel.OUTSIDEfindById(profile['id']);
    if (user) {
      return user;
    }
  
    let createdUser = userModel.createUserWithOutsideId(profile['id'],profile['display_name'],'Twitch');
    user = userModel.OUTSIDEfindById(profile['id']);
    if (user) {
      return user;
    }
  },

};



module.exports = authController;
