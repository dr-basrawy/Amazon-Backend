const mongoose = require("mongoose");
const {
  getCategory,
  catGreaterThanPrice,
  catLessThanPrice,
  catBetweenPrice,
  catGreaterThanDiscount,
} = require("../controllers/category");
const express = require("express");
const router = express.Router();
router.get("/:id/:text", async (req, res) => {
  let { id, text } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }
    const foundCategory = await getCategory(id);

    if (foundCategory) {
      let productList = foundCategory.products;
      let searchResults = productList.filter((item) => {
        return item.title_en.toLowerCase().includes(text.toLowerCase());
      });
      if (searchResults.length !== 0) {
        return res.status(201).json(searchResults);
      } else {
        let searchResults = productList.filter((item) => {
          return item.title_ar.toLowerCase().includes(text.toLowerCase());
        });
        return res.status(201).json(searchResults);
      }
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/:id/lessThan/:price", async (req, res) => {
  let { id, price } = req.params;
  price = Number(price);
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }
    const foundCategory = await getCategory(id);
    if (foundCategory) {
      console.log(foundCategory);
      if (typeof price == "number" && !isNaN(price)) {
        let productList = foundCategory.products.filter((item) => {
        return  item.price.new <= price;
        });
        console.log("---------------------",productList,"-----------------------");

        return res.status(201).json(productList);
      }
    }
  } catch (err) {
    res.sendStatus(404);
  }
});
router.get("/:id/greaterThan/:price", async (req, res) => {
  let { id, price } = req.params;
  price = Number(price);
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }
    const foundCategory = await getCategory(id);

    if (foundCategory) {
      if (typeof price == "number" && !isNaN(price)) {
        let productList = foundCategory.products.filter((item) => {
          return item.price.new >= price;
        });
        // let productGreaterThan = await catGreaterThanPrice(price, id);
        return res.status(201).json(productList);
      }
    }
  } catch (err) {
    res.sendStatus(404);
  }
});
router.get("/:id/between/:maxPrice/:minPrice", async (req, res) => {
  let { id, maxPrice, minPrice } = req.params;
  maxPrice = Number(maxPrice);
  minPrice = Number(minPrice);
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }
    const foundCategory = await getCategory(id);

    if (foundCategory) {
      if (
        typeof maxPrice == "number" &&
        !isNaN(maxPrice) &&
        typeof minPrice == "number" &&
        !isNaN(minPrice)
      ) {
        let productList=foundCategory.products.filter((item)=>{
          return item.price.new<=maxPrice && item.price.new>=minPrice;
        })


        // let productBetween = await catBetweenPrice(maxPrice, minPrice, id);
        return res.status(201).json(productList);
      }
    }
  } catch (err) {
    res.sendStatus(404);
  }
});
router.get("/:id/discount/:discount", async (req, res) => {
  let { id, discount } = req.params;
  discount = Number(discount);
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }
    const foundCategory = await getCategory(id);

    if (foundCategory) {
      if (typeof discount == "number" && !isNaN(discount)) {
        let productList = foundCategory.products.filter((item) => {
          return item.price.discount >= discount;
        })
        // let discountGreaterThan = await catGreaterThanDiscount(discount, id);
        return res.status(201).json(productList);
      }
    }
  } catch (err) {
    res.sendStatus(404);
  }
});
module.exports = router;
