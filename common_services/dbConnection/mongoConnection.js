const MongoClient = require('mongodb').MongoClient;
let mongoOptions = {
  server: {poolSize: 20},
  useNewUrlParser: true
};
const mongoConnectionURL = 'mongodb+srv://supermario:supermario@cluster0.naqdh.mongodb.net/supermario?retryWrites=true&w=majority';
MongoClient.connect(mongoConnectionURL, mongoOptions, function (err, database) {
  if (err) {
    console.log(">>>>>>>>>>>>>>",err)
    console.error({origin: 'MONGO CONNECTION', event:'Trying connecting mongodb!!', message: {mongoConnectionURL, mongoOptions}});
  } else {
    console.log({origin: 'MONGO CONNECTION', event:'Connection established with mongodb!!', message: {mongoOptions}});
  }
});