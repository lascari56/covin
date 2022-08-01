// car-notifications-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'carNotifications';
  const mongooseClient = app.get('mongooseClient');
  const { Schema, Types } = mongooseClient;
  const schema = new Schema({
    car: {type: Types.ObjectId, ref: 'Car', required: true},
    lotId: { type: String },
    client: {type: Types.ObjectId, ref: 'User'},
    buyNow: {type: JSON, default: {active: false}},
    auction: {type: JSON, default: {active: false}},
    // type: {type: Array},
    time: {type: Number},
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
