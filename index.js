const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const authRoute = require("./routes/authRoute");
const passport = require("./middleware/passport");
const { ensureAuthenticated, forwardAuthenticated } = require("./middleware/checkAuth");


app.use(express.urlencoded({ extended: false }));



app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


app.set("view engine", "ejs");

// Middleware for express
app.use(express.json());
app.use(ejsLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
// Routes start here

app.get("/", forwardAuthenticated, function(req,res) {
  res.sendFile('index.html');
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/reminders", ensureAuthenticated, reminderController.list);

app.get("/reminder/friends", ensureAuthenticated, reminderController.friends);

app.get("/reminder/addfriends", ensureAuthenticated, reminderController.addfriends);

app.get("/reminder/addfriendsid", ensureAuthenticated, reminderController.addfriendspost);

app.get("/reminder/new", ensureAuthenticated, reminderController.new);

app.get("/reminder/:id", ensureAuthenticated, reminderController.listOne);

app.get("/reminder/:id/edit", ensureAuthenticated, reminderController.edit);

app.post("/reminder/", ensureAuthenticated, reminderController.create);



app.get('/login', (req, res) => {
  res.redirect('/auth/login')
})

// Implement this yourself
app.post("/reminder/update/:id", reminderController.update);

// Implement this yourself
app.post("/reminder/delete/:id", reminderController.delete);

// Fix this to work with passport! The registration does not need to work, you can use the fake database for this.
app.use("/auth", authRoute);
/*app.get("/register", authController.register);
app.get("/login", authController.login);
app.post("/register", authController.registerSubmit);
app.post("/login", authController.loginSubmit);*/

app.listen(3001, function () {
  console.log(
    "Server running. Visit: localhost:3001/reminders in your browser 🚀"
  );
});
