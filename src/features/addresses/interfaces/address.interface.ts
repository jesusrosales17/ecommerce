import { Address } from "@prisma/client";

export type AddressData = Omit<
  Address,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export interface AddressForm {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  reference: string;
  isDefault: boolean;
}
