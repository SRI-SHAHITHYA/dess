'use client';

import { useEffect, useState } from 'react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { eduModulesColumns } from './columns';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from '@/app/shared/ecommerce/category/category-list/filters';
import { moduleService } from '@/services/module-service';
import toast from 'react-hot-toast';
import { Loader } from 'rizzui';

export type EduModuleDataType = {
  id: string;
  categoryId: number;
  name: string;
  description: string;
  image?: string;
  updatedAt?: string;
};

interface EduModuleTableProps {
  categoryId: number;
}

export default function EduModuleTable({ categoryId }: EduModuleTableProps) {
  const [modules, setModules] = useState<EduModuleDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      const data = await moduleService.getByCategoryId(categoryId);
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to load modules');
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchModules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleDeleteRow = async (row: EduModuleDataType) => {
    try {
      await moduleService.delete(Number(row.id));
      setModules((prev) => prev.filter((r) => r.id !== row.id));
      toast.success('Module deleted successfully');
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    }
  };

  const handleMultipleDelete = async (rows: EduModuleDataType[]) => {
    try {
      await Promise.all(rows.map((row) => moduleService.delete(Number(row.id))));
      setModules((prev) => prev.filter((r) => !rows.includes(r)));
      toast.success(`${rows.length} modules deleted successfully`);
    } catch (error) {
      console.error('Error deleting modules:', error);
      toast.error('Failed to delete modules');
    }
  };

  const { table, setData } = useTanStackTable<EduModuleDataType>({
    tableData: modules,
    columnConfig: eduModulesColumns,
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
      },
      enableColumnResizing: false,
    },
  });

  // Update table data when modules change
  useEffect(() => {
    if (modules.length > 0) {
      setData(modules);
    }
  }, [modules, setData]);

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
          rowClassName: 'last:border-0',
        }}
      />
      <TableFooter table={table} />
      <TablePagination table={table} className="py-4" />
    </>
  );
}
