import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize AI clients
const useThesys = !!process.env.THESYS_API_KEY;

const thesysClient = useThesys ? new OpenAI({
  apiKey: process.env.THESYS_API_KEY,
  baseURL: 'https://api.thesys.dev/v1/embed',
}) : null;

const anthropicClient = !useThesys ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

console.log(`🤖 Using ${useThesys ? 'Thesys C1 (Generative UI)' : 'Anthropic Claude (Text)'}`);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-domain.com'
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'as400-ai-backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: useThesys ? 'Thesys C1' : 'Anthropic Claude'
  });
});

// System prompt
const getSystemPrompt = (user_id, company_id) => `Tu es un assistant comptable expert pour une application de comptabilité AS400.

Tu aides les utilisateurs à :
- Analyser leurs données comptables
- Détecter des anomalies
- Répondre aux questions sur leur comptabilité
- Calculer des soldes et des statistiques
- Générer des rapports

Contexte utilisateur :
- User ID: ${user_id || 'non fourni'}
- Company ID: ${company_id || 'non fourni'}

Réponds toujours en français, de manière claire et professionnelle.
${useThesys ? 'IMPORTANT : Génère des UI interactives (tableaux, graphiques, cartes) quand c\'est pertinent.' : 'Utilise des émojis pour rendre tes réponses plus agréables (💰 📊 ⚠️ ✅ etc.)'}`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, user_id, company_id } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const systemPrompt = getSystemPrompt(user_id, company_id);

    if (useThesys) {
      // Use Thesys C1 with OpenAI SDK
      const openaiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const response = await thesysClient.chat.completions.create({
        model: 'c1/anthropic/claude-sonnet-4/v-20250815',
        messages: openaiMessages,
        max_tokens: 4096,
      });

      const finalMessage = response.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer de réponse.';

      res.json({
        success: true,
        message: finalMessage,
        usage: response.usage,
        mode: 'thesys-c1'
      });

    } else {
      // Use Anthropic Claude directly
      const anthropicMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await anthropicClient.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: anthropicMessages,
      });

      const textBlock = response.content.find(block => block.type === 'text');
      const finalMessage = textBlock ? textBlock.text : 'Désolé, je n\'ai pas pu générer de réponse.';

      res.json({
        success: true,
        message: finalMessage,
        usage: response.usage,
        mode: 'anthropic-claude'
      });
    }

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 AI Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✨ Mode: ${useThesys ? 'Thesys C1 (Generative UI) 🎨' : 'Anthropic Claude (Text) 📝'}`);
});
