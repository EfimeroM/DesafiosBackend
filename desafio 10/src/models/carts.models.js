import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  productos: {
    type: Array,
    default: []
  }
});

export const CartsModel = mongoose.model("carritos", Schema)