const express = require('express');
const app = express();

const port = process.env.PORT || 5050;

app.use(express.json());
app.use(express.urlencoded({ extended: false}));// ?username="value"&&password="value"  //kinda a security check
//this bit of config enables our express app to read incoming data payloads via our routes
// the user data we pass via the fetch call in the login component
// we can use a JSON encoded object or URL parameters / form data to pass our user  data in 

app.use('/ums', require('./routes/api'));

app.listen(port, () => {
    console.log(`UMS is running at port ${port}`);
})

  /*When you are using node you have to restart on your own to see the changes you made But nodemon watches the particular path for any changes. If you make any changes in your file, nodemon will restart it for you.*/