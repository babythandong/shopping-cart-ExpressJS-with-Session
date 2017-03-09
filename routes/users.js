var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.getAllUser(function(err, users) {
        if (err) return err;
        res.render('users/list', { 'title': 'Cpanel Express | List User', 'users': users });
        console.log('Session ' + req.session);
    })
});
router.get('/register', function(req, res, next) {
    res.render('register', { 'title': 'Register member' });
});
router.post('/register', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var date = new Date();
    req.checkBody('name','Name field is requried').notEmpty();
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email field is not valid').isEmail();
    req.checkBody('password','Password field is required').notEmpty();
    req.checkBody('password2','Password is not match').equals(req.body.password);
    var errors = req.validationErrors();
    if(errors){
    	res.render('register',{'errors':errors});
    }else{
    	var user = new User({name:name,email:email,password:password,date:date});
    	User.createUser(user,function(err,user){
    		if(err) return err;
    		console.log(user);
    		res.location('/users/login');
    		res.redirect('/users/login');
    	})
    }
});
router.get('/login',function(req,res,next){
	if(req.session.user){
		res.redirect('/dashboard');
	}
	res.render('login',{'title':'Login'});
});
router.get('/logout',function(req,res,next){
	req.logout();
	req.session.destroy();
	res.redirect('/users/login');
});
router.post('/login',function(req,res,next){
	var email = req.body.email;
	var password = req.body.password;
	User.getUserByEmail(email,function(err,user){
		if(err) return err;
		if(!user){
			return res.status(404).send();
		}else{
			User.comparePassword(password,user.password,function(err,isMatch){
				if(err) return err;
				if(isMatch){
					req.session.user = user;
					res.location('/dashboard');
					res.redirect('/dashboard');
				}
			})
		}
	})
});
router.get('/add',function(req,res,next){
	res.render('users/add',{'title':'Add User'});
});
router.post('/add',function(req,res,next){
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var company = req.body.company;
	var address = req.body.address;
	var job = req.body.job;

	/*var img = req.files;
	console.log(img);
	var img_name = img[0].filename;*/
	var img = req.files;
    console.log(img);
    var img_name = img[0].filename;
	var date = new Date();
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email field is valid').isEmail();
	var errors = req.validationErrors();
	if(errors){
		res.render('/users/add',{'title':'Add User','errors':errors});
	}else{
		var newMember = new User({
		name: name,
        email: email,
        password: password,
        company: company,
        job: job,
        address: address,
        img_name: img_name,
        date: date
		});
		User.createUser(newMember, function(err, user) {
            if (err) {
                return err;
            } else {
                req.flash('success', 'Member is added');
                res.location('/users');
				res.redirect('/users');
            }
        });
	}
	
});
router.get('/edit/:id',function(req,res,next){
	var id = req.params.id;
	User.getUserById(id,function(err,user){
		if(err){
			return err;
		}else{
			console.log(user);
			res.render('users/edit',{'title':'Edit User','post':user});
		}
	})
});
router.post('/edit/:id',function(req,res,next){
	var id = req.params.id;
	var name = req.body.name;
	var email = req.body.email;
	var company = req.body.company;
	var address = req.body.address;
	var job = req.body.job;
	var img = req.files;
	var img_name = img[0].filename;
	var date = new Date();
	User.editUserById(id,{name:name,email:email,company:company,address:address,job:job,img_name:img_name,date:date},function(err,user){
		if(err){
			return err;
		}else{
			req.flash('success','Member is created');
			res.location('/users');
			res.redirect('/users');
		}
	})
});
router.get('/del/:id',function(req,res,next){
	var id = req.params.id;
	User.delUserById(id,function(err,user){
		if(err){
			return err;
		}else{
			req.flash('success','Delete user is success');
			res.location('/users');
			res.redirect('/users');
		}
	})
});
module.exports = router;