const Cart_model = require('../models/cart');
const { getproductByid } = require('./products');


function getAllcarts() {
    return Cart_model.find().populate('user')
}

function getCartByUserId(userId) {
    return Cart_model.findOne({ user: userId }).populate('user').populate('items.product')
}
function clearCart(userId) {
    return Cart_model.findOneAndUpdate({ user: userId }, { items: [] }).populate('user').populate('items.product')
}
function addNewCart(cart) {

    return Cart_model.create(cart)
}


async function addNewProductsInCart(userId, products) {

    var oldCart = await getCartByUserId(userId)
    // console.log(products);
    console.log("-------------------");
    // console.log(oldCart.items);


    if (oldCart.items == 0) { var newcartitems = [...products] }
    else {
        for (const x of products) {
            for (const y of oldCart.items) {
                if ((x.product) == y.product._id.toString()) {
                    y.quantity += x.quantity
                    var newcartitems = [...oldCart.items]

                }
                else {
                    var newcartitems = [...oldCart.items, ...products]
                }

            }
        }
    }


    return Cart_model.findOneAndUpdate({ user: userId }, { items: newcartitems }, { new: true }).populate('user').populate('items.product')
}


async function updateQuantity(userId, productId, newquantity) {

    var oldCart = await getCartByUserId(userId)
    var product = await getproductByid(productId)
    // console.log(product);


    for (const x of oldCart.items) {

        if (x.product._id.toString() == productId) {
            if (newquantity > product.quantity) { x.quantity = product.quantity}
            else if (newquantity <= 0) { x.quantity =1 }
            else { x.quantity = newquantity }
            var newcartitems = [...oldCart.items]

        }


    }



    return Cart_model.findOneAndUpdate({ user: userId }, { items: newcartitems }, { new: true }).populate('user').populate('items.product')
}


async function removeProductsInCart(userId, productId) {
    var oldCart = await getCartByUserId(userId)
    // console.log(oldCart.items);
    // for (let i = 0; i < oldCart.items.length; i++) {
    //     if (oldCart.items[i].product == productId) {
    //         oldCart.items.splice(i, 1);
    //     }
    // }
    let index = 0
    for (const i of oldCart.items) {
        console.log(i.product._id.toString());
        console.log(productId);
        if (i.product._id.toString() == productId) {
            oldCart.items.splice(index, 1)
        }
        index++
    }
    // console.log(oldCart);
    var newcartitems = [...oldCart.items]

    return Cart_model.findOneAndUpdate({ user: userId }, { items: newcartitems }, { new: true }).populate('user')
}





module.exports = { getAllcarts, getCartByUserId, addNewCart, addNewProductsInCart, removeProductsInCart, clearCart, updateQuantity }