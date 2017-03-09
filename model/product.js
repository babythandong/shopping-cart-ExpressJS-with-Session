var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        unique: true,
        required: true
    },
    parent: String,
    createAt: Date,
    count: Number,
    author: String,
    slug: String
});
var Product = module.exports = mongoose.model('Product', productSchema);
module.exports.createProduct = function(newProduct, callback) {
    newProduct.save(callback);
}
module.exports.getProductById = function(id, callback) {
    Product.findById(id, callback);
}
module.exports.getProductByName = function(category, callback) {
    var query = { name: category };
    Product.findOne(query, callback);
}
module.exports.editProductById = function(id, newData, callback) {
    var query = { _id: id };
    Product.findOneAndUpdate(query, newData, callback);
}
module.exports.editProductByName = function(name, newData, callback) {
    var query = { name: name };
    Product.findOneAndUpdate(query, newData, callback);
}
module.exports.getParentProduct = function(callback) {
    var query = { parent: '0' };
    Product.find(query, {}, callback);
}
module.exports.removeProductById = function(id, callback) {
    Product.findOneAndRemove(id, callback);
}
module.exports.getParentProduct = function(callback) {
    var query = { parent: '0' };
    Product.find(query, {}, callback);
}
module.exports.getAllProduct = function(callback) {
    Product.find({}, {}, callback);
}
module.exports.convert_slug = function(str) {
    // Chuyển hết sang chữ thường
    str = str.toLowerCase();

    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
    str = str.replace(/(đ)/g, 'd');

    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, '');

    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, '-');

    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, '');

    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, '');

    // return
    return str;
}