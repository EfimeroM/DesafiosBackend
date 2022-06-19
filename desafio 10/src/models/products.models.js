import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  nombre: {
    type: String,
    required: true,
    max: 100,
  },
  descripcion: {
    type: String,
    required: true,
    max: 100,
  },
  codigo: {
    type: String,
    required: true,
    max: 100,
  },
  foto: {
    type: String,
    max:100,
    required: true,
  },
  precio: {
      type: Number,
      required: true
  },
  stock: {
      type: Number,
      required: true
  }
});

export const ProductsModel = mongoose.model("productos", Schema)