const MongoClient = require('mongodb').MongoClient;
let mongoOptions = {
  server: {poolSize: 20},
  useNewUrlParser: true
};
const mongoConnectionURL = 'mongodb://localhost:27017/supermarios';
MongoClient.connect(mongoConnectionURL, mongoOptions, function (err, database) {
  if (err) {
    console.log(">>>>>>>>>>>>>>",err)
    console.error({origin: 'MONGO CONNECTION', event:'Trying connecting mongodb!!', message: {mongoConnectionURL, mongoOptions}});
  } else {
    console.log({origin: 'MONGO CONNECTION', event:'Connection established with mongodb!!', message: {mongoOptions}});
  }
});