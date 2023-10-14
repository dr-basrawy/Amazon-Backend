const express = require('express')
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var { promisify } = require('util')
var router = express.Router()
const userModel = require('../models/user');
const cart = require('../controllers/cart')
var { getCartByUserId, clearCart } = require('../controllers/cart');
var { updatequantity, updatequantityAdd } = require('../controllers/products');
var { orderDelete, addOrder, getOrderItems, getOrderItemsByUserID, getAllOrders, updatetoComplete,updatetocancelled } = require("../controllers/order");
const loginAuth = require('../middlewares/auth');
const verifyJWT = require('../middlewares/verifyJWT');


router.post("/:userId/addNewOrder", async (req, res) => {
    var userId = req.params.userId
    var order = req.body
    order.user = userId


    var cartt = await getCartByUserId(userId)
    if (cartt.items.length == 0) {
        res.status(500).json({ data: "card is  empty" })

    } else {
        order.products = [...cartt.items]
        for (const x of order.products) {

            await updatequantity(x.product._id, x.quantity)///////

        }
        var neworder = await addOrder(order, userId);
        ////updatequantity
        await clearCart(userId)

        res.status(201).json({ data: neworder })

    }

})

// router.post("/:userId/addNewOrder", async (req, res) => {
//     var cartt = await addOrder(req.body)
//     if (cartt.products.length == 0) {
//         res.status(500).json({ data: "card is  empty" })

//     } else {
//         res.status(200).json({ data: cartt })

//     }

// })
router.delete("/:orderId", async (req, res) => {
    var { orderId } = req.params
    try {
        var order = await orderDelete(orderId);
        if (order.deletedCount > 0) {
            res.status(200).json({ data: true })
        } else {
            throw new Error("not found")
        }
    } catch (err) {
        if (err.message === "not found") {
            res.status(404).json({ message: "Order not found, make sure of the correct id", deleted: false })
        } else {
            res.status(500).json({ message: err })
        }

    }


})
router.get("/:orderId", async (req, res) => {
    var id = req.params.orderId
    try {
        var order = await getOrderItems(id);
        var lang = req.headers.localization
        if (lang === "en") {
            let productsT = order.products.map(prd => {
                return {
                    id: prd._id,
                    title: prd.title_en,
                    description: prd.description_en,
                }
            })
        }
        if (order) {
            res.status(200).json({ data: order })
        } else {
            res.status(404).json({ data: "not found" })
        }
    } catch (err) {
        res.status(500).json({ massage: "id not  found" })
    }
});

router.get("/", async (req, res) => {

    try {
        var orders = await getAllOrders()
        res.json({ data: orders })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
router.get("/getByUserId/:userId", async (req, res) => {
    const userID = req.params.userId;
    try {
        var orders = await getOrderItemsByUserID(userID);
        res.status(200).json({ data: orders })

    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.patch("/:orderId/changetocomplete", async (req, res) => {
    const orderId = req.params.orderId;
    try {
        var orders = await updatetoComplete(orderId);
        res.status(200).json({ data: orders })

    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.patch("/:orderId/cancel", async (req, res) => {
    const orderId = req.params.orderId;
    let oldOrder = await getOrderItems(orderId)
    for (const prod of oldOrder.products) {
        await updatequantityAdd(prod.product._id,prod.quantity)

    }
    await updatetocancelled(orderId);

    try {
        
        res.status(200).json({ data: orders })

    } catch (error) {
        res.status(500).json({ message: error })
    }
})

module.exports = router 