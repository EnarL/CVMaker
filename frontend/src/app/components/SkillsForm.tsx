"use client";
import React, { useState } from 'react';
import { ProfileData } from '../types/profile';

interface SkillsFormProps {
    profileData: ProfileData;
    onInputChange: (field: keyof ProfileData, value: any) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ profileData, onInputChange }) => {
    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
        if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
            onInputChange('skills', [...profileData.skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        onInputChange('skills', profileData.skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900">Skills</h2>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900 transition-colors duration-200"
                >
                    Add
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm">
                        {skill}
                        <button
                            onClick={() => removeSkill(skill)}
                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                            ×
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SkillsForm;