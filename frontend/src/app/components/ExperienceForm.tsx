"use client";
import React from 'react';
import { ProfileData } from '../types/profile';

interface ExperienceFormProps {
    profileData: ProfileData;
    onInputChange: (field: keyof ProfileData, value: any) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ profileData, onInputChange }) => {
    const addExperience = () => {
        const newExp = {
            id: Date.now().toString(),
            title: '',
            company: '',
            duration: '',
            description: ''
        };
        onInputChange('experience', [...profileData.experience, newExp]);
    };

    const updateExperience = (id: string, field: string, value: string) => {
        const updated = profileData.experience.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        );
        onInputChange('experience', updated);
    };

    const removeExperience = (id: string) => {
        onInputChange('experience', profileData.experience.filter(exp => exp.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900">Work Experience</h2>
                <button
                    type="button"
                    onClick={addExperience}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900 transition-colors duration-200"
                >
                    + Add
                </button>
            </div>

            <div className="space-y-8">
                {profileData.experience.map((exp, index) => (
                    <div key={exp.id} className="space-y-4">
                        {index > 0 && <div className="border-t border-gray-100 pt-6"></div>}

                        <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-500">Experience {index + 1}</span>
                            {profileData.experience.length > 1 && (
                                <button
                                    onClick={() => removeExperience(exp.id)}
                                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                                <input
                                    type="text"
                                    className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                                    placeholder="Software Engineer"
                                    value={exp.title}
                                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                <input
                                    type="text"
                                    className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                                    placeholder="Company Name"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                            <input
                                type="text"
                                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                                placeholder="Jan 2020 - Present"
                                value={exp.duration}
                                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 resize-none"
                                rows={3}
                                placeholder="Describe your role and achievements..."
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceForm;