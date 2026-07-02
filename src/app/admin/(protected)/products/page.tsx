import Link from "next/link";

import { ProductsTable } from "@/components/admin/products-table";
import { EmptyState } from "@/components/shared/empty-state";
import { getAdminProducts } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  if (products.length === 0) {
    return (
      <div className="grid gap-6">
        <EmptyState
          title="还没有产品"
          description="点击“新增产品”后，填写产品信息并上传图片，首页就可以开始展示。"
        />
        <div>
          <Link href="/admin/products/new" className="primary-button">
            新增第一个产品
          </Link>
        </div>
      </div>
    );
  }

  return <ProductsTable initialProducts={products} />;
}
