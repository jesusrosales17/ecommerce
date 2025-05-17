
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
    id?: string,
    name: string;
    stock: number;
    status: "ACTIVE" | "INACTIVE" | "DELETED";
    price?: number | undefined;
    isOnSale?: boolean | undefined;
    salePrice?: number | undefined;
    isFeatured?: boolean | undefined;
    categoryId?: string | undefined;
  };
  specifications: Specification[];
  description: string;
  images: Images[];
  setGeneral: (data: ProductStore["general"]) => void;
  setSpecifications: (data: Specification[]) => void;
  setDescription: (desc: string) => void;
  setImages: (files: Images[]) => void;
  reset: () => void;
};

