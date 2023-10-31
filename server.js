const dotenv = require('dotenv');
// const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');
require('./DB/connection');

// mongoose.connect(process.env.DATABASE_LOCAL, { // return a promise
//     useNewUrlParser: true
// }).then(() => {
//     console.log("DB Connection successful!");
// }).catch(err => console.log(err));


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});