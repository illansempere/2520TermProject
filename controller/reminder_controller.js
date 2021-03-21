let database = require("../database");
const { ensureAuthenticated } = require("../middleware/checkAuth");
const express = require("express");
const passport = require("../middleware/passport");

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: database.cindy.reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database.cindy.reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: database.cindy.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    database.cindy.reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    let reminderToFind = req.params.id;
    let updatedreminder = {
      id: reminderToFind,
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
    };
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    console.log(searchResult)
    let del = database.cindy.reminders.indexOf(searchResult)
    database.cindy.reminders.splice(del);
    database.cindy.reminders.push(updatedreminder);
    res.render("reminder", { reminderItem: searchResult, reminders: database.cindy.reminders });
  },

  delete: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    let del = database.cindy.reminders.indexOf(searchResult)
    database.cindy.reminders.splice(del);
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
