import { routes } from '@/config/routes';
import EduModuleTable from '@/app/shared/edu/module/module-list/table';
import ModulePageHeader from './module-page-header';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Modules'),
};

const pageHeader = {
  title: 'Modules',
  breadcrumb: [
    {
      href: routes.edu.dashboard,
      name: 'Education',
    },
    {
      href: routes.edu.modules,
      name: 'Modules',
    },
    {
      name: 'List',
    },
  ],
};

export default function ModulesPage() {
  return (
    <>
      <ModulePageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      />
      <EduModuleTable />
    </>
  );
}
