// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const app = express();



// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

/*const MONGO_URI =
  process.env.MONGODB_URI || "mongodb+srv://kharisma:1234@cluster0.3gwspoq.mongodb.net/test";*/
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project2"; 
  console.log(MONGO_URI)
mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${databaseName}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

  const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/project2', // Replace with your MongoDB connection string
    collection: 'sessions',
  });
  
  app.use(session({
    secret: 'Vanka40Ljuba2ipoAndrija1zubmanje',
    resave: false,
    saveUninitialized: true,
    store: store,
  }));