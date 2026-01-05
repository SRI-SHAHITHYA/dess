/**
 * Upload image to backend
 * @param file - File object or array of files
 * @returns Promise with image URL
 */
export async function uploadImage(file: File | File[] | string): Promise<string | undefined> {
  // If it's already a string URL, return it
  if (typeof file === 'string') {
    return file;
  }

  // If no file, return undefined
  if (!file) {
    return undefined;
  }

  // Handle array - take first file
  const fileToUpload = Array.isArray(file) ? file[0] : file;

  if (!fileToUpload || !(fileToUpload instanceof File)) {
    return undefined;
  }

  try {
    const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3000';
    const formData = new FormData();
    formData.append('image', fileToUpload);

    const response = await fetch(`${BACKEND_BASE_URL}/api/upload/image`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      // Note: Don't set Content-Type header, browser will set it with boundary
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
