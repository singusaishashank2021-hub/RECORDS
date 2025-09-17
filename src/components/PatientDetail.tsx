import React, { useState, useEffect } from 'react';
import { X, Edit2, Plus, FileText, Heart, AlertTriangle, User, Phone, Mail, MapPin, Calendar, Stethoscope, Pill } from 'lucide-react';
import { supabase, Patient, MedicalRecord, Prescription, Document } from '../lib/supabase';
import MedicalRecordForm from './MedicalRecordForm';
import PrescriptionForm from './PrescriptionForm';
import DocumentUpload from './DocumentUpload';

interface PatientDetailProps {
  patient: Patient;
  onClose: () => void;
  onEdit: () => void;
}

export default function PatientDetail({ patient, onClose, onEdit }: PatientDetailProps) {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPatientData();
  }, [patient.id]);

  const fetchPatientData = async () => {
    try {
      const [medicalData, prescriptionData, documentData] = await Promise.all([
        supabase
          .from('medical_records')
          .select('*')
          .eq('patient_id', patient.id)
          .order('visit_date', { ascending: false }),
        supabase
          .from('prescriptions')
          .select('*')
          .eq('patient_id', patient.id)
          .order('prescribed_date', { ascending: false }),
        supabase
          .from('documents')
          .select('*')
          .eq('patient_id', patient.id)
          .order('uploaded_at', { ascending: false })
      ]);

      setMedicalRecords(medicalData.data || []);
      setPrescriptions(prescriptionData.data || []);
      setDocuments(documentData.data || []);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'medical', label: 'Medical Records', icon: Stethoscope, count: medicalRecords.length },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill, count: prescriptions.length },
    { id: 'documents', label: 'Documents', icon: FileText, count: documents.length },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {patient.first_name} {patient.last_name}
              </h2>
              <p className="text-blue-100">
                Age {calculateAge(patient.date_of_birth)} • {patient.gender} • Patient ID: {patient.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Edit Patient"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {patient.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{patient.phone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{patient.email}</span>
                    </div>
                  )}
                  {patient.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-900">{patient.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">
                      DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Emergency Contact */}
                {(patient.emergency_contact_name || patient.emergency_contact_phone) && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Emergency Contact</h4>
                    <div className="bg-red-50 rounded-lg p-4 space-y-2">
                      {patient.emergency_contact_name && (
                        <p className="text-gray-900 font-medium">{patient.emergency_contact_name}</p>
                      )}
                      {patient.emergency_contact_phone && (
                        <p className="text-gray-700">{patient.emergency_contact_phone}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Medical Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  Medical Information
                </h3>
                <div className="space-y-4">
                  {patient.blood_type && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-medium text-gray-900">Blood Type</p>
                          <p className="text-red-700 font-semibold">{patient.blood_type}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {patient.allergies && (
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Allergies</p>
                          <p className="text-orange-700">{patient.allergies}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Activity Summary */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Recent Activity</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p>Medical Records: {medicalRecords.length}</p>
                      <p>Vital Signs: {vitalSigns.length}</p>
                      <p>Chronic Conditions: {chronicConditions.length}</p>
                      <p>Lab Results: {labResults.length}</p>
                      <p>Active Prescriptions: {prescriptions.length}</p>
                      <p>Immunizations: {immunizations.length}</p>
                      <p>Documents: {documents.length}</p>
                      <p>Patient Since: {new Date(patient.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* BMI Calculator */}
                  {patient.height_cm && patient.weight_kg && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">Body Mass Index</h4>
                      <div className="text-green-800">
                        <p className="text-2xl font-bold">
                          {((patient.weight_kg / (patient.height_cm / 100)) ** 2).toFixed(1)}
                        </p>
                        <p className="text-sm">
                          Height: {patient.height_cm}cm • Weight: {patient.weight_kg}kg
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vitals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Vital Signs</h3>
                <button
                  onClick={() => setShowVitalSignsForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Record Vitals
                </button>
              </div>

              {vitalSigns.length > 0 ? (
                <div className="space-y-4">
                  {vitalSigns.map((vital) => (
                    <div key={vital.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {new Date(vital.recorded_date).toLocaleDateString()}
                          </h4>
                          <p className="text-sm text-gray-500">Recorded by: {vital.recorded_by}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {vital.systolic_bp && vital.diastolic_bp && (
                          <div>
                            <span className="font-medium text-gray-700">Blood Pressure:</span>
                            <p className="text-gray-900">{vital.systolic_bp}/{vital.diastolic_bp} mmHg</p>
                          </div>
                        )}
                        {vital.heart_rate && (
                          <div>
                            <span className="font-medium text-gray-700">Heart Rate:</span>
                            <p className="text-gray-900">{vital.heart_rate} bpm</p>
                          </div>
                        )}
                        {vital.temperature_celsius && (
                          <div>
                            <span className="font-medium text-gray-700">Temperature:</span>
                            <p className="text-gray-900">{vital.temperature_celsius}°C</p>
                          </div>
                        )}
                        {vital.oxygen_saturation && (
                          <div>
                            <span className="font-medium text-gray-700">O2 Saturation:</span>
                            <p className="text-gray-900">{vital.oxygen_saturation}%</p>
                          </div>
                        )}
                      </div>
                      
                      {vital.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600">{vital.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No vital signs recorded</h4>
                  <p className="text-gray-500 mb-4">Start tracking patient vital signs</p>
                  <button
                    onClick={() => setShowVitalSignsForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Record Vital Signs
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'conditions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Chronic Conditions</h3>
                <button
                  onClick={() => setShowChronicConditionForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Condition
                </button>
              </div>

              {chronicConditions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chronicConditions.map((condition) => (
                    <div key={condition.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{condition.condition_name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          condition.status === 'active' ? 'bg-red-100 text-red-800' :
                          condition.status === 'managed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {condition.status}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        {condition.diagnosed_date && (
                          <p><span className="font-medium">Diagnosed:</span> {new Date(condition.diagnosed_date).toLocaleDateString()}</p>
                        )}
                        {condition.diagnosed_by && (
                          <p><span className="font-medium">By:</span> {condition.diagnosed_by}</p>
                        )}
                        <p><span className="font-medium">Severity:</span> {condition.severity}</p>
                        {condition.treatment_plan && (
                          <p><span className="font-medium">Treatment:</span> {condition.treatment_plan}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No chronic conditions</h4>
                  <p className="text-gray-500 mb-4">Track ongoing health conditions</p>
                  <button
                    onClick={() => setShowChronicConditionForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Chronic Condition
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Medical Records</h3>
                <button
                  onClick={() => setShowMedicalForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Record
                </button>
              </div>

              {medicalRecords.length > 0 ? (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{record.diagnosis || 'General Visit'}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(record.visit_date).toLocaleDateString()} • Dr. {record.doctor_name}
                          </p>
                        </div>
                      </div>
                      
                      {record.symptoms && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Symptoms</h5>
                          <p className="text-gray-600">{record.symptoms}</p>
                        </div>
                      )}
                      
                      {record.treatment && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Treatment</h5>
                          <p className="text-gray-600">{record.treatment}</p>
                        </div>
                      )}
                      
                      {record.notes && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Notes</h5>
                          <p className="text-gray-600">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No medical records</h4>
                  <p className="text-gray-500 mb-4">Start by adding the first medical record for this patient</p>
                  <button
                    onClick={() => setShowMedicalForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Medical Record
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Prescriptions</h3>
                <button
                  onClick={() => setShowPrescriptionForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Prescription
                </button>
              </div>

              {prescriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{prescription.medication_name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(prescription.prescribed_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Dosage:</span> {prescription.dosage}</p>
                        <p><span className="font-medium">Frequency:</span> {prescription.frequency}</p>
                        {prescription.duration && (
                          <p><span className="font-medium">Duration:</span> {prescription.duration}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No prescriptions</h4>
                  <p className="text-gray-500 mb-4">Add prescriptions to track patient medications</p>
                  <button
                    onClick={() => setShowPrescriptionForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Prescription
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Documents</h3>
                <button
                  onClick={() => setShowDocumentUpload(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Upload Document
                </button>
              </div>

              {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{doc.document_name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{doc.document_type}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                          {doc.ocr_text && (
                            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                              <p className="font-medium mb-1">Extracted Text:</p>
                              <p className="line-clamp-3">{doc.ocr_text.substring(0, 200)}...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No documents</h4>
                  <p className="text-gray-500 mb-4">Upload medical documents and reports with OCR text extraction</p>
                  <button
                    onClick={() => setShowDocumentUpload(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Upload Document
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {showMedicalForm && (
          <MedicalRecordForm
            patientId={patient.id}
            onClose={() => setShowMedicalForm(false)}
            onSave={() => {
              setShowMedicalForm(false);
              fetchPatientData();
            }}
          />
        )}

        {showPrescriptionForm && (
          <PrescriptionForm
            patientId={patient.id}
            onClose={() => setShowPrescriptionForm(false)}
            onSave={() => {
              setShowPrescriptionForm(false);
              fetchPatientData();
            }}
          />
        )}

        {showDocumentUpload && (
          <DocumentUpload
            patientId={patient.id}
            onClose={() => setShowDocumentUpload(false)}
            onSave={() => {
              setShowDocumentUpload(false);
              fetchPatientData();
            }}
          />
        )}

        {showVitalSignsForm && (
          <VitalSignsForm
            patientId={patient.id}
            onClose={() => setShowVitalSignsForm(false)}
            onSave={() => {
              setShowVitalSignsForm(false);
              fetchPatientData();
            }}
          />
        )}

        {showChronicConditionForm && (
          <ChronicConditionForm
            patientId={patient.id}
            onClose={() => setShowChronicConditionForm(false)}
            onSave={() => {
              setShowChronicConditionForm(false);
              fetchPatientData();
            }}
          />
        )}

        {showLabResultForm && (
          <LabResultForm
            patientId={patient.id}
            onClose={() => setShowLabResultForm(false)}
            onSave={() => {
              setShowLabResultForm(false);
              fetchPatientData();
            }}
          />
        )}

        {showImmunizationForm && (
          <ImmunizationForm
            patientId={patient.id}
            onClose={() => setShowImmunizationForm(false)}
            onSave={() => {
              setShowImmunizationForm(false);
              fetchPatientData();
            }}
          />
        )}

        {showFamilyHistoryForm && (
          <FamilyHistoryForm
            patientId={patient.id}
            onClose={() => setShowFamilyHistoryForm(false)}
            onSave={() => {
              setShowFamilyHistoryForm(false);
              fetchPatientData();
            }}
          />
        )}
      </div>
    </div>
  );
}