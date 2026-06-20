import { ClothesDetailPageClient } from '@/modules/clothes/ui/components/clothes-detail-page-client'

interface ClothesDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ClothesDetailPage({
  params
}: ClothesDetailPageProps) {
  const { id } = await params

  return <ClothesDetailPageClient id={id} />
}
