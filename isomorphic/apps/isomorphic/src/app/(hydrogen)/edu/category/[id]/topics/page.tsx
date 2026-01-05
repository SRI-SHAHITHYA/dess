import TopicsListPage from './topics-list';

export default async function CategoryTopicsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TopicsListPage categoryId={Number(id)} />;
}
