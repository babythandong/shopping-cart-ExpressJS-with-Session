var express = require('express');
var router = express.Router();
var Category = require('../model/category');
var Post = require('../model/post');
router.get('/add', function(req, res, next) {
    Category.getParentCategory(function(err, categories) {
        if (err) {
            return err;
        } else {
            res.render('categories/add', { 'title': 'Add Category', 'categories': categories });
        }
    })
});
router.post('/add', function(req, res, next) {
    var name = req.body.name;
    var author = req.body.author;
    var description = req.body.description;
    var parent = req.body.parent;
    req.checkBody('name', 'Name field is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.render('categories/add', { 'title': 'Add Category', 'errors': errors });
    } else {
        var newCategory = new Category({
            name: name,
            author: author,
            parent: parent,
            description: description,
            slug: Category.convert_slug(name)
        });
        Category.createCategory(newCategory, function(err, newCategory) {
            if (err) {
                return err;
            } else {
                req.flash('success', 'Category is added');
                res.location('/categories');
                res.redirect('/categories');
            }
        });
    }
});
router.get('/', function(req, res, next) {
    Category.getAllCategory(function(err, categories) {
        if (err) {
            return err;
        } else {
            res.render('categories/list', { 'title': 'List category', 'catagories': categories });
        }
    });
});
router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    Category.getCategoryById(id, function(err, category) {
        if (err) {
            return err;
        } else {
            //res.render('categories/edit',{'title':category.name,'category':category});
            Category.getAllCategory(function(err, categories) {
                res.render('categories/edit', { 'title': category.name, 'category': category, 'categories': categories });
            });
        }
    });
});
router.post('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    var name = req.body.name;
    var author = req.body.author;
    var description = req.body.description;
    var parent = req.body.parent;
    Category.editCategoryById(id, { name: name, author: author, description: description, parent: parent, slug: Category.convert_slug(name), count: 0 }, function(err, category) {
        if (err) {
            return err;
        } else {
            req.flash('success', 'Updated');
            res.location('/categories');
            res.redirect('/categories');
        }
    });
});
router.get('/view/:id', function(req, res, next) {
    Category.getCategoryById(req.params.id, function(err, category) {
        if (err) {
            return err;
        } else {
            Post.getPostByCategory(category.name, function(err, posts) {
                res.render('categories/detail', { 'title': category.name, 'posts': posts });
            })

        }
    })

});
router.get('/del/:id', function(req, res, next) {
    var id = req.params.id;
    Category.delCategoryById(id, function(err, category) {
        if (err) {
            return err;
        } else {
            req.flash('success', 'Delete success');
            res.location('/categories');
            res.redirect('/categories');
        }
    });
});
module.exports = router;