import React, { useState } from 'react';
import { X, Save, TestTube } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LabResultFormProps {
  patientId: string;
  onClose: () => void;
  onSave: () => void;
}

export default function LabResultForm({ patientId, onClose, onSave }: LabResultFormProps) {
  const [formData, setFormData] = useState({
    test_name: '',
    test_category: 'general',
    test_date: new Date().toISOString().split('T')[0],
    ordered_by: '',
    result_value: '',
    result_unit: '',
    reference_range: '',
    status: 'normal',
    lab_name: '',
    lab_reference_number: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await supabase
        .from('lab_results')
        .insert([{ ...formData, patient_id: patientId }]);
      
      onSave();
    } catch (error) {
      console.error('Error saving lab result:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const testCategories = [
    'general',
    'blood_chemistry',
    'hematology',
    'lipid_panel',
    'liver_function',
    'kidney_function',
    'thyroid_function',
    'cardiac_markers',
    'diabetes_markers',
    'inflammatory_markers',
    'tumor_markers',
    'hormones',
    'vitamins',
    'microbiology',
    'pathology'
  ];

  const commonTests = [
    'Complete Blood Count (CBC)',
    'Basic Metabolic Panel (BMP)',
    'Comprehensive Metabolic Panel (CMP)',
    'Lipid Panel',
    'Hemoglobin A1C',
    'Thyroid Stimulating Hormone (TSH)',
    'Vitamin D',
    'Vitamin B12',
    'Fasting Glucose',
    'Creatinine',
    'Blood Urea Nitrogen (BUN)',
    'Liver Function Tests',
    'C-Reactive Protein (CRP)',
    'Erythrocyte Sedimentation Rate (ESR)',
    'Prostate Specific Antigen (PSA)'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TestTube className="h-6 w-6 text-purple-600" />
            Add Lab Result
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Name *
              </label>
              <input
                type="text"
                name="test_name"
                value={formData.test_name}
                onChange={handleChange}
                required
                list="common-tests"
                placeholder="e.g., Complete Blood Count"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <datalist id="common-tests">
                {commonTests.map((test) => (
                  <option key={test} value={test} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Category *
              </label>
              <select
                name="test_category"
                value={formData.test_category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {testCategories.map((category) => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Date *
              </label>
              <input
                type="date"
                name="test_date"
                value={formData.test_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordered By *
              </label>
              <input
                type="text"
                name="ordered_by"
                value={formData.ordered_by}
                onChange={handleChange}
                required
                placeholder="Doctor's name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Result Information */}
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Test Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Result Value
                </label>
                <input
                  type="text"
                  name="result_value"
                  value={formData.result_value}
                  onChange={handleChange}
                  placeholder="e.g., 5.2, Positive, Normal"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  name="result_unit"
                  value={formData.result_unit}
                  onChange={handleChange}
                  placeholder="e.g., mg/dL, mmol/L, %"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="normal">Normal</option>
                  <option value="abnormal">Abnormal</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                  <option value="critical">Critical</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Range
              </label>
              <input
                type="text"
                name="reference_range"
                value={formData.reference_range}
                onChange={handleChange}
                placeholder="e.g., 3.5-5.0 mg/dL, <100 mg/dL"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Lab Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Laboratory Name
              </label>
              <input
                type="text"
                name="lab_name"
                value={formData.lab_name}
                onChange={handleChange}
                placeholder="e.g., Quest Diagnostics, LabCorp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lab Reference Number
              </label>
              <input
                type="text"
                name="lab_reference_number"
                value={formData.lab_reference_number}
                onChange={handleChange}
                placeholder="Lab report reference number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional notes about the test results..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Lab Result Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Include complete test names and specific values when available</li>
              <li>• Always specify units for numerical results</li>
              <li>• Mark critical or abnormal results appropriately</li>
              <li>• Include reference ranges for proper interpretation</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Lab Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}