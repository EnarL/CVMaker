import {useCallback, useEffect, useState} from 'react';
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
    const [error, setError] = useState<string | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Load CV data on mount
    useEffect(() => {
        loadCV();
    }, []);

    const loadCV = async () => {
        try {
            setLoading(true);
            setError(null);
            const cvData = await apiService.getCV();
            const profile = cvDataToProfile(cvData);
            setProfileData(profile);
        } catch (err) {
            console.error('Failed to load CV:', err);
            setError(err instanceof Error ? err.message : 'Failed to load CV');
        } finally {
            setLoading(false);
        }
    };

    const saveCV = async (data?: ProfileData) => {
        try {
            setLoading(true);
            setError(null);
            const dataToSave = data || profileData;
            const cvData = profileToCVData(dataToSave);

            const savedData = await apiService.saveCV(cvData);
            const updatedProfile = cvDataToProfile(savedData);

            setProfileData(updatedProfile);
            setLastSaved(new Date());

            return updatedProfile;
        } catch (err) {
            console.error('Failed to save CV:', err);
            setError(err instanceof Error ? err.message : 'Failed to save CV');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Auto-save functionality
    const autoSave = useCallback(async (data: ProfileData) => {
        try {
            const cvData = profileToCVData(data);
            await apiService.saveCV(cvData);
            setLastSaved(new Date());
        } catch (err) {
            console.error('Auto-save failed:', err);
        }
    }, []);

    const handleInputChange = (field: keyof ProfileData, value: any) => {
        const newData = { ...profileData, [field]: value };
        setProfileData(newData);

        // Auto-save after 2 seconds of inactivity
        setTimeout(() => autoSave(newData), 2000);
    };

    // Section-specific operations
    const addExperience = async () => {
        try {
            setLoading(true);
            const newExp = {
                title: '',
                company: '',
                duration: '',
                description: '',
            };

            const addedExp = await apiService.addToSection('experience', newExp);
            const updatedExperience = [...profileData.experience, {
                id: addedExp.data?.id || Date.now().toString(),
                ...newExp
            }];

            setProfileData(prev => ({ ...prev, experience: updatedExperience }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add experience');
        } finally {
            setLoading(false);
        }
    };

    const updateExperience = async (experienceId: string, updatedData: any) => {
        try {
            await apiService.updateSectionItem('experience', experienceId, updatedData);

            const updatedExperience = profileData.experience.map(exp =>
                exp.id === experienceId ? { ...exp, ...updatedData } : exp
            );

            setProfileData(prev => ({ ...prev, experience: updatedExperience }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update experience');
        }
    };

    const deleteExperience = async (experienceId: string) => {
        try {
            await apiService.deleteSectionItem('experience', experienceId);

            const updatedExperience = profileData.experience.filter(exp => exp.id !== experienceId);
            setProfileData(prev => ({ ...prev, experience: updatedExperience }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete experience');
        }
    };

    // Similar functions for education, projects, etc.
    const addEducation = async () => {
        try {
            setLoading(true);
            const newEdu = {
                degree: '',
                school: '',
                year: '',
            };

            const addedEdu = await apiService.addToSection('education', newEdu);
            const updatedEducation = [...profileData.education, {
                id: addedEdu.data?.id || Date.now().toString(),
                ...newEdu
            }];

            setProfileData(prev => ({ ...prev, education: updatedEducation }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add education');
        } finally {
            setLoading(false);
        }
    };

    const updateEducation = async (educationId: string, updatedData: any) => {
        try {
            await apiService.updateSectionItem('education', educationId, updatedData);

            const updatedEducation = profileData.education.map(edu =>
                edu.id === educationId ? { ...edu, ...updatedData } : edu
            );

            setProfileData(prev => ({ ...prev, education: updatedEducation }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update education');
        }
    };

    const deleteEducation = async (educationId: string) => {
        try {
            await apiService.deleteSectionItem('education', educationId);

            const updatedEducation = profileData.education.filter(edu => edu.id !== educationId);
            setProfileData(prev => ({ ...prev, education: updatedEducation }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete education');
        }
    };


    return {
        profileData,
        loading,
        error,
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
        // Utility
        clearError: () => setError(null),
    };
};