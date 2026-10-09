import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialise Gemini SDK
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Failed to initialise GoogleGenAI:', err);
  }
}

// 1. AI Copilot Route
app.post('/api/copilot', async (req, res) => {
  const { query, city = 'Pune', budget = 500, style = 'immersive' } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (genAI && process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are CITYVERSE AI, the next-generation smart city exploration copilot for ${city}.
A user asked: "${query}" with a budget reference of ₹${budget}.
Generate an inspiring, realistic, high-tech urban itinerary and recommendations for ${city}.
Respond ONLY with a valid JSON object matching this schema:
{
  "title": "Short punchy adventure title",
  "overview": "2-3 sentences overview of the experience",
  "estimatedBudget": "e.g. ₹450 (under ₹${budget})",
  "vibes": ["Vibe 1", "Vibe 2", "Vibe 3"],
  "stops": [
    {
      "time": "09:30 AM",
      "placeName": "Name of real spot in ${city}",
      "category": "Heritage" | "Culinary" | "Viewpoint" | "Sanctuary" | "Culture",
      "description": "Engaging 1-2 sentence description",
      "estimatedCost": "₹150",
      "coordinates": [18.5204, 73.8567],
      "highlight": "Secret photography angle or signature food"
    }
  ],
  "localTips": [
    "Practical urban exploration tip 1",
    "Practical urban exploration tip 2"
  ]
}
Provide exactly 3 to 4 stops with real coordinates in or around ${city}. Return JSON only. No markdown ticks if possible, or clean standard json.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, data: parsed, isLiveAI: true });
      } catch (jsonErr) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, data: parsed, isLiveAI: true });
      }
    } catch (err: any) {
      console.warn('Gemini API call failed, using intelligent fallback:', err?.message);
    }
  }

  // Fallback rich itinerary if Gemini API is unavailable or offline
  const fallbackItinerary = {
    title: `${city} Cyber-Heritage & Secret Alleys Quest`,
    overview: `An expertly optimized itinerary for ${city} combining historic architectural wonders, high-altitude vantage points, and secluded artisan food stops while respecting your ₹${budget} budget.`,
    estimatedBudget: `₹${Math.min(budget, 480)} Total`,
    vibes: ['Cyber-Heritage', 'Culinary Lore', 'Eco-Walk'],
    stops: [
      {
        time: '08:30 AM',
        placeName: city.toLowerCase().includes('pune') ? 'Shaniwar Wada Stone Bastion' : 'Old City Heritage Archways',
        category: 'Heritage',
        description: 'Atmospheric early morning exploration of the 18th-century fortification with cyber-augmented audio tours and teak gateways.',
        estimatedCost: '₹50 entry fee',
        coordinates: [18.5196, 73.8553],
        highlight: 'Quiet morning light over the Dilli Darwaza courtyard'
      },
      {
        time: '11:15 AM',
        placeName: city.toLowerCase().includes('pune') ? 'FC Road Hidden Irani Cafe & Bun Maska' : 'Historic Artisan Tea Den',
        category: 'Culinary',
        description: 'Authentic city food stop serving freshly baked crusty bread, spiced chai, and heritage berry sodas.',
        estimatedCost: '₹120 meal',
        coordinates: [18.5246, 73.8398],
        highlight: 'Crispy Bun Maska paired with double-boiled Irani Chai'
      },
      {
        time: '03:30 PM',
        placeName: city.toLowerCase().includes('pune') ? 'Vetal Tekdi High-Ridge Sanctuary' : 'Zen Ridge Observation Deck',
        category: 'Sanctuary',
        description: 'The highest natural elevation in the metropolis offering biophilic nature paths, peacock sightings, and panoramic city views.',
        estimatedCost: '₹0 (Free access)',
        coordinates: [18.5284, 73.8189],
        highlight: 'Sunset panoramic overlook across the glowing skyline'
      },
      {
        time: '06:45 PM',
        placeName: city.toLowerCase().includes('pune') ? 'JM Road Cyber-Lit Street Food Bazaar' : 'Night Market Avenue',
        category: 'Culinary',
        description: 'Bustling night market with glowing food stalls, artisanal street momos, sizzling bhaji, and fruit kulfi.',
        estimatedCost: '₹180 street dinner',
        coordinates: [18.5230, 73.8488],
        highlight: 'Sizzling local delicacies under ambient city lights'
      }
    ],
    localTips: [
      'Take the electric Pune Metro line between Civil Court and Vanaz to save travel time.',
      'Carry a reusable thermal flask — city water refill pods are located at all heritage hubs.'
    ]
  };

  return res.json({ success: true, data: fallbackItinerary, isLiveAI: false });
});

// 2. Snap The City Vision AI Route
app.post('/api/snap-city', async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg', location = 'Central Ward', description = '' } = req.body;

  if (genAI && process.env.GEMINI_API_KEY && imageBase64) {
    try {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const prompt = `You are CITYVERSE AI Civic Vision Assistant.
Analyze this urban photograph. Identify if there is a municipal or public infrastructure problem (e.g., pothole, broken sidewalk, garbage overflow, streetlamp breakdown, drainage clogging, damaged signage) or a civic feature.
Return ONLY valid JSON matching this schema:
{
  "detectedCategory": "Pothole & Road Hazard" | "Sidewalk Obstruction" | "Garbage Overflow" | "Lighting & Electrical" | "Drainage Issue" | "Public Property Defect",
  "severity": "High" | "Medium" | "Low",
  "confidenceScore": 94,
  "summary": "1 sentence technical summary of the observed defect",
  "departmentAssigned": "Municipal Road Infrastructure Division",
  "estimatedRepairTurnaround": "24 to 48 Hours",
  "actionPlan": "Auto-routed to ward maintenance squad for rapid patching."
}`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const text = response.text || '';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, report: parsed, isLiveAI: true });
      } catch (e) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, report: parsed, isLiveAI: true });
      }
    } catch (err: any) {
      console.warn('Vision API call failed, using intelligent fallback:', err?.message);
    }
  }

  // Fallback civic report
  const sampleCategories = [
    { cat: 'Pothole & Asphalt Erosion', sev: 'High', dep: 'Roadway Maintenance Corps', time: '24-36 Hours', summary: 'Surface asphalt fracture approximately 40cm wide requiring rapid cold-mix patching.' },
    { cat: 'Garbage & Waste Accumulation', sev: 'Medium', dep: 'Sanitation & Solid Waste Wing', time: '12 Hours', summary: 'Spillover waste detected at intersection collection perimeter.' },
    { cat: 'Broken Streetlight Luminaire', sev: 'Medium', dep: 'Public Electrical Grid Dept', time: '24 Hours', summary: 'Light fixture non-operational; cabling casing requires inspection.' }
  ];

  const chosen = sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
  return res.json({
    success: true,
    report: {
      detectedCategory: chosen.cat,
      severity: chosen.sev,
      confidenceScore: 92,
      summary: chosen.summary,
      departmentAssigned: chosen.dep,
      estimatedRepairTurnaround: chosen.time,
      actionPlan: 'Dispatched ticket to localized civic response vehicle via Smart City Mesh.'
    },
    isLiveAI: false
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CITYVERSE AI Server listening on port ${PORT}`);
  });
}

startServer();
