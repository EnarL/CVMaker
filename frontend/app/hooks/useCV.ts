import {useCallback, useEffect, useState, useRef} from 'react';
import {apiService, CVData} from '../services/api';
import {ProfileData} from '../types/profile';

const profileToCVData = (profile: ProfileData): CVData => ({
    personalInfo: {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        summary: profile.bio,
    },
    experience: profile.experience.map(exp => ({
        id: exp.id,
        title: exp.title,
        company: exp.company,
        duration: exp.duration,
        description: exp.description,
    })),
    education: profile.education.map(edu => ({
        id: edu.id,
        degree: edu.degree,
        school: edu.school,
        year: edu.year,
    })),
    skills: profile.skills.map((skill, index) => ({
        id: index.toString(),
        name: skill,
        category: 'General',
    })),
    projects: profile.projects.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        technologies: project.technologies,
        link: project.link,
    })),
    template: 'modern',
});

const cvDataToProfile = (cvData: CVData): ProfileData => ({
    fullName: cvData.personalInfo?.fullName || '',
    email: cvData.personalInfo?.email || '',
    phone: cvData.personalInfo?.phone || '',
    location: cvData.personalInfo?.location || '',
    bio: cvData.personalInfo?.summary || '',
    skills: cvData.skills?.map(skill => skill.name) || [],
    experience: cvData.experience?.map(exp => ({
        id: exp.id || Date.now().toString(),
        title: exp.title || '',
        company: exp.company || '',
        duration: exp.duration || '',
        description: exp.description || '',
    })) || [{ id: '1', title: '', company: '', duration: '', description: '' }],
    projects: cvData.projects?.map(project => ({
        id: project.id || Date.now().toString(),
        name: project.name || '',
        description: project.description || '',
        technologies: project.technologies || '',
        link: project.link || '',
    })) || [{ id: '1', name: '', description: '', technologies: '', link: '' }],
    education: cvData.education?.map(edu => ({
        id: edu.id || Date.now().toString(),
        degree: edu.degree || '',
        school: edu.school || '',
        year: edu.year || '',
    })) || [{ id: '1', degree: '', school: '', year: '' }],
});

export const useCV = () => {
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

    const [loading, setLoading] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Load CV data on mount
    useEffect(() => {
        loadCV();
    }, []);

    const loadCV = async () => {
        setLoading(true);
        const cvData = await apiService.getCV();
        const profile = cvDataToProfile(cvData);
        setProfileData(profile);
        setLoading(false);
    };

    const saveCV = async (data?: ProfileData) => {
        setLoading(true);
        const dataToSave = data || profileData;
        const cvData = profileToCVData(dataToSave);

        const savedData = await apiService.saveCV(cvData);
        const updatedProfile = cvDataToProfile(savedData);

        setProfileData(updatedProfile);
        setLastSaved(new Date());
        setLoading(false);

        return updatedProfile;
    };

    // Auto-save functionality with debouncing
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const autoSave = useCallback(async (data: ProfileData) => {
        const cvData = profileToCVData(data);
        await apiService.saveCV(cvData);
        setLastSaved(new Date());
    }, []);

    const handleInputChange = (field: keyof ProfileData, value: any) => {
        const newData = { ...profileData, [field]: value };
        setProfileData(newData);

        // Clear existing timeout to debounce
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        // Set new timeout for auto-save
        autoSaveTimeoutRef.current = setTimeout(() => {
            autoSave(newData);
            autoSaveTimeoutRef.current = null;
        }, 2000);
    };

    // Experience operations
    const addExperience = async () => {
        const newExp = {
            id: Date.now().toString(),
            title: '',
            company: '',
            duration: '',
            description: '',
        };

        await apiService.addToSection('experience', newExp);
        setProfileData(prev => ({
            ...prev,
            experience: [...prev.experience, newExp]
        }));
    };

    const updateExperience = async (experienceId: string, updatedData: any) => {
        await apiService.updateSectionItem('experience', experienceId, updatedData);

        const updatedExperience = profileData.experience.map(exp =>
            exp.id === experienceId ? { ...exp, ...updatedData } : exp
        );

        setProfileData(prev => ({ ...prev, experience: updatedExperience }));
    };

    const deleteExperience = async (experienceId: string) => {
        await apiService.deleteSectionItem('experience', experienceId);

        const updatedExperience = profileData.experience.filter(exp => exp.id !== experienceId);
        setProfileData(prev => ({ ...prev, experience: updatedExperience }));
    };

    // Education operations
    const addEducation = async () => {
        const newEdu = {
            id: Date.now().toString(),
            degree: '',
            school: '',
            year: '',
        };

        await apiService.addToSection('education', newEdu);
        setProfileData(prev => ({
            ...prev,
            education: [...prev.education, newEdu]
        }));
    };

    const updateEducation = async (educationId: string, updatedData: any) => {
        await apiService.updateSectionItem('education', educationId, updatedData);

        const updatedEducation = profileData.education.map(edu =>
            edu.id === educationId ? { ...edu, ...updatedData } : edu
        );

        setProfileData(prev => ({ ...prev, education: updatedEducation }));
    };

    const deleteEducation = async (educationId: string) => {
        await apiService.deleteSectionItem('education', educationId);

        const updatedEducation = profileData.education.filter(edu => edu.id !== educationId);
        setProfileData(prev => ({ ...prev, education: updatedEducation }));
    };

    // Project operations
    const addProject = async () => {
        const newProject = {
            id: Date.now().toString(),
            name: '',
            description: '',
            technologies: '',
            link: '',
        };

        await apiService.addToSection('projects', newProject);
        setProfileData(prev => ({
            ...prev,
            projects: [...prev.projects, newProject]
        }));
    };

    const updateProject = async (projectId: string, updatedData: any) => {
        await apiService.updateSectionItem('projects', projectId, updatedData);

        const updatedProjects = profileData.projects.map(project =>
            project.id === projectId ? { ...project, ...updatedData } : project
        );

        setProfileData(prev => ({ ...prev, projects: updatedProjects }));
    };

    const deleteProject = async (projectId: string) => {
        await apiService.deleteSectionItem('projects', projectId);

        const updatedProjects = profileData.projects.filter(project => project.id !== projectId);
        setProfileData(prev => ({ ...prev, projects: updatedProjects }));
    };

    return {
        profileData,
        loading,
        lastSaved,
        handleInputChange,
        saveCV,
        loadCV,
        // Experience operations
        addExperience,
        updateExperience,
        deleteExperience,
        // Education operations
        addEducation,
        updateEducation,
        deleteEducation,
        // Project operations
        addProject,
        updateProject,
        deleteProject,
    };
};