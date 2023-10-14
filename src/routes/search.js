const {
  getAllProducts,
  getLessThanPrice,
  getGreaterThanPrice,
  getBetweenPrices,
  getGreaterThanDiscount
} = require("../controllers/products");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
router.get("/:text", async (req, res) => {
  try {
    let { text } = req.params;
    let productList = await getAllProducts();
    let searchResults = productList.filter((item) => {
      return item.title_en.toLowerCase().includes(text.toLowerCase());
    });
    if (searchResults.length !== 0) {
      res.status(201).json(searchResults);
    } else {
      let searchResults = productList.filter((item) => {
        return item.title_ar.toLowerCase().includes(text.toLowerCase());
      });
      res.status(201).json(searchResults);
    }
  } catch (err) {
    res.sendStatus(404);
  }
});

router.get("/lessThan/:price", async (req, res) => {
  let { price } = req.params;
  price = Number(price);
  try {
    if (typeof price == "number" && !isNaN(price)) {
      let productLessThan = await getLessThanPrice(price);
      return res.status(201).json(productLessThan);
    }
  } catch (err) {
    res.sendStatus(404);
  }
});
router.get("/greaterThan/:price", async (req, res) => {
  let { price } = req.params;
  price = Number(price);
  try {
    if (typeof price == "number" && !isNaN(price)) {
      let productGreaterThan = await getGreaterThanPrice(price);
      return res.status(201).json(productGreaterThan);
    }
  } catch (err) {
    res.sendStatus(404);
  }
});
router.get("/between/:maxPrice/:minPrice", async (req, res) => {
  let { maxPrice, minPrice } = req.params;
  maxPrice = Number(maxPrice);
  minPrice = Number(minPrice);
  try {
    if (
      typeof maxPrice == "number" &&
      !isNaN(maxPrice) &&
      typeof minPrice == "number" &&
      !isNaN(minPrice)
    ) {
      let productBetween = await getBetweenPrices(maxPrice, minPrice);
      return res.status(201).json(productBetween);
    }
  } catch (err) {
    res.sendStatus(404);
  }
});
router.get("/discount/:discount", async (req, res) => {
  let { discount } = req.params;
  discount = Number(discount);
  try {
    if (typeof discount == "number" && !isNaN(discount)) {
      let discountGreaterThan = await getGreaterThanDiscount(discount);
      return res.status(201).json(discountGreaterThan);
    }
  } catch (err) {
    res.sendStatus(404);
  }
});

module.exports = router;
