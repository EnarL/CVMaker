"use client";
import React from 'react';
import { ProfileData } from '../types/profile';

interface ExperienceFormProps {
    profileData: ProfileData;
    onInputChange: (field: keyof ProfileData, value: any) => void;
    onAddExperience?: () => Promise<void>;
    onUpdateExperience?: (experienceId: string, updatedData: any) => Promise<void>;
    onDeleteExperience?: (experienceId: string) => Promise<void>;
    loading?: boolean;
}

const FormInput: React.FC<{
    label: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}> = ({ label, type = "text", placeholder, value, onChange, rows }) => {
    const Component = rows ? 'textarea' : 'input';

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <Component
                type={type}
                rows={rows}
                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 resize-none"
                placeholder={placeholder}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

const ExperienceForm: React.FC<ExperienceFormProps> = ({
                                                           profileData,
                                                           onInputChange,
                                                           onAddExperience,
                                                           onUpdateExperience,
                                                           onDeleteExperience,
                                                           loading = false
                                                       }) => {
    // Check if this is a temporary/local ID
    const isTemporaryId = (id: string): boolean => {
        return !id || id === '1' || id.startsWith('temp_') || parseInt(id) > Date.now() - 10000;
    };

    const handleExperienceChange = async (id: string, field: string, value: string) => {
        // Always update local state immediately for better UX
        const updated = profileData.experience.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        );
        onInputChange('experience', updated);

        // Only try to update backend if it's a real backend item
        if (onUpdateExperience && !isTemporaryId(id)) {
            try {
                await onUpdateExperience(id, { [field]: value });
            } catch (error) {
                console.warn('Failed to update experience in backend:', error);
                // Continue with local state - don't break the user experience
            }
        }
    };

    const handleAdd = async () => {
        if (onAddExperience) {
            try {
                await onAddExperience();
            } catch (error) {
                console.error('Failed to add experience:', error);
                // Fallback to local addition
                addLocalExperience();
            }
        } else {
            addLocalExperience();
        }
    };

    const addLocalExperience = () => {
        const newExp = {
            id: `temp_${Date.now()}`,
            title: '',
            company: '',
            duration: '',
            description: ''
        };
        onInputChange('experience', [...profileData.experience, newExp]);
    };

    const handleDelete = async (id: string) => {
        // Always remove from local state first
        const updated = profileData.experience.filter(exp => exp.id !== id);
        onInputChange('experience', updated);

        // Try to delete from backend if it's a real item
        if (onDeleteExperience && !isTemporaryId(id)) {
            try {
                await onDeleteExperience(id);
            } catch (error) {
                console.warn('Failed to delete experience from backend:', error);
                // Local deletion already happened, so user experience isn't affected
            }
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900">Work Experience</h2>
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Adding...' : '+ Add'}
                </button>
            </header>

            <div className="space-y-8">
                {profileData.experience.map((exp, index) => (
                    <div key={exp.id} className="space-y-4">
                        {index > 0 && <div className="border-t border-gray-100 pt-6" />}

                        <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-500">
                                Experience {index + 1}
                                {isTemporaryId(exp.id) && (
                                    <span className="ml-2 text-xs text-orange-500 font-normal">(draft)</span>
                                )}
                            </span>
                            {profileData.experience.length > 1 && (
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    disabled={loading}
                                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="Job Title"
                                placeholder="Software Engineer"
                                value={exp.title}
                                onChange={(value) => handleExperienceChange(exp.id, 'title', value)}
                            />
                            <FormInput
                                label="Company"
                                placeholder="Company Name"
                                value={exp.company}
                                onChange={(value) => handleExperienceChange(exp.id, 'company', value)}
                            />
                        </div>

                        <FormInput
                            label="Duration"
                            placeholder="Jan 2020 - Present"
                            value={exp.duration}
                            onChange={(value) => handleExperienceChange(exp.id, 'duration', value)}
                        />

                        <FormInput
                            label="Description"
                            placeholder="Describe your role and achievements..."
                            value={exp.description}
                            onChange={(value) => handleExperienceChange(exp.id, 'description', value)}
                            rows={3}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceForm;