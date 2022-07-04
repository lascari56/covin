const users = require('./users/users.service.js');
const cars = require('./cars/cars.service.js');
const historyCars = require('./history-cars/history-cars.service.js');
const logs = require('./logs/logs.service.js');
const carFilters = require('./car-filters/car-filters.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(cars);
  app.configure(historyCars);
  app.configure(logs);
  app.configure(carFilters);
};
