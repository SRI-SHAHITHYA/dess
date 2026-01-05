// Utility functions for image file upload

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please select a valid image file (JPEG, PNG, GIF, WEBP, SVG)');
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  return true;
};

export const uploadImageFile = async (imageFile) => {
  if (!imageFile) return null;

  try {
    const formData = new FormData();
    formData.append('image', imageFile);

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

export const formatFileSize = (bytes) => {
  return (bytes / 1024).toFixed(2);
};
