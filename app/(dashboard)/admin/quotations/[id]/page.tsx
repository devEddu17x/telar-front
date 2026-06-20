import { QuotationDetailPageClient } from '@/modules/quotations/ui/components/quotation-detail-page-client'

interface QuotationDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function QuotationDetailPage({
  params
}: QuotationDetailPageProps) {
  const { id } = await params

  return <QuotationDetailPageClient id={id} />
}
