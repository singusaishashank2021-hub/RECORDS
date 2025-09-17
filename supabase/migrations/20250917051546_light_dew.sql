/*
  # Enhanced Patient Records with Comprehensive Health Parameters

  1. New Tables
    - `vital_signs` - Track blood pressure, heart rate, temperature, etc.
    - `chronic_conditions` - Manage ongoing health conditions
    - `lab_results` - Store laboratory test results
    - `immunizations` - Track vaccination history
    - `family_history` - Record family medical history

  2. Enhanced Tables
    - `patients` - Added insurance, occupation, lifestyle fields
    - `prescriptions` - Added refills, pharmacy, side effects tracking
    - `medical_records` - Added vital signs reference, follow-up dates

  3. Security
    - Enable RLS on all new tables
    - Add policies for public access (demo purposes)
*/

-- Add new fields to patients table
DO $$
BEGIN
  -- Insurance and demographic information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'insurance_provider') THEN
    ALTER TABLE patients ADD COLUMN insurance_provider text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'insurance_policy_number') THEN
    ALTER TABLE patients ADD COLUMN insurance_policy_number text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'occupation') THEN
    ALTER TABLE patients ADD COLUMN occupation text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'marital_status') THEN
    ALTER TABLE patients ADD COLUMN marital_status text DEFAULT 'single';
  END IF;
  
  -- Lifestyle factors
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'smoking_status') THEN
    ALTER TABLE patients ADD COLUMN smoking_status text DEFAULT 'never';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'alcohol_consumption') THEN
    ALTER TABLE patients ADD COLUMN alcohol_consumption text DEFAULT 'none';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'exercise_frequency') THEN
    ALTER TABLE patients ADD COLUMN exercise_frequency text DEFAULT 'none';
  END IF;
  
  -- Physical characteristics
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'height_cm') THEN
    ALTER TABLE patients ADD COLUMN height_cm integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'weight_kg') THEN
    ALTER TABLE patients ADD COLUMN weight_kg decimal(5,2);
  END IF;
  
  -- Medical identifiers
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'medical_record_number') THEN
    ALTER TABLE patients ADD COLUMN medical_record_number text UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'primary_physician') THEN
    ALTER TABLE patients ADD COLUMN primary_physician text;
  END IF;
END $$;

-- Create vital_signs table
CREATE TABLE IF NOT EXISTS vital_signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  recorded_date timestamptz DEFAULT now(),
  recorded_by text NOT NULL,
  
  -- Blood pressure
  systolic_bp integer,
  diastolic_bp integer,
  
  -- Heart and respiratory
  heart_rate integer,
  respiratory_rate integer,
  
  -- Temperature
  temperature_celsius decimal(4,2),
  
  -- Other vitals
  oxygen_saturation integer,
  blood_glucose integer,
  
  -- Physical measurements
  height_cm integer,
  weight_kg decimal(5,2),
  bmi decimal(4,2),
  
  -- Additional notes
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create chronic_conditions table
CREATE TABLE IF NOT EXISTS chronic_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  condition_name text NOT NULL,
  icd_10_code text,
  diagnosed_date date,
  diagnosed_by text,
  severity text DEFAULT 'mild',
  status text DEFAULT 'active',
  treatment_plan text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lab_results table
CREATE TABLE IF NOT EXISTS lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  test_category text DEFAULT 'general',
  test_date date DEFAULT CURRENT_DATE,
  ordered_by text NOT NULL,
  
  -- Results
  result_value text,
  result_unit text,
  reference_range text,
  status text DEFAULT 'normal',
  
  -- Lab information
  lab_name text,
  lab_reference_number text,
  
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create immunizations table
CREATE TABLE IF NOT EXISTS immunizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  vaccine_type text,
  administration_date date DEFAULT CURRENT_DATE,
  administered_by text NOT NULL,
  
  -- Vaccine details
  manufacturer text,
  lot_number text,
  expiration_date date,
  dose_number integer DEFAULT 1,
  
  -- Location and reaction
  administration_site text DEFAULT 'left arm',
  adverse_reactions text,
  
  -- Next dose information
  next_dose_due date,
  
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create family_history table
CREATE TABLE IF NOT EXISTS family_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  relationship text NOT NULL,
  condition_name text NOT NULL,
  age_of_onset integer,
  status text DEFAULT 'unknown',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Add new fields to prescriptions table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'refills_remaining') THEN
    ALTER TABLE prescriptions ADD COLUMN refills_remaining integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'pharmacy_name') THEN
    ALTER TABLE prescriptions ADD COLUMN pharmacy_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'pharmacy_phone') THEN
    ALTER TABLE prescriptions ADD COLUMN pharmacy_phone text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'side_effects') THEN
    ALTER TABLE prescriptions ADD COLUMN side_effects text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'instructions') THEN
    ALTER TABLE prescriptions ADD COLUMN instructions text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'status') THEN
    ALTER TABLE prescriptions ADD COLUMN status text DEFAULT 'active';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'prescriptions' AND column_name = 'end_date') THEN
    ALTER TABLE prescriptions ADD COLUMN end_date date;
  END IF;
END $$;

-- Add new fields to medical_records table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'vital_signs_id') THEN
    ALTER TABLE medical_records ADD COLUMN vital_signs_id uuid REFERENCES vital_signs(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'follow_up_date') THEN
    ALTER TABLE medical_records ADD COLUMN follow_up_date date;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'visit_type') THEN
    ALTER TABLE medical_records ADD COLUMN visit_type text DEFAULT 'routine';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'chief_complaint') THEN
    ALTER TABLE medical_records ADD COLUMN chief_complaint text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'physical_examination') THEN
    ALTER TABLE medical_records ADD COLUMN physical_examination text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'assessment') THEN
    ALTER TABLE medical_records ADD COLUMN assessment text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medical_records' AND column_name = 'plan') THEN
    ALTER TABLE medical_records ADD COLUMN plan text;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chronic_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_history ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables (public access for demo)
CREATE POLICY "Allow public access to vital_signs"
  ON vital_signs
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to chronic_conditions"
  ON chronic_conditions
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to lab_results"
  ON lab_results
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to immunizations"
  ON immunizations
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public access to family_history"
  ON family_history
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS vital_signs_patient_idx ON vital_signs(patient_id);
CREATE INDEX IF NOT EXISTS vital_signs_date_idx ON vital_signs(recorded_date);
CREATE INDEX IF NOT EXISTS chronic_conditions_patient_idx ON chronic_conditions(patient_id);
CREATE INDEX IF NOT EXISTS lab_results_patient_idx ON lab_results(patient_id);
CREATE INDEX IF NOT EXISTS lab_results_date_idx ON lab_results(test_date);
CREATE INDEX IF NOT EXISTS immunizations_patient_idx ON immunizations(patient_id);
CREATE INDEX IF NOT EXISTS family_history_patient_idx ON family_history(patient_id);

-- Create trigger for chronic_conditions updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chronic_conditions_updated_at
    BEFORE UPDATE ON chronic_conditions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();