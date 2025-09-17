import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_type?: string;
  allergies?: string;
  created_at: string;
  updated_at: string;
};

export type MedicalRecord = {
  id: string;
  patient_id: string;
  doctor_name: string;
  visit_date: string;
  diagnosis?: string;
  symptoms?: string;
  treatment?: string;
  notes?: string;
  created_at: string;
};

export type Prescription = {
  id: string;
  patient_id: string;
  medical_record_id?: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration?: string;
  prescribed_date: string;
  created_at: string;
};

export type Document = {
  id: string;
  patient_id: string;
  document_name: string;
  document_type: string;
  file_url?: string;
  ocr_text?: string;
  uploaded_at: string;
};

export type VitalSigns = {
  id: string;
  patient_id: string;
  recorded_date: string;
  recorded_by: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  temperature_celsius?: number;
  oxygen_saturation?: number;
  blood_glucose?: number;
  height_cm?: number;
  weight_kg?: number;
  bmi?: number;
  notes?: string;
  created_at: string;
};

export type ChronicCondition = {
  id: string;
  patient_id: string;
  condition_name: string;
  icd_10_code?: string;
  diagnosed_date?: string;
  diagnosed_by?: string;
  severity: string;
  status: string;
  treatment_plan?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type LabResult = {
  id: string;
  patient_id: string;
  test_name: string;
  test_category: string;
  test_date: string;
  ordered_by: string;
  result_value?: string;
  result_unit?: string;
  reference_range?: string;
  status: string;
  lab_name?: string;
  lab_reference_number?: string;
  notes?: string;
  created_at: string;
};

export type Immunization = {
  id: string;
  patient_id: string;
  vaccine_name: string;
  vaccine_type?: string;
  administration_date: string;
  administered_by: string;
  manufacturer?: string;
  lot_number?: string;
  expiration_date?: string;
  dose_number: number;
  administration_site: string;
  adverse_reactions?: string;
  next_dose_due?: string;
  notes?: string;
  created_at: string;
};

export type FamilyHistory = {
  id: string;
  patient_id: string;
  relationship: string;
  condition_name: string;
  age_of_onset?: number;
  status: string;
  notes?: string;
  created_at: string;
};