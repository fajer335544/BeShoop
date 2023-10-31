const mongoose = require('mongoose');
let connection;
mongoose.connect(process.env.DATABASE_LOCAL, { // return a promise
  // replicaSet: 'rs', 
  useNewUrlParser: true
})
.then(() => {
  connection = mongoose.connection;
  console.log("DB Connection successful!");
})
.catch(err => console.log(err));

module.exports = connection;

// npm install run-rs -g