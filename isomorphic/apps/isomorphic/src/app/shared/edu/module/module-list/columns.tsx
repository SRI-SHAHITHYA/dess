'use client';

import DeletePopover from '@core/components/delete-popover';
import { routes } from '@/config/routes';
import PencilIcon from '@core/components/icons/pencil';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { ActionIcon, Checkbox, Text, Title, Tooltip } from 'rizzui';
import { EduModuleDataType } from './table';

const columnHelper = createColumnHelper<EduModuleDataType>();

export const eduModulesColumns = [
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
    header: 'Module Name',
    cell: ({ getValue }) => (
      <Title as="h6" className="!text-sm font-medium">
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
        if (typeof window === 'undefined') return html; // Server-side fallback
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
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
        <Tooltip content={'Edit Module'} placement="top" color="invert">
          <Link href={routes.edu.editModule(row.original.id)}>
            <ActionIcon size="sm" variant="outline">
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the module`}
          description={`Are you sure you want to delete this #${row.original.id} module?`}
          onDelete={() => meta?.handleDeleteRow?.(row.original)}
        />
      </div>
    ),
  }),
];
