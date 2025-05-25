import { Address } from "@prisma/client";

export type AddressData = Omit<
  Address,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export interface AddressForm extends Omit<AddressData, "isDefault"> {
  isDefault?: boolean;
}
