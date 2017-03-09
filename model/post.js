var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema({
    title: String,
    author: String,
    category: String,
    intro: String,
    content: String,
    slug: String,
    img_name: String,
    date: String
});
var Post = module.exports = mongoose.model('post', postSchema);
module.exports.createPost = function(newPost, callback) {
    newPost.save(callback);
}
module.exports.getPostById = function(id, callback) {
    Post.findById(id, callback);
}
module.exports.getAllPost = function(callback) {
    Post.find({}, {}, callback);
}
module.exports.getPostByCategory = function(category, callback) {
    var query = { category: category };
    Post.find(query, {}, callback);
}
module.exports.editPostById = function(id, newData, callback) {
    var query = { _id: id };
    Post.findOneAndUpdate(query, newData, callback);
}
module.exports.delPostById = function(id, callback) {
    var query = { _id: id };
    Post.findOneAndRemove(id, callback);
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
module.exports.getCount = function(arr) {
    var count = arr.length;
    return count;
}