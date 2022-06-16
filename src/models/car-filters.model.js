// car-filters-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'carFilters';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    make: {type: JSON},
    model: {type: JSON},
    series: {type: JSON},
    year: {type: JSON},
    odometer: {type: JSON},
    loss: {type: JSON},
    damage_pr: {type: JSON},
    damage_sec: {type: JSON},
    drive: {type: JSON},
    status: {type: JSON},
    keys: {type: JSON},
    transmission: {type: JSON},
    engine: {type: JSON},
    fuel: {type: JSON},
    cost_repair: {type: JSON},
    location: {type: JSON},
    document: {type: JSON},
    site: {type: JSON},
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
