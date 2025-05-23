
export interface Specification  {
  label: string;
  value: string;
};

export interface Images {
  file: File | null;
  preview: string;
};
export interface ProductStore {
  general: {
    name: string;
    stock: number;
    status: "ACTIVE" | "INACTIVE" | "DELETED";
    price?: number | undefined;
    isOnSale?: boolean | undefined;
    salePrice?: number | undefined;
    isFeatured?: boolean | undefined;
    categoryId?: string | undefined;
    brand?: string | undefined;
    color?: string | undefined;
  };
  specifications: Specification[];
  description: string;
  images: Images[];
  productSelectedId?: string | undefined;
  imagesToDelete: string[];
  originalImages: string[];
  setOriginalImages: (images: string[]) => void;
  setImagesToDelete: (images: string[]) => void;
  setProductSelectedId: (id:  string | undefined) => void;
  setGeneral: (data: ProductStore["general"]) => void;
  setSpecifications: (data: Specification[]) => void;
  setDescription: (desc: string) => void;
  setImages: (files: Images[]) => void;
  reset: () => void;
};

