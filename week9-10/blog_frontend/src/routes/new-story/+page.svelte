<script>
  import {
    Image,
    List,
    ListOrdered,
    Bold,
    Italic,
    Link2,
    Eye,
    Save,
    Send,
    X,
    Calendar,
    User,
    Tag,
    FolderOpen,
    AlertCircle
  } from 'lucide-svelte';


  let title = '';
  let content = '';
  let excerpt = '';
  let author = '';
  let publishDate = new Date().toISOString().split('T')[0];
  let category = '';
  let selectedTags = [];
  let customTag = '';
  let featuredImage = null;
  let imagePreview = '';
  let showPreview = false;
  let isSaving = false;
  let errors = {};

  let fileInputRef;
  let contentRef;

  const categories = [
    'Technology', 'Science', 'Health', 'Lifestyle',
    'Finance', 'Wellness', 'Environment', 'Business'
  ];

  const availableTags = [
    'AI', 'Future Tech', 'Innovation', 'Remote Work', 'Tools', 'Career',
    'Sustainability', 'Urban Living', 'Eco-Friendly', 'Quantum', 'Computing',
    'Mindfulness', 'Productivity', 'Blockchain', 'Web3', 'Digital Detox'
  ];

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        errors = { ...errors, image: 'Image must be less than 5MB' };
        return;
      }
      featuredImage = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        imagePreview = reader.result;
        errors = { ...errors, image: null };
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    featuredImage = null;
    imagePreview = '';
    if (fileInputRef) fileInputRef.value = '';
  }

  function formatText(command) {
    document.execCommand(command, false, null);
    contentRef?.focus();
  }

  function insertLink() {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  }

  function toggleTag(tag) {
    selectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
  }

  function addCustomTag() {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      selectedTags = [...selectedTags, customTag.trim()];
      customTag = '';
    }
  }

  function removeTag(tag) {
    selectedTags = selectedTags.filter(t => t !== tag);
  }

  function validateForm() {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    if (!author.trim()) newErrors.author = 'Author name is required';
    if (!imagePreview) newErrors.image = 'Featured image is required';
    if (!category) newErrors.category = 'Please select a category';

    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  function handleSaveDraft() {
    const post = {
      title,
      content,
      excerpt,
      author,
      publishDate,
      category,
      tags: selectedTags,
      featuredImage: imagePreview,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    console.log('Draft saved:', post);
    alert('Draft saved successfully!');
  }

  function handlePublish() {
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }

    isSaving = true;

    const post = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.trim().substring(0, 200) + '...',
      author: author.trim(),
      publishDate,
      category,
      tags: selectedTags,
      featuredImage: imagePreview,
      status: 'published',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      console.log('Published:', post);
      alert('Post published successfully!');
      isSaving = false;
    }, 1000);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function handleContentInput(e) {
    content = e.currentTarget.innerHTML;
  }
</script>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
      <p class="text-gray-600">Write and publish your story</p>
    </div>

    <div class="grid lg:grid-cols-[1fr_380px] gap-6">
      <div class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <label class="block text-sm font-semibold text-gray-900 mb-3">
            Post Title *
          </label>
          <input
            type="text"
            bind:value={title}
            placeholder="Enter an engaging title..."
            maxlength={200}
            class="w-full text-2xl font-bold border-0 border-b-2 {errors.title ? 'border-red-500' : 'border-gray-200'} focus:border-gray-900 focus:outline-none pb-3 transition-colors"
          />
          {#if errors.title}
            <p class="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.title}
            </p>
          {/if}
          <p class="text-xs text-gray-500 mt-2">{title.length}/200</p>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <label class="block text-sm font-semibold text-gray-900 mb-3">
            Featured Image *
          </label>

          {#if !imagePreview}
            <div
              onclick={() => fileInputRef?.click()}
              class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-gray-900 hover:bg-gray-50 transition-all"
            >
              <Image size={48} class="mx-auto mb-4 text-gray-400" />
              <p class="text-gray-600 font-medium mb-1">Click to upload featured image</p>
              <p class="text-sm text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          {:else}
            <div class="relative rounded-xl overflow-hidden group">
              <img src={imagePreview} alt="Featured" class="w-full h-64 object-cover" />
              <button
                onclick={removeImage}
                class="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
          {/if}

          <input
            bind:this={fileInputRef}
            type="file"
            accept="image/*"
            onchange={handleImageUpload}
            class="hidden"
          />
          {#if errors.image}
            <p class="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.image}
            </p>
          {/if}
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <label class="block text-sm font-semibold text-gray-900 mb-3">
            Content *
          </label>

          <div class="flex flex-wrap gap-1 mb-4 pb-4 border-b border-gray-200">
            <button
              onclick={() => formatText('bold')}
              class="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Bold"
              type="button"
            >
              <Bold size={18} />
            </button>
            <button
              onclick={() => formatText('italic')}
              class="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Italic"
              type="button"
            >
              <Italic size={18} />
            </button>
            <button
              onclick={insertLink}
              class="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Insert Link"
              type="button"
            >
              <Link2 size={18} />
            </button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button
              onclick={() => formatText('insertUnorderedList')}
              class="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Bullet List"
              type="button"
            >
              <List size={18} />
            </button>
            <button
              onclick={() => formatText('insertOrderedList')}
              class="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Numbered List"
              type="button"
            >
              <ListOrdered size={18} />
            </button>
            <div class="w-px bg-gray-300 mx-1"></div>
            <button
              onclick={() => formatText('formatBlock', '<h2>')}
              class="px-3 py-2 hover:bg-gray-100 rounded transition-colors font-semibold text-sm"
              title="Heading"
              type="button"
            >
              H2
            </button>
            <button
              onclick={() => formatText('formatBlock', '<h3>')}
              class="px-3 py-2 hover:bg-gray-100 rounded transition-colors font-semibold text-sm"
              title="Subheading"
              type="button"
            >
              H3
            </button>
          </div>

          <div
            bind:this={contentRef}
            contenteditable
            oninput={handleContentInput}
            class="min-h-[400px] prose prose-lg max-w-none focus:outline-none p-4 rounded-lg {errors.content ? 'border-2 border-red-500' : 'border-2 border-transparent'}"
          >
            {#if !content}<p class="text-gray-400">Start writing your story...</p>{/if}
          </div>
          {#if errors.content}
            <p class="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.content}
            </p>
          {/if}
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <label class="block text-sm font-semibold text-gray-900 mb-3">
            Excerpt (Optional)
          </label>
          <textarea
            bind:value={excerpt}
            placeholder="Write a short summary of your post..."
            rows={3}
            maxlength={300}
            class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
          <p class="text-xs text-gray-500 mt-2">{excerpt.length}/300</p>
        </div>
      </div>

      <div class="space-y-6 lg:sticky lg:top-6 self-start">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="font-semibold text-gray-900 mb-4">Publish</h3>
          <div class="space-y-3">
            <button
              onclick={handlePublish}
              disabled={isSaving}
              class="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} />
              {isSaving ? 'Publishing...' : 'Publish Now'}
            </button>
            <button
              onclick={handleSaveDraft}
              class="w-full flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-900 hover:bg-gray-50 transition-all"
            >
              <Save size={18} />
              Save Draft
            </button>
            <button
              onclick={() => showPreview = !showPreview}
              class="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              <Eye size={18} />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <User size={16} />
            Author *
          </label>
          <input
            type="text"
            bind:value={author}
            placeholder="Your name"
            class="w-full border {errors.author ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          {#if errors.author}
            <p class="text-red-500 text-xs mt-1">{errors.author}</p>
          {/if}
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <Calendar size={16} />
            Publish Date
          </label>
          <input
            type="date"
            bind:value={publishDate}
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <FolderOpen size={16} />
            Category *
          </label>
          <select
            bind:value={category}
            class="w-full border {errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="">Select category</option>
            {#each categories as cat (cat)}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
          {#if errors.category}
            <p class="text-red-500 text-xs mt-1">{errors.category}</p>
          {/if}
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
            <Tag size={16} />
            Tags
          </label>

          {#if selectedTags.length > 0}
            <div class="flex flex-wrap gap-2 mb-3">
              {#each selectedTags as tag (tag)}
                <span class="inline-flex items-center gap-1 bg-gray-900 text-white px-3 py-1 rounded-full text-sm">
                  {tag}
                  <button onclick={() => removeTag(tag)} class="hover:text-gray-300">
                    <X size={14} />
                  </button>
                </span>
              {/each}
            </div>
          {/if}

          <div class="space-y-2 mb-3 max-h-48 overflow-y-auto">
            {#each availableTags as tag (tag)}
              <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onchange={() => toggleTag(tag)}
                  class="w-4 h-4 rounded"
                />
                <span class="text-sm text-gray-700">{tag}</span>
              </label>
            {/each}
          </div>

          <div class="flex gap-2">
            <input
              type="text"
              bind:value={customTag}
              onkeypress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
              placeholder="Add custom tag"
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              onclick={addCustomTag}
              class="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {#if showPreview}
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Preview</h3>
            <div class="space-y-4">
              {#if imagePreview}
                <img src={imagePreview} alt="Preview" class="w-full h-40 object-cover rounded-lg" />
              {/if}
              <div>
                <p class="text-xs text-gray-500 mb-2">{formatDate(publishDate)}</p>
                <h4 class="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {title || 'Your title here'}
                </h4>
                <p class="text-sm text-gray-600 line-clamp-3">
                  {excerpt || stripHtml(content).substring(0, 150) + '...'}
                </p>
              </div>
              {#if author}
                <div class="flex items-center gap-2 pt-3 border-t">
                  <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <span class="text-sm font-medium">{author}</span>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>