import { z } from 'zod';

// ====================================================================
// 🔥 SCHÉMAS DE VALIDATION ZOD
// ====================================================================

/**
 * Order Schema - Validation des commandes
 */
export const OrderSchema = z.object({
  weight: z.number()
    .min(0.5, "Le poids minimum est de 0.5kg")
    .max(50, "Le poids maximum est de 50kg"),
  
  total_price: z.number()
    .positive("Le prix doit être positif")
    .max(1000, "Prix maximum: 1000€"),
  
  pickup_address: z.string()
    .min(10, "L'adresse doit contenir au moins 10 caractères")
    .max(500, "Adresse trop longue"),
  
  pickup_date: z.string()
    .datetime("Format de date invalide"),
  
  delivery_date: z.string()
    .datetime("Format de date invalide"),
  
  status: z.enum(['pending', 'assigned', 'in_progress', 'ready', 'completed', 'cancelled']),
  
  payment_intent_id: z.string().optional(),
  partner_id: z.string().uuid().optional().nullable(),
  user_id: z.string().uuid(),
});

export type OrderInput = z.infer<typeof OrderSchema>;

/**
 * Partner Schema - Validation des partenaires
 */
export const PartnerSchema = z.object({
  company_name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Nom trop long"),
  
  email: z.string()
    .email("Email invalide")
    .toLowerCase(),
  
  phone: z.string()
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone français invalide"),
  
  address: z.string()
    .min(10, "Adresse complète requise"),
  
  city: z.string()
    .min(2, "Ville requise"),
  
  postal_code: z.string()
    .regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
  
  siret: z.string()
    .regex(/^\d{14}$/, "SIRET invalide (14 chiffres)")
    .optional(),
  
  capacity_kg_per_day: z.number()
    .int()
    .min(10, "Capacité minimum: 10kg/jour")
    .max(500, "Capacité maximum: 500kg/jour"),
  
  is_active: z.boolean().default(true),
});

export type PartnerInput = z.infer<typeof PartnerSchema>;

/**
 * Contact Message Schema
 */
export const ContactMessageSchema = z.object({
  name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Nom trop long"),
  
  email: z.string()
    .email("Email invalide")
    .toLowerCase(),
  
  subject: z.string()
    .min(3, "Le sujet doit contenir au moins 3 caractères")
    .max(200, "Sujet trop long")
    .optional(),
  
  message: z.string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(2000, "Message trop long (max 2000 caractères)"),
});

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;

/**
 * User Profile Schema
 */
export const UserProfileSchema = z.object({
  full_name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Nom trop long")
    .optional(),
  
  phone: z.string()
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro français invalide")
    .optional(),
  
  email: z.string()
    .email("Email invalide")
    .toLowerCase(),
  
  address: z.string()
    .min(10, "Adresse complète requise")
    .optional(),
});

export type UserProfileInput = z.infer<typeof UserProfileSchema>;

/**
 * Payment Schema - Validation Stripe
 */
export const PaymentSchema = z.object({
  amount: z.number()
    .positive("Le montant doit être positif")
    .min(10, "Montant minimum: 10€")
    .max(1000, "Montant maximum: 1000€"),
  
  order_id: z.string().uuid(),
  
  payment_method: z.enum(['card', 'sepa_debit']).optional(),
});

export type PaymentInput = z.infer<typeof PaymentSchema>;

/**
 * Helper: Valider et logger les erreurs
 */
export const validateOrThrow = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Validation error:', error.errors);
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

/**
 * Helper: Valider sans throw (retourne les erreurs)
 */
export const validateSafe = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  return schema.safeParse(data);
};