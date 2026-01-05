'use client';

import { useEffect, useState } from 'react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { eduTopicsListColumns } from './columns';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from '@/app/shared/ecommerce/category/category-list/filters';
import { topicService } from '@/services/topic-service';
import toast from 'react-hot-toast';
import { Loader } from 'rizzui';

export type EduTopicsDataType = {
  id: string;
  moduleId?: number;
  submoduleId?: number;
  name: string;
  content: string;
  image?: string;
  updatedAt?: string;
};

interface EduTopicsTableProps {
  moduleId?: number;
  submoduleId?: number;
}

export default function EduTopicsTable({ moduleId, submoduleId }: EduTopicsTableProps) {
  const [topics, setTopics] = useState<EduTopicsDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      let data;
      if (moduleId) {
        data = await topicService.getByModuleId(moduleId);
      } else if (submoduleId) {
        data = await topicService.getBySubmoduleId(submoduleId);
      } else {
        data = [];
      }
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
      setTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId || submoduleId) {
      fetchTopics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, submoduleId]);

  const handleDeleteRow = async (row: EduTopicsDataType) => {
    try {
      await topicService.delete(Number(row.id));
      setTopics((prev) => prev.filter((r) => r.id !== row.id));
      toast.success('Topic deleted successfully');
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast.error('Failed to delete topic');
    }
  };

  const handleMultipleDelete = async (rows: EduTopicsDataType[]) => {
    try {
      await Promise.all(rows.map((row) => topicService.delete(Number(row.id))));
      setTopics((prev) => prev.filter((r) => !rows.includes(r)));
      toast.success(`${rows.length} topics deleted successfully`);
    } catch (error) {
      console.error('Error deleting topics:', error);
      toast.error('Failed to delete topics');
    }
  };

  const { table, setData } = useTanStackTable<EduTopicsDataType>({
    tableData: topics,
    columnConfig: eduTopicsListColumns,
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

  // Update table data when topics change
  useEffect(() => {
    if (topics.length > 0) {
      setData(topics);
    }
  }, [topics, setData]);

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
