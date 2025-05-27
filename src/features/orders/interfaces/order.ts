import { Prisma } from "@prisma/client";

// Original Prisma type
type PrismaOrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    User: {
      select: {
        name: true;
        email: true;
      };
    };
    Address: true;
    items: {
      include: {
        Product: {
          select: {
            id: true;
            name: true;
            images: {
              where: {
                isPrincipal: true;
              };
              take: 1;
            };
          };
        };
      };
    };
  };
}>;

// Serializable version for client components where Decimals are converted to strings
export type OrderWithRelations = Omit<PrismaOrderWithRelations, 'total' | 'items'> & {
  total: string;
  items: Array<Omit<PrismaOrderWithRelations['items'][0], 'price'> & {
    price: string;
  }>;
};