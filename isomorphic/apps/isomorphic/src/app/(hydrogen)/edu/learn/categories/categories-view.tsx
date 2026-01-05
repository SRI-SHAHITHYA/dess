'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { categoriesAPI } from '@/services/api';
import { routes } from '@/config/routes';
import { Title, Text, Button, Loader } from 'rizzui';
import { PiBookOpenTextBold, PiStackBold } from 'react-icons/pi';
import toast from 'react-hot-toast';

interface Category {
  category_id: number;
  name: string;
  description: string;
  type: 'Standalone' | 'Module-based';
  created_at: string;
  updated_at: string;
}

interface CategoriesByType {
  Standalone: Category[];
  'Module-based': Category[];
}

export default function CategoriesView() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoriesByType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getByType();
      setCategories(data);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category: Category) => {
    if (category.type === 'Standalone') {
      // Standalone: Navigate directly to topics
      router.push(routes.edu.categoryTopics(category.category_id.toString()));
    } else {
      // Module-based: Navigate to submodules page first
      router.push(routes.edu.categorySubmodules(category.category_id.toString()));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader variant="spinner" size="xl" />
      </div>
    );
  }

  if (!categories) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Text>No categories found</Text>
      </div>
    );
  }

  const CategoryCard = ({ category }: { category: Category }) => (
    <div
      onClick={() => handleCategoryClick(category)}
      className="group cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="rounded-lg bg-blue-50 p-3 group-hover:bg-blue-100">
          {category.type === 'Standalone' ? (
            <PiBookOpenTextBold className="h-6 w-6 text-blue-600" />
          ) : (
            <PiStackBold className="h-6 w-6 text-blue-600" />
          )}
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {category.type}
        </span>
      </div>
      <Title as="h3" className="mb-2 text-xl font-bold text-gray-900">
        {category.name}
      </Title>
      <Text className="mb-4 line-clamp-2 text-sm text-gray-600">
        {category.description}
      </Text>
      <Button
        variant="text"
        className="text-blue-600 group-hover:text-blue-700"
        onClick={(e) => {
          e.stopPropagation();
          handleCategoryClick(category);
        }}
      >
        Explore {category.type === 'Standalone' ? 'Topics' : 'Modules'} →
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <Title as="h1" className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            Explore Learning Categories
          </Title>
          <Text className="mx-auto max-w-2xl text-lg text-gray-600">
            Choose from our wide range of topics to start your learning journey
          </Text>
        </div>

        {/* Standalone Categories */}
        {categories.Standalone && categories.Standalone.length > 0 && (
          <div className="mb-12">
            <Title as="h2" className="mb-6 text-2xl font-bold text-gray-900">
              <PiBookOpenTextBold className="mr-2 inline h-7 w-7 text-blue-600" />
              Quick Topics
            </Title>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.Standalone.map((category) => (
                <CategoryCard key={category.category_id} category={category} />
              ))}
            </div>
          </div>
        )}

        {/* Module-based Categories */}
        {categories['Module-based'] && categories['Module-based'].length > 0 && (
          <div>
            <Title as="h2" className="mb-6 text-2xl font-bold text-gray-900">
              <PiStackBold className="mr-2 inline h-7 w-7 text-blue-600" />
              Structured Courses
            </Title>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories['Module-based'].map((category) => (
                <CategoryCard key={category.category_id} category={category} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!categories.Standalone || categories.Standalone.length === 0) &&
          (!categories['Module-based'] || categories['Module-based'].length === 0) && (
            <div className="mt-12 rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <Text className="text-gray-500">
                No categories available at the moment. Please check back later!
              </Text>
            </div>
          )}
      </div>
    </div>
  );
}
