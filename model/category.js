var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    author: String,
    description: String,
    parent: String,
    slug: String,
    count: Number
});
var Category = module.exports = mongoose.model('category', categorySchema);
module.exports.createCategory = function(newCategory, callback) {
    newCategory.save(callback);
}
module.exports.getAllCategory = function(callback) {
    Category.find({}, {}, callback);
}
module.exports.getParentCategory = function(callback) {
    var query = { parent: '0' };
    Category.find(query, {}, callback);
}
module.exports.getCategoryById = function(id, callback) {
    Category.findById(id, callback);
}
module.exports.editCategoryById = function(id, newData, callback) {
    var query = { _id: id };
    Category.findOneAndUpdate(query, newData, callback);
}
module.exports.getCategoryByName = function(category, callback) {
    var query = { name: category };
    Category.findOne(query, callback);
}
module.exports.updateCategotybyName = function(category, newData, callback) {
    var query = { name: category };
    Category.findOneAndUpdate(query, newData, callback);
}
module.exports.delCategoryById = function(id, callback) {
    var query = { _id: id };
    Category.findOneAndRemove(query, callback);
}
module.exports.getDetailById = function(id, callback) {
    Category.findById(id, callback);
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