const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const db = require("./models");

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

const forgetPasswordRouter = require("./routes/ForgetPassword");
app.use("/forgetpassword", forgetPasswordRouter);

const forgetPasswordEmailRouter = require("./routes/ForgetPasswordEmail");
app.use("/forgetpasswordemail", forgetPasswordEmailRouter);

const profileRouter = require("./routes/Profile");
app.use("/profile", profileRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
