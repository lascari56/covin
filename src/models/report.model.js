// report-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'report';
  const mongooseClient = app.get('mongooseClient');
  const { Schema, Types } = mongooseClient;
  const schema = new Schema({
    source: {type: Types.ObjectId, ref: 'Source'},
    source_group: {type: String},
    client: {type: Types.ObjectId, ref: 'User'},
    price: {type: Number},
    profit: {type: Number},
    date: {type: Date, default: Date.now},
    file: {type: String },
    bonusSticker: {type: String },
    vin: {type: String},
    order_token: {type: String},
    status: {type: String},
    external: {type: Boolean, default: false},
  }, {
    timestamps: false
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
