'use client';

import React from 'react';
import Link from 'next/link';
import PageHeader from '@/app/shared/page-header';
import { Button } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import { routes } from '@/config/routes';

type PageHeaderTypes = {
  title: string;
  breadcrumb: { name: string; href?: string }[];
  className?: string;
};

export default function ModulePageHeader({
  title,
  breadcrumb,
  className,
}: PageHeaderTypes) {
  return (
    <>
      <PageHeader title={title} breadcrumb={breadcrumb} className={className}>
        <Link
          href={routes.edu.createModule}
          className="mt-4 w-full @lg:mt-0 @lg:w-auto"
        >
          <Button as="span" className="w-full @lg:w-auto">
            <PiPlusBold className="me-1 h-4 w-4" />
            Add Module
          </Button>
        </Link>
      </PageHeader>
    </>
  );
}
