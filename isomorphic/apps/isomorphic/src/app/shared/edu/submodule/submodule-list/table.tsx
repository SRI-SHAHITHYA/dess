'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { eduSubmodulesColumns } from './columns';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from '@/app/shared/ecommerce/category/category-list/filters';
import { submoduleService } from '@/services/submodule-service';
import { routes } from '@/config/routes';
import toast from 'react-hot-toast';
import { Loader } from 'rizzui';

export type EduSubmoduleDataType = {
  id: string;
  categoryId: number;
  name: string;
  description: string;
  image?: string;
  updatedAt?: string;
};

interface EduSubmoduleTableProps {
  categoryId: number;
}

export default function EduSubmoduleTable({ categoryId }: EduSubmoduleTableProps) {
  const router = useRouter();
  const [submodules, setSubmodules] = useState<EduSubmoduleDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubmodules = async () => {
    try {
      setIsLoading(true);
      const data = await submoduleService.getByCategoryId(categoryId);
      setSubmodules(data);
    } catch (error) {
      console.error('Error fetching submodules:', error);
      toast.error('Failed to load submodules');
      setSubmodules([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchSubmodules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleSubmoduleClick = (submodule: EduSubmoduleDataType) => {
    // Navigate to submodule topics
    router.push(routes.edu.submoduleTopics(submodule.id));
  };

  const handleDeleteRow = async (row: EduSubmoduleDataType) => {
    try {
      await submoduleService.delete(Number(row.id));
      setSubmodules((prev) => prev.filter((r) => r.id !== row.id));
      toast.success('Submodule deleted successfully');
    } catch (error) {
      console.error('Error deleting submodule:', error);
      toast.error('Failed to delete submodule');
    }
  };

  const handleMultipleDelete = async (rows: EduSubmoduleDataType[]) => {
    try {
      await Promise.all(rows.map((row) => submoduleService.delete(Number(row.id))));
      setSubmodules((prev) => prev.filter((r) => !rows.includes(r)));
      toast.success(`${rows.length} submodules deleted successfully`);
    } catch (error) {
      console.error('Error deleting submodules:', error);
      toast.error('Failed to delete submodules');
    }
  };

  const { table, setData } = useTanStackTable<EduSubmoduleDataType>({
    tableData: submodules,
    columnConfig: eduSubmodulesColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow,
        handleMultipleDelete,
        handleSubmoduleClick,
      },
      enableColumnResizing: false,
    },
  });

  // Update table data when submodules change
  useEffect(() => {
    if (submodules.length > 0) {
      setData(submodules);
    }
  }, [submodules, setData]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader variant="spinner" size="xl" />
      </div>
    );
  }

  return (
    <>
      <Filters table={table} />
      <Table
        table={table}
        variant="modern"
        classNames={{
          container: 'border border-muted rounded-md',
          rowClassName: 'last:border-0 cursor-pointer hover:bg-gray-50',
        }}
      />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
