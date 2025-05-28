"use client";
import React, { useState } from "react";
import PersonalInfoForm from "@/app/components/PersonalInfoForm";
import SkillsForm from "@/app/components/SkillsForm";
import ExperienceForm from "@/app/components/ExperienceForm";
import ProjectsForm from "@/app/components/ProjectsForm";
import EducationForm from "@/app/components/EducationForm";
import ProfilePreview from "@/app/components/ProfilePreview";
import { useCV } from "@/app/hooks/useCV";

const Dashboard: React.FC = () => {
    const {
        profileData,
        loading,
        lastSaved,
        handleInputChange,
        saveCV,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
    } = useCV();

    const [showPreview, setShowPreview] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [shareLink, setShareLink] = useState<string | null>(null);

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    const handleSaveProfile = async () => {
        try {
            setSaveLoading(true);
            await saveCV();
            alert('Profile saved successfully!');
        } catch (err) {
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaveLoading(false);
        }
    };


    if (showPreview) {
        return (
            <>
                <ProfilePreview
                    profileData={profileData}
                    onBack={togglePreview}
                />
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-white">
                <div className="max-w-6xl mx-auto px-8 py-12">

                    {loading && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-blue-700 text-sm flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </p>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-12 border-b border-gray-200 pb-8">
                        <h1 className="text-3xl font-light text-gray-900 mb-3">Profile Editor</h1>
                        <p className="text-gray-600 text-sm mb-4">Build your professional profile</p>

                        {/* Last Saved Indicator */}
                        {lastSaved && (
                            <p className="text-xs text-gray-500 mb-4">
                                Last saved: {lastSaved.toLocaleString()}
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={togglePreview}
                                disabled={loading}
                                className="px-6 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center disabled:opacity-50"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                Preview
                            </button>

                            <button
                                onClick={handleSaveProfile}
                                disabled={loading || saveLoading}
                                className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 hover:text-gray-900 transition-colors duration-200 disabled:opacity-50"
                            >
                                {saveLoading ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        <div className="space-y-12">
                            <PersonalInfoForm
                                profileData={profileData}
                                onInputChange={handleInputChange}
                            />

                            <SkillsForm
                                profileData={profileData}
                                onInputChange={handleInputChange}
                            />

                            <ExperienceForm
                                profileData={profileData}
                                onInputChange={handleInputChange}
                                onAddExperience={addExperience}
                                onUpdateExperience={updateExperience}
                                onDeleteExperience={deleteExperience}
                                loading={loading}
                            />

                            <ProjectsForm
                                profileData={profileData}
                                onInputChange={handleInputChange}
                            />

                            <EducationForm
                                profileData={profileData}
                                onInputChange={handleInputChange}
                                onAddEducation={addEducation}
                                onUpdateEducation={updateEducation}
                                onDeleteEducation={deleteEducation}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;