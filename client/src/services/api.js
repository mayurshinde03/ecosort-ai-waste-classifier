// API Configuration - Works in all environments
const API_URL = 'http://localhost:5000/api';

/**
 * Classify an image using the backend API
 * @param {string} base64Image - Base64 encoded image data
 * @returns {Promise<Object>} Classification result
 */
export const classifyImage = async (base64Image) => {
  try {
    console.log('📤 Sending image to backend API...');
    console.log('🔗 API URL:', `${API_URL}/classify`);
    
    const response = await fetch(`${API_URL}/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image
      })
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Classification successful:', data);
    
    // Validate response structure
    if (!data || !data.result) {
      throw new Error('Invalid response format from server');
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ API Error:', error);
    
    // Provide helpful error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Make sure backend is running on http://localhost:5000');
    }
    
    throw new Error(error.message || 'Failed to classify image');
  }
};

/**
 * Test server connection
 * @returns {Promise<Object>} Server health status
 */
export const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    console.log('✅ Server health check:', data);
    return data;
  } catch (error) {
    console.error('❌ Server connection test failed:', error);
    return null;
  }
};
