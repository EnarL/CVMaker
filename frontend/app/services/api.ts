const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface CVData {
    personalInfo: {
        fullName?: string;
        email?: string;
        phone?: string;
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
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                ...options,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            // For non-200 responses, try to get the response anyway
            if (!response.ok) {
                console.warn(`API request returned ${response.status} for ${url}`);
                // Try to parse response even if not ok
                try {
                    const data = await response.json();
                    return data;
                } catch {
                    // If can't parse, return empty object
                    return {};
                }
            }
