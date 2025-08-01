import { saveAs } from 'file-saver';
import { ResumeData, CustomizationOptions, ResumeTheme } from '@/components/resume/types';

// Convert resume data to RTF format (compatible with Word)
export const exportToDocx = async (
  data: ResumeData,
  customization: CustomizationOptions,
  theme: ResumeTheme,
  filename: string = 'resume.rtf'
) => {
  try {
    const rtfContent = generateRTFContent(data, customization, theme);
    const blob = new Blob([rtfContent], {
      type: 'application/rtf'
    });
    
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to RTF:', error);
    throw new Error('Failed to export resume as Word document');
  }
};

const generateRTFContent = (
  data: ResumeData,
  customization: CustomizationOptions,
  theme: ResumeTheme
) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  let rtf = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}';
  
  // Header
  rtf += '\\qc\\b\\fs36 ' + escapeRTF(data.personalInfo.fullName) + '\\b0\\fs24\\par\\par';
  
  // Contact Info
  const contactInfo = [];
  if (data.personalInfo.email) contactInfo.push(`Email: ${data.personalInfo.email}`);
  if (data.personalInfo.phone) contactInfo.push(`Phone: ${data.personalInfo.phone}`);
  if (data.personalInfo.location) contactInfo.push(`Location: ${data.personalInfo.location}`);
  
  if (contactInfo.length > 0) {
    rtf += '\\qc ' + escapeRTF(contactInfo.join(' | ')) + '\\par';
  }

  // Links
  const links = [];
  if (data.publicLinks.github) links.push(`GitHub: ${data.publicLinks.github}`);
  if (data.publicLinks.linkedin) links.push(`LinkedIn: ${data.publicLinks.linkedin}`);
  if (data.publicLinks.portfolio) links.push(`Portfolio: ${data.publicLinks.portfolio}`);
  if (data.publicLinks.website) links.push(`Website: ${data.publicLinks.website}`);
  
  if (links.length > 0) {
    rtf += '\\qc ' + escapeRTF(links.join(' | ')) + '\\par\\par';
  }

  // Summary
  if (data.personalInfo.summary) {
    rtf += '\\ql\\b\\fs28 Professional Summary\\b0\\fs24\\par';
    rtf += escapeRTF(data.personalInfo.summary) + '\\par\\par';
  }

  // Experience
  if (data.experience.length > 0) {
    rtf += '\\ql\\b\\fs28 Professional Experience\\b0\\fs24\\par';
    
    data.experience.forEach(exp => {
      rtf += '\\b ' + escapeRTF(exp.jobTitle) + '\\b0\\par';
      rtf += escapeRTF(exp.company) + '\\par';
      rtf += '\\i ' + escapeRTF(`${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`) + '\\i0\\par';
      
      if (exp.description) {
        exp.description.split('\n').forEach(line => {
          if (line.trim()) {
            rtf += '\\bullet ' + escapeRTF(line) + '\\par';
          }
        });
      }
      rtf += '\\par';
    });
  }

  // Education
  if (data.education.length > 0) {
    rtf += '\\ql\\b\\fs28 Education\\b0\\fs24\\par';
    
    data.education.forEach(edu => {
      rtf += '\\b ' + escapeRTF(edu.degree) + '\\b0\\par';
      rtf += escapeRTF(edu.school) + '\\par';
      rtf += '\\i ' + escapeRTF(`${edu.startYear} - ${edu.current ? 'Present' : edu.endYear}`) + '\\i0\\par';
      
      const gradeInfo = [];
      if (edu.cgpa && edu.cgpaScale) gradeInfo.push(`CGPA: ${edu.cgpa}/${edu.cgpaScale}`);
      if (edu.percentage) gradeInfo.push(`Percentage: ${edu.percentage}`);
      if (edu.letterGrade) gradeInfo.push(`Grade: ${edu.letterGrade}`);
      
      if (gradeInfo.length > 0) {
        rtf += escapeRTF(gradeInfo.join(' | ')) + '\\par';
      }
      
      if (edu.description) {
        edu.description.split('\n').forEach(line => {
          if (line.trim()) {
            rtf += '\\bullet ' + escapeRTF(line) + '\\par';
          }
        });
      }
      rtf += '\\par';
    });
  }

  // Skills
  if (data.skills.length > 0) {
    rtf += '\\ql\\b\\fs28 Skills & Technologies\\b0\\fs24\\par';
    
    const skillsByCategory = data.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof data.skills>);
    
    Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
      rtf += '\\b ' + escapeRTF(category) + '\\b0\\par';
      rtf += escapeRTF(categorySkills.map(skill => `${skill.name} (${skill.level})`).join(', ')) + '\\par\\par';
    });
  }

  // Certificates
  if (data.certificates.length > 0) {
    rtf += '\\ql\\b\\fs28 Certifications\\b0\\fs24\\par';
    
    data.certificates.forEach(cert => {
      rtf += '\\b ' + escapeRTF(cert.name) + '\\b0\\par';
      rtf += escapeRTF(cert.issuer) + '\\par';
      
      const dateText = [];
      if (cert.issueDate) dateText.push(formatDate(cert.issueDate));
      if (cert.expiryDate) dateText.push(formatDate(cert.expiryDate));
      if (dateText.length > 0) {
        rtf += '\\i ' + escapeRTF(dateText.join(' - ')) + '\\i0\\par';
      }
      if (cert.url) {
        rtf += escapeRTF(`Certificate URL: ${cert.url}`) + '\\par';
      }
      rtf += '\\par';
    });
  }

  rtf += '}';
  return rtf;
};

const escapeRTF = (text: string) => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\n/g, '\\par');
};