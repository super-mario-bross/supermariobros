const MongoClient = require('mongodb').MongoClient;
let mongoOptions = {
  server: {poolSize: 20},
  useNewUrlParser: true
};
const mongoConnectionURL = 'mongodb+srv://mario:mario@cluster0.e1hx5.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority';
MongoClient.connect(mongoConnectionURL, mongoOptions, function (err, database) {
  if (err) {
    console.error({origin: 'MONGO CONNECTION', event:'Trying connecting mongodb!!', message: {mongoConnectionURL, mongoOptions}});
  } else {
    console.log({origin: 'MONGO CONNECTION', event:'Connection established with mongodb!!', message: {mongoOptions}});
  }
});