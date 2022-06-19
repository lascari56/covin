const users = require('./users/users.service.js');
const cars = require('./cars/cars.service.js');
const historyCars = require('./history-cars/history-cars.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(cars);
  app.configure(historyCars);
};
