var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: String,
    address: String,
    company:String,
    job:String,
    img_name: String,
    date: String
});

var User = module.exports = mongoose.model('users', userSchema)
module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}
module.exports.getUserByEmail = function(email, callback) {
    var query = { email: email };
    User.findOne(query, callback);
}
module.exports.getAllUser = function(callback) {
    User.find({}, {}, callback);
}
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}
module.exports.delUserById = function(id, callback) {
    var query = { _id: id };
    User.findOneAndRemove(query, callback);
}
module.exports.editUserById = function(id, newData, callback) {
    var query = { _id: id };
    User.findOneAndUpdate(query, newData, callback);
}
module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if(err) return err;
		callback(null,isMatch);
	})
}
