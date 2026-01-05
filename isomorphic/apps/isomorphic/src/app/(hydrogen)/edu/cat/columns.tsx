'use client';

import DeletePopover from '@core/components/delete-popover';
import { routes } from '@/config/routes';
import PencilIcon from '@core/components/icons/pencil';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { ActionIcon, Badge, Checkbox, Text, Title, Tooltip } from 'rizzui';
import { EduCategoryDataType } from './table';
import { StatusSelect } from '@core/components/table-utils/status-select';

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Draft', value: 'draft' },
];

const columnHelper = createColumnHelper<EduCategoryDataType>();

export const eduCategoriesColumns = [
  columnHelper.display({
    id: 'checked',
    size: 50,
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        className="ps-3.5"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
  columnHelper.display({
    id: 'image',
    size: 100,
    header: 'Image',
    cell: ({ row }) => (
      <figure className="relative aspect-square w-12 overflow-hidden rounded-lg bg-gray-100">
        <Image
          alt={row.original.name}
          src={row.original.image}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-cover"
        />
      </figure>
    ),
  }),
  columnHelper.accessor('name', {
    id: 'name',
    size: 200,
    header: 'Category Name',
    cell: ({ getValue, row, table: { options: { meta } } }) => (
      <Title
        as="h6"
        className="!text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
        onClick={() => meta?.handleCategoryClick?.(row.original)}
      >
        {getValue()}
      </Title>
    ),
  }),
  columnHelper.display({
    id: 'description',
    size: 250,
    header: 'Description',
    cell: ({ row }) => {
      // Strip HTML tags and decode HTML entities from description
      const stripHtml = (html: string) => {
        if (!html) return '';

        // Decode common HTML entities using regex (works in SSR and client)
        let decoded = html
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&#x2F;/g, '/');

        // Remove all HTML tags
        return decoded.replace(/<[^>]*>/g, '').trim();
      };
      const cleanDesc = stripHtml(row.original.description || '');
      return <Text className="truncate !text-sm">{cleanDesc || 'No description'}</Text>;
    },
  }),
  columnHelper.accessor('type', {
    id: 'type',
    size: 200,
    header: 'Type',
    cell: ({ getValue }) => {
      const type = getValue();
      // Display capitalized version for better UX
      const displayType = type === 'module-based' ? 'Module-based' : 'Standalone';
      return (
        <Badge
          variant="flat"
          color={type === 'module-based' ? 'info' : 'secondary'}
        >
          {displayType}
        </Badge>
      );
    },
  }),
  columnHelper.accessor('status', {
    id: 'status',
    size: 150,
    header: 'Status',
    enableSorting: false,
    cell: ({ row, table: { options: { meta } } }) => (
      <StatusSelect
        selectItem={row.original.status}
        options={statusOptions}
        onChange={(value) => meta?.handleStatusChange?.(row.original.id, value as 'active' | 'inactive' | 'draft')}
      />
    ),
  }),
  columnHelper.display({
    id: 'action',
    size: 100,
    cell: ({
      row,
      table: {
        options: { meta },
      },
    }) => (
      <div className="flex items-center justify-end gap-3 pe-4">
        <Tooltip content={'Edit Category'} placement="top" color="invert">
          <Link href={routes.edu.editCategory(row.original.id)}>
            <ActionIcon size="sm" variant="outline">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the category`}
          description={`Are you sure you want to delete this #${row.original.id} category?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
        />
      </div>
    ),
  }),
];
