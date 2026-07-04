import { OrdersTable } from "@/components/admin/orders-table";
import { getAdminOrders } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return <OrdersTable initialOrders={orders} />;
}
