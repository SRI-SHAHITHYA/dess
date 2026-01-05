'use client';

import DeletePopover from '@core/components/delete-popover';
import { routes } from '@/config/routes';
import PencilIcon from '@core/components/icons/pencil';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { ActionIcon, Checkbox, Text, Title, Tooltip } from 'rizzui';
import { EduSubmoduleDataType } from './table';

const columnHelper = createColumnHelper<EduSubmoduleDataType>();

export const eduSubmodulesColumns = [
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
          src={row.original.image || '/placeholder.png'}
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
    header: 'Submodule Name',
    cell: ({ getValue, row, table: { options: { meta } } }) => (
      <Title
        as="h6"
        className="!text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
        onClick={() => meta?.handleSubmoduleClick?.(row.original)}
      >
        {getValue()}
      </Title>
    ),
  }),
  columnHelper.display({
    id: 'description',
    size: 350,
    header: 'Description',
    cell: ({ row }) => {
      // Strip HTML tags from description
      const stripHtml = (html: string) => {
        if (!html) return '';
        // Decode common HTML entities
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
        <Tooltip content={'Edit Submodule'} placement="top" color="invert">
          <Link href={`/edu/submodule/${row.original.id}/edit`}>
            <ActionIcon size="sm" variant="outline">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the submodule`}
          description={`Are you sure you want to delete this #${row.original.id} submodule?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
        />
      </div>
    ),
  }),
];
