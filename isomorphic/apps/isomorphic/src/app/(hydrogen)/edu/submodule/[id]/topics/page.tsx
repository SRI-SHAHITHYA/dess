import { metaObject } from '@/config/site.config';
import SubmoduleTopicsView from './submodule-topics-view';

export const metadata = {
  ...metaObject('Topics'),
};

export default function SubmoduleTopicsPage({ params }: { params: { id: string } }) {
  return <SubmoduleTopicsView submoduleId={params.id} />;
}
