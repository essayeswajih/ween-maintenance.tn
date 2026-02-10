// page.tsx (server)
import EditArticleClient from './EditArticleClient';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditArticleClient blogId={id} />;
}
