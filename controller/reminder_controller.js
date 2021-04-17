let database = require("../database").Database;
let AddUser = require("../database").AddUser;
const express = require("express");
const passport = require("../middleware/passport");
let userdatabase = require("../models/userModel").database;
let userModel = require("../models/userModel").userModel;
const request = require('request-promise');
// const {Client} = require("@googlemaps/google-maps-services-js");

async function getWeather(city='nanaimo'){
  var x;
  await request('http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=ad9c706cc1a14ac190bd66cb6220a124&units=metric', function (error, response, body) {
      x = JSON.parse(body)
    })
    return x
}

// client
//   .elevation({
//     params: {
//       locations: [{ lat: 45, lng: -110 }],
//       key: "asdf",
//     },
//     timeout: 1000, // milliseconds
//   })
//   .then((r) => {
//     console.log(r.data.results[0].elevation);
//   })
//   .catch((e) => {
//     console.log(e.response.data.error_message);
//   });

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
    
    res.render("reminder/index", { reminders: database[currentuser].reminders });
    
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
      let x = getWeather(searchResult.location.city).then(function(result) {
        console.log(result)
        res.render("reminder/single-reminder", { reminderItem: searchResult, weather:result });
      })
    } else {
      res.render("reminder/index", { reminders: database[currentuser].reminders });
    }
  },

  create: (req, res) => {
    let newtags = req.body.tags.replace(/-/g, " | ")
    let newsub = req.body.subtasks.replace(/-/g, " <br> ")
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
    let tempdb = {
      address: req.body.address,
      city: req.body.city,
      stateprovince: req.body.stateprovince,
      country: req.body.country
    }

    let reminder = {
      id: database[currentuser].reminders.length + 1,
      title: req.body.title,
      date: req.body.date,
      description: req.body.description,
      subtasks: newsub,
      tags: newtags,
      locationbool: req.body.locationTF,
      location: tempdb,
      completed: false,
    };
    console.log(reminder)
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
    let newtags = req.body.tags.replace("-", " | ")
    let newsub = req.body.subtasks.replace(/-/g, " <br> ")
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
    let tempdb = {
      address: req.body.address,
      city: req.body.city,
      stateprovince: req.body.stateprovince,
      country: req.body.country
    }
    let reminderToFind = req.params.id;
    let updatedreminder = {
      id: reminderToFind,
      title: req.body.title,
      date: req.body.date,
      description: req.body.description,
      subtasks: newsub,
      tags: newtags,
      locationbool: req.body.locationTF,
      location: tempdb,
      completed: req.body.completed,
    };
    let searchResult = database[currentuser].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    let del = database[currentuser].reminders.indexOf(searchResult)
    database[currentuser].reminders.splice(del,1);
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
    database[currentuser].reminders.splice(del, 1);
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
