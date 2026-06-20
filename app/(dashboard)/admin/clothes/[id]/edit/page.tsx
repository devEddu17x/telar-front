import { EditClothesPageClient } from '@/modules/clothes/ui/components/edit-clothes-page-client'

interface EditClothesPageProps {
  params: Promise<{ id: string }>
}

export default async function EditClothesPage({
  params
}: EditClothesPageProps) {
  const { id } = await params

  return <EditClothesPageClient id={id} />
}
