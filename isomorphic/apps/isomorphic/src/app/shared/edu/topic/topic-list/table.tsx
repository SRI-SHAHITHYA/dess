'use client';

import { useEffect, useState } from 'react';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { eduTopicsColumns } from './columns';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from '@/app/shared/ecommerce/category/category-list/filters';
import toast from 'react-hot-toast';
import { Loader } from 'rizzui';
import { topicService } from '@/services/topic-service';

export type EduTopicDataType = {
  id: string;
  topic_id: number;
  module_id?: number;
  submodule_id?: number;
  name: string;
  content: string;
  image_url?: string;
  status: 'active' | 'inactive' | 'draft';
};

export default function EduTopicTable() {
  const [topics, setTopics] = useState<EduTopicDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const topicsData = await topicService.getAll();
      
      const transformedData = topicsData.map((topic) => ({
        id: topic.id,
        topic_id: Number(topic.id),
        module_id: topic.moduleId,
        submodule_id: topic.submoduleId,
        name: topic.name,
        content: topic.content,
        image_url: topic.image,
        status: 'active' as const,
      }));
      setTopics(transformedData);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setIsLoading(false);
    }
  };

  const { table, setData } = useTanStackTable<EduTopicDataType>({
    tableData: topics,
    columnConfig: eduTopicsColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {
        handleDeleteRow: (row) => {
          setData((prev) => prev.filter((r) => r.id !== row.id));
        },
        handleMultipleDelete: (rows) => {
          setData((prev) => prev.filter((r) => !rows.includes(r)));
        },
      },
      enableColumnResizing: false,
    },
  });

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
