const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = function (app) {
  mongoose.connect(
    app.get('mongodb'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  ).catch(err => {
    console.log(err);
    process.exit(1);
  });

  app.set('mongooseClient', mongoose);
};
