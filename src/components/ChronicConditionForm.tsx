import React, { useState } from 'react';
import { X, Save, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ChronicConditionFormProps {
  patientId: string;
  onClose: () => void;
  onSave: () => void;
}

export default function ChronicConditionForm({ patientId, onClose, onSave }: ChronicConditionFormProps) {
  const [formData, setFormData] = useState({
    condition_name: '',
    icd_10_code: '',
    diagnosed_date: '',
    diagnosed_by: '',
    severity: 'mild',
    status: 'active',
    treatment_plan: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await supabase
        .from('chronic_conditions')
        .insert([{ ...formData, patient_id: patientId }]);
      
      onSave();
    } catch (error) {
      console.error('Error saving chronic condition:', error);
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

  const commonConditions = [
    'Hypertension',
    'Type 2 Diabetes',
    'Type 1 Diabetes',
    'Asthma',
    'COPD',
    'Heart Disease',
    'Arthritis',
    'Depression',
    'Anxiety',
    'Chronic Kidney Disease',
    'Osteoporosis',
    'Hyperlipidemia',
    'Hypothyroidism',
    'Hyperthyroidism'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-600" />
            Add Chronic Condition
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition Name *
            </label>
            <input
              type="text"
              name="condition_name"
              value={formData.condition_name}
              onChange={handleChange}
              required
              list="common-conditions"
              placeholder="e.g., Hypertension, Type 2 Diabetes..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <datalist id="common-conditions">
              {commonConditions.map((condition) => (
                <option key={condition} value={condition} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ICD-10 Code
              </label>
              <input
                type="text"
                name="icd_10_code"
                value={formData.icd_10_code}
                onChange={handleChange}
                placeholder="e.g., I10, E11.9"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosed Date
              </label>
              <input
                type="date"
                name="diagnosed_date"
                value={formData.diagnosed_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosed By
            </label>
            <input
              type="text"
              name="diagnosed_by"
              value={formData.diagnosed_by}
              onChange={handleChange}
              placeholder="Doctor's name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity *
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
                <option value="critical">Critical</option>
              </select>
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
                <option value="active">Active</option>
                <option value="managed">Managed</option>
                <option value="resolved">Resolved</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatment Plan
            </label>
            <textarea
              name="treatment_plan"
              value={formData.treatment_plan}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the current treatment plan..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
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
              placeholder="Any additional notes or observations..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Chronic Condition Guidelines</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Record all ongoing health conditions that require long-term management</li>
              <li>• Include ICD-10 codes for insurance and billing purposes</li>
              <li>• Update status regularly based on patient progress</li>
              <li>• Document treatment plans for continuity of care</li>
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
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Condition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}