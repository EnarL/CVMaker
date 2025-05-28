"use client";
import React from 'react';
import { ProfileData } from '../types/profile';

interface EducationFormProps {
  profileData: ProfileData;
  onInputChange: (field: keyof ProfileData, value: any) => void;
  onAddEducation?: () => Promise<void>;
  onUpdateEducation?: (educationId: string, updatedData: any) => Promise<void>;
  onDeleteEducation?: (educationId: string) => Promise<void>;
  loading?: boolean;
}

const FormInput: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  id: string;
}> = ({ label, placeholder, value, onChange, id }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
          type="text"
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
);

const EducationForm: React.FC<EducationFormProps> = ({
                                                       profileData,
                                                       onInputChange,
                                                       onAddEducation,
                                                       onUpdateEducation,
                                                       onDeleteEducation,
                                                       loading = false
                                                     }) => {
  // Check if this is a temporary/local ID
  const isTemporaryId = (id: string): boolean => {
    return !id || id === '1' || id.startsWith('temp_') || parseInt(id) > Date.now() - 10000;
  };

  const handleEducationChange = async (index: number, field: string, value: string) => {
    const updatedEducation = [...profileData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    onInputChange('education', updatedEducation);

    const item = updatedEducation[index];

    // Only try to update backend if it's a real backend item
    if (onUpdateEducation && item.id && !isTemporaryId(item.id)) {
      try {
        await onUpdateEducation(item.id, { [field]: value });
      } catch (error) {
        console.warn('Failed to update education in backend:', error);
        // Continue with local state - don't break the user experience
      }
    }
  };

  const handleAddEducation = async () => {
    if (onAddEducation) {
      try {
        await onAddEducation();
      } catch (error) {
        console.error('Failed to add education:', error);
        // Fallback to local addition
        addLocalEducation();
      }
    } else {
      addLocalEducation();
    }
  };

  const addLocalEducation = () => {
    const newEducation = {
      id: `temp_${Date.now()}`,
      degree: '',
      school: '',
      year: ''
    };
    onInputChange('education', [...profileData.education, newEducation]);
  };

  const handleDeleteEducation = async (index: number) => {
    const educationToDelete = profileData.education[index];

    // Always remove from local state first
    const updatedEducation = profileData.education.filter((_, i) => i !== index);
    onInputChange('education', updatedEducation);

    // Try to delete from backend if it's a real item
    if (onDeleteEducation && educationToDelete.id && !isTemporaryId(educationToDelete.id)) {
      try {
        await onDeleteEducation(educationToDelete.id);
      } catch (error) {
        console.warn('Failed to delete education from backend:', error);
        // Local deletion already happened, so user experience isn't affected
      }
    }
  };

  return (
      <div className="space-y-6">
        <header className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Education</h2>
          <p className="text-sm text-gray-600">Add your educational background</p>
        </header>

        <div className="space-y-6">
          {profileData.education.map((edu, index) => (
              <div key={edu.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Education {index + 1}
                    {isTemporaryId(edu.id) && (
                        <span className="ml-2 text-xs text-orange-500 font-normal">(draft)</span>
                    )}
                  </h3>
                  {profileData.education.length > 1 && (
                      <button
                          onClick={() => handleDeleteEducation(index)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                      label="Degree"
                      placeholder="Bachelor of Science in Computer Science"
                      value={edu.degree}
                      onChange={(value) => handleEducationChange(index, 'degree', value)}
                      id={`degree-${index}`}
                  />

                  <FormInput
                      label="School"
                      placeholder="University of Technology"
                      value={edu.school}
                      onChange={(value) => handleEducationChange(index, 'school', value)}
                      id={`school-${index}`}
                  />

                  <FormInput
                      label="Year"
                      placeholder="2020"
                      value={edu.year}
                      onChange={(value) => handleEducationChange(index, 'year', value)}
                      id={`year-${index}`}
                  />
                </div>
              </div>
          ))}

          <button
              onClick={handleAddEducation}
              disabled={loading}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {loading ? 'Adding...' : 'Add Education'}
          </button>
        </div>
      </div>
  );
};

export default EducationForm;