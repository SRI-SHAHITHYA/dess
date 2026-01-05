import SubmodulesListPage from './submodules-list';

export default async function CategorySubmodulesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SubmodulesListPage categoryId={Number(id)} />;
}
