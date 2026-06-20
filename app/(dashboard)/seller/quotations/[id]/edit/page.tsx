import { EditQuotationPageClient } from '@/modules/quotations/ui/components/edit-quotation-page-client'

interface EditQuotationPageProps {
  params: Promise<{ id: string }>
}

export default async function SellerEditQuotationPage({
  params
}: EditQuotationPageProps) {
  const { id } = await params

  return (
    <EditQuotationPageClient
      id={id}
      homePath='/seller'
      basePath='/seller/quotations'
    />
  )
}
