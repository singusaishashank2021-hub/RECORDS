import React, { useState } from 'react';
import { X, Save, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FamilyHistoryFormProps {
  patientId: string;
  onClose: () => void;
  onSave: () => void;
}

export default function FamilyHistoryForm({ patientId, onClose, onSave }: FamilyHistoryFormProps) {
  const [formData, setFormData] = useState({
    relationship: '',
    condition_name: '',
    age_of_onset: '',
    status: 'unknown',
    notes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToInsert = {
        ...formData,
        patient_id: patientId,
        age_of_onset: formData.age_of_onset ? parseInt(formData.age_of_onset) : null,
      };

      await supabase
        .from('family_history')
        .insert([dataToInsert]);
      
      onSave();
    } catch (error) {
      console.error('Error saving family history:', error);
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

  const relationships = [
    'Mother',
    'Father',
    'Sister',
    'Brother',
    'Maternal Grandmother',
    'Maternal Grandfather',
    'Paternal Grandmother',
    'Paternal Grandfather',
    'Maternal Aunt',
    'Maternal Uncle',
    'Paternal Aunt',
    'Paternal Uncle',
    'Daughter',
    'Son',
    'Cousin'
  ];

  const commonConditions = [
    'Heart Disease',
    'High Blood Pressure',
    'Diabetes Type 1',
    'Diabetes Type 2',
    'Stroke',
    'Cancer (Breast)',
    'Cancer (Lung)',
    'Cancer (Colon)',
    'Cancer (Prostate)',
    'Cancer (Other)',
    'Asthma',
    'COPD',
    'Depression',
    'Anxiety',
    'Alzheimer\'s Disease',
    'Parkinson\'s Disease',
    'Kidney Disease',
    'Liver Disease',
    'Osteoporosis',
    'Arthritis',
    'Thyroid Disease',
    'Blood Clots',
    'High Cholesterol'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Add Family History
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
                Relationship *
              </label>
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select relationship</option>
                {relationships.map((relationship) => (
                  <option key={relationship} value={relationship}>
                    {relationship}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Condition *
              </label>
              <input
                type="text"
                name="condition_name"
                value={formData.condition_name}
                onChange={handleChange}
                required
                list="common-conditions"
                placeholder="e.g., Heart Disease, Diabetes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <datalist id="common-conditions">
                {commonConditions.map((condition) => (
                  <option key={condition} value={condition} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age of Onset
              </label>
              <input
                type="number"
                name="age_of_onset"
                value={formData.age_of_onset}
                onChange={handleChange}
                min="0"
                max="120"
                placeholder="Age when condition started"
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
                <option value="unknown">Unknown</option>
                <option value="confirmed">Confirmed</option>
                <option value="suspected">Suspected</option>
                <option value="deceased">Deceased (from condition)</option>
                <option value="resolved">Resolved</option>
              </select>
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
              rows={4}
              placeholder="Additional details about the family member's condition, treatment, or other relevant information..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <h4 className="font-medium text-indigo-900 mb-2">Family History Guidelines</h4>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• Record significant medical conditions in immediate family members</li>
              <li>• Include age of onset when known for risk assessment</li>
              <li>• Document both maternal and paternal family history</li>
              <li>• Update status as new information becomes available</li>
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
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Family History'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}