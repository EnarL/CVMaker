export interface ProfileData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    bio: string;
    skills: string[];
    experience: Array<{
        id: string;
        title: string;
        company: string;
        duration: string;
        description: string;
    }>;
    projects: Array<{
        id: string;
        name: string;
        description: string;
        technologies: string;
        link: string;
    }>;
    education: Array<{
        id: string;
        degree: string;
        school: string;
        year: string;
    }>;
}