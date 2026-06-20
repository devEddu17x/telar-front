import { EditQuotationPageClient } from '@/modules/quotations/ui/components/edit-quotation-page-client'

interface EditQuotationPageProps {
  params: Promise<{ id: string }>
}

export default async function EditQuotationPage({
  params
}: EditQuotationPageProps) {
  const { id } = await params

  return <EditQuotationPageClient id={id} />
}
