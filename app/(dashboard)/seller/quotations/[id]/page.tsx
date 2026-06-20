import { QuotationDetailPageClient } from '@/modules/quotations/ui/components/quotation-detail-page-client'

interface QuotationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function SellerQuotationDetailPage({
  params
}: QuotationDetailPageProps) {
  const { id } = await params

  return (
    <QuotationDetailPageClient
      id={id}
      homePath='/seller'
      basePath='/seller/quotations'
      ordersBasePath='/seller/orders'
    />
  )
}
