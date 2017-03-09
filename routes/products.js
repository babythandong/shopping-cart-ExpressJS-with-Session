var express = require('express');
var router = express.Router();
var Product = require('../model/product');

router.get('/', function(req, res) {
    Product.getParentProduct(function(err, products) {
        if (err) {
            return err;
        } else {
            res.render('products/list', { 'title': 'List Products', 'products': products });
        }
    })

});
router.get('/add', function(req, res) {
    res.render('products/add', { 'title': 'Add Products' });
});
router.post('/add', function(req, res) {
    var name = req.body.name;
    var author = req.body.author;
    var description = req.body.description;
    var parent = req.body.parent;
    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('parent', 'Parent field is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.render('products/add', { 'errors': errors });
    } else {
        var product = new Product({
            name: name,
            slug: Product.convert_slug(name),
            author: author,
            parent: parent,
            description: description,
            count: 0,
            createAt: new Date()
        });
        Product.createProduct(product, function(err, product) {
            if (err) {
                return err;
            } else {
                req.flash('success', 'Product is created');
                res.location('/products');
                res.redirect('/products');
            }
        });
    }
});
router.get('/edit/:id', function(req, res) {
    var id = req.params.id;
    Product.getProductById(id, function(err, product) {
        Product.getParentProduct(function(err, parent) {
            res.render('products/edit', { 'title': product.name, 'product': product, 'parent': parent });
        });
    });
});
router.post('/edit/:id', function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var author = req.body.author;
    var description = req.body.description;
    var parent = req.body.parent;
    var slug = Product.convert_slug(name);
    Product.editProductById(id, { name: name, author: author, description: description, parent: parent, slug: slug, createAt: new Date() }, function(err, product) {
        if (err) {
            return err;
        } else {
            req.flash('success', 'Product is updated');
            res.location('/products');
            res.redirect('/products');
        }
    });
});
router.get('/del/:id', function(req, res) {
    var id = req.params.id;
    Product.removeProductById(id, function(err, status) {
        if (err) {
            return err;
        } else {
            req.flash('success', 'Delete success');
            res.location('/products');
            res.redirect('/products');
        }
    });
});
module.exports = router;