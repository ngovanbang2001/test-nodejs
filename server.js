const express = require("express");
const router = require("./routers/account");
const cors = require("cors");
var jwt = require("jsonwebtoken");
var AccountModel = require("./models/account");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
var app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/api/account", router);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 150000,
    },
    store: new MongoStore({
      mongoUrl: "mongodb://localhost/users",
      mongooseConnection: mongoose.collection,
    }),
  })
);
app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  AccountModel.findOne({ username: username })
    .then((data) => {
      if (data) res.json("user nay da ton tai");
      return AccountModel.create({
        username: username,
        password: password,
        role: role,
      });
    })
    .then(() => res.json("Thanh cong"))
    .catch((err) => {
      res.json(err);
    });
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  AccountModel.findOne({ username: username, password: password })
    .then((data) => {
      if (data) {
        var token = jwt.sign(
          {
            _id: data._id,
          },
          "mk"
        );
        return res.json({
          message: "thanh cong",
          token: token,
        });
      }

      res.status.json("dang nhap that bai");
    })
    .catch((err) => res.status(500).json(err));
});
app.get("/", function (req, res, next) {
  if (req.session.views) {
    req.session.views++;
    res.setHeader("Content-Type", "text/html");
    res.write("<p>views: " + req.session.views + "</p>");
    res.write("<p>expires in: " + req.session.cookie.maxAge / 1000 + "s</p>");
    res.end();
  } else {
    req.session.views = 1;
    res.end("welcome to the session demo. refresh!");
  }
});
app.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.json("dang xuat thanh cong");
});
const checkLogin = (req, res, next) => {
  try {
    let token = req.cookies.token;
    let idUser = jwt.verify(token, "mk");
    AccountModel.findOne({ _id: idUser })
      .then((data) => {
        if (data) {
          req.data = data;
          next();
        } else {
          res.json("NOT PERMISSON1");
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (err) {
    res.json("ban phai dang nhap");
  }
};
const checkStudent = (req, res, next) => {
  const role = req.data.role;
  if (role >= 0) {
    next();
  } else {
    res.json("NOT PERMISSON");
  }
};
const checkTeacher = (req, res, next) => {
  const role = req.data.role;
  if (role >= 1) {
    next();
  } else {
    res.json("NOT PERMISSON");
  }
};
const checkManager = (req, res, next) => {
  const role = req.data.role;

  if (role >= 2) {
    next();
  } else {
    res.json("NOT PERMISSON");
  }
};
app.get("/task", checkLogin, checkStudent, (req, res, next) => {
  res.json("ALL TASK");
});
app.get("/student", checkLogin, checkTeacher, (req, res, next) => {
  res.json("welcom student");
});
app.get("/teacher", checkLogin, checkManager, (req, res, next) => {
  res.json("welcom teacher");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
