"use client";
import React, { useState } from "react";
import Navbar from "@/src/app/components/Navbar";
import PersonalInfoForm from "@/src/app/components/PersonalInfoForm";
import SkillsForm from "@/src/app/components/SkillsForm";
import ExperienceForm from "@/src/app/components/ExperienceForm";
import ProjectsForm from "@/src/app/components/ProjectsForm";
import EducationForm from "@/src/app/components/EducationForm";
import ProfilePreview from "@/src/app/components/ProfilePreview";
import { ProfileData } from "@/src/app/types/profile";

const Dashboard: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        skills: [],
        experience: [{ id: '1', title: '', company: '', duration: '', description: '' }],
        projects: [{ id: '1', name: '', description: '', technologies: '', link: '' }],
        education: [{ id: '1', degree: '', school: '', year: '' }]
    });

    const [showPreview, setShowPreview] = useState(false);

    const handleInputChange = (field: keyof ProfileData, value: any) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const togglePreview = () => {
        setShowPreview(!showPreview);
    };

    const handleSaveProfile = () => {
        // TODO: Implement save functionality
        console.log('Saving profile:', profileData);
        // You can add API call here to save to backend
        alert('Profile saved successfully!');
    };

    if (showPreview) {
        return (
            <>
                <Navbar />
                <ProfilePreview profileData={profileData} onBack={togglePreview} />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white">
                <div className="max-w-6xl mx-auto px-8 py-12">
                    {/* Header */}
                    <div className="mb-12 border-b border-gray-200 pb-8">
                        <h1 className="text-3xl font-light text-gray-900 mb-3">Profile Editor</h1>
                        <p className="text-gray-600 text-sm">Build your professional profile</p>

                        {/* Action Buttons */}
                        <div className="mt-6 flex items-center space-x-4">
                            <button
                                onClick={togglePreview}
                                className="px-6 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                Preview
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:border-gray-400 hover:text-gray-900 transition-colors duration-200"
                            >
                                Save Profile
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
                            />

                            <ProjectsForm
                                profileData={profileData}
                                onInputChange={handleInputChange}
                            />

                            <EducationForm
                                profileData={profileData}
                                onInputChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;