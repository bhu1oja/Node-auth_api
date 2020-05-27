const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//init app
const app = express();

//connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/MY_DATABASE", { useNewUrlParser: true, useCreateIndex: true })
  //if mongo connected, console the status
  .then(() => console.log( "MongoDB connected"))
  // if mongo fails to connect , console the error
  .catch(err => console.log(err));

  //BodyParser, parse the data in the body when user are sending the data in api call
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// parse application/json
app.use(bodyParser.json());

//set routes
//here we call route file
//the url of the login and signup will be
//http://192.168.0.106:3000/api/login
//http://192.168.0.106:3000/api/signup
app.use("/api", require("./userRoute"));


//start server
const PORT = process.env.PORT || 3000;
const IP = "192.168.0.106"; // this ip should be you pc's ip
app.listen(PORT,IP, (err, success) => {
  //if error in starting server , console the error
  if (err) {
    console.log({
      status: 0,
      msg: `Server startig error onPORT : ${PORT}`
    });
  } else {
    // Console the server started status
    console.log({ status: 1, msg: `Server started on ${PORT} ` });
  }
});