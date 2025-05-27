"use client";
import React from 'react';
import { ProfileData } from '../types/profile';

interface EducationFormProps {
    profileData: ProfileData;
    onInputChange: (field: keyof ProfileData, value: any) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ profileData, onInputChange }) => {
    const addEducation = () => {
        const newEdu = {
            id: Date.now().toString(),
            degree: '',
            school: '',
            year: ''
        };
        onInputChange('education', [...profileData.education, newEdu]);
    };

    const updateEducation = (id: string, field: string, value: string) => {
        const updated = profileData.education.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        );
        onInputChange('education', updated);
    };

    const removeEducation = (id: string) => {
        onInputChange('education', profileData.education.filter(edu => edu.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900">Education</h2>
                <button
                    type="button"
                    onClick={addEducation}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900 transition-colors duration-200"
                >
                    + Add
                </button>
            </div>

            <div className="space-y-8">
                {profileData.education.map((edu, index) => (
                    <div key={edu.id} className="space-y-4">
                        {index > 0 && <div className="border-t border-gray-100 pt-6"></div>}

                        <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-500">Education {index + 1}</span>
                            {profileData.education.length > 1 && (
                                <button
                                    onClick={() => removeEducation(edu.id)}
                                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Degree/Certificate</label>
                                <input
                                    type="text"
                                    className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                                    placeholder="Bachelor of Science"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                <input
                                    type="text"
                                    className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                                    placeholder="2020"
                                    value={edu.year}
                                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">School/Institution</label>
                            <input
                                type="text"
                                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                                placeholder="University of Technology"
                                value={edu.school}
                                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EducationForm;