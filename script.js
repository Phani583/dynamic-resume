// Resume Builder JavaScript

class ResumeBuilder {
    constructor() {
        this.data = this.getDefaultData();
        this.customization = this.getDefaultCustomization();
        this.isEditMode = false;
        this.themes = this.getThemes();
        
        this.initializeElements();
        this.bindEvents();
        this.loadFromStorage();
        this.renderThemes();
        this.updatePreview();
        
        this.showToast('Welcome to Resume Builder!', 'Start building your professional resume', 'success');
    }
    
    getDefaultData() {
        return {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                location: '',
                summary: ''
            },
            publicLinks: {
                github: '',
                linkedin: '',
                portfolio: '',
                website: ''
            },
            experience: [],
            education: [],
            skills: [],
            projects: []
        };
    }
    
    getDefaultCustomization() {
        return {
            primaryColor: '#2563eb',
            secondaryColor: '#64748b',
            accentColor: '#3b82f6',
            layout: 'traditional',
            fontFamily: 'Inter',
            theme: 'classic-professional'
        };
    }
    
    getThemes() {
        return [
            {
                id: 'classic-professional',
                name: 'Classic Professional',
                primaryColor: '#2563eb',
                secondaryColor: '#64748b',
                accentColor: '#3b82f6',
                layout: 'traditional'
            },
            {
                id: 'modern-executive',
                name: 'Modern Executive',
                primaryColor: '#1f2937',
                secondaryColor: '#6b7280',
                accentColor: '#ef4444',
                layout: 'modern'
            },
            {
                id: 'creative-designer',
                name: 'Creative Designer',
                primaryColor: '#7c3aed',
                secondaryColor: '#a78bfa',
                accentColor: '#fbbf24',
                layout: 'sidebar'
            },
            {
                id: 'minimal-clean',
                name: 'Minimal Clean',
                primaryColor: '#374151',
                secondaryColor: '#9ca3af',
                accentColor: '#10b981',
                layout: 'minimal'
            },
            {
                id: 'tech-innovator',
                name: 'Tech Innovator',
                primaryColor: '#0891b2',
                secondaryColor: '#0e7490',
                accentColor: '#f59e0b',
                layout: 'two-column'
            }
        ];
    }
    
    initializeElements() {
        // Form inputs
        this.elements = {
            fullName: document.getElementById('fullName'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            location: document.getElementById('location'),
            summary: document.getElementById('summary'),
            github: document.getElementById('github'),
            linkedin: document.getElementById('linkedin'),
            portfolio: document.getElementById('portfolio'),
            website: document.getElementById('website'),
            
            // Lists
            experienceList: document.getElementById('experienceList'),
            educationList: document.getElementById('educationList'),
            skillsList: document.getElementById('skillsList'),
            projectsList: document.getElementById('projectsList'),
            
            // Buttons
            addExperience: document.getElementById('addExperience'),
            addEducation: document.getElementById('addEducation'),
            addSkill: document.getElementById('addSkill'),
            addProject: document.getElementById('addProject'),
            editModeToggle: document.getElementById('editModeToggle'),
            downloadBtn: document.getElementById('downloadBtn'),
            downloadDocxBtn: document.getElementById('downloadDocxBtn'),
            
            // Customization
            primaryColor: document.getElementById('primaryColor'),
            secondaryColor: document.getElementById('secondaryColor'),
            accentColor: document.getElementById('accentColor'),
            layoutSelector: document.getElementById('layoutSelector'),
            fontSelector: document.getElementById('fontSelector'),
            themeSelector: document.getElementById('themeSelector'),
            
            // Preview
            emptyState: document.getElementById('emptyState'),
            resumeDocument: document.getElementById('resumeDocument'),
            toastContainer: document.getElementById('toastContainer')
        };
    }
    
    bindEvents() {
        // Personal info inputs
        Object.keys(this.data.personalInfo).forEach(key => {
            if (this.elements[key]) {
                this.elements[key].addEventListener('input', (e) => {
                    this.data.personalInfo[key] = e.target.value;
                    this.saveToStorage();
                    this.updatePreview();
                });
            }
        });
        
        // Public links inputs
        Object.keys(this.data.publicLinks).forEach(key => {
            if (this.elements[key]) {
                this.elements[key].addEventListener('input', (e) => {
                    this.data.publicLinks[key] = e.target.value;
                    this.saveToStorage();
                    this.updatePreview();
                });
            }
        });
        
        // Add buttons
        this.elements.addExperience.addEventListener('click', () => this.addExperience());
        this.elements.addEducation.addEventListener('click', () => this.addEducation());
        this.elements.addSkill.addEventListener('click', () => this.addSkill());
        this.elements.addProject.addEventListener('click', () => this.addProject());
        
        // Action buttons
        this.elements.editModeToggle.addEventListener('click', () => this.toggleEditMode());
        this.elements.downloadBtn.addEventListener('click', () => this.downloadPDF());
        this.elements.downloadDocxBtn.addEventListener('click', () => this.downloadDOCX());
        
        // Customization inputs
        this.elements.primaryColor.addEventListener('input', (e) => {
            this.customization.primaryColor = e.target.value;
            this.saveToStorage();
            this.updatePreview();
        });
        
        this.elements.secondaryColor.addEventListener('input', (e) => {
            this.customization.secondaryColor = e.target.value;
            this.saveToStorage();
            this.updatePreview();
        });
        
        this.elements.accentColor.addEventListener('input', (e) => {
            this.customization.accentColor = e.target.value;
            this.saveToStorage();
            this.updatePreview();
        });
        
        this.elements.layoutSelector.addEventListener('change', (e) => {
            this.customization.layout = e.target.value;
            this.saveToStorage();
            this.updatePreview();
        });
        
        this.elements.fontSelector.addEventListener('change', (e) => {
            this.customization.fontFamily = e.target.value;
            this.saveToStorage();
            this.updatePreview();
        });
    }
    
    // Experience Management
    addExperience() {
        const experience = {
            id: this.generateId(),
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        };
        
        this.data.experience.push(experience);
        this.renderExperience();
        this.saveToStorage();
        this.updatePreview();
    }
    
    renderExperience() {
        this.elements.experienceList.innerHTML = '';
        this.data.experience.forEach((exp, index) => {
            const expElement = this.createExperienceElement(exp, index);
            this.elements.experienceList.appendChild(expElement);
        });
    }
    
    createExperienceElement(exp, index) {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="list-item-header">
                <span class="list-item-title">Experience ${index + 1}</span>
                <button onclick="app.removeExperience(${index})" class="btn btn-sm btn-danger">Remove</button>
            </div>
            <input type="text" placeholder="Job Title" class="input" value="${exp.jobTitle}" 
                   onchange="app.updateExperience(${index}, 'jobTitle', this.value)">
            <input type="text" placeholder="Company" class="input" value="${exp.company}"
                   onchange="app.updateExperience(${index}, 'company', this.value)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <input type="date" placeholder="Start Date" class="input" value="${exp.startDate}"
                       onchange="app.updateExperience(${index}, 'startDate', this.value)">
                <input type="date" placeholder="End Date" class="input" value="${exp.endDate}"
                       onchange="app.updateExperience(${index}, 'endDate', this.value)" ${exp.current ? 'disabled' : ''}>
            </div>
            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
                <input type="checkbox" ${exp.current ? 'checked' : ''} 
                       onchange="app.updateExperience(${index}, 'current', this.checked)">
                Currently working here
            </label>
            <textarea placeholder="Job Description" class="textarea" 
                      onchange="app.updateExperience(${index}, 'description', this.value)">${exp.description}</textarea>
        `;
        return div;
    }
    
    updateExperience(index, field, value) {
        if (this.data.experience[index]) {
            this.data.experience[index][field] = value;
            if (field === 'current' && value) {
                this.data.experience[index].endDate = '';
            }
            this.saveToStorage();
            this.updatePreview();
            if (field === 'current') {
                this.renderExperience(); // Re-render to update disabled state
            }
        }
    }
    
    removeExperience(index) {
        this.data.experience.splice(index, 1);
        this.renderExperience();
        this.saveToStorage();
        this.updatePreview();
        this.showToast('Experience Removed', 'Experience entry has been deleted', 'success');
    }
    
    // Education Management
    addEducation() {
        const education = {
            id: this.generateId(),
            degree: '',
            school: '',
            startYear: '',
            endYear: '',
            current: false,
            cgpa: ''
        };
        
        this.data.education.push(education);
        this.renderEducation();
        this.saveToStorage();
        this.updatePreview();
    }
    
    renderEducation() {
        this.elements.educationList.innerHTML = '';
        this.data.education.forEach((edu, index) => {
            const eduElement = this.createEducationElement(edu, index);
            this.elements.educationList.appendChild(eduElement);
        });
    }
    
    createEducationElement(edu, index) {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="list-item-header">
                <span class="list-item-title">Education ${index + 1}</span>
                <button onclick="app.removeEducation(${index})" class="btn btn-sm btn-danger">Remove</button>
            </div>
            <input type="text" placeholder="Degree/Course" class="input" value="${edu.degree}" 
                   onchange="app.updateEducation(${index}, 'degree', this.value)">
            <input type="text" placeholder="School/University" class="input" value="${edu.school}"
                   onchange="app.updateEducation(${index}, 'school', this.value)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <input type="text" placeholder="Start Year" class="input" value="${edu.startYear}"
                       onchange="app.updateEducation(${index}, 'startYear', this.value)">
                <input type="text" placeholder="End Year" class="input" value="${edu.endYear}"
                       onchange="app.updateEducation(${index}, 'endYear', this.value)" ${edu.current ? 'disabled' : ''}>
            </div>
            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
                <input type="checkbox" ${edu.current ? 'checked' : ''} 
                       onchange="app.updateEducation(${index}, 'current', this.checked)">
                Currently studying
            </label>
            <input type="text" placeholder="CGPA/Grade (optional)" class="input" value="${edu.cgpa}"
                   onchange="app.updateEducation(${index}, 'cgpa', this.value)">
        `;
        return div;
    }
    
    updateEducation(index, field, value) {
        if (this.data.education[index]) {
            this.data.education[index][field] = value;
            if (field === 'current' && value) {
                this.data.education[index].endYear = '';
            }
            this.saveToStorage();
            this.updatePreview();
            if (field === 'current') {
                this.renderEducation(); // Re-render to update disabled state
            }
        }
    }
    
    removeEducation(index) {
        this.data.education.splice(index, 1);
        this.renderEducation();
        this.saveToStorage();
        this.updatePreview();
        this.showToast('Education Removed', 'Education entry has been deleted', 'success');
    }
    
    // Skills Management
    addSkill() {
        const skill = {
            id: this.generateId(),
            name: '',
            category: '',
            level: 'Intermediate'
        };
        
        this.data.skills.push(skill);
        this.renderSkills();
        this.saveToStorage();
        this.updatePreview();
    }
    
    renderSkills() {
        this.elements.skillsList.innerHTML = '';
        this.data.skills.forEach((skill, index) => {
            const skillElement = this.createSkillElement(skill, index);
            this.elements.skillsList.appendChild(skillElement);
        });
    }
    
    createSkillElement(skill, index) {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="list-item-header">
                <span class="list-item-title">Skill ${index + 1}</span>
                <button onclick="app.removeSkill(${index})" class="btn btn-sm btn-danger">Remove</button>
            </div>
            <input type="text" placeholder="Skill Name" class="input" value="${skill.name}" 
                   onchange="app.updateSkill(${index}, 'name', this.value)">
            <input type="text" placeholder="Category (e.g., Programming, Design)" class="input" value="${skill.category}"
                   onchange="app.updateSkill(${index}, 'category', this.value)">
            <select class="select" onchange="app.updateSkill(${index}, 'level', this.value)">
                <option value="Beginner" ${skill.level === 'Beginner' ? 'selected' : ''}>Beginner</option>
                <option value="Intermediate" ${skill.level === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
                <option value="Expert" ${skill.level === 'Expert' ? 'selected' : ''}>Expert</option>
            </select>
        `;
        return div;
    }
    
    updateSkill(index, field, value) {
        if (this.data.skills[index]) {
            this.data.skills[index][field] = value;
            this.saveToStorage();
            this.updatePreview();
        }
    }
    
    removeSkill(index) {
        this.data.skills.splice(index, 1);
        this.renderSkills();
        this.saveToStorage();
        this.updatePreview();
        this.showToast('Skill Removed', 'Skill has been deleted', 'success');
    }
    
    // Projects Management
    addProject() {
        const project = {
            id: this.generateId(),
            name: '',
            description: '',
            technologies: '',
            url: '',
            startDate: '',
            endDate: '',
            current: false
        };
        
        this.data.projects.push(project);
        this.renderProjects();
        this.saveToStorage();
        this.updatePreview();
    }
    
    renderProjects() {
        this.elements.projectsList.innerHTML = '';
        this.data.projects.forEach((project, index) => {
            const projectElement = this.createProjectElement(project, index);
            this.elements.projectsList.appendChild(projectElement);
        });
    }
    
    createProjectElement(project, index) {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div class="list-item-header">
                <span class="list-item-title">Project ${index + 1}</span>
                <button onclick="app.removeProject(${index})" class="btn btn-sm btn-danger">Remove</button>
            </div>
            <input type="text" placeholder="Project Name" class="input" value="${project.name}" 
                   onchange="app.updateProject(${index}, 'name', this.value)">
            <textarea placeholder="Project Description" class="textarea" 
                      onchange="app.updateProject(${index}, 'description', this.value)">${project.description}</textarea>
            <input type="text" placeholder="Technologies Used" class="input" value="${project.technologies}"
                   onchange="app.updateProject(${index}, 'technologies', this.value)">
            <input type="url" placeholder="Project URL (optional)" class="input" value="${project.url}"
                   onchange="app.updateProject(${index}, 'url', this.value)">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <input type="date" placeholder="Start Date" class="input" value="${project.startDate}"
                       onchange="app.updateProject(${index}, 'startDate', this.value)">
                <input type="date" placeholder="End Date" class="input" value="${project.endDate}"
                       onchange="app.updateProject(${index}, 'endDate', this.value)" ${project.current ? 'disabled' : ''}>
            </div>
            <label style="display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
                <input type="checkbox" ${project.current ? 'checked' : ''} 
                       onchange="app.updateProject(${index}, 'current', this.checked)">
                Currently working on this project
            </label>
        `;
        return div;
    }
    
    updateProject(index, field, value) {
        if (this.data.projects[index]) {
            this.data.projects[index][field] = value;
            if (field === 'current' && value) {
                this.data.projects[index].endDate = '';
            }
            this.saveToStorage();
            this.updatePreview();
            if (field === 'current') {
                this.renderProjects(); // Re-render to update disabled state
            }
        }
    }
    
    removeProject(index) {
        this.data.projects.splice(index, 1);
        this.renderProjects();
        this.saveToStorage();
        this.updatePreview();
        this.showToast('Project Removed', 'Project has been deleted', 'success');
    }
    
    // Theme Management
    renderThemes() {
        this.elements.themeSelector.innerHTML = '';
        this.themes.forEach(theme => {
            const themeCard = document.createElement('div');
            themeCard.className = `theme-card ${theme.id === this.customization.theme ? 'active' : ''}`;
            themeCard.innerHTML = `
                <div class="theme-preview" style="background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})"></div>
                <div class="theme-name">${theme.name}</div>
            `;
            themeCard.addEventListener('click', () => this.selectTheme(theme));
            this.elements.themeSelector.appendChild(themeCard);
        });
    }
    
    selectTheme(theme) {
        this.customization = {
            ...this.customization,
            theme: theme.id,
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            accentColor: theme.accentColor,
            layout: theme.layout
        };
        
        // Update color inputs
        this.elements.primaryColor.value = theme.primaryColor;
        this.elements.secondaryColor.value = theme.secondaryColor;
        this.elements.accentColor.value = theme.accentColor;
        this.elements.layoutSelector.value = theme.layout;
        
        this.renderThemes();
        this.saveToStorage();
        this.updatePreview();
        this.showToast('Theme Applied', `${theme.name} theme has been applied`, 'success');
    }
    
    // Preview Generation
    updatePreview() {
        const hasContent = this.hasResumeContent();
        
        if (hasContent) {
            this.elements.emptyState.style.display = 'none';
            this.elements.resumeDocument.style.display = 'block';
            this.generateResumeHTML();
        } else {
            this.elements.emptyState.style.display = 'flex';
            this.elements.resumeDocument.style.display = 'none';
        }
        
        this.applyCustomization();
    }
    
    hasResumeContent() {
        const { personalInfo, experience, education, skills, projects } = this.data;
        return personalInfo.fullName || personalInfo.email || 
               experience.length > 0 || education.length > 0 || 
               skills.length > 0 || projects.length > 0;
    }
    
    generateResumeHTML() {
        const { personalInfo, publicLinks, experience, education, skills, projects } = this.data;
        const layout = this.customization.layout;
        
        let html = `<div class="resume-document ${layout}-layout">`;
        
        // Header
        html += `<header class="resume-header">`;
        if (personalInfo.fullName) {
            html += `<h1 class="resume-name ${this.isEditMode ? 'editable' : ''}" 
                         ${this.isEditMode ? 'contenteditable="true" data-field="personalInfo.fullName"' : ''}>
                         ${personalInfo.fullName}
                     </h1>`;
        }
        
        // Contact Info
        const contactInfo = [
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location
        ].filter(Boolean);
        
        if (contactInfo.length > 0) {
            html += `<div class="resume-contact">`;
            contactInfo.forEach(info => {
                html += `<span>${info}</span>`;
            });
            html += `</div>`;
        }
        
        // Public Links
        const links = Object.entries(publicLinks).filter(([key, value]) => value);
        if (links.length > 0) {
            html += `<div class="resume-links">`;
            links.forEach(([key, value]) => {
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                html += `<a href="${value}" class="resume-link" target="_blank">${label}</a>`;
            });
            html += `</div>`;
        }
        html += `</header>`;
        
        // Content based on layout
        if (layout === 'sidebar') {
            html += this.generateSidebarLayout();
        } else if (layout === 'two-column') {
            html += this.generateTwoColumnLayout();
        } else {
            html += this.generateTraditionalLayout();
        }
        
        html += `</div>`;
        this.elements.resumeDocument.innerHTML = html;
        
        // Bind edit mode events
        if (this.isEditMode) {
            this.bindEditableElements();
        }
    }
    
    generateTraditionalLayout() {
        let html = '';
        
        // Summary
        if (this.data.personalInfo.summary) {
            html += this.generateSection('Summary', '', [
                `<p class="resume-item-description ${this.isEditMode ? 'editable' : ''}" 
                     ${this.isEditMode ? 'contenteditable="true" data-field="personalInfo.summary"' : ''}>
                     ${this.data.personalInfo.summary}
                 </p>`
            ]);
        }
        
        // Experience
        if (this.data.experience.length > 0) {
            html += this.generateSection('Experience', '💼', 
                this.data.experience.map(exp => this.generateExperienceItem(exp))
            );
        }
        
        // Education
        if (this.data.education.length > 0) {
            html += this.generateSection('Education', '🎓',
                this.data.education.map(edu => this.generateEducationItem(edu))
            );
        }
        
        // Skills
        if (this.data.skills.length > 0) {
            html += this.generateSection('Skills', '🛠️', [
                `<div class="resume-skills">
                    ${this.data.skills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
                 </div>`
            ]);
        }
        
        // Projects
        if (this.data.projects.length > 0) {
            html += this.generateSection('Projects', '🚀',
                this.data.projects.map(project => this.generateProjectItem(project))
            );
        }
        
        return html;
    }
    
    generateSidebarLayout() {
        let sidebarContent = '';
        let mainContent = '';
        
        // Sidebar: Skills, Education
        if (this.data.skills.length > 0) {
            sidebarContent += this.generateSection('Skills', '🛠️', [
                `<div class="resume-skills">
                    ${this.data.skills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
                 </div>`
            ]);
        }
        
        if (this.data.education.length > 0) {
            sidebarContent += this.generateSection('Education', '🎓',
                this.data.education.map(edu => this.generateEducationItem(edu))
            );
        }
        
        // Main: Summary, Experience, Projects
        if (this.data.personalInfo.summary) {
            mainContent += this.generateSection('Summary', '', [
                `<p class="resume-item-description">${this.data.personalInfo.summary}</p>`
            ]);
        }
        
        if (this.data.experience.length > 0) {
            mainContent += this.generateSection('Experience', '💼',
                this.data.experience.map(exp => this.generateExperienceItem(exp))
            );
        }
        
        if (this.data.projects.length > 0) {
            mainContent += this.generateSection('Projects', '🚀',
                this.data.projects.map(project => this.generateProjectItem(project))
            );
        }
        
        return `
            <div class="resume-sidebar">${sidebarContent}</div>
            <div class="resume-main">${mainContent}</div>
        `;
    }
    
    generateTwoColumnLayout() {
        const leftColumn = this.generateTraditionalLayout();
        return `<div class="resume-content-grid">${leftColumn}</div>`;
    }
    
    generateSection(title, icon, items) {
        return `
            <section class="resume-section">
                <h2 class="resume-section-title">${icon} ${title}</h2>
                ${items.join('')}
            </section>
        `;
    }
    
    generateExperienceItem(exp) {
        const endDate = exp.current ? 'Present' : exp.endDate;
        const dateRange = exp.startDate && (endDate || exp.current) ? 
            `${exp.startDate} - ${endDate}` : '';
        
        return `
            <div class="resume-item">
                <div class="resume-item-header">
                    <div>
                        <div class="resume-item-title">${exp.jobTitle}</div>
                        <div class="resume-item-subtitle">${exp.company}</div>
                    </div>
                    <div class="resume-item-date">${dateRange}</div>
                </div>
                ${exp.description ? `<p class="resume-item-description">${exp.description}</p>` : ''}
            </div>
        `;
    }
    
    generateEducationItem(edu) {
        const endYear = edu.current ? 'Present' : edu.endYear;
        const yearRange = edu.startYear && (endYear || edu.current) ? 
            `${edu.startYear} - ${endYear}` : '';
        
        return `
            <div class="resume-item">
                <div class="resume-item-header">
                    <div>
                        <div class="resume-item-title">${edu.degree}</div>
                        <div class="resume-item-subtitle">${edu.school}</div>
                    </div>
                    <div class="resume-item-date">${yearRange}</div>
                </div>
                ${edu.cgpa ? `<p class="resume-item-description">CGPA: ${edu.cgpa}</p>` : ''}
            </div>
        `;
    }
    
    generateProjectItem(project) {
        const endDate = project.current ? 'Present' : project.endDate;
        const dateRange = project.startDate && (endDate || project.current) ? 
            `${project.startDate} - ${endDate}` : '';
        
        return `
            <div class="resume-item">
                <div class="resume-item-header">
                    <div>
                        <div class="resume-item-title">
                            ${project.url ? `<a href="${project.url}" target="_blank">${project.name}</a>` : project.name}
                        </div>
                        <div class="resume-item-subtitle">${project.technologies}</div>
                    </div>
                    <div class="resume-item-date">${dateRange}</div>
                </div>
                ${project.description ? `<p class="resume-item-description">${project.description}</p>` : ''}
            </div>
        `;
    }
    
    applyCustomization() {
        const root = document.documentElement;
        root.style.setProperty('--resume-primary', this.customization.primaryColor);
        root.style.setProperty('--resume-secondary', this.customization.secondaryColor);
        root.style.setProperty('--resume-accent', this.customization.accentColor);
        root.style.setProperty('--resume-font', this.customization.fontFamily);
        
        const resumeDocument = this.elements.resumeDocument.querySelector('.resume-document');
        if (resumeDocument) {
            resumeDocument.style.fontFamily = this.customization.fontFamily;
        }
    }
    
    // Edit Mode
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        const toggleText = document.getElementById('editModeText');
        toggleText.textContent = this.isEditMode ? 'Disable Live Edit' : 'Enable Live Edit';
        
        document.body.classList.toggle('edit-mode', this.isEditMode);
        this.updatePreview();
        
        this.showToast(
            this.isEditMode ? 'Live Edit Enabled' : 'Live Edit Disabled',
            this.isEditMode ? 'Click on text in the preview to edit directly' : 'Live editing has been disabled',
            'success'
        );
    }
    
    bindEditableElements() {
        const editables = this.elements.resumeDocument.querySelectorAll('.editable');
        editables.forEach(element => {
            element.addEventListener('blur', (e) => {
                const field = e.target.getAttribute('data-field');
                if (field) {
                    this.updateNestedField(field, e.target.textContent);
                }
            });
        });
    }
    
    updateNestedField(fieldPath, value) {
        const keys = fieldPath.split('.');
        let obj = this.data;
        
        for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }
        
        obj[keys[keys.length - 1]] = value;
        this.saveToStorage();
        
        // Update form input if exists
        const inputElement = this.elements[keys[keys.length - 1]];
        if (inputElement) {
            inputElement.value = value;
        }
    }
    
    // Download Functions
    downloadPDF() {
        if (!this.validateRequired()) return;
        
        this.showToast('Preparing Download', 'Your PDF is being generated...', 'success');
        
        // Simple print dialog for PDF
        setTimeout(() => {
            window.print();
        }, 500);
    }
    
    downloadDOCX() {
        if (!this.validateRequired()) return;
        
        this.showToast('Feature Coming Soon', 'DOCX download will be available in the next update', 'warning');
    }
    
    validateRequired() {
        if (!this.data.personalInfo.fullName.trim()) {
            this.showToast('Validation Error', 'Please enter your full name before downloading', 'error');
            return false;
        }
        
        if (!this.data.personalInfo.email.trim()) {
            this.showToast('Validation Error', 'Please enter your email address before downloading', 'error');
            return false;
        }
        
        return true;
    }
    
    // Storage
    saveToStorage() {
        localStorage.setItem('resumeBuilder_data', JSON.stringify(this.data));
        localStorage.setItem('resumeBuilder_customization', JSON.stringify(this.customization));
    }
    
    loadFromStorage() {
        const savedData = localStorage.getItem('resumeBuilder_data');
        const savedCustomization = localStorage.getItem('resumeBuilder_customization');
        
        if (savedData) {
            try {
                this.data = { ...this.getDefaultData(), ...JSON.parse(savedData) };
                this.populateForm();
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
        
        if (savedCustomization) {
            try {
                this.customization = { ...this.getDefaultCustomization(), ...JSON.parse(savedCustomization) };
                this.populateCustomization();
            } catch (e) {
                console.error('Error loading saved customization:', e);
            }
        }
    }
    
    populateForm() {
        // Personal info
        Object.keys(this.data.personalInfo).forEach(key => {
            if (this.elements[key]) {
                this.elements[key].value = this.data.personalInfo[key];
            }
        });
        
        // Public links
        Object.keys(this.data.publicLinks).forEach(key => {
            if (this.elements[key]) {
                this.elements[key].value = this.data.publicLinks[key];
            }
        });
        
        // Render lists
        this.renderExperience();
        this.renderEducation();
        this.renderSkills();
        this.renderProjects();
    }
    
    populateCustomization() {
        this.elements.primaryColor.value = this.customization.primaryColor;
        this.elements.secondaryColor.value = this.customization.secondaryColor;
        this.elements.accentColor.value = this.customization.accentColor;
        this.elements.layoutSelector.value = this.customization.layout;
        this.elements.fontSelector.value = this.customization.fontFamily;
    }
    
    // Utility Functions
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    showToast(title, description, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-description">${description}</div>
        `;
        
        this.elements.toastContainer.appendChild(toast);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ResumeBuilder();
});