const Driver = require('./../models/driverModel');

const schedule = require('node-schedule');

const sc = ()=>{
  schedule.scheduleJob('0 0 * * *', async () => {  // run everyday at midnight
    await Driver.findByIdAndUpdate('6470b043c8266e7d9efff04f' , {
      phone : '1233'
    })
  })
}

module.exports = {sc};
