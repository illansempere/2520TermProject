let database = require("../database");
const express = require("express");
const passport = require("../middleware/passport");

let remindersController = {
  list: (req, res) => {
    let currentuser = req.user.id
    let exists = false
    for (i in database){
      if (i == currentuser){
        exists = true
      }
    }
    if (exists == false) {
      database[currentuser] = {reminders:[]}
    }
    
    res.render("reminder/index", { reminders: database[currentuser].reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let currentuser = req.user.id
    let exists = false
    for (i in database){
      if (i == currentuser){
        exists = true
      }
    }
    if (exists == false) {
      database[currentuser] = {reminders:[]}
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
    for (i in database){
      if (i == currentuser){
        exists = true
      }
    }
    if (exists == false) {
      database[currentuser] = {reminders:[]}
    }

    let reminder = {
      id: database[currentuser].reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    database[currentuser].reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let currentuser = req.user.id
    let exists = false
    for (i in database){
      if (i == currentuser){
        exists = true
      }
    }
    if (exists == false) {
      database[currentuser] = {reminders:[]}
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
    for (i in database){
      if (i == currentuser){
        exists = true
      }
    }
    if (exists == false) {
      database[currentuser] = {reminders:[]}
    }

    let reminderToFind = req.params.id;
    let updatedreminder = {
      id: reminderToFind,
      title: req.body.title,
      description: req.body.description,
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
    for (i in database){
      if (i == currentuser){
        exists = true
      }
    }
    if (exists == false) {
      database[currentuser] = {reminders:[]}
    }

    let reminderToFind = req.params.id;
    let searchResult = database[currentuser].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    let del = database[currentuser].reminders.indexOf(searchResult)
    database[currentuser].reminders.splice(del);
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
