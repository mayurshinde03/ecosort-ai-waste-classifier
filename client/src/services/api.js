// API Configuration - Works in all environments
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

    if (!data || !data.result) {
      throw new Error('Invalid response format from server');
    }

    return data;

  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};
