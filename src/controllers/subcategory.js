// const SubcategoryModel=require('../models/subcategory ');
const SubcategoryModel = require("../models/subcategory");
// const CategoryModel=require('../models/category ');

function savesubCategory(SubCategory) {
  return SubcategoryModel.create(SubCategory);
}
function getAllSubCategories() {
  return SubcategoryModel.find();
}
function getSubCategory(id) {
  return SubcategoryModel.findById(id).populate("products");
}
function updateSubCategory(id, subCategoryData) {
  return SubcategoryModel.findByIdAndUpdate(id, subCategoryData, { new: true });
}
function deleteSubCategory(id) {
  return SubcategoryModel.findByIdAndDelete(id);
}
function getSubCategoryByCatId(catId){
  return SubcategoryModel.find({category:catId});
}
module.exports = {
  savesubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryByCatId
};
