// services/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface CVData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        website?: string;
        linkedin?: string;
        summary: string;
    };
    experience: Array<{
        id?: string;
        title: string;
        company: string;
        location?: string;
        duration: string;
        description: string;
    }>;
    education: Array<{
        id?: string;
        degree: string;
        school: string;
        location?: string;
        year: string;
        gpa?: string;
    }>;
    skills: Array<{
        id?: string;
        name: string;
        level?: string;
        category?: string;
    }>;
    projects: Array<{
        id?: string;
        name: string;
        description: string;
        technologies: string;
        link?: string;
        duration?: string;
    }>;
    languages?: Array<{
        id?: string;
        name: string;
        proficiency?: string;
    }>;
    certifications?: Array<{
        id?: string;
        name: string;
        issuer: string;
        date?: string;
        url?: string;
    }>;
    template?: string;
}

class APIService {
    private async fetchWithCredentials(url: string, options: RequestInit = {}) {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            let errorMessage = 'API request failed';
            try {
                const error = await response.json();
                errorMessage = error.message || errorMessage;
                if (error.errors) {
                    console.error('Validation errors:', error.errors);
                }
            } catch {
                console.error('Failed to parse error response');
            }
            throw new Error(errorMessage);
        }

        return response.json();
    }

    async getCV(): Promise<CVData> {
        try {
            const response = await this.fetchWithCredentials('/cv');
            return response.data || this.getEmptyTemplate();
        } catch {
            return this.getEmptyTemplate();
        }
    }

    async saveCV(cvData: CVData): Promise<CVData> {
        const cleanedData = this.cleanCVData(cvData);
        const response = await this.fetchWithCredentials('/cv', {
            method: 'POST',
            body: JSON.stringify(cleanedData),
        });
        return response.data;
    }

    private cleanCVData(cvData: CVData): CVData {
        return {
            personalInfo: {
                fullName: cvData.personalInfo?.fullName || '',
                email: cvData.personalInfo?.email || '',
                phone: cvData.personalInfo?.phone || '',
                location: cvData.personalInfo?.location || '',
                website: cvData.personalInfo?.website || '',
                linkedin: cvData.personalInfo?.linkedin || '',
                summary: cvData.personalInfo?.summary || '',
            },
            experience: (cvData.experience || [])
                .filter(exp => exp.title || exp.company)
                .map(exp => ({
                    id: exp.id,
                    title: exp.title || '',
                    company: exp.company || '',
                    location: exp.location || '',
                    duration: exp.duration || '',
                    description: exp.description || '',
                })),
            education: (cvData.education || [])
                .filter(edu => edu.degree || edu.school)
                .map(edu => ({
                    id: edu.id,
                    degree: edu.degree || '',
                    school: edu.school || '',
                    location: edu.location || '',
                    year: edu.year || '',
                    gpa: edu.gpa || '',
                })),
            skills: (cvData.skills || [])
                .filter(skill => skill.name)
                .map(skill => ({
                    id: skill.id,
                    name: skill.name,
                    level: skill.level || '',
                    category: skill.category || 'General',
                })),
            projects: (cvData.projects || [])
                .filter(project => project.name || project.description)
                .map(project => ({
                    id: project.id,
                    name: project.name || '',
                    description: project.description || '',
                    technologies: project.technologies || '',
                    link: project.link || '',
                    duration: project.duration || '',
                })),
            languages: cvData.languages || [],
            certifications: cvData.certifications || [],
            template: cvData.template || 'modern',
        };
    }

    async getEmptyTemplate(): Promise<CVData> {
        try {
            const response = await this.fetchWithCredentials('/cv/template');
            return response.data;
        } catch {
            return {
                personalInfo: {
                    fullName: '',
                    email: '',
                    phone: '',
                    location: '',
                    website: '',
                    linkedin: '',
                    summary: '',
                },
                experience: [],
                education: [],
                skills: [],
                projects: [],
                languages: [],
                certifications: [],
                template: 'modern',
            };
        }
    }

    async deleteCV(): Promise<void> {
        await this.fetchWithCredentials('/cv', {
            method: 'DELETE',
        });
    }

    async updateSection(section: string, data: any): Promise<any> {
        const response = await this.fetchWithCredentials(`/cv/section/${section}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.data;
    }

    async addToSection(section: string, item: any): Promise<any> {
        const response = await this.fetchWithCredentials(`/cv/section/${section}`, {
            method: 'POST',
            body: JSON.stringify(item),
        });
        return response.data;
    }

    async updateSectionItem(section: string, itemId: string, data: any): Promise<any> {
        const response = await this.fetchWithCredentials(`/cv/section/${section}/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.data;
    }

    async deleteSectionItem(section: string, itemId: string): Promise<void> {
        await this.fetchWithCredentials(`/cv/section/${section}/${itemId}`, {
            method: 'DELETE',
        });
    }

}

export const apiService = new APIService();
