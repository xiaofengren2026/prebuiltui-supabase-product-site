import { ProductForm } from "@/components/admin/product-form";

export default function AdminNewProductPage() {
  return (
    <div className="grid gap-6">
      <section className="section-card px-6 py-6">
        <h2 className="font-serif text-2xl text-foreground">新增产品</h2>
        <p className="mt-3 text-sm leading-7 text-foreground-muted">
          填完产品信息、上传图片、设置上架状态后，前台会自动读取并显示。
        </p>
      </section>
      <ProductForm mode="create" />
    </div>
  );
}
