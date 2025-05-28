"use client";
import React from 'react';
import { ProfileData } from '../types/profile';

interface PersonalInfoFormProps {
    profileData: ProfileData;
    onInputChange: (field: keyof ProfileData, value: any) => void;
}

const FormField: React.FC<{
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
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

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ profileData, onInputChange }) => {
    return (
        <div className="space-y-6">
            <header className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            </header>

            <div className="space-y-6">
                <FormField
                    label="Full Name"
                    placeholder="John Doe"
                    value={profileData.fullName}
                    onChange={(value) => onInputChange('fullName', value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        value={profileData.email}
                        onChange={(value) => onInputChange('email', value)}
                    />
                    <FormField
                        label="Phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={profileData.phone}
                        onChange={(value) => onInputChange('phone', value)}
                    />
                </div>

                <FormField
                    label="Location"
                    placeholder="New York, NY"
                    value={profileData.location}
                    onChange={(value) => onInputChange('location', value)}
                />

                <FormField
                    label="Professional Bio"
                    placeholder="Tell us about yourself and your professional background..."
                    value={profileData.bio}
                    onChange={(value) => onInputChange('bio', value)}
                    rows={3}
                />
            </div>
        </div>
    );
};

export default PersonalInfoForm;