import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { updateSubmodule } from '../services/submoduleService.js';
import { getSeoAeoData, saveSeoAeoData } from '../services/seoAeoService.js';
import { validateImageFile, uploadImageFile } from '../utils/imageUpload.js';
import QuillEditor from '../components/QuillEditor';
import HorizontalFormBlockWrapper from '../components/HorizontalFormBlockWrapper';
import UploadZone from '../components/UploadZone';
import cn from '../utils/class-names';

export default function EditSubmodulePage() {
  const { submoduleId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [submodule] = useState(location.state?.submodule || null);
  const [category] = useState(location.state?.category || null);

  // Submodule basic fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [ogImageFile, setOgImageFile] = useState(null);
  const [twitterImageFile, setTwitterImageFile] = useState(null);
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
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [ogType, setOgType] = useState('article');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImageUrl, setTwitterImageUrl] = useState('');
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

  useEffect(() => {
    if (submodule) {
      setName(submodule.name || '');
      setDescription(submodule.description || '');
      setImageUrl(submodule.image_url || '');
    }

    // Load SEO/AEO data
    const loadSeoAeoData = async () => {
      if (!submoduleId) return;

      try {
        const pageId = `submodule-${submoduleId}`;
        const response = await getSeoAeoData(pageId);
        const { seo, aeo } = response.data;

        if (seo) {
          setShowSeoSection(true);
          setPageUrl(seo.page_url || '');
          setMetaTitle(seo.meta_title || '');
          setMetaDescription(seo.meta_description || '');
          setMetaKeywords(seo.meta_keywords || '');
          setOgTitle(seo.og_title || '');
          setOgDescription(seo.og_description || '');
          setOgImageUrl(seo.og_image_url || '');
          setOgType(seo.og_type || 'article');
          setTwitterCard(seo.twitter_card || 'summary_large_image');
          setTwitterTitle(seo.twitter_title || '');
          setTwitterDescription(seo.twitter_description || '');
          setTwitterImageUrl(seo.twitter_image_url || '');
          setCanonicalUrl(seo.canonical_url || '');
          setRobotsDirective(seo.robots_directive || 'index, follow');
        }

        if (aeo) {
          setShowAeoSection(true);
          setFeaturedSnippetTarget(aeo.featured_snippet_target || '');
          setSnippetFormat(aeo.snippet_format || 'paragraph');
          setPaaQuestions((aeo.paa_questions || []).join('\n'));
          setPaaAnswers((aeo.paa_answers || []).join('\n'));
          setConversationalQuery(aeo.conversational_query || '');
          setVoiceAnswer(aeo.voice_answer || '');
          setAiSummary(aeo.ai_summary || '');
          setKeyFacts((aeo.key_facts || []).join('\n'));
          setPrimaryEntities((aeo.primary_entities || []).join(', '));
          setRelatedTopics((aeo.related_topics || []).join(', '));
        }
      } catch (error) {
        // SEO/AEO data might not exist for this submodule, which is fine
        console.log('No existing SEO/AEO data found for this submodule');
      }
    };

    loadSeoAeoData();
  }, [submodule, submoduleId]);

  // Handle file selection
  const handleFileChange = (file) => {
    if (file) {
      try {
        validateImageFile(file);
        setImageFile(file);
      } catch (error) {
        alert(error.message);
      }
    } else {
      setImageFile(null);
    }
  };

  // Handle OG image file selection (UploadZone compatible)
  const handleOgImageChange = (file) => {
    if (file) {
      try {
        validateImageFile(file);
        setOgImageFile(file);
      } catch (error) {
        alert(error.message);
      }
    } else {
      setOgImageFile(null);
    }
  };

  // Handle Twitter image file selection (UploadZone compatible)
  const handleTwitterImageChange = (file) => {
    if (file) {
      try {
        validateImageFile(file);
        setTwitterImageFile(file);
      } catch (error) {
        alert(error.message);
      }
    } else {
      setTwitterImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Submodule name is required');
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
      // Upload new images if selected
      let finalImageUrl = imageUrl;
      let finalOgImageUrl = ogImageUrl;
      let finalTwitterImageUrl = twitterImageUrl;

      if (imageFile) {
        finalImageUrl = await uploadImageFile(imageFile);
      }

      if (ogImageFile) {
        finalOgImageUrl = await uploadImageFile(ogImageFile);
      }

      if (twitterImageFile) {
        finalTwitterImageUrl = await uploadImageFile(twitterImageFile);
      }

      setIsUploading(false);

      // Update the submodule basic information first
      await updateSubmodule(submoduleId, {
        name: name.trim(),
        description: description.trim(),
        image_url: finalImageUrl || null
      });

      // Save SEO/AEO data if sections are enabled
      if (showSeoSection) {
        const pageId = `submodule-${submoduleId}`;

        const seoData = {
          page_type: 'course',
          page_url: pageUrl.trim(),
          meta_title: metaTitle.trim(),
          meta_description: metaDescription.trim(),
          meta_keywords: metaKeywords.trim() || null,
          og_title: ogTitle.trim() || null,
          og_description: ogDescription.trim() || null,
          og_image_url: finalOgImageUrl || null,
          og_type: ogType,
          twitter_card: twitterCard,
          twitter_title: twitterTitle.trim() || null,
          twitter_description: twitterDescription.trim() || null,
          twitter_image_url: finalTwitterImageUrl || null,
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

      alert('Submodule updated successfully with SEO/AEO data');
      goBack();
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data?.message || 'Failed to update submodule');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (category) {
      navigate(`/category/${category.category_id}/submodules`, {
        state: { category }
      });
    } else {
      navigate('/categories');
    }
  };

  // Helper function to generate URL slug from submodule name
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
      setPageUrl(`/submodules/${generateSlug(newName)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Edit Submodule</h1>
            <button
              onClick={goBack}
              className="text-gray-600 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg font-medium transition-colors"
              disabled={isLoading}
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
                  onClick={goBack}
                >
                  {category.name}
                </span>
              </>
            )}
            <span className="mx-2">›</span>
            <span className="text-gray-900">Edit {submodule?.name || 'Submodule'}</span>
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
                  title="Edit submodule:"
                  description="Edit the submodule details"
                  isModalView={true}
                  className="first:pt-0 pt-8"
                >
                  {/* Submodule Name */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Submodule Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="submodule name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <QuillEditor
                      value={description}
                      onChange={setDescription}
                      label="Description"
                      placeholder="Enter submodule description..."
                      disabled={isLoading}
                    />
                  </div>

                  {/* Submodule Image */}
                  <div className="col-span-2">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Upload submodule image</h3>
                    <p className="text-sm text-gray-500 mb-3">Upload your submodule image here</p>
                    <UploadZone
                      name="image"
                      value={imageUrl}
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
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div
                className="bg-gray-100 px-6 py-4 border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors flex justify-between items-center"
                onClick={() => setShowSeoSection(!showSeoSection)}
              >
                <h3 className="text-base font-semibold text-gray-800 m-0">
                  SEO Metadata (Search Engine Optimization)
                </h3>
                <span className="text-xl text-gray-600">{showSeoSection ? '▼' : '▶'}</span>
              </div>

              {showSeoSection && (
                <div className="p-8 border border-t-0 border-gray-200">
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
                        <small className="text-gray-500 ml-2">Canonical URL for this submodule</small>
                      </label>
                      <input
                        type="text"
                        value={pageUrl}
                        onChange={(e) => setPageUrl(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="/submodules/example-submodule"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title <span className="text-red-600">*</span>
                        <small className="text-gray-500 ml-2">Max 60 chars ({metaTitle.length}/60)</small>
                      </label>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="SEO title for search results"
                        maxLength={60}
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description <span className="text-red-600">*</span>
                        <small className="text-gray-500 ml-2">Max 160 chars ({metaDescription.length}/160)</small>
                      </label>
                      <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description shown in Google search results"
                        rows="3"
                        maxLength={160}
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Keywords (optional)
                      </label>
                      <input
                        type="text"
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="keyword1, keyword2, keyword3"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Open Graph Fields */}
                    <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">Open Graph (Facebook, LinkedIn)</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Title
                      <small className="text-gray-500 ml-2">Max 95 chars ({ogTitle.length}/95)</small>
                    </label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Title for social media sharing"
                      maxLength={95}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Description
                      <small className="text-gray-500 ml-2">Max 200 chars ({ogDescription.length}/200)</small>
                    </label>
                    <textarea
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description for Facebook/LinkedIn share"
                      rows="2"
                      maxLength={200}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Upload OG Image</h3>
                    <p className="text-sm text-gray-500 mb-3">Upload Open Graph image for social media (1200x630px recommended)</p>
                    <UploadZone
                      name="og_image"
                      value={ogImageUrl}
                      onChange={handleOgImageChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OG Type
                    </label>
                    <select
                      value={ogType}
                      onChange={(e) => setOgType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Card Type
                    </label>
                    <select
                      value={twitterCard}
                      onChange={(e) => setTwitterCard(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <small className="text-gray-500 ml-2">Max 70 chars ({twitterTitle.length}/70)</small>
                    </label>
                    <input
                      type="text"
                      value={twitterTitle}
                      onChange={(e) => setTwitterTitle(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Title for Twitter card"
                      maxLength={70}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter Description
                      <small className="text-gray-500 ml-2">Max 200 chars ({twitterDescription.length}/200)</small>
                    </label>
                    <textarea
                      value={twitterDescription}
                      onChange={(e) => setTwitterDescription(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Description for Twitter share"
                      rows="2"
                      maxLength={200}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Upload Twitter Image</h3>
                    <p className="text-sm text-gray-500 mb-3">Upload Twitter card image (1200x675px recommended)</p>
                    <UploadZone
                      name="twitter_image"
                      value={twitterImageUrl}
                      onChange={handleTwitterImageChange}
                      disabled={isLoading}
                    />
                  </div>

                    {/* Technical SEO */}
                    <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">Technical SEO</h4>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Leave empty to use Page URL"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Robots Directive</label>
                      <select
                        value={robotsDirective}
                        onChange={(e) => setRobotsDirective(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
              )}
            </div>

            {/* AEO SECTION */}
            {showSeoSection && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div
                  className="bg-gray-100 px-6 py-4 border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors flex justify-between items-center"
                  onClick={() => setShowAeoSection(!showAeoSection)}
                >
                  <h3 className="text-base font-semibold text-gray-800 m-0">
                    AEO - Answer Engine Optimization (Voice Search, AI Engines)
                  </h3>
                  <span className="text-xl text-gray-600">{showAeoSection ? '▼' : '▶'}</span>
                </div>

                {showAeoSection && (
                  <div className="p-8 border border-t-0 border-gray-200">
                    <HorizontalFormBlockWrapper
                      title="AEO Optimization"
                      description="Answer Engine & Voice Search settings"
                      isModalView={true}
                    >
                      {/* Full width container for all AEO fields */}
                      <div className="col-span-2 space-y-6">
                        {/* Featured Snippet */}
                        <h4 className="text-sm font-semibold text-gray-600 mb-4">Featured Snippet Optimization</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Snippet Target
                        <small className="text-gray-500 ml-2">40-60 words targeting position zero</small>
                      </label>
                      <textarea
                        value={featuredSnippetTarget}
                        onChange={(e) => setFeaturedSnippetTarget(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Concise answer for featured snippet (40-60 words)"
                        rows="3"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Snippet Format</label>
                      <select
                        value={snippetFormat}
                        onChange={(e) => setSnippetFormat(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <small className="text-gray-500 ml-2">One question per line</small>
                      </label>
                      <textarea
                        value={paaQuestions}
                        onChange={(e) => setPaaQuestions(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={'What is this submodule about?\nWho should take this course?\nHow long does it take?'}
                        rows="4"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PAA Answers
                        <small className="text-gray-500 ml-2">One answer per line (30-50 words each)</small>
                      </label>
                      <textarea
                        value={paaAnswers}
                        onChange={(e) => setPaaAnswers(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={'This submodule covers fundamental concepts and practical applications.\nBoth beginners and intermediate learners will benefit from this course.\nMost students complete this submodule in 2-4 weeks with dedicated practice.'}
                        rows="4"
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
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What can I learn from this submodule?"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voice Answer
                        <small className="text-gray-500 ml-2">20-30 words, spoken-style</small>
                      </label>
                      <textarea
                        value={voiceAnswer}
                        onChange={(e) => setVoiceAnswer(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="This submodule teaches you practical skills through hands-on projects and guided exercises designed for real-world applications."
                        rows="2"
                        disabled={isLoading}
                      />
                      </div>

                      {/* AI Summary */}
                      <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">AI Engine Optimization</h4>

                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        AI Summary
                        <small className="text-gray-500 ml-2">100-150 words for ChatGPT, Perplexity, Google AI</small>
                      </label>
                      <textarea
                        value={aiSummary}
                        onChange={(e) => setAiSummary(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Comprehensive summary for AI engines (100-150 words)"
                        rows="5"
                        disabled={isLoading}
                      />
                      </div>

                      {/* Structured Data */}
                      <h4 className="text-sm font-semibold text-gray-600 mb-4 mt-8">Structured Data</h4>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Facts
                        <small className="text-gray-500 ml-2">One fact per line (3-5 facts)</small>
                      </label>
                      <textarea
                        value={keyFacts}
                        onChange={(e) => setKeyFacts(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={'Self-paced learning\nHands-on projects included\nCertificate upon completion'}
                        rows="3"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Entities
                        <small className="text-gray-500 ml-2">Comma-separated main topics</small>
                      </label>
                      <input
                        type="text"
                        value={primaryEntities}
                        onChange={(e) => setPrimaryEntities(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Online Course, E-Learning, Skill Development"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Related Topics
                        <small className="text-gray-500 ml-2">Comma-separated connected subjects</small>
                      </label>
                        <input
                          type="text"
                          value={relatedTopics}
                          onChange={(e) => setRelatedTopics(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Career Development, Professional Skills, Industry Certification"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    </HorizontalFormBlockWrapper>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Sticky Footer with Action Buttons */}
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
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Update Submodule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
