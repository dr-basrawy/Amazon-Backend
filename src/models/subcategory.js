const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    required: true,
  },
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true
    }
  ]
},{
  timestamps: true
});

const SubcategoryModel = mongoose.model("subcategory", subcategorySchema);

module.exports = SubcategoryModel;
