'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { topicsAPI } from '@/services/api';
import { Title, Text, Button, Loader } from 'rizzui';
import { PiArrowLeftBold, PiArticleBold } from 'react-icons/pi';
import toast from 'react-hot-toast';

interface Topic {
  topic_id: number;
  module_id?: number;
  submodule_id?: number;
  name: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export default function SubmoduleTopicsView({ submoduleId }: { submoduleId: string }) {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    fetchTopics();
  }, [submoduleId]);

  const fetchTopics = async () => {
    try {
      const data = await topicsAPI.getBySubmodule(parseInt(submoduleId));
      setTopics(data);
      // Auto-select first topic
      if (data && data.length > 0) {
        setSelectedTopic(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader variant="spinner" size="xl" />
      </div>
    );
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <Button variant="outline" onClick={() => router.back()}>
            <PiArrowLeftBold className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="mt-12 rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <Text className="text-gray-500">
              No topics available yet. Please check back later!
            </Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - Topics List */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-6 w-full"
            >
              <PiArrowLeftBold className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Title as="h2" className="mb-4 text-xl font-bold text-gray-900">
              Topics
            </Title>
            <div className="space-y-2">
              {topics.map((topic, index) => (
                <button
                  key={topic.topic_id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full rounded-lg p-4 text-left transition-all ${
                    selectedTopic?.topic_id === topic.topic_id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <Text className="font-medium text-gray-900">
                        {topic.name}
                      </Text>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Topic Details */}
        <div className="flex-1 overflow-y-auto">
          {selectedTopic ? (
            <div className="mx-auto max-w-4xl px-8 py-12">
              <div className="mb-6 flex items-center">
                <div className="rounded-lg bg-blue-50 p-3">
                  <PiArticleBold className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <Title as="h1" className="mb-6 text-4xl font-bold text-gray-900">
                {selectedTopic.name}
              </Title>
              {selectedTopic.image_url && (
                <div className="mb-8 overflow-hidden rounded-xl">
                  <img
                    src={selectedTopic.image_url}
                    alt={selectedTopic.name}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: selectedTopic.content }}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <Text className="text-gray-500">Select a topic to view</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
