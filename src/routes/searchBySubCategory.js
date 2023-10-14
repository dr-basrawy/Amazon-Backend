const express = require("express");
const router = express.Router();
const {   getSubCategoryByCatId }= require("../controllers/subcategory");

router.get('/:id',async (req,res)=>{
    try {
        const {id} = req.params;
        const subCategory = await getSubCategoryByCatId(id);
        res.status(201).json(subCategory);
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})
module.exports  = router