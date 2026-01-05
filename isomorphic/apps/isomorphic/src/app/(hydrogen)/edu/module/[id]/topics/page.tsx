import { metaObject } from '@/config/site.config';
import ModuleTopicsView from './module-topics-view';

export const metadata = {
  ...metaObject('Topics'),
};

export default function ModuleTopicsPage({ params }: { params: { id: string } }) {
  return <ModuleTopicsView moduleId={params.id} />;
}
