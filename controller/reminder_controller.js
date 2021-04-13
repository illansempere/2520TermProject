let database = require("../database").Database;
let AddUser = require("../database").AddUser;
const express = require("express");
const passport = require("../middleware/passport");
let userdatabase = require("../models/userModel").database;
let userModel = require("../models/userModel").userModel;
const request = require('request');

let remindersController = {
  list: (req, res) => {
    let currentuser = req.user.id
    let exists = false
    for (i in database) {
      if (i == currentuser) {
        exists = true
      }
    }
    if (exists == false) {
      AddUser(currentuser)
    }
    let x = []
    x.push(request('http://api.openweathermap.org/data/2.5/weather?q=nanaimo&appid=ad9c706cc1a14ac190bd66cb6220a124', function (error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
      return body
    }))
    console.log(x[0])
    res.render("reminder/index", { reminders: database[currentuser].reminders, weather:x[0] });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let currentuser = req.user.id
    let exists = false
    for (i in database) {
      if (i == currentuser) {
        exists = true
      }
    }
    if (exists == false) {
      AddUser(currentuser)
    }

    let reminderToFind = req.params.id;
    let searchResult = database[currentuser].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database[currentuser].reminders });
    }
  },

  create: (req, res) => {
    let currentuser = req.user.id
    let exists = false
    for (i in database) {
      if (i == currentuser) {
        exists = true
      }
    }
    if (exists == false) {
      AddUser(currentuser)
    }

    let reminder = {
      id: database[currentuser].reminders.length + 1,
      title: req.body.title,
      date: req.body.date,
      description: req.body.description,
      subtasks: req.body.subtasks,
      tags: req.body.tags,
      completed: false,
    };
    database[currentuser].reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let currentuser = req.user.id
    let exists = false
    for (i in database) {
      if (i == currentuser) {
        exists = true
      }
    }
    if (exists == false) {
      AddUser(currentuser)
    }

    let reminderToFind = req.params.id;
    let searchResult = database[currentuser].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    let currentuser = req.user.id
    let exists = false
    for (i in database) {
      if (i == currentuser) {
        exists = true
      }
    }
    if (exists == false) {
      AddUser(currentuser)
    }

    let reminderToFind = req.params.id;
    let updatedreminder = {
      id: reminderToFind,
      title: req.body.title,
      date: req.body.date,
      description: req.body.description,
      subtasks: req.body.subtasks,
      tags: req.body.tags,
      completed: req.body.completed,
    };
    let searchResult = database[currentuser].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    console.log(searchResult)
    let del = database[currentuser].reminders.indexOf(searchResult)
    database[currentuser].reminders.splice(del);
    database[currentuser].reminders.push(updatedreminder);
    res.render("reminder", { reminderItem: searchResult, reminders: database[currentuser].reminders });
  },

  delete: (req, res) => {
    let currentuser = req.user.id
    let exists = false
    for (i in database) {
      if (i == currentuser) {
        exists = true
      }
    }
    if (exists == false) {
      AddUser(currentuser)
    }

    let reminderToFind = req.params.id;
    let searchResult = database[currentuser].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    let del = database[currentuser].reminders.indexOf(searchResult)
    console.log('!!!!!!!!!!!!', database)
    database[currentuser].reminders.splice(del, 1);
    console.log('!!!!!!!!!!!!', database)
    res.redirect("/reminders");
  },
  friends: (req, res) => {
    let currentuser = req.user.id
    let currentuserfriends = []
    for (user in userdatabase) {
      if (userdatabase[user].id == req.user.id) {
        currentuserfriends = userdatabase[user].friends
        break
      }
    }


    let friendsposts = {}
    console.log(currentuserfriends)
    for (id in currentuserfriends) {
      // console.log('ID:', id, 'Database:', database,'currentuserfriends:',currentuserfriends)
      friendsposts[currentuserfriends[id]] = database[currentuserfriends[id]].reminders
    }
    let exists = false

    for (i in database) {
      if (i == currentuser) {
        exists = true
      }
    }
    if (exists == false) {
      AddUser(currentuser)
    }

    res.render("reminder/friends", { reminders: database[currentuser].reminders, friendsposts, userdatabase });
  },
  addfriends: (req, res) => {
    let currentuser = req.user.id
    let currentuserfriends = []

    for (user in userdatabase) {
      if (userdatabase[user].id == req.user.id) {
        currentuserfriends = userdatabase[user].friends
        break
      }
    }
    let friendsposts = {}

    for (id in currentuserfriends) {
      // console.log('ID:', id, 'Database:', database,'currentuserfriends:',currentuserfriends)
      friendsposts[currentuserfriends[id]] = database[currentuserfriends[id]].reminders
    }
    let exists = false

    for (i in database) {
      if (i == currentuser) {
        exists = true
      }
    }
    if (exists == false) {
      AddUser(currentuser)
    }
    console.log(currentuserfriends)
    res.render("reminder/addfriends", { reminders: database[currentuser].reminders, currentuserfriends, userdatabase, user: req.user });
  },
  addfriendspost: (req, res) => {
    let nfid = req.query.nfid

    userModel.addfriendbyid(req.user.id, nfid)

    res.redirect('/reminder/friends')
  }
};

module.exports = remindersController;
