var express = require("express"); 
var router = express.Router();
var bcrypt = require("bcryptjs");
//bcryptjs is used for password hash

// Get Users model which we have created above
var User = require("./UserModel");


//this is the api for signup
//we can access this by  http://......../signup
router.post("/signup", function(req, res) {
  //we will get these data from requst body i.e. we have to provide this data will calling this api
  let {name,email,password,address} = req.body;
//verify if we go all of these data or not
  if (name === "" || email === "" || password === "" || address === "") {
    //if any of the data is missing we will send this response to user
    res.json({ status: 0, data: "error", msg: " Enter all fields" });
  } else {
    //if all the data is provided, it checks that email provides is alredy used or not in our system
    User.findOne({ email: email }, function(err, user) {
      if (err) console.log(err);

      if (user) {
        //if used, return thi message
        res.json({ status: 0, data: user.email, msg: " User already exists" });
      } else {
        //if not used, create a new obnect od our user schema and store it in it
        var user = new User({
          name: name,
          email: email,
          password: password,
         address : address,
        });
        //then hash the provides password with  bcryptjs package
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(user.password, salt, function(err, hash) {
            // if hash error occcur send response to the user about the error
            if (err) {
              res.json({
                status: 0,
                data: err,
                msg: " error while hashing password"
              });
            }

            user.password = hash;
//if everything is ok and password is hashe, then user bojcet that we created aboue will be saved in our database
            user.save(function(err) {
              //you can use promise here
              //user.save().then().catch() you can use promise like this also
              if (err) {
                //if error send that to user
                res.json({ status: 0, data: err, msg: " error" });
              } else {
                //Send response to the user that registration process is complete
                res.json({
                  status: 1,
                  data: user,
                  msg: `Thank You for registering.`
                });
              }
            });
          });
        });
      }
    });
  }
});

//this is the api for login
//we can access this by  http://......../login
router.post("/login", function(req, res) {
  let { email, password } = req.body;
  //checks that both email and password is provided at api call
  if (email === "" || password === "") {
    res.json({ status: 0, data: "error", msg: " Enter all fields!!!" });
  } else {
    //check the provided email with  our database
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        res.json({ status: 0, message: err });
      }
      // if the email is not found , respond user that this email is not found
      if (!user) {
        res.json({
          status: 0,
          msg:
            " user with this email didnot found"
        });
      } else {
        //if email found hash the password for the comparision as our system have hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            res.json({ status: 0, data: err, msg: " error" });
          } else {
            //if passowrd didnt match respond to the user
            if (!isMatch) {
              res.json({
                status: 0,
                data: isMatch,
                msg: " Password didnt match"
              });
            } else {
              // if email and password match , respond that to user
              res.json({
                status: 1,
                data: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  type: user.type
                },
                msg: "Welcome " + email
              });
            }
          }
        });
      }
    });
  }
});



// Exports
module.exports = router;
