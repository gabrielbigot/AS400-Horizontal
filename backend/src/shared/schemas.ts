import { z } from 'zod';

// Account Schema
export const AccountSchema = z.object({
  id: z.string().uuid().optional(),
  account_number: z.string().regex(/^\d{6}$/, 'Account number must be 6 digits'),
  label: z.string().min(1, 'Label is required'),
  user_id: z.string().uuid().optional(),
  created_at: z.string().optional()
});

export type Account = z.infer<typeof AccountSchema>;

// Journal Schema
export const JournalSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(2).max(3),
  name: z.string().min(1),
  company_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  created_at: z.string().optional()
});

export type Journal = z.infer<typeof JournalSchema>;

// Journal Entry Schema
export const JournalEntrySchema = z.object({
  id: z.string().uuid().optional(),
  company_id: z.string().uuid(),
  journal_id: z.string().uuid().nullable().optional(),
  batch_id: z.string(),
  compte: z.string().regex(/^\d{6}$/, 'Account number must be 6 digits'),
  s: z.enum(['D', 'C']),
  montant: z.number().positive(),
  libelle: z.string().min(1),
  date: z.string().regex(/^\d{2}\/\d{2}\/\d{2}$/, 'Date format must be DD/MM/YY'),
  status: z.enum(['draft', 'posted']).default('draft'),
  letter_code: z.string().nullable().optional(),
  posted_at: z.string().nullable().optional(),
  user_id: z.string().uuid().optional(),
  created_at: z.string().optional()
});

export type JournalEntry = z.infer<typeof JournalEntrySchema>;

// Balance Row Schema
export const BalanceRowSchema = z.object({
  compte: z.string(),
  label: z.string(),
  debit: z.number(),
  credit: z.number(),
  solde: z.number()
});

export type BalanceRow = z.infer<typeof BalanceRowSchema>;

// Company Settings Schema
export const CompanySettingsSchema = z.object({
  id: z.string().uuid().optional(),
  company_id: z.string().uuid(),
  accounting_year_start: z.string(),
  accounting_year_end: z.string(),
  accounting_year_closed: z.boolean().default(false),
  club_name: z.string().optional(),
  club_address: z.string().optional(),
  club_city: z.string().optional(),
  club_postal_code: z.string().optional(),
  club_phone: z.string().optional(),
  club_email: z.string().email().optional(),
  default_bank_account: z.string().optional(),
  default_cash_account: z.string().optional(),
  default_result_account: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});

export type CompanySettings = z.infer<typeof CompanySettingsSchema>;

// Paginated Response Schema
export const PaginatedSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number()
  });
