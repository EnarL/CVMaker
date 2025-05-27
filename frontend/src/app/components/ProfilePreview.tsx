"use client";
import React from 'react';
import { ProfileData } from '../types/profile';

interface ProfilePreviewProps {
    profileData: ProfileData;
    onBack: () => void;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ profileData, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-8 py-4">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={onBack}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900 transition-colors duration-200 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Back to Editor
                        </button>

                        <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900 transition-colors duration-200">
                                Download PDF
                            </button>
                            <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-200">
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Container */}
            <div className="py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Paper Sheet */}
                    <div className="bg-white border border-gray-200 mx-8" style={{ aspectRatio: '8.5/11', minHeight: '800px' }}>
                        <div className="p-16 h-full">
                            {/* Header */}
                            <div className="text-center mb-12 pb-8 border-b border-gray-900">
                                <h1 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                                    {profileData.fullName || 'Your Name'}
                                </h1>

                                <div className="flex justify-center items-center space-x-6 text-sm text-gray-700 mb-6">
                                    {profileData.email && <span>{profileData.email}</span>}
                                    {profileData.phone && <span>{profileData.phone}</span>}
                                    {profileData.location && <span>{profileData.location}</span>}
                                </div>

                                {profileData.bio && (
                                    <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed text-sm">
                                        {profileData.bio}
                                    </p>
                                )}
                            </div>

                            {/* Skills */}
                            {profileData.skills.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wider">
                                        Skills
                                    </h2>
                                    <div className="text-sm text-gray-700 leading-relaxed">
                                        {profileData.skills.join(' • ')}
                                    </div>
                                </div>
                            )}

                            {/* Experience */}
                            {profileData.experience.some(exp => exp.title || exp.company) && (
                                <div className="mb-8">
                                    <h2 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
                                        Experience
                                    </h2>
                                    <div className="space-y-5">
                                        {profileData.experience.filter(exp => exp.title || exp.company).map((exp) => (
                                            <div key={exp.id}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-medium text-gray-900 text-sm">
                                                        {exp.title || 'Position Title'}
                                                    </h3>
                                                    <span className="text-xs text-gray-600">
                                                        {exp.duration}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {exp.company || 'Company Name'}
                                                </p>
                                                {exp.description && (
                                                    <p className="text-xs text-gray-700 leading-relaxed">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects */}
                            {profileData.projects.some(project => project.name || project.description) && (
                                <div className="mb-8">
                                    <h2 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
                                        Projects
                                    </h2>
                                    <div className="space-y-4">
                                        {profileData.projects.filter(project => project.name || project.description).map((project) => (
                                            <div key={project.id}>
                                                <div className="flex items-baseline mb-1">
                                                    <h3 className="font-medium text-gray-900 text-sm">
                                                        {project.name || 'Project Name'}
                                                    </h3>
                                                    {project.link && (
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            {project.link}
                                                        </span>
                                                    )}
                                                </div>
                                                {project.technologies && (
                                                    <p className="text-xs text-gray-600 mb-1">
                                                        {project.technologies}
                                                    </p>
                                                )}
                                                {project.description && (
                                                    <p className="text-xs text-gray-700 leading-relaxed">
                                                        {project.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {profileData.education.some(edu => edu.degree || edu.school) && (
                                <div className="mb-8">
                                    <h2 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
                                        Education
                                    </h2>
                                    <div className="space-y-3">
                                        {profileData.education.filter(edu => edu.degree || edu.school).map((edu) => (
                                            <div key={edu.id} className="flex justify-between items-baseline">
                                                <div>
                                                    <h3 className="font-medium text-gray-900 text-sm">
                                                        {edu.degree || 'Degree/Certificate'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {edu.school || 'Institution Name'}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-600">
                                                    {edu.year}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePreview;