const express = require('express');
const router = express.Router();
const sql = require('mysql');

const creds = require('../config/user');


//create the sql connection pool
var pool  = sql.createPool(creds);
router.use(express.json());
router.use(express.urlencoded({ extended: false}));

router.get('/', (req, res) => {
    res.json({message: 'hit the main ums route'});
})

// try out login route - set it up and send back a message
router.post('/login', (req,res) => {
  console.log('hit the login route');
  //we are accepting this above info from loginComponent
  console.log(req.body);

  pool.getConnection(function(err, connection) {   //trying to connect to the database
    if (err) throw err; // not connected!
   
    // Use the connection
    //use the connection to validate that this user exists in the database
    connection.query(`SELECT username, password FROM users WHERE username="${req.body.username}"`, function (error, results) {   //the result will be either an error or the actual result
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;
      console.log("the user data:", results, results.length);

      if(results.length==0){
        res.json({message: 'no user'});
      }else if  (results[0].password !==req.body.password){

        res.json({message: 'wrong password'});

      }else{
        res.json({message: "success", user: results[0]});
      }
   
      // Don't use the connection here, it has been returned to the pool.
    });
  });


 // res.json({message: 'hit the login route'});
})

router.get('/users', (req,res) => {
    // try to query the database annd get all of the users

    pool.getConnection(function(err, connection) {   //trying to connect to the database
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query('SELECT * FROM users', function (error, results) {   //the result will be either an error or the actual result
          // When done with the connection, release it.
          connection.release();
       
          // Handle error after the release.
          if (error) throw error;

          results.forEach(user => {
            delete user.fname;
            delete user.lname;
            delete user.password;

            if (user.avatar == "default"){
              user.avatar = 'temp_avatar.jpg';
            }
          })
       
          // Don't use the connection here, it has been returned to the pool.
          res.json(results);
        });
      });

    //end pool query
})

router.get('/users/:user', (req,res) => {

 //get one users with this one   
    // try to query the database annd get all of the users
    //this is the user ID:
     console.log(req.params.user);

    pool.getConnection(function(err, connection) {   //trying to connect to the database
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query(`SELECT * FROM users WHERE id=${req.params.user}`, function (error, results) {   //the result will be either an error or the actual result
          // When done with the connection, release it.
          connection.release();
       
          // Handle error after the release.
          if (error) throw error;
          console.log(results);
       
          // Don't use the connection here, it has been returned to the pool.
          res.json({results});
        });
      });

    //end pool query
})

// router.get('/users/:user', (req, res) => {
//     res.json({message: 'hit single users route'});
// })

module.exports = router;