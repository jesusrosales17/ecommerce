import { redirect } from "next/navigation";
import { getSession } from "@/libs/auth/auth";
import prisma from "@/libs/prisma";
import { AddressList } from "@/features/addresses/components/AddressList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function AddressesPage({
  searchParams,
}: {
  searchParams: { checkout?: string };
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/addresses");
  }

  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      isDefault: "desc",
    },
  });
  const isFromCheckout = searchParams.checkout === "true";

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mis direcciones</h1>
        {isFromCheckout && (
          <Button variant="outline" asChild>
            <Link href="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al carrito
            </Link>
          </Button>
        )}
      </div>
      <AddressList addresses={addresses} />
    </div>
  );
}
