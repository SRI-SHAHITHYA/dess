# Isomorphic Category List - Complete Style Reference

## 🎯 Overview
This document contains all the **Tailwind CSS classes** and **component patterns** used in the Isomorphic-styled category list. Use this as a reference to apply the same styling to other pages in your project.

---

## 📦 Required Dependencies

```json
{
  "@tanstack/react-table": "^8.21.2",
  "tailwindcss": "^3.4.17"
}
```

---

## 🎨 Complete Tailwind CSS Class Reference

### **1. PAGE LAYOUT**

```css
/* Main container */
.min-h-screen.bg-gray-50

/* Header section */
.bg-white.border-b.border-gray-200

/* Content wrapper */
.max-w-7xl.mx-auto.px-6.py-4
.max-w-7xl.mx-auto.px-6.py-6
```

---

### **2. HEADER & TITLE**

```jsx
{/* Page Title */}
<h1 className="text-2xl font-bold text-gray-900">
  Categories
</h1>

{/* Add Button */}
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
  + Add Category
</button>

{/* Breadcrumb */}
<div className="text-sm text-gray-500">
  <span className="cursor-pointer hover:text-blue-600">E-Commerce</span>
  <span className="mx-2">›</span>
  <span className="text-gray-900">List</span>
</div>
```

**Classes:**
```css
/* Title */
.text-2xl.font-bold.text-gray-900

/* Button */
.px-4.py-2.bg-blue-600.text-white.rounded-lg.hover:bg-blue-700.font-medium.transition-colors

/* Breadcrumb */
.text-sm.text-gray-500
.cursor-pointer.hover:text-blue-600
.mx-2
.text-gray-900
```

---

### **3. SEARCH BAR**

```jsx
{/* Search Container */}
<div className="flex items-center justify-between mb-4">

  {/* Search Input Wrapper */}
  <div className="relative flex-1 max-w-sm">

    {/* Search Icon */}
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <svg className="h-4 w-4 text-gray-400">...</svg>
    </div>

    {/* Input Field */}
    <input
      type="search"
      placeholder="Search by category name..."
      className="w-full h-9 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>

  {/* Toggle Button */}
  <button className="ml-4 inline-flex items-center justify-center h-9 w-9 border border-gray-300 rounded-lg hover:bg-gray-50">
    <svg className="h-4 w-4">...</svg>
  </button>
</div>
```

**Classes:**
```css
/* Container */
.flex.items-center.justify-between.mb-4

/* Search wrapper */
.relative.flex-1.max-w-sm

/* Icon wrapper */
.absolute.inset-y-0.left-0.flex.items-center.pl-3.pointer-events-none

/* Icon */
.h-4.w-4.text-gray-400

/* Input */
.w-full.h-9.pl-10.pr-4.border.border-gray-300.rounded-lg.focus:outline-none.focus:ring-2.focus:ring-blue-500.focus:border-transparent

/* Toggle button */
.ml-4.inline-flex.items-center.justify-center.h-9.w-9.border.border-gray-300.rounded-lg.hover:bg-gray-50
```

---

### **4. TABLE STRUCTURE**

```jsx
{/* Table Container */}
<div className="bg-white border border-gray-200 rounded-md overflow-hidden">

  {/* Table Wrapper */}
  <div className="overflow-x-auto">

    <table className="w-full">

      {/* Table Header */}
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            COLUMN NAME
          </th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="bg-white divide-y divide-gray-200">
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-4 py-4 whitespace-nowrap">
            Cell content
          </td>
        </tr>
      </tbody>

    </table>
  </div>
</div>
```

**Classes:**
```css
/* Table container */
.bg-white.border.border-gray-200.rounded-md.overflow-hidden

/* Table wrapper */
.overflow-x-auto

/* Table */
.w-full

/* Header row */
.bg-gray-50.border-b.border-gray-200

/* Header cell */
.px-4.py-3.text-left.text-xs.font-medium.text-gray-500.uppercase.tracking-wider

/* Body */
.bg-white.divide-y.divide-gray-200

/* Body row */
.hover:bg-gray-50.transition-colors

/* Body cell */
.px-4.py-4.whitespace-nowrap
```

---

### **5. TABLE CELL COMPONENTS**

#### **A. Checkbox Column**
```jsx
{/* Checkbox */}
<input
  type="checkbox"
  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
/>
```

**Classes:**
```css
.h-4.w-4.rounded.border-gray-300.text-blue-600.focus:ring-blue-500.cursor-pointer
```

#### **B. Image Column**
```jsx
{/* Image Wrapper */}
<figure className="relative aspect-square w-12 overflow-hidden rounded-lg bg-gray-100">
  <img
    alt="Category"
    src="image-url.jpg"
    className="h-full w-full object-cover"
  />
</figure>

{/* No Image Placeholder */}
<div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-xs font-medium">
  No Image
</div>
```

**Classes:**
```css
/* Image wrapper */
.relative.aspect-square.w-12.overflow-hidden.rounded-lg.bg-gray-100

/* Image */
.h-full.w-full.object-cover

/* Placeholder */
.flex.h-full.w-full.items-center.justify-center.bg-gray-200.text-gray-400.text-xs.font-medium
```

#### **C. Text Columns**
```jsx
{/* Category Name (clickable) */}
<button className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
  Category Name
</button>

{/* Regular Text */}
<h6 className="text-sm font-medium text-gray-900">
  Title
</h6>

{/* Description (truncated) */}
<p className="truncate text-sm text-gray-600 max-w-xs">
  Long description text...
</p>

{/* Secondary text */}
<span className="text-sm text-gray-700">
  Slug or metadata
</span>
```

**Classes:**
```css
/* Clickable name */
.text-sm.font-medium.text-blue-600.hover:text-blue-800.hover:underline

/* Title */
.text-sm.font-medium.text-gray-900

/* Description */
.truncate.text-sm.text-gray-600.max-w-xs

/* Secondary */
.text-sm.text-gray-700
```

#### **D. Badge/Status Column**
```jsx
{/* Type Badge */}
<span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
  Standalone
</span>

{/* Status Badge (clickable) */}
<button className="px-3 py-1 rounded-md text-xs font-medium capitalize bg-green-100 text-green-700 hover:opacity-80 transition-opacity">
  active
</button>
```

**Classes:**
```css
/* Badge */
.px-2.py-1.text-xs.font-medium.rounded

/* Color variants */
.bg-blue-100.text-blue-700    /* Standalone */
.bg-purple-100.text-purple-700 /* Module-based */
.bg-green-100.text-green-700   /* Active */
.bg-red-100.text-red-700       /* Inactive */
.bg-yellow-100.text-yellow-700 /* Draft */

/* Clickable status */
.px-3.py-1.rounded-md.text-xs.font-medium.capitalize.hover:opacity-80.transition-opacity
```

#### **E. Action Buttons Column**
```jsx
{/* Actions Container */}
<div className="flex items-center justify-end gap-3 pe-4">

  {/* Edit Button */}
  <button
    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
    title="Edit Category"
  >
    <svg className="h-4 w-4">...</svg>
  </button>

  {/* Delete Button */}
  <button
    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-300 bg-white text-red-600 hover:bg-red-50 transition-colors"
    title="Delete Category"
  >
    <svg className="h-4 w-4">...</svg>
  </button>
</div>
```

**Classes:**
```css
/* Container */
.flex.items-center.justify-end.gap-3.pe-4

/* Edit button */
.inline-flex.h-8.w-8.items-center.justify-center.rounded-md.border.border-gray-300.bg-white.text-gray-700.hover:bg-gray-50.transition-colors

/* Delete button */
.inline-flex.h-8.w-8.items-center.justify-center.rounded-md.border.border-red-300.bg-white.text-red-600.hover:bg-red-50.transition-colors

/* Icon */
.h-4.w-4
```

---

### **6. PAGINATION FOOTER**

```jsx
{/* Pagination Container */}
<div className="px-6 py-4 border-t border-gray-200 bg-gray-50">

  {/* Flex wrapper */}
  <div className="flex items-center justify-between">

    {/* Rows per page */}
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">Rows per page</span>
      <select className="h-8 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>

    {/* Pagination controls */}
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-700">Page 1 of 5</span>

      <div className="flex gap-1">
        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          <svg className="h-4 w-4">...</svg>
        </button>
      </div>
    </div>
  </div>
</div>
```

**Classes:**
```css
/* Footer container */
.px-6.py-4.border-t.border-gray-200.bg-gray-50

/* Flex wrapper */
.flex.items-center.justify-between

/* Section wrapper */
.flex.items-center.gap-2

/* Label */
.text-sm.text-gray-700

/* Select dropdown */
.h-8.px-3.border.border-gray-300.rounded-md.text-sm.focus:outline-none.focus:ring-2.focus:ring-blue-500.bg-white

/* Button container */
.flex.gap-1

/* Pagination button */
.inline-flex.h-8.w-8.items-center.justify-center.rounded-md.border.border-gray-300.bg-white.hover:bg-gray-50.disabled:opacity-50.disabled:cursor-not-allowed.transition-colors
```

---

### **7. LOADING & EMPTY STATES**

```jsx
{/* Loading State */}
<div className="flex items-center justify-center h-64">
  <div className="text-gray-500">Loading categories...</div>
</div>

{/* Empty State */}
<div className="flex items-center justify-center h-64">
  <div className="text-center">
    <p className="text-gray-500 mb-4">No categories found</p>
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
      Create First Category
    </button>
  </div>
</div>
```

**Classes:**
```css
/* Container */
.flex.items-center.justify-center.h-64

/* Message */
.text-gray-500

/* Empty state wrapper */
.text-center

/* Empty message */
.text-gray-500.mb-4
```

---

## 🔧 React Table Integration

### **Basic Setup**

```jsx
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

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
```

### **Column Definitions**

```jsx
const columns = useMemo(
  () => [
    {
      id: 'select',
      size: 50,
      header: ({ table }) => (/* Checkbox */),
      cell: ({ row }) => (/* Checkbox */),
    },
    {
      accessorKey: 'image_url',
      size: 100,
      header: 'IMAGE',
      cell: ({ row }) => (/* Image */),
    },
    {
      accessorKey: 'name',
      size: 200,
      header: 'CATEGORY NAME',
      cell: ({ getValue }) => (/* Name */),
    },
  ],
  [dependencies]
);
```

---

## 📋 Quick Copy - Most Used Classes

### **Layout & Structure**
```css
min-h-screen bg-gray-50
bg-white border-b border-gray-200
max-w-7xl mx-auto px-6 py-4
flex items-center justify-between
```

### **Typography**
```css
text-2xl font-bold text-gray-900       /* Page title */
text-sm font-medium text-gray-700      /* Labels */
text-xs font-medium uppercase          /* Table headers */
text-sm text-gray-600                  /* Body text */
```

### **Buttons**
```css
/* Primary */
px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors

/* Icon button */
inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors

/* Delete button */
inline-flex h-8 w-8 items-center justify-center rounded-md border border-red-300 bg-white text-red-600 hover:bg-red-50 transition-colors
```

### **Form Inputs**
```css
w-full h-9 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
```

### **Table**
```css
bg-white border border-gray-200 rounded-md overflow-hidden   /* Container */
w-full                                                        /* Table */
bg-gray-50 border-b border-gray-200                          /* Header */
bg-white divide-y divide-gray-200                            /* Body */
hover:bg-gray-50 transition-colors                           /* Row hover */
px-4 py-4 whitespace-nowrap                                  /* Cell */
```

### **Images**
```css
relative aspect-square w-12 overflow-hidden rounded-lg bg-gray-100   /* Wrapper */
h-full w-full object-cover                                            /* Image */
```

### **Badges**
```css
px-2 py-1 text-xs font-medium rounded                               /* Base */
bg-blue-100 text-blue-700                                           /* Blue */
bg-green-100 text-green-700                                         /* Green */
bg-red-100 text-red-700                                             /* Red */
```

---

## 🎨 Color Palette

### **Grays**
```css
.bg-gray-50    /* Page background, table header */
.bg-gray-100   /* Image placeholder */
.bg-gray-200   /* Border, no image state */
.text-gray-400 /* Icons */
.text-gray-500 /* Secondary text */
.text-gray-600 /* Body text */
.text-gray-700 /* Labels */
.text-gray-900 /* Headings */
```

### **Blue (Primary)**
```css
.bg-blue-600     /* Primary buttons */
.bg-blue-700     /* Button hover */
.text-blue-600   /* Links */
.text-blue-800   /* Link hover */
.bg-blue-100     /* Badge background */
.text-blue-700   /* Badge text */
```

### **Status Colors**
```css
/* Green (Active) */
.bg-green-100 .text-green-700

/* Red (Inactive/Delete) */
.bg-red-100 .text-red-700
.border-red-300 .text-red-600
.hover:bg-red-50

/* Yellow (Draft) */
.bg-yellow-100 .text-yellow-700

/* Purple (Module-based) */
.bg-purple-100 .text-purple-700
```

---

## 🚀 Usage Example

To apply these styles to a new list page:

1. **Install dependencies**: `npm install @tanstack/react-table`
2. **Copy the column definitions** structure
3. **Use the table classes** from this reference
4. **Apply pagination footer** with classes
5. **Style action buttons** with the provided classes

---

## 📝 Notes

- All transitions use `transition-colors` for smooth state changes
- Hover states are consistent: `hover:bg-gray-50` for rows, `hover:bg-blue-700` for blue buttons
- Focus states use `focus:ring-2 focus:ring-blue-500`
- Disabled states use `disabled:opacity-50 disabled:cursor-not-allowed`
- Use `whitespace-nowrap` to prevent text wrapping in table cells
- Use `truncate` with `max-w-xs` for long descriptions

---

**Created for:** Online Learning Platform
**Date:** December 2025
**Framework:** React + Tailwind CSS + React Table
