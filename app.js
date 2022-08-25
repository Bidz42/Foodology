// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const projectName = "The Hunger Game of Thrones";

app.locals.appTitle = `${(projectName)}`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

const restaurantsRouter = require("./routes/restaurant.routes");
app.use("/restaurant", restaurantsRouter);

const reviewsRouter = require("./routes/review.routes");
app.use("/review", reviewsRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

module.exports = app;
