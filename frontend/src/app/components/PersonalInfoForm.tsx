"use client";
import React from 'react';
import { ProfileData } from '../types/profile';

interface PersonalInfoFormProps {
    profileData: ProfileData;
    onInputChange: (field: keyof ProfileData, value: any) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ profileData, onInputChange }) => {
    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                        type="text"
                        className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                        placeholder="John Doe"
                        value={profileData.fullName}
                        onChange={(e) => onInputChange('fullName', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                            placeholder="john@example.com"
                            value={profileData.email}
                            onChange={(e) => onInputChange('email', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                            type="tel"
                            className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                            placeholder="+1 (555) 123-4567"
                            value={profileData.phone}
                            onChange={(e) => onInputChange('phone', e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                        placeholder="New York, NY"
                        value={profileData.location}
                        onChange={(e) => onInputChange('location', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio</label>
                    <textarea
                        className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 resize-none"
                        rows={3}
                        placeholder="Tell us about yourself and your professional background..."
                        value={profileData.bio}
                        onChange={(e) => onInputChange('bio', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;