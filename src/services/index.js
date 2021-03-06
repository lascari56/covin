const users = require('./users/users.service.js');
const cars = require('./cars/cars.service.js');
const historyCars = require('./history-cars/history-cars.service.js');
const logs = require('./logs/logs.service.js');
const carFilters = require('./car-filters/car-filters.service.js');
const templates = require('./templates/templates.service.js');
const bynowTrackings = require('./bynow-trackings/bynow-trackings.service.js');
const carBookmarks = require('./car-bookmarks/car-bookmarks.service.js');
const carComments = require('./car-comments/car-comments.service.js');
const carHidden = require('./car-hidden/car-hidden.service.js');
const source = require('./source/source.service.js');
const report = require('./report/report.service.js');
const billing = require('./billing/billing.service.js');
const carNotifications = require('./car-notifications/car-notifications.service.js');
const news = require('./news/news.service.js');
const settings = require('./settings/settings.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(cars);
  app.configure(historyCars);
  app.configure(logs);
  app.configure(carFilters);
  app.configure(templates);
  app.configure(bynowTrackings);
  app.configure(carBookmarks);
  app.configure(carComments);
  app.configure(carHidden);
  app.configure(source);
  app.configure(report);
  app.configure(billing);
  app.configure(carNotifications);
  app.configure(news);
  app.configure(settings);
};
