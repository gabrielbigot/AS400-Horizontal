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
    version: '2.0.0',
    mode: useThesys ? 'Thesys C1' : 'Anthropic Claude'
  });
});

// ==============================================================================
// TOOLS DEFINITION - Format Anthropic (pour référence)
// ==============================================================================
const anthropicTools = [
  {
    name: 'query_database',
    description: 'Query the Supabase database to retrieve accounting data. Supports filtering, sorting, and pagination.',
    input_schema: {
      type: 'object',
      properties: {
        table: {
          type: 'string',
          enum: ['companies', 'journals', 'journal_accounts', 'journal_entries', 'accounts', 'company_settings', 'regles'],
          description: 'The table to query'
        },
        filters: {
          type: 'object',
          description: 'Filters to apply (e.g., { "status": "draft", "compte": { "like": "411%" } })',
          additionalProperties: true
        },
        select: {
          type: 'string',
          description: 'Columns to select (default: "*")'
        },
        order: {
          type: 'string',
          description: 'Column to order by with direction (e.g., "created_at.desc")'
        },
        limit: {
          type: 'number',
          description: 'Maximum number of rows to return'
        }
      },
      required: ['table']
    }
  },
  {
    name: 'analyze_account_balance',
    description: 'Calculate the balance of a specific account (debit - credit). Returns debit total, credit total, balance, and number of entries.',
    input_schema: {
      type: 'object',
      properties: {
        company_id: {
          type: 'string',
          description: 'The company ID (UUID)'
        },
        account_number: {
          type: 'string',
          description: 'The account number (6 digits, e.g., "411000")'
        },
        status_filter: {
          type: 'string',
          enum: ['all', 'draft', 'posted'],
          description: 'Filter by entry status (default: "all")'
        }
      },
      required: ['account_number']
    }
  },
  {
    name: 'detect_anomalies',
    description: 'Detect anomalies in accounting entries such as unbalanced batches, duplicate entries, unusual amounts, missing lettrage, or old drafts.',
    input_schema: {
      type: 'object',
      properties: {
        company_id: {
          type: 'string',
          description: 'The company ID (UUID)'
        },
        check_types: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['unbalanced_batches', 'duplicate_entries', 'unusual_amounts', 'missing_lettrage', 'old_drafts']
          },
          description: 'Types of anomaly checks to perform'
        }
      }
    }
  }
];

// ==============================================================================
// TOOLS DEFINITION - Format OpenAI (pour Thesys C1)
// ==============================================================================
const openaiTools = [
  {
    type: 'function',
    function: {
      name: 'query_database',
      description: 'Query the Supabase database to retrieve accounting data. Supports filtering, sorting, and pagination.',
      parameters: {
        type: 'object',
        properties: {
          table: {
            type: 'string',
            enum: ['companies', 'journals', 'journal_accounts', 'journal_entries', 'accounts', 'company_settings', 'regles'],
            description: 'The table to query'
          },
          filters: {
            type: 'object',
            description: 'Filters to apply (e.g., { "status": "draft", "compte": { "like": "411%" } })',
            additionalProperties: true
          },
          select: {
            type: 'string',
            description: 'Columns to select (default: "*")'
          },
          order: {
            type: 'string',
            description: 'Column to order by with direction (e.g., "created_at.desc")'
          },
          limit: {
            type: 'number',
            description: 'Maximum number of rows to return'
          }
        },
        required: ['table']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'analyze_account_balance',
      description: 'Calculate the balance of a specific account (debit - credit). Returns debit total, credit total, balance, and number of entries.',
      parameters: {
        type: 'object',
        properties: {
          company_id: {
            type: 'string',
            description: 'The company ID (UUID)'
          },
          account_number: {
            type: 'string',
            description: 'The account number (6 digits, e.g., "411000")'
          },
          status_filter: {
            type: 'string',
            enum: ['all', 'draft', 'posted'],
            description: 'Filter by entry status (default: "all")'
          }
        },
        required: ['account_number']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'detect_anomalies',
      description: 'Detect anomalies in accounting entries such as unbalanced batches, duplicate entries, unusual amounts, missing lettrage, or old drafts.',
      parameters: {
        type: 'object',
        properties: {
          company_id: {
            type: 'string',
            description: 'The company ID (UUID)'
          },
          check_types: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['unbalanced_batches', 'duplicate_entries', 'unusual_amounts', 'missing_lettrage', 'old_drafts']
            },
            description: 'Types of anomaly checks to perform'
          }
        }
      }
    }
  }
];

// ==============================================================================
// TOOL EXECUTION FUNCTIONS
// ==============================================================================

async function executeQueryDatabase(input) {
  try {
    let query = supabase.from(input.table).select(input.select || '*');

    // Apply filters
    if (input.filters) {
      for (const [key, value] of Object.entries(input.filters)) {
        if (typeof value === 'object' && value !== null) {
          // Handle complex filters like { like: "411%" }
          const [operator, filterValue] = Object.entries(value)[0];
          query = query[operator](key, filterValue);
        } else {
          query = query.eq(key, value);
        }
      }
    }

    // Apply ordering
    if (input.order) {
      const [column, direction] = input.order.split('.');
      query = query.order(column, { ascending: direction !== 'desc' });
    }

    // Apply limit
    if (input.limit) {
      query = query.limit(input.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      data,
      count: data?.length || 0
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function executeAnalyzeAccountBalance(input) {
  try {
    let query = supabase
      .from('journal_entries')
      .select('s, montant, status')
      .eq('compte', input.account_number);

    if (input.company_id) {
      query = query.eq('company_id', input.company_id);
    }

    if (input.status_filter && input.status_filter !== 'all') {
      query = query.eq('status', input.status_filter);
    }

    const { data, error } = await query;

    if (error) throw error;

    let debit = 0;
    let credit = 0;

    data?.forEach(entry => {
      if (entry.s === 'D') {
        debit += entry.montant;
      } else if (entry.s === 'C') {
        credit += entry.montant;
      }
    });

    return {
      success: true,
      account: input.account_number,
      debit: parseFloat(debit.toFixed(2)),
      credit: parseFloat(credit.toFixed(2)),
      balance: parseFloat((debit - credit).toFixed(2)),
      entry_count: data?.length || 0
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function executeDetectAnomalies(input) {
  try {
    const anomalies = [];
    const checkTypes = input.check_types || ['unbalanced_batches', 'duplicate_entries', 'unusual_amounts', 'missing_lettrage', 'old_drafts'];

    // Check 1: Unbalanced batches
    if (checkTypes.includes('unbalanced_batches')) {
      let query = supabase
        .from('journal_entries')
        .select('batch_id, s, montant');

      if (input.company_id) {
        query = query.eq('company_id', input.company_id);
      }

      const { data } = await query;

      const batchMap = new Map();
      data?.forEach(entry => {
        const existing = batchMap.get(entry.batch_id) || { debit: 0, credit: 0 };
        if (entry.s === 'D') {
          existing.debit += entry.montant;
        } else {
          existing.credit += entry.montant;
        }
        batchMap.set(entry.batch_id, existing);
      });

      batchMap.forEach((totals, batchId) => {
        const diff = Math.abs(totals.debit - totals.credit);
        if (diff > 0.01) {
          anomalies.push({
            type: 'unbalanced_batches',
            severity: 'high',
            description: `Lot ${batchId} déséquilibré`,
            details: {
              batch_id: batchId,
              debit: totals.debit,
              credit: totals.credit,
              difference: parseFloat(diff.toFixed(2))
            }
          });
        }
      });
    }

    // Check 2: Old drafts (> 30 days)
    if (checkTypes.includes('old_drafts')) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      let query = supabase
        .from('journal_entries')
        .select('batch_id, created_at')
        .eq('status', 'draft')
        .lt('created_at', thirtyDaysAgo.toISOString());

      if (input.company_id) {
        query = query.eq('company_id', input.company_id);
      }

      const { data } = await query;

      const uniqueBatches = new Set(data?.map(e => e.batch_id));
      if (uniqueBatches.size > 0) {
        anomalies.push({
          type: 'old_drafts',
          severity: 'medium',
          description: `${uniqueBatches.size} lot(s) en brouillard depuis plus de 30 jours`,
          details: {
            count: uniqueBatches.size,
            batches: Array.from(uniqueBatches).slice(0, 10)
          }
        });
      }
    }

    // Check 3: Missing lettrage (accounts 411xxx and 401xxx)
    if (checkTypes.includes('missing_lettrage')) {
      let query = supabase
        .from('journal_entries')
        .select('compte, id')
        .is('letter_code', null)
        .eq('status', 'posted');

      if (input.company_id) {
        query = query.eq('company_id', input.company_id);
      }

      const { data } = await query;

      const clientEntries = data?.filter(e => e.compte.startsWith('411')) || [];
      const fournisseurEntries = data?.filter(e => e.compte.startsWith('401')) || [];

      if (clientEntries.length > 0 || fournisseurEntries.length > 0) {
        anomalies.push({
          type: 'missing_lettrage',
          severity: 'low',
          description: `${clientEntries.length + fournisseurEntries.length} écritures clients/fournisseurs non lettrées`,
          details: {
            clients: clientEntries.length,
            fournisseurs: fournisseurEntries.length
          }
        });
      }
    }

    // Check 4: Unusual amounts (> 10,000)
    if (checkTypes.includes('unusual_amounts')) {
      let query = supabase
        .from('journal_entries')
        .select('id, compte, montant, libelle')
        .gt('montant', 10000);

      if (input.company_id) {
        query = query.eq('company_id', input.company_id);
      }

      const { data } = await query;

      if (data && data.length > 0) {
        anomalies.push({
          type: 'unusual_amounts',
          severity: 'medium',
          description: `${data.length} écriture(s) avec montant > 10 000€`,
          details: {
            count: data.length,
            entries: data.slice(0, 5).map(e => ({
              compte: e.compte,
              montant: e.montant,
              libelle: e.libelle
            }))
          }
        });
      }
    }

    return {
      success: true,
      anomalies,
      summary: {
        total_anomalies: anomalies.length,
        high_severity: anomalies.filter(a => a.severity === 'high').length,
        medium_severity: anomalies.filter(a => a.severity === 'medium').length,
        low_severity: anomalies.filter(a => a.severity === 'low').length
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Execute tool based on name
async function executeTool(toolName, toolInput) {
  console.log(`🔧 Executing tool: ${toolName}`);

  switch (toolName) {
    case 'query_database':
      return await executeQueryDatabase(toolInput);
    case 'analyze_account_balance':
      return await executeAnalyzeAccountBalance(toolInput);
    case 'detect_anomalies':
      return await executeDetectAnomalies(toolInput);
    default:
      return { success: false, error: `Unknown tool: ${toolName}` };
  }
}

// ==============================================================================
// SYSTEM PROMPT
// ==============================================================================

const getSystemPrompt = (user_id, company_id) => `Tu es un assistant comptable expert pour une application de comptabilité AS400.

Tu aides les utilisateurs à :
- Analyser leurs données comptables
- Détecter des anomalies
- Répondre aux questions sur leur comptabilité
- Calculer des soldes et des statistiques
- Générer des rapports

Tu as accès à 3 outils puissants :
1. query_database : Pour interroger la base de données Supabase
2. analyze_account_balance : Pour calculer le solde d'un compte
3. detect_anomalies : Pour détecter des anomalies comptables

Contexte utilisateur :
- User ID: ${user_id || 'non fourni'}
- Company ID: ${company_id || 'non fourni'}

Réponds toujours en français, de manière claire et professionnelle.
${useThesys ? `
IMPORTANT - Thesys C1 activé :
- Génère des UI interactives (tableaux, graphiques, cartes) quand c'est pertinent
- Présente les données comptables sous forme de tableaux
- Utilise des cartes pour les anomalies avec code couleur (🔴 haute, 🟡 moyenne, 🟢 faible)
- Crée des boutons d'action contextuels
- Organise les informations de manière visuelle
` : 'Utilise des émojis pour rendre tes réponses plus agréables (💰 📊 ⚠️ ✅ etc.)'}`;

// ==============================================================================
// CHAT ENDPOINT - MODE THESYS C1
// ==============================================================================

async function handleThesysChat(messages, user_id, company_id) {
  const systemPrompt = getSystemPrompt(user_id, company_id);

  const openaiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  ];

  let iterations = 0;
  const maxIterations = 10;
  let currentMessages = [...openaiMessages];

  while (iterations < maxIterations) {
    const response = await thesysClient.chat.completions.create({
      model: 'c1/anthropic/claude-sonnet-4/v-20250815',
      messages: currentMessages,
      max_tokens: 4096,
      tools: openaiTools,
    });

    const choice = response.choices[0];
    const message = choice.message;

    // Check if the model wants to call tools
    if (choice.finish_reason === 'tool_calls' && message.tool_calls) {
      iterations++;
      console.log(`[Iteration ${iterations}] Tool calls requested: ${message.tool_calls.length}`);

      // Add assistant message with tool calls
      currentMessages.push(message);

      // Execute each tool call
      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolInput = JSON.parse(toolCall.function.arguments);

        const toolResult = await executeTool(toolName, toolInput);

        // Add tool result message
        currentMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult)
        });
      }

      // Continue the loop to get the next response
      continue;
    }

    // No more tool calls, return the final message
    return {
      success: true,
      message: message.content || 'Désolé, je n\'ai pas pu générer de réponse.',
      usage: response.usage,
      iterations: iterations,
      mode: 'thesys-c1'
    };
  }

  // Max iterations reached
  return {
    success: false,
    message: 'Nombre maximum d\'itérations atteint.',
    iterations: maxIterations,
    mode: 'thesys-c1'
  };
}

// ==============================================================================
// CHAT ENDPOINT - MODE ANTHROPIC
// ==============================================================================

async function handleAnthropicChat(messages, user_id, company_id) {
  const systemPrompt = getSystemPrompt(user_id, company_id);

  const anthropicMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  let response = await anthropicClient.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: anthropicMessages,
    tools: anthropicTools
  });

  let iterations = 0;
  const maxIterations = 10;

  // Handle tool use loop
  while (response.stop_reason === 'tool_use' && iterations < maxIterations) {
    iterations++;

    const toolUseBlock = response.content.find(block => block.type === 'tool_use');
    if (!toolUseBlock) break;

    console.log(`[Iteration ${iterations}] Tool: ${toolUseBlock.name}`);

    // Execute the tool
    const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input);

    // Continue conversation with tool result
    anthropicMessages.push({
      role: 'assistant',
      content: response.content
    });

    anthropicMessages.push({
      role: 'user',
      content: [
        {
          type: 'tool_result',
          tool_use_id: toolUseBlock.id,
          content: JSON.stringify(toolResult)
        }
      ]
    });

    response = await anthropicClient.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: anthropicMessages,
      tools: anthropicTools
    });
  }

  // Extract final text response
  const textBlock = response.content.find(block => block.type === 'text');
  const finalMessage = textBlock ? textBlock.text : 'Désolé, je n\'ai pas pu générer de réponse.';

  return {
    success: true,
    message: finalMessage,
    usage: response.usage,
    iterations: iterations,
    mode: 'anthropic-claude'
  };
}

// ==============================================================================
// MAIN CHAT ENDPOINT
// ==============================================================================

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, user_id, company_id } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log(`💬 Chat request received (${messages.length} messages)`);

    let result;

    if (useThesys) {
      result = await handleThesysChat(messages, user_id, company_id);
    } else {
      result = await handleAnthropicChat(messages, user_id, company_id);
    }

    res.json(result);

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// ==============================================================================
// START SERVER
// ==============================================================================

app.listen(PORT, () => {
  console.log(`🚀 ========================================`);
  console.log(`🤖 AI Backend server running`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: POST http://localhost:${PORT}/api/chat`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✨ Mode: ${useThesys ? 'Thesys C1 (Generative UI) 🎨' : 'Anthropic Claude (Text) 📝'}`);
  console.log(`🛠️  Tools: query_database, analyze_account_balance, detect_anomalies`);
  console.log(`🗄️  Database: Supabase connected`);
  console.log(`========================================`);
});
