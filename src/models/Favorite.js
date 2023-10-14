const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  productId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
      default:[]
    }
  ],

},
{timestamps:true}
);

const FavoriteModel = mongoose.model('favorite', favoriteSchema);

module.exports = FavoriteModel;