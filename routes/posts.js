var express = require('express');
var router = express.Router();
var Post = require('../model/post');
var Category = require('../model/category');
//var paginate = require('express-paginate');

router.get('/', function(req, res, next) {
    console.log(req.query.pageSize);
    Post.getAllPost(function(err, posts) {
        if (err) {
            return err;
        } else {
            res.render('posts/list', { 'title': 'List Post', 'posts': posts });
        }
    });
});
router.get('/add', function(req, res, next) {
    Category.getAllCategory(function(err, categories) {
        if (err) {
            return err;
        } else {
            res.render('posts/add', { 'title': 'Add Post', 'categories': categories });
        }
    });

});
router.post('/add', function(req, res, next) {
    var title = req.body.title;
    var category = req.body.category;
    var img = req.files;
    var img_name = img[0].filename;
    var intro = req.body.intro;
    var content = req.body.content;
    var author = req.body.author;
    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('category', 'Category field is required').notEmpty();
    req.checkBody('content', 'Content field is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.render('posts/add', { 'title': 'Add Post', 'errors': errors });
    } else {
        var newPost = new Post({
            title: title,
            category: category,
            img_name: img_name,
            intro: intro,
            content: content,
            author: author,
            slug: Post.convert_slug(title)
        });
        Post.createPost(newPost, function(err, post) {
            if (err) {
                return err;
            } else {
                var category = post.category;
                Category.getCategoryByName(category, function(err, cate) {
                    var count_post = cate.count;
                    var count = count_post + 1;
                    Category.updateCategotybyName(cate.name, { count: count }, function(err, cate1) {
                        req.flash('success', 'Post is created');
                        res.location('/posts');
                        res.redirect('/posts');
                    });
                });
            }
        });
    }
});
router.get('/edit/:id', function(req, res, next) {


    var id = req.params.id;
    Post.getPostById(id, function(err, post) {
        if (err) {
            return err;
        } else {
            Category.getAllCategory(function(err, categories) {
                res.render('posts/edit', { 'title': post.title, 'post': post, 'categories': categories });
            })
        }
    });
});
router.post('/edit/:id', function(req, res, next) {

    var title = req.body.title;
    var category = req.body.category;
    var intro = req.body.intro;
    var content = req.body.content;
    var author = req.body.author;
    var img = req.files;
    if (img != '') {
        var img_name = img[0].filename;
        Post.editPostById(req.params.id, { title: title, category: category, intro: intro, content: content, author: author, img_name: img_name, slug: Post.convert_slug(title) }, function(err, post) {
            req.flash('success', 'Post is updated');
            res.location('/posts');
            res.redirect('/posts');
        });
    } else {
        Post.editPostById(req.params.id, { title: title, category: category, intro: intro, content: content, author: author, slug: Post.convert_slug(title) }, function(err, post) {
            req.flash('success', 'Post is updated');
            res.location('/posts');
            res.redirect('/posts');
        });
    }
});
router.get('/detail/:id', function(req, res, next) {

    /*
    Muốn hiển thị không lỗi font khi sử dụng ckeditor chỉnh sửa trong 
    file ckeditor.js chỉnh config.entities_latin thành false
    Muốn hiển thị nội dung không dính mấy thẻ tah sử dụng cú pháp !{}
    */
    var id = req.params.id;
    Post.getPostById(id, function(err, post) {
        if (err) {
            return err;
        } else {
            res.render('posts/detail', { 'title': post.title, 'post': post });
        }
    });
});
module.exports = router;