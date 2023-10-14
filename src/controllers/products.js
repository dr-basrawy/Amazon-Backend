const productModel = require("../models/product");
const CategoryModel = require("../models/category ");
const { updateCategory } = require("./category");

async function saveProduct(product) {
  try {
    let newProduct = productModel.create(product);
    let categoryId = product.categoryId;
    let category = await CategoryModel.findById(categoryId);
    if (category) {
      category.products.push((await newProduct)._id);
      await category.save();
    } else {
      console.log("Category not found");
    }
    return newProduct;
  } catch (err) {
    console.log(err);
  }
}
function getAllProducts() {
  return productModel.find().populate("categoryId");
}
async function getLessThanPrice(price) {
  try {
    const result = await productModel.find({ "price.new": { $lt: price } });
    return result;
  } catch (err) {
    console.error("Error ", err);
    return null;
  }
}
async function getGreaterThanPrice(price) {
  try {
    const result = await productModel.find({ "price.new": { $gt: price } });
    return result;
  } catch (err) {
    console.error("Error ", err);
    return null;
  }
}
async function getBetweenPrices(maxPrice, minPrice) {
  try {
    const result = await productModel.find({
      "price.new": { $gte: minPrice, $lte: maxPrice },
    });
    return result;
  } catch (err) {
    console.error("Error ", err);
    return null;
  }
}
async function getGreaterThanDiscount(discount) {
  try {
    const result = await productModel.find({
      "price.discount": { $gt: discount },
    });
    return result;
  } catch (err) {
    console.error("Error ", err);
    return null;
  }
}
async function updateProduct(id, productData) {
  let oldProduct = await productModel.findById(id);
  let newProduct = productData;
  let newProductCategoryId = newProduct.categoryId;
  let oldCategory = await CategoryModel.findById(oldProduct.categoryId);
  let category = await CategoryModel.findById(newProductCategoryId);
  if (!oldProduct) {
    return null;
  }
  //get the old category to delete the product form it
  //delete product from it's old category and put it in the new one
  if (oldCategory) {
    oldCategory.products = oldCategory.products.filter(
      (productId) =>
        productId && productId.toString() !== oldProduct._id.toString()
    );
    await oldCategory.save();
  }
  if (oldProduct.categoryId == newProductCategoryId) {
    if (category) {
      category.products.push(id);
      console.log(
        "category from oldProduct.categoryId == newProductCategoryId Check",
        category
      );
      await category.save();
    }
  } else if (
    oldProduct.categoryId !== newProductCategoryId ||
    oldProduct.categoryId == null
  ) {
    //search for the new category by the new id and put the product in it.

    if (category) {
      category.products.push(id);
      console.log(
        "category from oldProduct.categoryId !== newProductCategoryId Check",
        category
      );

      await category.save();
    }
    newProduct.categoryId = newProductCategoryId;
  }
  const updateProduct = await productModel
    .findByIdAndUpdate(id, newProduct, { new: true })
    .populate("categoryId");
  return updateProduct;
}


async function deleteProduct(id) {
  try {
    let deletedProduct = await productModel.findById(id);
    let deletedProdCatId = deletedProduct.categoryId;
    let category = await CategoryModel.findById(deletedProdCatId).populate(
      "products"
    );
    let categoryProducts = category.products;

    let deletedItemIndex = categoryProducts.findIndex((item) => {
      return item._id.toString() == id;
    });
    if (deletedItemIndex !== -1) {
      categoryProducts.splice(deletedItemIndex, 1);
      await category.save();
    }

    return productModel.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }
}

function getproductByid(id) {
  return productModel.findOne({ _id: id }).populate('categoryId');
}

async function updatequantity(prodId, new_q) {
  let q = await getproductByid(prodId);
  console.log(q.quantity);
  console.log(new_q);
  let newq = q.quantity - new_q;
  return productModel.findOneAndUpdate(
    { _id: prodId },
    { quantity: newq },
    { new: true }
  );
}


async function updatequantityAdd(prodId, new_q) {
  let q = await getproductByid(prodId);
  console.log(q.quantity);
  console.log(new_q);
  let newq = q.quantity + new_q;
  return productModel.findOneAndUpdate(
    { _id: prodId },
    { quantity: newq },
    { new: true }
  );
}

module.exports = {
  saveProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getproductByid,
  updatequantity,
  getLessThanPrice,
  getGreaterThanPrice,
  getBetweenPrices,
  getGreaterThanDiscount,
  updatequantityAdd
};
