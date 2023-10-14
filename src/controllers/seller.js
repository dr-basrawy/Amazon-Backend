const sellerModel = require("../models/seller")

function saveNewSeller(seller){

    return sellerModel.create(seller)
}

function getAllUSellers (){
    return sellerModel.find()
}


function deleteSeller(id){
    return sellerModel.findByIdAndDelete(id,{new:true})
}

function getSellerById(id){
    return sellerModel.findOne({_id:id})
}
function updateSeller(id , seller){
    return sellerModel.findByIdAndUpdate(id,seller,{new:true})
 }
 function updatestatus(id , status){
    return sellerModel.findByIdAndUpdate({_id:id},{status:status},{new:true})
 }
 

 module.exports = {saveNewSeller,getAllUSellers,deleteSeller,getSellerById,updateSeller,updatestatus,}
