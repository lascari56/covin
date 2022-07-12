// source-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'source';
  const mongooseClient = app.get('mongooseClient');
  const { Schema, Types } = mongooseClient;
  const schema = new Schema({
    name: { type: String, required: true, unique: true },
    group: { type: String, required: true, default: "carfax" },
    set: { type: String, default: "old" },
    token: { type: String },
    net_price: { type: Number, default: 0 },
    sell_price: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    priority_old: { type: Number, default: 0 },
    priority_new: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    reports: [{ type: Types.ObjectId, ref: "Report" }],
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
