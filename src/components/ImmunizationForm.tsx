import React, { useState } from 'react';
import { X, Save, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImmunizationFormProps {
  patientId: string;
  onClose: () => void;
  onSave: () => void;
}

export default function ImmunizationForm({ patientId, onClose, onSave }: ImmunizationFormProps) {
  const [formData, setFormData] = useState({
    vaccine_name: '',
    vaccine_type: '',
    administration_date: new Date().toISOString().split('T')[0],
    administered_by: '',
    manufacturer: '',
    lot_number: '',
    expiration_date: '',
    dose_number: '1',
    administration_site: 'left arm',
    adverse_reactions: '',
    next_dose_due: '',
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
        dose_number: parseInt(formData.dose_number),
      };

      await supabase
        .from('immunizations')
        .insert([dataToInsert]);
      
      onSave();
    } catch (error) {
      console.error('Error saving immunization:', error);
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

  const commonVaccines = [
    'COVID-19 (Pfizer-BioNTech)',
    'COVID-19 (Moderna)',
    'COVID-19 (Johnson & Johnson)',
    'Influenza (Flu)',
    'Tetanus, Diphtheria, Pertussis (Tdap)',
    'Tetanus, Diphtheria (Td)',
    'Measles, Mumps, Rubella (MMR)',
    'Varicella (Chickenpox)',
    'Hepatitis A',
    'Hepatitis B',
    'Human Papillomavirus (HPV)',
    'Meningococcal',
    'Pneumococcal (PCV13)',
    'Pneumococcal (PPSV23)',
    'Shingles (Zoster)',
    'Polio (IPV)',
    'Haemophilus influenzae type b (Hib)'
  ];

  const administrationSites = [
    'left arm',
    'right arm',
    'left thigh',
    'right thigh',
    'left deltoid',
    'right deltoid',
    'oral',
    'nasal'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Add Immunization
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
                Vaccine Name *
              </label>
              <input
                type="text"
                name="vaccine_name"
                value={formData.vaccine_name}
                onChange={handleChange}
                required
                list="common-vaccines"
                placeholder="e.g., COVID-19 (Pfizer-BioNTech)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <datalist id="common-vaccines">
                {commonVaccines.map((vaccine) => (
                  <option key={vaccine} value={vaccine} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vaccine Type
              </label>
              <input
                type="text"
                name="vaccine_type"
                value={formData.vaccine_type}
                onChange={handleChange}
                placeholder="e.g., mRNA, Live attenuated, Inactivated"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Administration Date *
              </label>
              <input
                type="date"
                name="administration_date"
                value={formData.administration_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Administered By *
              </label>
              <input
                type="text"
                name="administered_by"
                value={formData.administered_by}
                onChange={handleChange}
                required
                placeholder="Healthcare provider name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Vaccine Details */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Vaccine Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  placeholder="e.g., Pfizer, Moderna, J&J"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lot Number
                </label>
                <input
                  type="text"
                  name="lot_number"
                  value={formData.lot_number}
                  onChange={handleChange}
                  placeholder="Vaccine lot number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="expiration_date"
                  value={formData.expiration_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dose Number *
              </label>
              <input
                type="number"
                name="dose_number"
                value={formData.dose_number}
                onChange={handleChange}
                required
                min="1"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Administration Site *
              </label>
              <select
                name="administration_site"
                value={formData.administration_site}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {administrationSites.map((site) => (
                  <option key={site} value={site}>
                    {site.charAt(0).toUpperCase() + site.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Dose Due
            </label>
            <input
              type="date"
              name="next_dose_due"
              value={formData.next_dose_due}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adverse Reactions
            </label>
            <textarea
              name="adverse_reactions"
              value={formData.adverse_reactions}
              onChange={handleChange}
              rows={3}
              placeholder="Document any adverse reactions or side effects..."
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
              placeholder="Any additional notes about the immunization..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Immunization Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Record all vaccines with complete manufacturer information</li>
              <li>• Document lot numbers for vaccine tracking and recalls</li>
              <li>• Note any adverse reactions, even if mild</li>
              <li>• Schedule next dose dates for multi-dose vaccines</li>
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
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Immunization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}