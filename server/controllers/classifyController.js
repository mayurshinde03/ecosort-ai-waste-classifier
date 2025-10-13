const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ CRITICAL: GEMINI_API_KEY environment variable is not set');
  throw new Error('GEMINI_API_KEY not configured');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log('✅ Gemini AI initialized in controller');

exports.classifyImage = async (req, res) => {
  try {
    console.log('🔍 ===== Classification Request Started =====');
    console.log('📅 Timestamp:', new Date().toISOString());

    const { image } = req.body;

    if (!image) {
      console.log('❌ No image provided in request');
      return res.status(400).json({ error: 'No image data provided' });
    }

    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    console.log('📸 Image size:', base64Image.length, 'characters');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert waste classification AI. Analyze this image of a waste item and classify it.

Provide your response in this EXACT JSON format (no markdown, no code blocks, just pure JSON):

{
  "materialType": "one of: Plastic, Paper, Metal, Glass, Organic, E-waste, Textile, or Mixed",
  "description": "brief 2-4 word description of the item",
  "recyclable": true or false,
  "binColor": "one of: Green, Blue, Yellow, or Red",
  "tip": "one practical recycling tip in 10-20 words",
  "examples": ["similar item 1", "similar item 2", "similar item 3"]
}

Color coding system:
- Green: Organic/Compostable waste
- Blue: Paper and cardboard
- Yellow: Plastic and metal
- Red: General/non-recyclable waste

Be accurate and specific in your classification.`;

    console.log('🤖 Sending request to Gemini 2.0 Flash...');

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      }
    ]);

    const response = result.response;
    const text = response.text();
    
    console.log('📝 Gemini response received');

    let resultData;
    try {
      // More robust markdown removal
      let cleanText = text.trim();
      
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
      }
      
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      
      cleanText = cleanText.trim();

      resultData = JSON.parse(cleanText);
      
      console.log('✅ Successfully parsed Gemini response');
      console.log('Material Type:', resultData.materialType);
      console.log('Bin Color:', resultData.binColor);
      console.log('Recyclable:', resultData.recyclable);
      
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError.message);
      
      resultData = {
        materialType: 'Unknown',
        description: 'Unable to classify item',
        recyclable: false,
        binColor: 'Red',
        tip: 'Please consult local recycling guidelines for proper disposal',
        examples: ['Unidentified items', 'Mixed materials', 'Unclear waste']
      };
    }

    console.log('✅ ===== Classification Successful =====\n');
    
    res.json({ result: resultData });

  } catch (error) {
    console.error('❌ ===== Classification Error =====');
    console.error('Error:', error.message);
    console.error('=====================================');

    res.status(500).json({
      error: 'Failed to classify image',
      details: error.message,
      type: error.name
    });
  }
};
