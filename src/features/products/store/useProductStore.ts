import { create } from "zustand";
import { ProductStore, Specification } from "../interfaces/productStore";

export const useProductStore = create<ProductStore>((set) => ({
  general: {
    name: "",
    price: 0,
    stock: 0,
    isOnSale: false,
    salePrice: undefined,
    isFeatured: false,
    status: "ACTIVE",
  },
  specifications: [ { label: "", value: "" }],
  description: "",
  images: [],
  setGeneral: (data: ProductStore['general']) => set({ general: data }),
  setSpecifications: (data: Specification[]) => set({ specifications: data }),
  setDescription: (desc: ProductStore['description']) => set({ description: desc }),
  setImages: (files: ProductStore["images"]) => set({ images: files }),
  reset: () =>
    set({
      general: {
        name: "",
        price: 0,
        stock: 0,
        isOnSale: false,
        salePrice: undefined,
        isFeatured: false,
        status: "ACTIVE",
      },
      specifications: [],
      description: "", images: [],
    }),
}));