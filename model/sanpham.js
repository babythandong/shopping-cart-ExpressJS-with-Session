var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sanphamSchema = new Schema({
    name: String,
    price: Number,
    category: String,
    img_name: String,
    intro: String,
    content: String
});
var Sanpham = module.exports = mongoose.model('sanpham', sanphamSchema);

module.exports.createSanpham = function(newsp, callback) {
    newsp.save(callback);
}
module.exports.getAllSanpham = function(callback) {
    Sanpham.find({}, {}, callback);
}
module.exports.getSanphamById = function(id, callback) {
    Sanpham.findById(id, callback);
}