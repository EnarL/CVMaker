"use client";
import React from 'react';
import { ProfileData } from '../types/profile';

interface ProjectsFormProps {
    profileData: ProfileData;
    onInputChange: (field: keyof ProfileData, value: any) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ profileData, onInputChange }) => {
    const addProject = () => {
        const newProject = {
            id: Date.now().toString(),
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
        onInputChange('projects', profileData.projects.filter(project => project.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900">Projects</h2>
                <button
                    type="button"
                    onClick={addProject}
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900 transition-colors duration-200"
                >
                    + Add
                </button>
            </div>

            <div className="space-y-8">
                {profileData.projects.map((project, index) => (
                    <div key={project.id} className="space-y-4">
                        {index > 0 && <div className="border-t border-gray-100 pt-6"></div>}

                        <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-500">Project {index + 1}</span>
                            {profileData.projects.length > 1 && (
                                <button
                                    onClick={() => removeProject(project.id)}
                                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                            <input
                                type="text"
                                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                                placeholder="My Awesome Project"
                                value={project.name}
                                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                            <input
                                type="text"
                                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                                placeholder="React, Node.js, PostgreSQL"
                                value={project.technologies}
                                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Project Link</label>
                            <input
                                type="url"
                                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400"
                                placeholder="https://github.com/username/project"
                                value={project.link}
                                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                className="w-full px-0 py-2 border-0 border-b border-gray-300 bg-transparent focus:border-gray-900 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 resize-none"
                                rows={3}
                                placeholder="Describe your project and what you accomplished..."
                                value={project.description}
                                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsForm;