// cars-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'cars';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    "data_id": { type: String },
    "site": { type: String },
    "lot_id": { type: String },
    "item_id": { type: String },
    "odometer": {type: Number},
    "price_new": {type: Number},
    "price_future": {type: Number},
    "price_old": {type: Number},
    "cost_priced": {type: Number},
    "cost_repair": {type: Number},
    "year": { type: String },
    "auction_date": { type: Date },
    "auction_date_api": { type: String },
    "auction_date_known": { type: Boolean },
    "cylinders": {type: String},
    "state": { type: String },
    "vehicle_type": { type: String },
    "auction_type": { type: String },
    "make": { type: String },
    "model": { type: String },
    "series": { type: String },
    "loss": { type: String },
    "damage_pr": { type: String },
    "damage_sec": { type: String },
    "status": { type: String },
    "keys": { type: String },
    "odobrand": { type: String },
    "fuel": { type: String },
    "drive": { type: String },
    "transmission": { type: String },
    "color": { type: String },
    "title": { type: String },
    "vin": { type: String },
    "engine": { type: String },
    "link_img_hd": { type: Array, default: [] },
    "image_360": { type: String },
    "location": { type: String },
    "document": { type: String },
  }, {
    timestamps: true
  });

  schema.index(
    { title: 'text', lot_id: 'text', vin: 'text' },
    { year: 1 },
    { odometr: 1 },
    { cost_repair: 1 },
    { damage_pr: 1, damage_sec: 1 },
    { make: 1 },
    { loss: 1 },
    { drive: 1 },
    { status: 1 },
    { keys: 1 },
    { transmission: 1 },
    { engine: 1 },
    { fuel: 1 },
    { location: 1 },
    { document: 1 },
    { site: 1 },
    { lot_id: 1 },
    { auction_date_api: 1 },
    { auction_date: 1 },
    { auction_date_known: 1 },
    { date_adding_new: 1 },
    { date_adding_old: 1 },
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
