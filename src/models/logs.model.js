// logs-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'logs';
  const mongooseClient = app.get('mongooseClient');
  const { Schema, Types } = mongooseClient;
  const schema = new Schema({
    client: {type: Types.ObjectId, ref: 'User'},
    vin: {type: String},
    date: {type: Date, default: Date.now},
    status: {type: String},
    message: {type: String},
    api: {type: String},
    transfer: {type: Number},
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
