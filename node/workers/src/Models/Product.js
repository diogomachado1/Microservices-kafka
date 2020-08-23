import mongoose from '../Database/database';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    account: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model('product', ProductSchema);

export default Product;
