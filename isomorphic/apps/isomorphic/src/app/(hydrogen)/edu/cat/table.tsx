'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { eduCategoriesColumns } from './columns';
import TableFooter from '@core/components/table/footer';
import TablePagination from '@core/components/table/pagination';
import Filters from '@/app/shared/ecommerce/category/category-list/filters';
import { routes } from '@/config/routes';
import { categoryService } from '@/services/category-service';
import { moduleService } from '@/services/module-service';
import { submoduleService } from '@/services/submodule-service';
import toast from 'react-hot-toast';

export type EduCategoryDataType = {
  id: string;
  name: string;
  description: string;
  type: 'standalone' | 'module-based';
  image?: string;
  status: 'active' | 'inactive' | 'draft';
};

export default function EduCategoryTable() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<EduCategoryDataType[]>([]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: EduCategoryDataType) => {
    if (category.type === 'standalone') {
      // Standalone: Go directly to topics
      router.push(routes.edu.categoryTopics(category.id));
    } else {
      // Module-based: Go to submodules first
      router.push(routes.edu.categorySubmodules(category.id));
    }
  };

  const handleDeleteRow = async (row: EduCategoryDataType) => {
    // Check if category has children before deleting
    try {
      if (row.type === 'standalone') {
        // Standalone categories: Check for modules
        const modules = await moduleService.getByCategoryId(Number(row.id));
        if (modules && modules.length > 0) {
          toast.error(
            `Cannot delete "${row.name}" because it has ${modules.length} module(s). Please delete them first.`
          );
          return;
        }
      } else {
        // Module-based categories: Check for submodules
        const submodules = await submoduleService.getByCategoryId(Number(row.id));
        if (submodules && submodules.length > 0) {
          toast.error(
            `Cannot delete "${row.name}" because it has ${submodules.length} submodule(s). Please delete them first.`
          );
          return;
        }
      }
    } catch (error) {
      console.error('Error checking children:', error);
    }

    // Proceed with deletion
    try {
      await categoryService.delete(Number(row.id));
      setCategories((prev) => prev.filter((r) => r.id !== row.id));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  const handleMultipleDelete = async (rows: EduCategoryDataType[]) => {
    try {
      await Promise.all(rows.map((row) => categoryService.delete(Number(row.id))));
      setCategories((prev) => prev.filter((r) => !rows.includes(r)));
      toast.success(`${rows.length} categories deleted successfully`);
    } catch (error) {
      console.error('Error deleting categories:', error);
      toast.error('Failed to delete categories');
    }
  };

  const handleStatusChange = async (id: string, status: 'active' | 'inactive' | 'draft') => {
    try {
      await categoryService.updateStatus(Number(id), status);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, status } : cat))
      );
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const { table, setData } = useTanStackTable<EduCategoryDataType>({
    tableData: categories,
    columnConfig: eduCategoriesColumns,
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
        handleCategoryClick,
        handleStatusChange,
      },
      enableColumnResizing: false,
    },
  });

  // Update table data when categories change
  useEffect(() => {
    if (categories.length > 0) {
      setData(categories);
    }
  }, [categories, setData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading categories...</div>
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
