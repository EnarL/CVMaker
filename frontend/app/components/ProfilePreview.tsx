"use client";
import React from 'react';
import { ProfileData } from '../types/profile';

interface ProfilePreviewProps {
    profileData: ProfileData;
    onBack: () => void;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ profileData, onBack }) => {
    const contactInfo = [profileData.phone, profileData.email, profileData.location]
        .filter(Boolean)
        .join(' | ');

    const hasContent = (items: any[], fields: string[]) =>
        items.some(item => fields.some(field => item[field]));

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 print:hidden">
                <div className="max-w-5xl mx-auto px-24 py-4 flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900 transition-colors flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Editor
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Print
                    </button>
                </div>
            </nav>

            {/* Document */}
            <div className="py-12 print:py-0">
                <div className="max-w-4xl mx-auto print:max-w-none">
                    <div className="bg-white border border-gray-200 mx-8 print:border-0 print:mx-0 print:shadow-none"
                         style={{ aspectRatio: '8.5/11', minHeight: '800px' }}>
                        <div className="p-12 print:p-8 text-sm font-serif">

                            {/* Header */}
                            <header className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wider">
                                    {profileData.fullName || 'Your Name'}
                                </h1>
                                {contactInfo && (
                                    <div className="text-sm text-gray-700">{contactInfo}</div>
                                )}
                            </header>

                            {profileData.bio && (
                                <section className="mb-6">
                                    <p className="text-sm text-gray-700 leading-relaxed text-justify">
                                        {profileData.bio}
                                    </p>
                                </section>
                            )}
                            {hasContent(profileData.education, ['degree', 'school']) && (
                                <section className="mb-6">
                                    <h2 className="section-title">EDUCATION</h2>
                                    <div className="space-y-3">
                                        {profileData.education
                                            .filter(edu => edu.degree || edu.school)
                                            .map(edu => (
                                                <div key={edu.id} className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-bold text-sm text-gray-900">
                                                            {edu.school || 'Institution Name'}
                                                        </div>
                                                        <div className="italic text-sm text-gray-700">
                                                            {edu.degree || 'Degree/Certificate'}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-700 italic">
                                                        {edu.year}
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </section>
                            )}

                            {/* Experience */}
                            {hasContent(profileData.experience, ['title', 'company']) && (
                                <section className="mb-6">
                                    <h2 className="section-title">Experience</h2>
                                    <div className="space-y-4">
                                        {profileData.experience
                                            .filter(exp => exp.title || exp.company)
                                            .map(exp => (
                                                <div key={exp.id}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <div className="font-bold text-sm text-gray-900">
                                                                {exp.title || 'Position Title'}
                                                            </div>
                                                            <div className="italic text-sm text-gray-700">
                                                                {exp.company || 'Company Name'}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-gray-700 italic">
                                                            {exp.duration}
                                                        </div>
                                                    </div>
                                                    {exp.description && (
                                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 leading-relaxed ml-4 mt-2">
                                                            {exp.description
                                                                .split('\n')
                                                                .filter(line => line.trim())
                                                                .map((line, index) => (
                                                                    <li key={index} className="pl-1">
                                                                        {line.trim()}
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    )}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </section>
                            )}

                            {/* Projects */}
                            {hasContent(profileData.projects, ['name', 'description']) && (
                                <section className="mb-6">
                                    <h2 className="section-title">Projects</h2>
                                    <div className="space-y-4">
                                        {profileData.projects
                                            .filter(project => project.name || project.description)
                                            .map(project => (
                                                <div key={project.id}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div className="font-bold text-sm text-gray-900">
                                                            {project.name || 'Project Name'}
                                                            {project.technologies && (
                                                                <span className="font-normal text-gray-700">
                                                                    {' | '}<em>{project.technologies}</em>
                                                                </span>
                                                            )}
                                                        </div>
                                                        {project.link && (
                                                            <div className="text-xs text-gray-700 italic">
                                                                {project.link}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {project.description && (
                                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 leading-relaxed ml-4 mt-2">
                                                            {project.description
                                                                .split('\n')
                                                                .filter(line => line.trim())
                                                                .map((line, index) => (
                                                                    <li key={index} className="pl-1">
                                                                        {line.trim()}
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    )}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </section>
                            )}

                            {/* Skills */}
                            {profileData.skills && profileData.skills.length > 0 && (
                                <section className="mb-6">
                                    <h2 className="section-title">Technical Skills</h2>
                                    <div className="text-sm text-gray-700">
                                        {profileData.skills.join(', ')}
                                    </div>
                                </section>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .section-title {
                    @apply text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider border-b border-gray-900 pb-1;
                }
                
                @media print {
                    .print\\:hidden { display: none !important; }
                    .print\\:py-0 { padding-top: 0 !important; padding-bottom: 0 !important; }
                    .print\\:border-0 { border: 0 !important; }
                    .print\\:mx-0 { margin-left: 0 !important; margin-right: 0 !important; }
                    .print\\:max-w-none { max-width: none !important; }
                    .print\\:p-8 { padding: 2rem !important; }
                    .print\\:shadow-none { box-shadow: none !important; }
                    @page { margin: 0.5in; }
                }
            `}</style>
        </div>
    );
};

export default ProfilePreview;