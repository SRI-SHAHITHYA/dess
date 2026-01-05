import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { getCategories, deleteCategory, updateCategory } from '../services/api.js';
import { getModulesByCategory } from '../services/moduleService.js';

export default function CategoryListPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category) => {
    // Check if category has children based on type
    try {
      if (category.type === 'Standalone') {
        const modules = await getModulesByCategory(category.category_id);
        if (modules && modules.length > 0) {
          alert(
            `Cannot delete "${category.name}" because it has ${modules.length} module(s). Please delete them first.`
          );
          return;
        }
      } else {
        const response = await fetch(`http://localhost:3000/api/submodules/category/${category.category_id}`, {
          credentials: 'include'
        });
        const result = await response.json();
        const submodules = result.data || result || [];

        if (submodules && submodules.length > 0) {
          alert(
            `Cannot delete "${category.name}" because it has ${submodules.length} submodule(s). Please delete them first.`
          );
          return;
        }
      }
    } catch (error) {
      console.error('Error checking children:', error);
    }

    if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      await deleteCategory(category.category_id);
      setCategories((prev) => prev.filter((cat) => cat.category_id !== category.category_id));
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete category');
    }
  };

  const handleViewClick = (category) => {
    if (category.type === 'Standalone') {
      navigate(`/category/${category.category_id}/modules`, {
        state: { category }
      });
    } else {
      navigate(`/category/${category.category_id}/submodules`, {
        state: { category }
      });
    }
  };

  const handleStatusChange = async (category, newStatus) => {
    try {
      await updateCategory(category.category_id, { status: newStatus });
      await fetchCategories();
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status');
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusCycle = ['draft', 'active', 'inactive'];
    const currentIndex = statusCycle.indexOf(currentStatus || 'draft');
    return statusCycle[(currentIndex + 1) % statusCycle.length];
  };

  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 50,
      },
      {
        accessorKey: 'image_url',
        header: 'IMAGE',
        cell: ({ row }) => (
          <figure className="relative aspect-square w-12 overflow-hidden rounded-lg bg-gray-100">
            {row.original.image_url ? (
              <img
                alt={row.original.name}
                src={row.original.image_url}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-xs font-medium">
                No Image
              </div>
            )}
          </figure>
        ),
        size: 100,
      },
      {
        accessorKey: 'name',
        header: 'CATEGORY NAME',
        cell: ({ row }) => (
          <button
            onClick={() => handleViewClick(row.original)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {row.original.name}
          </button>
        ),
        size: 200,
      },
      {
        accessorKey: 'type',
        header: 'TYPE',
        cell: ({ getValue }) => (
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            getValue() === 'Standalone'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
          }`}>
            {getValue()}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: 'description',
        header: 'DESCRIPTION',
        cell: ({ getValue }) => {
          // Strip HTML tags from description
          const stripHtml = (html) => {
            if (!html) return 'No description';
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || 'No description';
          };

          return (
            <p className="truncate text-sm text-gray-600 max-w-xs">
              {stripHtml(getValue())}
            </p>
          );
        },
        size: 300,
      },
      {
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) => {
          const status = row.original.status || 'draft';
          const statusColors = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-red-100 text-red-700',
            draft: 'bg-yellow-100 text-yellow-700',
          };

          return (
            <button
              onClick={() => handleStatusChange(row.original, getNextStatus(status))}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${statusColors[status]} hover:opacity-80 transition-opacity`}
              title={`Click to change status (Current: ${status})`}
            >
              {status}
            </button>
          );
        },
        size: 120,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-3 pe-4">
            {/* Edit Button */}
            <button
              onClick={() => navigate(`/category/${row.original.category_id}/edit`, {
                state: { category: row.original }
              })}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              title="Edit Category"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(row.original)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-300 bg-white text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Category"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ),
        size: 120,
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data: categories,
    columns,
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <button
              onClick={() => navigate('/category/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              + Add Category
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            <span className="cursor-pointer hover:text-blue-600">E-Commerce</span>
            <span className="mx-2">›</span>
            <span className="cursor-pointer hover:text-blue-600">Categories</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">List</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search & Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search by category name..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full h-9 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button className="ml-4 inline-flex items-center justify-center h-9 w-9 border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading categories...</div>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-4">No categories found</p>
                <button
                  onClick={() => navigate('/category/add')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Create First Category
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            style={{ width: header.getSize() }}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-4 whitespace-nowrap"
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  {/* Rows per page */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Rows per page</span>
                    <select
                      value={table.getState().pagination.pageSize}
                      onChange={(e) => table.setPageSize(Number(e.target.value))}
                      className="h-8 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {[10, 20, 30, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">
                      Page {table.getState().pagination.pageIndex + 1} of{' '}
                      {table.getPageCount()}
                    </span>

                    <div className="flex gap-1">
                      <button
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
