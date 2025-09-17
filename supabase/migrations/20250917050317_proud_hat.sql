/*
  # Patient Records Management System

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `phone` (text)
      - `email` (text)
      - `address` (text)
      - `emergency_contact_name` (text)
      - `emergency_contact_phone` (text)
      - `blood_type` (text)
      - `allergies` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `medical_records`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `doctor_name` (text)
      - `visit_date` (date)
      - `diagnosis` (text)
      - `symptoms` (text)
      - `treatment` (text)
      - `notes` (text)
      - `created_at` (timestamp)

    - `prescriptions`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `medical_record_id` (uuid, foreign key)
      - `medication_name` (text)
      - `dosage` (text)
      - `frequency` (text)
      - `duration` (text)
      - `prescribed_date` (date)
      - `created_at` (timestamp)

    - `documents`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `document_name` (text)
      - `document_type` (text)
      - `file_url` (text)
      - `ocr_text` (text)
      - `uploaded_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (no authentication required as requested)
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL,
  phone text,
  email text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  blood_type text,
  allergies text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_name text NOT NULL,
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  diagnosis text,
  symptoms text,
  treatment text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medical_record_id uuid REFERENCES medical_records(id) ON DELETE SET NULL,
  medication_name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  duration text,
  prescribed_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  document_type text NOT NULL DEFAULT 'general',
  file_url text,
  ocr_text text,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Allow public access to patients"
  ON patients FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to medical_records"
  ON medical_records FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to prescriptions"
  ON prescriptions FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to documents"
  ON documents FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS patients_name_idx ON patients(first_name, last_name);
CREATE INDEX IF NOT EXISTS medical_records_patient_idx ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS medical_records_date_idx ON medical_records(visit_date);
CREATE INDEX IF NOT EXISTS prescriptions_patient_idx ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS documents_patient_idx ON documents(patient_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for patients table
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();