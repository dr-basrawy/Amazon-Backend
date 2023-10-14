const CategoryModel = require("../models/category ");
const productModel = require("../models/product");
const ReviewModel = require("../models/review");
const { getAllReviews } = require("../controllers/review");
function saveCategory(Category) {
  return CategoryModel.create(Category);
}
function getAllCategories() {
  return CategoryModel.find();
}
function getCategory(id) {
  return CategoryModel.findById(id).populate("products");
}

function updateCategory(id, CategoryData) {
  return CategoryModel.findByIdAndUpdate(id, CategoryData, { new: true });
}
function deleteCategory(id) {
  return CategoryModel.findByIdAndDelete(id);
}
async function catLessThanPrice(price, catId) {
  try {
    const result = await productModel.find({
      categoryId: catId,
      "price.new": { $lt: price },
    });
    return result;
  } catch (err) {
    console.error("Error ", err);
    return null;
  }
}
async function catBetweenPrice(maxPrice, minPrice, catId) {
  try {
    const result = await productModel.find({
      categoryId: catId,
      "price.new": { $gte: minPrice, $lte: maxPrice },
    });
    return result;
  } catch (err) {
    console.error("Error ", err);
    return null;
  }
}
async function catGreaterThanPrice(price, catId) {
  try {
    const result = await productModel.find({
      categoryId: catId,
      "price.new": { $gt: price },
    });
    return result;
  } catch (err) {
    console.error("Error ", err);
    return null;
  }
}
async function catGreaterThanDiscount(discount, catId) {
  try {
    const result = await productModel.find({
      categoryId: catId,
      "price.discount": { $gt: discount },
    });
    return result;
  } catch (err) {
    console.error("Error ", err);
    return null;
  }
}
// async function getCategoryByName(name) {
//   try {
//     return CategoryModel.findOne({name_en:name}).populate("products");
//   }
//   catch (err) {
//     return err;
//   }
// }

async function getCategoryByName(name, pageNumber, productsPerPage) {
  try {
    const listlen = await CategoryModel.findOne({ name_en: name })
    console.log(listlen.products.length);
    let pages=Math.ceil(listlen.products.length/productsPerPage)

    let list = await CategoryModel.findOne({ name_en: name })
   
      .populate({
        path: "products",
        options: {
          skip: (pageNumber - 1) * productsPerPage,
          limit: productsPerPage,
        },
      },)
      .exec();
      list['pages']=pages
      // console.log(list);

    return {data:list ,pages};
  } catch (err) {
    throw err;
  }
}


module.exports = {
  saveCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  catLessThanPrice,
  catGreaterThanPrice,
  catBetweenPrice,
  catGreaterThanDiscount,
  getCategoryByName,
};
