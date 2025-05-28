const fs = require('fs').promises;
const path = require('path');
const handlebars = require('handlebars');
const pdfGenerator = require('../utils/pdfGenerator');

class ExportService {
    constructor() {
        this.templatesPath = path.join(__dirname, '../templates');
    }

    async renderHTML(cvData, templateName = 'modern') {
        try {
            // Get template file
            const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);
            let templateContent;

            try {
                templateContent = await fs.readFile(templatePath, 'utf8');
            } catch (error) {
                // Fallback to default template if specific template not found
                templateContent = this.getDefaultTemplate(templateName);
            }

            // Compile template
            const template = handlebars.compile(templateContent);

            // Process CV data for template
            const processedData = this.processDataForTemplate(cvData);

            // Render HTML
            return template(processedData);
        } catch (error) {
            console.error('HTML rendering error:', error);
            throw new Error('Failed to render HTML');
        }
    }

    // Process CV data for template rendering
    processDataForTemplate(cvData) {
        const processed = { ...cvData };

        // Ensure all required sections exist
        processed.personalInfo = processed.personalInfo || {};
        processed.experience = processed.experience || [];
        processed.education = processed.education || [];
        processed.skills = processed.skills || [];
        processed.projects = processed.projects || [];
        processed.languages = processed.languages || [];
        processed.certifications = processed.certifications || [];

        // Format dates and add helper properties
        processed.experience = processed.experience.map(exp => ({
            ...exp,
            hasDescription: !!exp.description,
            hasLocation: !!exp.location
        }));

        processed.education = processed.education.map(edu => ({
            ...edu,
            hasGPA: !!edu.gpa,
            hasLocation: !!edu.location
        }));

        // Group skills by category if applicable
        const skillsByCategory = {};
        processed.skills.forEach(skill => {
            const category = skill.category || 'General';
            if (!skillsByCategory[category]) {
                skillsByCategory[category] = [];
            }
            skillsByCategory[category].push(skill);
        });
        processed.skillsByCategory = Object.entries(skillsByCategory).map(([category, skills]) => ({
            category,
            skills
        }));

        // Add helper flags
        processed.hasExperience = processed.experience.length > 0;
        processed.hasEducation = processed.education.length > 0;
        processed.hasSkills = processed.skills.length > 0;
        processed.hasProjects = processed.projects.length > 0;
        processed.hasLanguages = processed.languages.length > 0;
        processed.hasCertifications = processed.certifications.length > 0;

        return processed;
    }

    // Get template-specific default template
    getDefaultTemplate(templateName = 'modern') {
        const templates = {
            modern: this.getModernTemplate(),
            classic: this.getClassicTemplate(),
            creative: this.getCreativeTemplate(),
            minimal: this.getMinimalTemplate()
        };

        return templates[templateName] || templates.modern;
    }

    getModernTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{personalInfo.fullName}}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 20px;
        }
        .name {
            font-size: 28px;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 10px;
        }
        .contact-info {
            font-size: 14px;
            color: #666;
        }
        .contact-info span {
            margin: 0 10px;
        }
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c5aa0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .item {
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        .item-title {
            font-weight: bold;
            font-size: 16px;
        }
        .item-subtitle {
            font-style: italic;
            color: #666;
        }
        .item-date {
            color: #888;
            font-size: 14px;
        }
        .item-description {
            margin-top: 8px;
            color: #555;
        }
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .skill-category {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        .skill-category-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #2c5aa0;
        }
        .skill-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .skill-item {
            display: flex;
            justify-content: space-between;
            padding: 2px 0;
        }
        .summary {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-style: italic;
        }
        a {
            color: #2c5aa0;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    ${this.getCommonTemplateBody()}
</body>
</html>
        `;
    }

    getClassicTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{personalInfo.fullName}}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.5;
            color: #000;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: left;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
        }
        .name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            margin-bottom: 10px;
            padding-bottom: 2px;
        }
        .item-title {
            font-weight: bold;
        }
        .item-subtitle {
            font-style: italic;
        }
    </style>
</head>
<body>
    ${this.getCommonTemplateBody()}
</body>
</html>
        `;
    }

    getCreativeTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{personalInfo.fullName}}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
        }
        .name {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .section {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 10px;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #ffd700;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    ${this.getCommonTemplateBody()}
</body>
</html>
        `;
    }

    getMinimalTemplate() {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{personalInfo.fullName}}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.8;
            color: #444;
            max-width: 750px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: left;
            margin-bottom: 40px;
        }
        .name {
            font-size: 26px;
            font-weight: 300;
            margin-bottom: 10px;
            color: #222;
        }
        .section-title {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            margin-bottom: 20px;
        }
        .item {
            margin-bottom: 25px;
        }
        .item-title {
            font-weight: 500;
        }
    </style>
</head>
<body>
    ${this.getCommonTemplateBody()}
</body>
</html>
        `;
    }

    getCommonTemplateBody() {
        return `
    <div class="header">
        <div class="name">{{personalInfo.fullName}}</div>
        <div class="contact-info">
            {{#if personalInfo.email}}<span>{{personalInfo.email}}</span>{{/if}}
            {{#if personalInfo.phone}}<span>{{personalInfo.phone}}</span>{{/if}}
            {{#if personalInfo.location}}<span>{{personalInfo.location}}</span>{{/if}}
            {{#if personalInfo.website}}<span><a href="{{personalInfo.website}}">Website</a></span>{{/if}}
            {{#if personalInfo.linkedin}}<span><a href="{{personalInfo.linkedin}}">LinkedIn</a></span>{{/if}}
        </div>
    </div>

    {{#if personalInfo.summary}}
    <div class="section">
        <div class="section-title">Summary</div>
        <div class="summary">{{personalInfo.summary}}</div>
    </div>
    {{/if}}

    {{#if hasExperience}}
    <div class="section">
        <div class="section-title">Experience</div>
        {{#each experience}}
        <div class="item">
            <div class="item-header">
                <div>
                    <div class="item-title">{{title}}</div>
                    <div class="item-subtitle">{{company}}{{#if location}}, {{location}}{{/if}}</div>
                </div>
                {{#if duration}}<div class="item-date">{{duration}}</div>{{/if}}
            </div>
            {{#if description}}<div class="item-description">{{description}}</div>{{/if}}
        </div>
        {{/each}}
    </div>
    {{/if}}

    {{#if hasEducation}}
    <div class="section">
        <div class="section-title">Education</div>
        {{#each education}}
        <div class="item">
            <div class="item-header">
                <div>
                    <div class="item-title">{{degree}}</div>
                    <div class="item-subtitle">{{school}}{{#if location}}, {{location}}{{/if}}</div>
                </div>
                {{#if year}}<div class="item-date">{{year}}</div>{{/if}}
            </div>
            {{#if gpa}}<div class="item-description">GPA: {{gpa}}</div>{{/if}}
        </div>
        {{/each}}
    </div>
    {{/if}}

    {{#if hasSkills}}
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-grid">
            {{#each skillsByCategory}}
            <div class="skill-category">
                <div class="skill-category-title">{{category}}</div>
                <ul class="skill-list">
                    {{#each skills}}
                    <li class="skill-item">
                        <span>{{name}}</span>
                        {{#if level}}<span>{{level}}</span>{{/if}}
                    </li>
                    {{/each}}
                </ul>
            </div>
            {{/each}}
        </div>
    </div>
    {{/if}}

    {{#if hasProjects}}
    <div class="section">
        <div class="section-title">Projects</div>
        {{#each projects}}
        <div class="item">
            <div class="item-header">
                <div class="item-title">
                    {{#if link}}<a href="{{link}}">{{name}}</a>{{else}}{{name}}{{/if}}
                </div>
                {{#if duration}}<div class="item-date">{{duration}}</div>{{/if}}
            </div>
            {{#if technologies}}<div class="item-subtitle">{{technologies}}</div>{{/if}}
            {{#if description}}<div class="item-description">{{description}}</div>{{/if}}
        </div>
        {{/each}}
    </div>
    {{/if}}

    {{#if hasLanguages}}
    <div class="section">
        <div class="section-title">Languages</div>
        <div class="skills-grid">
            {{#each languages}}
            <div class="skill-item">
                <span>{{name}}</span>
                {{#if proficiency}}<span>{{proficiency}}</span>{{/if}}
            </div>
            {{/each}}
        </div>
    </div>
    {{/if}}

    {{#if hasCertifications}}
    <div class="section">
        <div class="section-title">Certifications</div>
        {{#each certifications}}
        <div class="item">
            <div class="item-header">
                <div>
                    <div class="item-title">
                        {{#if url}}<a href="{{url}}">{{name}}</a>{{else}}{{name}}{{/if}}
                    </div>
                    <div class="item-subtitle">{{issuer}}</div>
                </div>
                {{#if date}}<div class="item-date">{{date}}</div>{{/if}}
            </div>
        </div>
        {{/each}}
    </div>
    {{/if}}
        `;
    }

    // Close browser when service shuts down
    async cleanup() {
        await pdfGenerator.closeBrowser();
    }
}

module.exports = new ExportService();