var express = require('express');
var router = express.Router();
var Sanpham = require('../model/sanpham');
var Product = require('../model/product');

router.get('/', function(req, res, next) {
    Sanpham.getAllSanpham(function(err, sanphams) {
        if (err) {
            return err;
        } else {
            res.render('sanpham/list', { 'title': 'List Sản phẩm', 'sanphams': sanphams });
        }
    });
});

router.get('/add', function(req, res, next) {
    Product.getAllProduct(function(err, products) {
        if (err) return err;
        res.render('sanpham/add', { 'title': 'Add San pham', 'products': products });
    })
});

router.post('/add', function(req, res, next) {
    var name = req.body.name;
    var price = req.body.price;
    var category = req.body.category;
    var img = req.files;
    var img_name = img[0].filename;
    var intro = req.body.intro;
    var content = req.body.content;
    var sanpham = new Sanpham({
        name: name,
        price: price,
        category: category,
        img_name: img_name,
        intro: intro,
        content: content
    });
    Sanpham.createSanpham(sanpham, function(err, sp) {
        if (err) {
            return err;
        } else {
            Product.getProductByName(sp.category, function(err, cate) {
                if (err) {
                    return err;
                } else {
                    var count_post = cate.count;
                    var count = count_post + 1;
                    Product.editProductByName(cate.name, { count: count }, function(err, cate1) {
                        if (err) {
                            return err;
                        }
                        req.flash('success', 'Sanpham is created');
                        res.location('/sanphams');
                        res.redirect('/sanphams');
                    })
                }
            });
        }
    });
});
router.get('/detail/:id', function(req, res) {
    var id = req.params.id;
    Sanpham.getSanphamById(id, function(err, sp) {
        if (err) {
            return err;
        } else {
            res.render('sanpham/detail', { 'title': sp.name, 'sp': sp });
        }
    });
})
module.exports = router;