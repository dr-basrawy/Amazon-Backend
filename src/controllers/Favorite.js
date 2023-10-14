const FavoriteModel = require("../models/Favorite");
const User_model = require("../models/user");

async function saveFavorite(favorite) {
    try {
        let newFav = FavoriteModel.create(favorite);
        let userId = favorite.userId;
        let user = await User_model.findById(userId);
        if (user) {
            user.favorite.push((await newFav)._id);
            await user.save();
        } else {
            console.log("product not found");
        }
        return newFav;
    } catch (err) {
        console.log(err);
    }
}
function getFavoriteByUserId(userId) {
    return FavoriteModel.findOne({ userId: userId }).populate("userId").populate("productId");
}

function getAllFavorites() {
    return FavoriteModel.find().populate("userId");
}

async function addNewProductsInFav(userId, products) {
    var oldFav = await getFavoriteByUserId(userId);
    if (oldFav.productId.toString().includes((products))) {
        return oldFav
    }
    var newFavitems = [...oldFav.productId, products];
    console.log(products);

    return FavoriteModel.findOneAndUpdate(
        { userId: userId },
        { productId: newFavitems },
        { new: true }
    ).populate("userId");
}

async function removeProductsInFav(userId, productId) {
    var oldFav = await getFavoriteByUserId(userId);
    let c=0
    for (const fav of oldFav.productId) {
        if (fav._id.toString() == productId) {
            oldFav.productId.splice(c, 1);
        }
        c++
    }
    var newFavitems = [...oldFav.productId];

    return FavoriteModel.findOneAndUpdate(
        { userId: userId },
        { productId: newFavitems },
        { new: true }
    ).populate("userId");
}

module.exports = {
    saveFavorite,
    getAllFavorites,
    addNewProductsInFav,
    getFavoriteByUserId,
    removeProductsInFav,
};
