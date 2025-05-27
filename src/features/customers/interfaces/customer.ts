import { Address,  User } from "@prisma/client";

export interface CustomerWithRelations extends User {
  Address: Address[];
  Order: {
    id: string;
    total: number;
    createdAt: Date;
  }[];
}

export interface CustomerSummary {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date | null;
  addressCount: number;
}
