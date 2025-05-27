import { Prisma } from "@prisma/client";

export type OrderWithRelations = Prisma.OrderGetPayload<{
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