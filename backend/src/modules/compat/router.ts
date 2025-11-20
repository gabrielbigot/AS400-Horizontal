import { Router, type Request, type Response } from 'express';
import { supabase } from '../../infra/supabase.js';
import { AccountSchema, JournalSchema, JournalEntrySchema } from '../../shared/schemas.js';

export const compatRouter = Router();

// GET /api/compat/accounts - List all accounts
compatRouter.get('/accounts', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;
    const offset = (page - 1) * pageSize;

    const { data, error, count } = await supabase
      .from('accounts')
      .select('*', { count: 'exact' })
      .order('account_number')
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    res.json({
      items: data || [],
      total: count || 0,
      page,
      pageSize
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// POST /api/compat/accounts - Create account
compatRouter.post('/accounts', async (req: Request, res: Response) => {
  try {
    const validated = AccountSchema.parse(req.body);

    const { data, error } = await supabase
      .from('accounts')
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(400).json({ error: 'Failed to create account' });
  }
});

// GET /api/compat/journals - List all journals
compatRouter.get('/journals', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .order('code');

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Error fetching journals:', error);
    res.status(500).json({ error: 'Failed to fetch journals' });
  }
});

// POST /api/compat/journals - Create journal
compatRouter.post('/journals', async (req: Request, res: Response) => {
  try {
    const validated = JournalSchema.parse(req.body);

    const { data, error } = await supabase
      .from('journals')
      .insert(validated)
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating journal:', error);
    res.status(400).json({ error: 'Failed to create journal' });
  }
});

// GET /api/compat/entries - List journal entries
compatRouter.get('/entries', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 100;
    const offset = (page - 1) * pageSize;
    const status = req.query.status as string || undefined;

    let query = supabase
      .from('journal_entries')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query.range(offset, offset + pageSize - 1);

    if (error) throw error;

    res.json({
      items: data || [],
      total: count || 0,
      page,
      pageSize
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// POST /api/compat/entries - Create journal entry
compatRouter.post('/entries', async (req: Request, res: Response) => {
  try {
    const entries = Array.isArray(req.body) ? req.body : [req.body];
    const validated = entries.map((entry: unknown) => JournalEntrySchema.parse(entry));

    const { data, error } = await supabase
      .from('journal_entries')
      .insert(validated)
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating entries:', error);
    res.status(400).json({ error: 'Failed to create entries' });
  }
});

// GET /api/compat/reports/balance - Generate balance report
compatRouter.get('/reports/balance', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    let query = supabase
      .from('journal_entries')
      .select('compte, montant, s, status');

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query.eq('status', 'posted');

    if (error) throw error;

    // Calculate balance for each account
    const balanceMap = new Map<string, { debit: number, credit: number }>();

    data?.forEach(entry => {
      const existing = balanceMap.get(entry.compte) || { debit: 0, credit: 0 };

      if (entry.s === 'D') {
        existing.debit += entry.montant;
      } else {
        existing.credit += entry.montant;
      }

      balanceMap.set(entry.compte, existing);
    });

    // Get account labels
    const accountNumbers = Array.from(balanceMap.keys());
    const { data: accounts } = await supabase
      .from('accounts')
      .select('account_number, label')
      .in('account_number', accountNumbers);

    const accountMap = new Map(accounts?.map(a => [a.account_number, a.label]) || []);

    // Format balance rows
    const balance = Array.from(balanceMap.entries()).map(([compte, { debit, credit }]) => ({
      compte,
      label: accountMap.get(compte) || 'Compte inconnu',
      debit,
      credit,
      solde: debit - credit
    })).sort((a, b) => a.compte.localeCompare(b.compte));

    res.json(balance);
  } catch (error) {
    console.error('Error generating balance:', error);
    res.status(500).json({ error: 'Failed to generate balance' });
  }
});

// GET /api/compat/reports/grand-livre - Generate general ledger
compatRouter.get('/reports/grand-livre', async (req: Request, res: Response) => {
  try {
    const compte = req.query.compte as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    let query = supabase
      .from('journal_entries')
      .select('*')
      .eq('status', 'posted')
      .order('date')
      .order('created_at');

    if (compte) {
      query = query.eq('compte', compte);
    }

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Error generating grand livre:', error);
    res.status(500).json({ error: 'Failed to generate grand livre' });
  }
});

// GET /api/compat/reports/fec - Generate FEC export
compatRouter.get('/reports/fec', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    let query = supabase
      .from('journal_entries')
      .select(`
        *,
        journals (code, name)
      `)
      .eq('status', 'posted')
      .order('date')
      .order('batch_id');

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Get account labels
    const accountNumbers = [...new Set(data?.map(e => e.compte))];
    const { data: accounts } = await supabase
      .from('accounts')
      .select('account_number, label')
      .in('account_number', accountNumbers);

    const accountMap = new Map(accounts?.map(a => [a.account_number, a.label]) || []);

    // Format FEC lines
    const fecLines = data?.map(entry => {
      const journal = entry.journals as any;
      return {
        JournalCode: journal?.code || 'OD',
        JournalLib: journal?.name || 'Opérations Diverses',
        EcritureNum: entry.batch_id,
        EcritureDate: entry.date,
        CompteNum: entry.compte,
        CompteLib: accountMap.get(entry.compte) || '',
        CompAuxNum: '',
        CompAuxLib: '',
        PieceRef: '',
        PieceDate: entry.date,
        EcritureLib: entry.libelle,
        Debit: entry.s === 'D' ? entry.montant.toFixed(2) : '0.00',
        Credit: entry.s === 'C' ? entry.montant.toFixed(2) : '0.00',
        EcritureLet: entry.letter_code || '',
        DateLet: '',
        ValidDate: entry.posted_at || entry.date,
        Montantdevise: '0.00',
        Idevise: 'EUR'
      };
    }) || [];

    res.json(fecLines);
  } catch (error) {
    console.error('Error generating FEC:', error);
    res.status(500).json({ error: 'Failed to generate FEC' });
  }
});
