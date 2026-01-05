import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createTopic } from '../services/topicService.js';
import { saveSeoAeoData } from '../services/seoAeoService.js';
import QuillEditor from '../components/QuillEditor';
import HorizontalFormBlockWrapper from '../components/HorizontalFormBlockWrapper';
import UploadZone from '../components/UploadZone';
import cn from '../utils/class-names';

export default function AddTopicPage() {
  const { submoduleId, moduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [submodule] = useState(location.state?.submodule || null);
  const [module] = useState(location.state?.module || null);
  const [category] = useState(location.state?.category || null);

  // Determine if we're creating a topic for a module or submodule
  const isModuleBased = !!moduleId;
  const parentName = isModuleBased ? (module?.name || 'Module') : (submodule?.name || 'Submodule');

  // Topic basic fields
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // SEO Section states
  const [showSeoSection, setShowSeoSection] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImageFile, setOgImageFile] = useState(null);
  const [ogType, setOgType] = useState('article');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImageFile, setTwitterImageFile] = useState(null);
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robotsDirective, setRobotsDirective] = useState('index, follow');

  // AEO Section states
  const [showAeoSection, setShowAeoSection] = useState(false);
  const [featuredSnippetTarget, setFeaturedSnippetTarget] = useState('');
  const [snippetFormat, setSnippetFormat] = useState('paragraph');
  const [paaQuestions, setPaaQuestions] = useState('');
  const [paaAnswers, setPaaAnswers] = useState('');
  const [conversationalQuery, setConversationalQuery] = useState('');
  const [voiceAnswer, setVoiceAnswer] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [keyFacts, setKeyFacts] = useState('');
  const [primaryEntities, setPrimaryEntities] = useState('');
  const [relatedTopics, setRelatedTopics] = useState('');

  // Validate image file
  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WEBP, SVG)');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return false;
    }
    return true;
  };

  // Handle file selection for main image
  const handleFileChange = (file) => {
    if (file && validateImageFile(file)) {
      setImageFile(file);
    } else if (!file) {
      setImageFile(null);
    }
  };

  // Handle OG image file selection (UploadZone compatible)
  const handleOgImageChange = (file) => {
    if (file && validateImageFile(file)) {
      setOgImageFile(file);
    } else if (!file) {
      setOgImageFile(null);
    }
  };

  // Handle Twitter image file selection (UploadZone compatible)
  const handleTwitterImageChange = (file) => {
    if (file && validateImageFile(file)) {
      setTwitterImageFile(file);
    } else if (!file) {
      setTwitterImageFile(null);
    }
  };

  // Upload image to server (generic function)
  const uploadImageFile = async (file) => {
    if (!file) return null;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('http://localhost:3000/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload image');
      }
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Topic name is required');
      return;
    }

    // Validate SEO fields if section is open
    if (showSeoSection) {
      if (!metaTitle.trim() || !metaDescription.trim()) {
        alert('Meta Title and Meta Description are required when SEO section is enabled');
        return;
      }
      if (metaTitle.length > 60) {
        alert('Meta Title must be maximum 60 characters');
        return;
      }
      if (metaDescription.length > 160) {
        alert('Meta Description must be maximum 160 characters');
        return;
      }
    }

    setIsLoading(true);
    setIsUploading(true);
    try {
      // Upload main image if selected
      let uploadedImageUrl = null;
      if (imageFile) {
        uploadedImageUrl = await uploadImageFile(imageFile);
      }

      // Upload SEO images if selected
      let uploadedOgImageUrl = null;
      let uploadedTwitterImageUrl = null;

      if (showSeoSection) {
        if (ogImageFile) {
          uploadedOgImageUrl = await uploadImageFile(ogImageFile);
        }
        if (twitterImageFile) {
          uploadedTwitterImageUrl = await uploadImageFile(twitterImageFile);
        }
      }

      setIsUploading(false);

      // Create the topic first
      const topicData = {
        name: name.trim(),
        content: content.trim(),
        image_url: uploadedImageUrl || null
      };

      // Add either moduleId or submoduleId depending on context
      if (isModuleBased) {
        topicData.moduleId = moduleId;
      } else {
        topicData.submoduleId = submoduleId;
      }

      const topicResponse = await createTopic(topicData);

      // Get the created topic_id
      const topicId = topicResponse.data?.topic_id || topicResponse.topic_id;

      // Save SEO/AEO data if sections are enabled
      if (showSeoSection && topicId) {
        const pageId = `topic-${topicId}`;

        const seoData = {
          page_type: 'topic',
          page_url: pageUrl.trim(),
          meta_title: metaTitle.trim(),
          meta_description: metaDescription.trim(),
          meta_keywords: metaKeywords.trim() || null,
          og_title: ogTitle.trim() || null,
          og_description: ogDescription.trim() || null,
          og_image_url: uploadedOgImageUrl || null,
          og_type: ogType,
          twitter_card: twitterCard,
          twitter_title: twitterTitle.trim() || null,
          twitter_description: twitterDescription.trim() || null,
          twitter_image_url: uploadedTwitterImageUrl || null,
          canonical_url: canonicalUrl.trim() || pageUrl.trim(),
          robots_directive: robotsDirective
        };

        let aeoData = null;
        if (showAeoSection) {
          aeoData = {
            featured_snippet_target: featuredSnippetTarget.trim() || null,
            snippet_format: snippetFormat,
            paa_questions: paaQuestions.trim() ? paaQuestions.split('\n').filter(q => q.trim()) : [],
            paa_answers: paaAnswers.trim() ? paaAnswers.split('\n').filter(a => a.trim()) : [],
            conversational_query: conversationalQuery.trim() || null,
            voice_answer: voiceAnswer.trim() || null,
            ai_summary: aiSummary.trim() || null,
            key_facts: keyFacts.trim() ? keyFacts.split('\n').filter(f => f.trim()) : [],
            primary_entities: primaryEntities.trim() ? primaryEntities.split(',').map(e => e.trim()).filter(e => e) : [],
            related_topics: relatedTopics.trim() ? relatedTopics.split(',').map(t => t.trim()).filter(t => t) : []
          };
        }

        await saveSeoAeoData(pageId, seoData, aeoData);
      }

      alert('Topic created successfully with SEO/AEO data');
      goBack();
    } catch (error) {
      console.error('Create error:', error);
      alert(error.response?.data?.message || 'Failed to create topic');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (isModuleBased) {
      navigate(`/module/${moduleId}/topics`, {
        state: { module, category }
      });
    } else {
      navigate(`/submodule/${submoduleId}/topics`, {
        state: { submodule, category }
      });
    }
  };

  const goToParentList = () => {
    if (isModuleBased) {
      // Navigate back to modules list
      if (category) {
        navigate(`/category/${category.category_id}/modules`, {
          state: { category }
        });
      } else {
        navigate('/categories');
      }
    } else {
      // Navigate back to submodules list
      if (category) {
        navigate(`/category/${category.category_id}/submodules`, {
          state: { category }
        });
      } else {
        navigate('/categories');
      }
    }
  };

  // Helper function to generate URL slug from topic name
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-fill page URL when name changes
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (showSeoSection && !pageUrl) {
      setPageUrl(`/topics/${generateSlug(newName)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Create A Topic</h1>
            <button
              onClick={goBack}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            <span
              className="cursor-pointer hover:text-blue-600"
              onClick={() => navigate('/categories')}
            >
              E-Commerce
            </span>
            {category && (
              <>
                <span className="mx-2">›</span>
                <span
                  className="cursor-pointer hover:text-blue-600"
                  onClick={goToParentList}
                >
                  {category.name}
                </span>
              </>
            )}
            {(module || submodule) && (
              <>
                <span className="mx-2">›</span>
                <span
                  className="cursor-pointer hover:text-blue-600"
                  onClick={goBack}
                >
                  {parentName}
                </span>
              </>
            )}
            <span className="mx-2">›</span>
            <span className="text-gray-900">Create</span>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="@container flex flex-col flex-grow">
          <div className="flex-grow pb-10 space-y-6">
            {/* BASIC INFORMATION */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200">
                <HorizontalFormBlockWrapper
                  title="Add new topic:"
                  description="Enter the topic details"
                  isModalView={true}
                  className="first:pt-0 pt-8"
                >
                  {/* Topic Name */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="topic name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Content */}
                  <div className="col-span-2">
                    <QuillEditor
                      value={content}
                      onChange={setContent}
                      label="Content"
                      placeholder="Enter topic content..."
                      disabled={isLoading}
                    />
                  </div>

                  {/* Topic Image */}
                  <div className="col-span-2">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Upload new topic image</h3>
                    <p className="text-sm text-gray-500 mb-3">Upload your topic image here</p>
                    <UploadZone
                      name="image"
                      value={null}
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                    {isUploading && (
                      <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
                    )}
                  </div>
                </HorizontalFormBlockWrapper>
              </div>
            </div>

            {/* SEO SECTION */}
            {showSeoSection && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200">
                  <HorizontalFormBlockWrapper
                    title="SEO Metadata"
                    description="Search Engine Optimization settings"
                    isModalView={true}
                  >
                    {/* Core SEO Fields - Full width container */}
                    <div className="col-span-2 space-y-6">
                      <h4 className="text-sm font-semibold text-gray-600 mb-4">Core SEO</h4>

                      <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page URL (optional)
                      <span className="text-gray-500 text-xs ml-2">Canonical URL for this topic</span>
                    </label>
                    <input
                      type="text"
                      value={pageUrl}
                      onChange={(e) => setPageUrl(e.target.value)}
                      placeholder="/topics/example-topic"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Title <span className="text-red-600">*</span>
                      <span className="text-gray-500 text-xs ml-2">Max 60 chars ({metaTitle.length}/60)</span>
                    </label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="SEO title for search results"
                      maxLength={60}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description <span className="text-red-600">*</span>
                      <span className="text-gray-500 text-xs ml-2">Max 160 chars ({metaDescription.length}/160)</span>
                    </label>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Description shown in Google search results"
                      rows="3"
                      maxLength={160}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords (optional)</label>
                    <input
                      type="text"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      placeholder="keyword1, keyword2, keyword3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Open Graph Fields */}
                  <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">Open Graph (Facebook, LinkedIn)</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Title
                      <span className="text-gray-500 text-xs ml-2">Max 95 chars ({ogTitle.length}/95)</span>
                    </label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="Title for social media sharing"
                      maxLength={95}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Description
                      <span className="text-gray-500 text-xs ml-2">Max 200 chars ({ogDescription.length}/200)</span>
                    </label>
                    <textarea
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      placeholder="Description for Facebook/LinkedIn share"
                      rows="2"
                      maxLength={200}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      disabled={isLoading}
                    />
                  </div>

                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Upload OG Image</h3>
                        <p className="text-sm text-gray-500 mb-3">Upload Open Graph image for social media (1200x630px recommended)</p>
                        <UploadZone
                          name="ogImage"
                          value={null}
                          onChange={handleOgImageChange}
                          disabled={isLoading}
                        />
                      </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">OG Type</label>
                    <select
                      value={ogType}
                      onChange={(e) => setOgType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      disabled={isLoading}
                    >
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                      <option value="profile">Profile</option>
                    </select>
                  </div>

                  {/* Twitter Card Fields */}
                  <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">Twitter Card</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Card Type</label>
                    <select
                      value={twitterCard}
                      onChange={(e) => setTwitterCard(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      disabled={isLoading}
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Title
                      <span className="text-gray-500 text-xs ml-2">Max 70 chars ({twitterTitle.length}/70)</span>
                    </label>
                    <input
                      type="text"
                      value={twitterTitle}
                      onChange={(e) => setTwitterTitle(e.target.value)}
                      placeholder="Title for Twitter card"
                      maxLength={70}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Description
                      <span className="text-gray-500 text-xs ml-2">Max 200 chars ({twitterDescription.length}/200)</span>
                    </label>
                    <textarea
                      value={twitterDescription}
                      onChange={(e) => setTwitterDescription(e.target.value)}
                      placeholder="Description for Twitter share"
                      rows="2"
                      maxLength={200}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      disabled={isLoading}
                    />
                  </div>

                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">Upload Twitter Image</h3>
                        <p className="text-sm text-gray-500 mb-3">Upload Twitter card image (1200x675px recommended)</p>
                        <UploadZone
                          name="twitterImage"
                          value={null}
                          onChange={handleTwitterImageChange}
                          disabled={isLoading}
                        />
                      </div>

                  {/* Technical SEO */}
                  <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">Technical SEO</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
                    <input
                      type="text"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      placeholder="Leave empty to use Page URL"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Robots Directive</label>
                    <select
                      value={robotsDirective}
                      onChange={(e) => setRobotsDirective(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      disabled={isLoading}
                    >
                      <option value="index, follow">Index, Follow (Allow indexing)</option>
                      <option value="noindex, nofollow">NoIndex, NoFollow (Block indexing)</option>
                      <option value="noindex, follow">NoIndex, Follow (Crawl but don't index)</option>
                    </select>
                      </div>
                    </div>
                  </HorizontalFormBlockWrapper>
                </div>
              </div>
            )}

            {/* AEO SECTION */}
            {showSeoSection && showAeoSection && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200">
                  <HorizontalFormBlockWrapper
                      title="AEO Optimization"
                      description="Answer Engine & Voice Search settings"
                      isModalView={true}
                      className="first:pt-0 pt-8"
                    >
                      <div className="col-span-2 space-y-6">
                        <h4 className="text-sm font-semibold text-gray-600 mb-4">Featured Snippet Optimization</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Featured Snippet Target
                          <span className="text-gray-500 text-xs ml-2">40-60 words targeting position zero</span>
                        </label>
                        <textarea
                          value={featuredSnippetTarget}
                          onChange={(e) => setFeaturedSnippetTarget(e.target.value)}
                          placeholder="Concise answer for featured snippet (40-60 words)"
                          rows="3"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Snippet Format</label>
                        <select
                          value={snippetFormat}
                          onChange={(e) => setSnippetFormat(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          disabled={isLoading}
                        >
                          <option value="paragraph">Paragraph (Definitions)</option>
                          <option value="list">List (Steps/Rankings)</option>
                          <option value="table">Table (Comparisons/Data)</option>
                          <option value="video">Video (Tutorials)</option>
                        </select>
                      </div>

                      {/* People Also Ask */}
                      <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">People Also Ask (PAA)</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAA Questions
                          <span className="text-gray-500 text-xs ml-2">One question per line</span>
                        </label>
                        <textarea
                          value={paaQuestions}
                          onChange={(e) => setPaaQuestions(e.target.value)}
                          placeholder={'How long does it take to learn Python?\nIs Python good for beginners?\nWhat can I do with Python?'}
                          rows="4"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAA Answers
                          <span className="text-gray-500 text-xs ml-2">One answer per line (30-50 words each)</span>
                        </label>
                        <textarea
                          value={paaAnswers}
                          onChange={(e) => setPaaAnswers(e.target.value)}
                          placeholder={'Most beginners can learn Python basics in 30 days with daily practice.\nYes, Python has simple syntax and is perfect for first-time programmers.\nYou can build web apps, analyze data, automate tasks, and create AI models.'}
                          rows="4"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          disabled={isLoading}
                        />
                      </div>

                      {/* Voice Search */}
                      <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">Voice Search Optimization</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Conversational Query</label>
                        <input
                          type="text"
                          value={conversationalQuery}
                          onChange={(e) => setConversationalQuery(e.target.value)}
                          placeholder="How can I learn Python programming as a complete beginner?"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Voice Answer
                          <span className="text-gray-500 text-xs ml-2">20-30 words, spoken-style</span>
                        </label>
                        <textarea
                          value={voiceAnswer}
                          onChange={(e) => setVoiceAnswer(e.target.value)}
                          placeholder="You can learn Python by taking online courses, practicing daily, and building small projects to reinforce your skills."
                          rows="2"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          disabled={isLoading}
                        />
                      </div>

                      {/* AI Summary */}
                      <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">AI Engine Optimization</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          AI Summary
                          <span className="text-gray-500 text-xs ml-2">100-150 words for ChatGPT, Perplexity, Google AI</span>
                        </label>
                        <textarea
                          value={aiSummary}
                          onChange={(e) => setAiSummary(e.target.value)}
                          placeholder="Comprehensive summary for AI engines (100-150 words)"
                          rows="5"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          disabled={isLoading}
                        />
                      </div>

                      {/* Structured Data */}
                      <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">Structured Data</h4>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Key Facts
                          <span className="text-gray-500 text-xs ml-2">One fact per line (3-5 facts)</span>
                        </label>
                        <textarea
                          value={keyFacts}
                          onChange={(e) => setKeyFacts(e.target.value)}
                          placeholder={'No prior experience required\nComplete in 30 days\n5 hands-on projects included'}
                          rows="3"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Entities
                          <span className="text-gray-500 text-xs ml-2">Comma-separated main topics</span>
                        </label>
                        <input
                          type="text"
                          value={primaryEntities}
                          onChange={(e) => setPrimaryEntities(e.target.value)}
                          placeholder="Python Programming, Online Learning, Beginner Courses"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Related Topics
                          <span className="text-gray-500 text-xs ml-2">Comma-separated connected subjects</span>
                        </label>
                        <input
                          type="text"
                          value={relatedTopics}
                          onChange={(e) => setRelatedTopics(e.target.value)}
                          placeholder="Web Development, Data Science, Career Development"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isLoading}
                        />
                      </div>
                      </div>
                    </HorizontalFormBlockWrapper>
                  </div>
                </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className={cn(
            'sticky bottom-0 z-40 flex items-center justify-end gap-3',
            'bg-gray-50/90 backdrop-blur',
            '-mx-6 px-6 py-5',
            'lg:gap-4'
          )}>
            <button
              type="button"
              onClick={goBack}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
