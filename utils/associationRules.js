// import apriori from 'apriori';
// import csv from 'csvtojson';
// import _ from 'lodash';
const apriori = require('apriori');
const csv = require('csvtojson');
const _ = require('lodash');

async function ar(){
  // productId,Date,name,price
  // select only the columns we will need, i.e. Member_number, Date and itemDescription.
  // const jsonArray = await csv({
  //     colParser: {
  //       "Member_number": "number",
  //       "Date": "string",
  //       "itemDescription": "string",
  //       "year": "omit",
  //       "month": "omit",
  //       "day": "omit",
  //       "day_of_week": "omit",
  //     },
  //   }).fromFile('./../mynewfile3.csv');
  const jsonArray = await csv({
      colParser: {
        "productId": "string",
        "Date": "string",
        "name": "string",
        "price": "omit",
      },
    }).fromFile('mynewfile3.csv');
  
  // console.log(jsonArray)
  /* The example object from the loaded array will view as follows:
  {
    Member_number: 2555,
    Date: '2015-12-23',
    itemDescription: 'whole milk'
  }
  */
  
  // The next step is to group the products by users and dates. To do this, let’s use the "Lodash" library 
  // Next, let’s make a grouping, as follows
  // let data = _.groupBy(jsonArray, ({ Member_number, Date }) => JSON.stringify({ Member_number, Date }));
  let data = _.groupBy(jsonArray, ({ Member_number, Date }) => JSON.stringify({ Member_number, Date }));
  // console.log(data);
  /* Under each common key, the data will be grouped into an array. An example array looks as follows:
    '{"Member_number":3762,"Date":"2014-10-31"}': 
    [
      {
        Member_number: 3762,
        Date: '2014-10-31',
        itemDescription: 'salt'
      },
      { Member_number: 3762,
        Date: '2014-10-31',
        itemDescription: 'oil' 
      }
    ]
  */
  
  //  Then let’s map such data to an array of arrays of product names, 
  // since such a structure is necessary for the inputs of the apriori algorithm:
  
  data = Object.values(data).map(v => v.map(w => w.name))
  // console.log(data)
  
  
  
  const Apriori = new apriori.Algorithm(0.01, 0.05, false); // describe the parameters below
  const results = Apriori.analyze(data);
  // console.log("Association");
  // console.log(results.associationRules);
  return results.associationRules;
  
  /*
    The values of the parameters of the constructor of the Algorithm class express,
    in turn: minimum support, minimum confidence,
    and whether the algorithm should log individual results during its execution.
    Thus, the result of the above code will be:
  */
  
  
  // This is a collection of rules that obtained the required certainty.
  // In this case, for example, when a product called “soda”
  // was purchased there was also a product called “whole milk” in the shopping cart along with it.
}

module.exports = {ar};