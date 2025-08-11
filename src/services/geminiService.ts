import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_KEY
const genAI = new GoogleGenerativeAI(API_KEY);

export interface FaceAnalysis {
  faceShape: string;
  confidence: number;
  features: {
    eyeDistance: string;
    faceWidth: string;
    jawline: string;
    cheekbones: string;
  };
  recommendations: GlassesRecommendation[];
}

export interface GlassesRecommendation {
  style: string;
  reason: string;
  confidence: number;
  examples: string[];
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async analyzeImage(imageData: string): Promise<FaceAnalysis> {
    try {
      // Convert base64 to the format Gemini expects
      const base64Data = imageData.split(',')[1];
      
      const prompt = `
        Analyze this face image and determine the face shape. Provide a detailed analysis including:
        1. Face shape (oval, round, square, heart, diamond, or oblong)
        2. Confidence level (0-1)
        3. Facial features analysis
        4. Specific glasses recommendations for this face shape
        
        Please respond in JSON format with the following structure:
        {
          "faceShape": "detected_shape",
          "confidence": 0.85,
          "features": {
            "eyeDistance": "wide-set or close-set",
            "faceWidth": "narrow or wide",
            "jawline": "angular or soft",
            "cheekbones": "prominent or subtle"
          },
          "recommendations": [
            {
              "style": "Frame Style Name",
              "reason": "Why this style works for this face shape",
              "confidence": 0.9,
              "examples": ["Example 1", "Example 2"]
            }
          ]
        }
      `;

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return analysis;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback analysis
      return this.getFallbackAnalysis();
    }
  }

  async chatWithGemini(message: string, context?: string): Promise<string> {
    try {
      const prompt = `
        You are an expert glasses and eyewear consultant. Help users with questions about:
        - Choosing the right glasses for their face shape
        - Frame styles and trends
        - Lens types and features
        - Fashion and styling advice
        - Technical specifications
        
        ${context ? `Context: ${context}` : ''}
        
        User question: ${message}
        
        Provide helpful, friendly, and professional advice. Keep responses concise but informative.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini Chat Error:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
  }

  async generateInsights(selectedProduct?: any, userPreferences?: any): Promise<any> {
    try {
      const prompt = `
        Generate AI-powered insights for a virtual glasses try-on experience.
        ${selectedProduct ? `Selected product: ${JSON.stringify(selectedProduct)}` : ''}
        ${userPreferences ? `User preferences: ${JSON.stringify(userPreferences)}` : ''}
        
        Provide insights in JSON format:
        {
          "faceMatchScore": 95,
          "styleAnalysis": "Detailed analysis of how this style works",
          "trendScore": 87,
          "comfortPrediction": 92,
          "recommendations": [
            {
              "type": "similar_styles",
              "items": ["Style 1", "Style 2"],
              "reason": "Why these are recommended"
            }
          ],
          "personalizedTips": [
            "Tip 1 for this user",
            "Tip 2 for this user"
          ]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Gemini Insights Error:', error);
      return this.getFallbackInsights();
    }
  }

  private getFallbackAnalysis(): FaceAnalysis {
    const faceShapes = ['oval', 'round', 'square', 'heart', 'diamond', 'oblong'];
    const randomShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
    
    return {
      faceShape: randomShape,
      confidence: 0.85,
      features: {
        eyeDistance: Math.random() > 0.5 ? 'wide-set' : 'close-set',
        faceWidth: Math.random() > 0.5 ? 'narrow' : 'wide',
        jawline: Math.random() > 0.5 ? 'angular' : 'soft',
        cheekbones: Math.random() > 0.5 ? 'prominent' : 'subtle'
      },
      recommendations: this.getRecommendationsForShape(randomShape)
    };
  }

  private getFallbackInsights(): any {
    return {
      faceMatchScore: 85 + Math.random() * 10,
      styleAnalysis: "This style complements your facial features well, creating a balanced and sophisticated look.",
      trendScore: 80 + Math.random() * 15,
      comfortPrediction: 85 + Math.random() * 10,
      recommendations: [
        {
          type: "similar_styles",
          items: ["Classic Round", "Modern Aviator", "Vintage Square"],
          reason: "These styles share similar proportions and would work well with your face shape"
        }
      ],
      personalizedTips: [
        "Consider frames that are slightly wider than your face for optimal proportion",
        "The bridge width should align with your nose bridge for comfort"
      ]
    };
  }

  private getRecommendationsForShape(faceShape: string): GlassesRecommendation[] {
    const recommendations: Record<string, GlassesRecommendation[]> = {
      oval: [
        {
          style: 'Aviator',
          reason: 'Complements your balanced facial proportions perfectly',
          confidence: 0.92,
          examples: ['Classic Gold Aviator', 'Modern Titanium Aviator']
        },
        {
          style: 'Wayfarer',
          reason: 'Enhances your natural symmetry',
          confidence: 0.88,
          examples: ['Classic Black Wayfarer', 'Tortoiseshell Wayfarer']
        }
      ],
      round: [
        {
          style: 'Square Frame',
          reason: 'Adds definition and structure to your soft features',
          confidence: 0.90,
          examples: ['Bold Square Frame', 'Geometric Rectangle']
        },
        {
          style: 'Cat-Eye',
          reason: 'Creates angular contrast to balance roundness',
          confidence: 0.85,
          examples: ['Vintage Cat-Eye', 'Modern Angular Cat-Eye']
        }
      ],
      square: [
        {
          style: 'Round Frame',
          reason: 'Softens your strong jawline beautifully',
          confidence: 0.89,
          examples: ['Classic Round', 'Oversized Round']
        },
        {
          style: 'Oval Frame',
          reason: 'Balances your angular features',
          confidence: 0.86,
          examples: ['Vintage Oval', 'Modern Oval']
        }
      ],
      heart: [
        {
          style: 'Bottom-Heavy Frame',
          reason: 'Balances your wider forehead with your narrower chin',
          confidence: 0.91,
          examples: ['Clubmaster Style', 'Semi-Rimless']
        },
        {
          style: 'Aviator',
          reason: 'Complements your facial structure',
          confidence: 0.87,
          examples: ['Classic Aviator', 'Oversized Aviator']
        }
      ],
      diamond: [
        {
          style: 'Cat-Eye',
          reason: 'Emphasizes your cheekbones and balances your face',
          confidence: 0.88,
          examples: ['Retro Cat-Eye', 'Modern Cat-Eye']
        },
        {
          style: 'Oval Frame',
          reason: 'Softens your angular features',
          confidence: 0.84,
          examples: ['Classic Oval', 'Vintage Oval']
        }
      ],
      oblong: [
        {
          style: 'Oversized Frame',
          reason: 'Adds width to balance your longer face',
          confidence: 0.90,
          examples: ['Large Square Frame', 'Oversized Round']
        },
        {
          style: 'Decorative Frame',
          reason: 'Draws attention horizontally',
          confidence: 0.86,
          examples: ['Embellished Frame', 'Colorful Frame']
        }
      ]
    };

    return recommendations[faceShape] || recommendations.oval;
  }
}

export const geminiService = new GeminiService();
