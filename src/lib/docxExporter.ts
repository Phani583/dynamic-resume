import { saveAs } from 'file-saver';
import { ResumeData, CustomizationOptions, ResumeTheme } from '@/components/resume/types';

// Convert HTML to DOCX
export const exportToDocx = async (
  data: ResumeData,
  customization: CustomizationOptions,
  theme: ResumeTheme,
  filename: string = 'resume.docx'
) => {
  try {
    // Create HTML content for the resume
    const htmlContent = generateResumeHTML(data, customization, theme);
    
    // Use html-docx-js to convert HTML to DOCX
    const { default: HTMLtoDOCX } = await import('html-docx-js/dist/html-docx');
    
    const docx = HTMLtoDOCX(htmlContent, {
      table: { row: { cantSplit: true } },
      pageNumber: true,
      font: theme.fontFamily
    });
    
    // Create blob and download
    const blob = new Blob([docx], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw new Error('Failed to export resume as Word document');
  }
};

const generateResumeHTML = (
  data: ResumeData,
  customization: CustomizationOptions,
  theme: ResumeTheme
): string => {
  const colors = customization.colors;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: ${theme.fontFamily}, sans-serif;
          color: ${colors.text};
          line-height: 1.6;
          margin: 0;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid ${colors.primary};
          padding-bottom: 20px;
        }
        .name {
          color: ${colors.primary};
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .contact-info {
          color: ${colors.secondary};
          margin-bottom: 10px;
        }
        .links {
          color: ${colors.accent};
          margin-top: 10px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          color: ${colors.primary};
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          border-bottom: 1px solid ${colors.primary};
          padding-bottom: 5px;
        }
        .experience-item, .education-item, .certificate-item {
          margin-bottom: 15px;
        }
        .job-title, .degree, .cert-name {
          font-weight: bold;
          font-size: 16px;
        }
        .company, .school, .issuer {
          color: ${colors.secondary};
          font-weight: 500;
        }
        .date {
          color: ${colors.secondary};
          font-style: italic;
        }
        .description {
          margin-top: 8px;
          line-height: 1.5;
        }
        .skills-category {
          margin-bottom: 15px;
        }
        .skills-category-title {
          color: ${colors.secondary};
          font-weight: bold;
          margin-bottom: 8px;
        }
        .skill-item {
          display: inline-block;
          background-color: ${colors.accent}20;
          color: ${colors.accent};
          padding: 4px 12px;
          margin: 2px 4px 2px 0;
          border-radius: 15px;
          font-size: 14px;
        }
        .summary {
          font-style: italic;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header">
        <div class="name">${data.personalInfo.fullName}</div>
        <div class="contact-info">
          ${data.personalInfo.email ? `Email: ${data.personalInfo.email}` : ''}
          ${data.personalInfo.phone ? ` | Phone: ${data.personalInfo.phone}` : ''}
          ${data.personalInfo.location ? ` | Location: ${data.personalInfo.location}` : ''}
        </div>
        ${(data.publicLinks.github || data.publicLinks.linkedin || data.publicLinks.portfolio || data.publicLinks.website) ? `
          <div class="links">
            ${data.publicLinks.github ? `GitHub: ${data.publicLinks.github} | ` : ''}
            ${data.publicLinks.linkedin ? `LinkedIn: ${data.publicLinks.linkedin} | ` : ''}
            ${data.publicLinks.portfolio ? `Portfolio: ${data.publicLinks.portfolio} | ` : ''}
            ${data.publicLinks.website ? `Website: ${data.publicLinks.website}` : ''}
          </div>
        ` : ''}
      </div>

      <!-- Summary -->
      ${data.personalInfo.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="summary">${data.personalInfo.summary}</div>
        </div>
      ` : ''}

      <!-- Experience -->
      ${data.experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Professional Experience</div>
          ${data.experience.map(exp => `
            <div class="experience-item">
              <div class="job-title">${exp.jobTitle}</div>
              <div class="company">${exp.company}</div>
              <div class="date">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</div>
              ${exp.description ? `
                <div class="description">
                  ${exp.description.split('\n').map(line => `• ${line}`).join('<br>')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Education -->
      ${data.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${data.education.map(edu => `
            <div class="education-item">
              <div class="degree">${edu.degree}</div>
              <div class="school">${edu.school}</div>
              <div class="date">${edu.startYear} - ${edu.current ? 'Present' : edu.endYear}</div>
              ${(edu.cgpa || edu.percentage || edu.letterGrade) ? `
                <div class="description">
                  ${edu.cgpa && edu.cgpaScale ? `CGPA: ${edu.cgpa}/${edu.cgpaScale}` : ''}
                  ${edu.percentage ? `${edu.cgpa ? ' | ' : ''}Percentage: ${edu.percentage}` : ''}
                  ${edu.letterGrade ? `${(edu.cgpa || edu.percentage) ? ' | ' : ''}Grade: ${edu.letterGrade}` : ''}
                </div>
              ` : ''}
              ${edu.description ? `
                <div class="description">
                  ${edu.description.split('\n').map(line => `• ${line}`).join('<br>')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Skills -->
      ${data.skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills & Technologies</div>
          ${Object.entries(
            data.skills.reduce((acc, skill) => {
              if (!acc[skill.category]) acc[skill.category] = [];
              acc[skill.category].push(skill);
              return acc;
            }, {} as Record<string, typeof data.skills>)
          ).map(([category, categorySkills]) => `
            <div class="skills-category">
              <div class="skills-category-title">${category}</div>
              <div>
                ${categorySkills.map(skill => `
                  <span class="skill-item">${skill.name} (${skill.level})</span>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Certificates -->
      ${data.certificates.length > 0 ? `
        <div class="section">
          <div class="section-title">Certifications</div>
          ${data.certificates.map(cert => `
            <div class="certificate-item">
              <div class="cert-name">${cert.name}</div>
              <div class="issuer">${cert.issuer}</div>
              <div class="date">
                ${cert.issueDate ? formatDate(cert.issueDate) : ''}
                ${cert.expiryDate ? ` - ${formatDate(cert.expiryDate)}` : ''}
              </div>
              ${cert.url ? `<div>Certificate URL: ${cert.url}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `;
};