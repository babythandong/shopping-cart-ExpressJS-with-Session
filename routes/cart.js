var express = require('express');
var router = express.Router();
var Sanpham = require('../model/sanpham');
router.post('/:id', function(req, res) {
    req.session.cart = req.session.cart || {};
    var cart = req.session.cart;
    Sanpham.findOne({ _id: req.params.id }, function(err, sp) {
        if (err) return err;
        if (cart[req.params.id]) {
            cart[req.params.id].qty++;
        } else {
            cart[req.params.id] = {
                item: sp._id,
                name: sp.name,
                price: sp.price,
                qty: req.body.qty,
                total: req.body.qty * sp.price
            };
        }
        res.redirect('/cart');
    });
});
router.get('/', function(req, res) {

    var cart = req.session.cart;
    var displayCart = { items: [], total: 0 };
    var total = 0;

    // Get total
    for (var item in cart) {
        displayCart.items.push(cart[item]);
        total += (cart[item].qty * cart[item].price);
    }

    displayCart.total = total;

    // Render Cart
    res.render('cart/index', {
        'cart': cart
    });
});
module.exports = router;