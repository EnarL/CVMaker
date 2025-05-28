"use client";
import React from 'react';
import { ProfileData } from '../types/profile';

interface ProjectsFormProps {
    profileData: ProfileData;
    onInputChange: (field: keyof ProfileData, value: any) => void;
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

const ProjectsForm: React.FC<ProjectsFormProps> = ({ profileData, onInputChange }) => {
    // Check if this is a temporary/local ID
    const isTemporaryId = (id: string): boolean => {
        return !id || id === '1' || id.startsWith('temp_') || parseInt(id) > Date.now() - 10000;
    };

    const addProject = () => {
        const newProject = {
            id: `temp_${Date.now()}`,
            name: '',
            description: '',
            technologies: '',
            link: ''
        };
        onInputChange('projects', [...profileData.projects, newProject]);
    };

    const updateProject = (id: string, field: string, value: string) => {
        const updated = profileData.projects.map(project =>
            project.id === id ? { ...project, [field]: value } : project
        );
        onInputChange('projects', updated);
    };

    const removeProject = (id: string) => {
        const updated = profileData.projects.filter(project => project.id !== id);
        onInputChange('projects', updated);
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900">Projects</h2>
                <button
                    type="button"
                    onClick={addProject}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900 transition-colors"
                >
                    + Add
                </button>
            </header>

            <div className="space-y-8">
                {profileData.projects.map((project, index) => (
                    <div key={project.id} className="space-y-4">
                        {index > 0 && <div className="border-t border-gray-100 pt-6" />}

                        <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-500">
                                Project {index + 1}
                                {isTemporaryId(project.id) && (
                                    <span className="ml-2 text-xs text-orange-500 font-normal">(draft)</span>
                                )}
                            </span>
                            {profileData.projects.length > 1 && (
                                <button
                                    onClick={() => removeProject(project.id)}
                                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <FormInput
                            label="Project Name"
                            placeholder="My Awesome Project"
                            value={project.name}
                            onChange={(value) => updateProject(project.id, 'name', value)}
                        />

                        <FormInput
                            label="Technologies"
                            placeholder="React, Node.js, PostgreSQL"
                            value={project.technologies}
                            onChange={(value) => updateProject(project.id, 'technologies', value)}
                        />

                        <FormInput
                            label="Project Link"
                            type="url"
                            placeholder="https://github.com/username/project"
                            value={project.link}
                            onChange={(value) => updateProject(project.id, 'link', value)}
                        />

                        <FormInput
                            label="Description"
                            placeholder="Describe your project and what you accomplished..."
                            value={project.description}
                            onChange={(value) => updateProject(project.id, 'description', value)}
                            rows={3}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsForm;