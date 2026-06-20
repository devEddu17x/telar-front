import { OrderDetailPageClient } from '@/modules/orders/ui/components/order-detail-page-client'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({
  params
}: OrderDetailPageProps) {
  const { id } = await params

  return <OrderDetailPageClient id={id} />
}
