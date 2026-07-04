import { notFound } from "next/navigation";

import { OrderForm } from "@/components/site/order-form";
import { getPublicProductBySlug } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function ProductOrderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="container-shell py-8 md:py-10">
      <OrderForm product={product} />
    </main>
  );
}
