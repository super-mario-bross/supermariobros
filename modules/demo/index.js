
const demoController = require('./controllers/demoController');

app.get('/demo/get'   ,       demoController.getDemoData);