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

  // Convert hex colors to RTF color table indices
  const hexToRTFColor = (hex: string) => {
    const hexCode = hex.replace('#', '');
    const r = parseInt(hexCode.substr(0, 2), 16);
    const g = parseInt(hexCode.substr(2, 2), 16);
    const b = parseInt(hexCode.substr(4, 2), 16);
    return `\\red${r}\\green${g}\\blue${b}`;
  };

  // Enhanced RTF with color table and font table
  let rtf = '{\\rtf1\\ansi\\deff0 ';
  
  // Font table with modern fonts
  rtf += '{\\fonttbl {\\f0\\fswiss\\fcharset0 Arial;}{\\f1\\froman\\fcharset0 Times New Roman;}{\\f2\\fmodern\\fcharset0 Calibri;}}';
  
  // Color table
  rtf += '{\\colortbl ;';
  rtf += hexToRTFColor(customization.colors.primary) + ';'; // \cf1
  rtf += hexToRTFColor(customization.colors.secondary) + ';'; // \cf2  
  rtf += hexToRTFColor(customization.colors.accent) + ';'; // \cf3
  rtf += hexToRTFColor(customization.colors.text) + ';'; // \cf4
  rtf += '\\red0\\green0\\blue0;'; // \cf5 - black
  rtf += '}';

  // Page layout
  rtf += '\\paperw12240\\paperh15840\\margl720\\margr720\\margt720\\margb720';
  
  // Header with primary color and larger font
  const headerAlignment = theme.headerStyle === 'centered' ? '\\qc' : 
                         theme.headerStyle === 'right' ? '\\qr' : '\\ql';
  
  rtf += `${headerAlignment}\\f0\\fs48\\cf1\\b ${escapeRTF(data.personalInfo.fullName)}\\b0\\fs20\\cf4\\par\\par`;
  
  // Contact Info with icons and better formatting
  const contactInfo = [];
  if (data.personalInfo.email) contactInfo.push(`✉ ${data.personalInfo.email}`);
  if (data.personalInfo.phone) contactInfo.push(`📞 ${data.personalInfo.phone}`);
  if (data.personalInfo.location) contactInfo.push(`📍 ${data.personalInfo.location}`);
  
  if (contactInfo.length > 0) {
    rtf += `\\qc\\cf2 ${escapeRTF(contactInfo.join('  |  '))}\\cf4\\par`;
  }

  // Links with better formatting
  const links = [];
  if (data.publicLinks.github) links.push(`🔗 GitHub: ${data.publicLinks.github}`);
  if (data.publicLinks.linkedin) links.push(`💼 LinkedIn: ${data.publicLinks.linkedin}`);
  if (data.publicLinks.portfolio) links.push(`🌐 Portfolio: ${data.publicLinks.portfolio}`);
  if (data.publicLinks.website) links.push(`🌍 Website: ${data.publicLinks.website}`);
  
  if (links.length > 0) {
    rtf += `\\qc\\cf2 ${escapeRTF(links.join('  |  '))}\\cf4\\par\\par`;
  }

  // Helper function to create section headers with dividers and icons
  const createSectionHeader = (title: string, sectionId: string) => {
    const icon = customization.sections[sectionId]?.icon || '';
    const dividerLine = '\\qc\\cf2\\fs16' + '_'.repeat(50) + '\\cf4\\fs20\\par\\par';
    return `${dividerLine}\\ql\\cf1\\b\\fs32 ${icon} ${title}\\cf4\\b0\\fs20\\par\\par`;
  };

  // Professional Summary
  if (data.personalInfo.summary) {
    rtf += createSectionHeader('Professional Summary', 'summary');
    rtf += `\\ql\\li360\\fs22 ${escapeRTF(data.personalInfo.summary)}\\li0\\fs20\\par\\par`;
  }

  // Professional Experience  
  if (data.experience.length > 0) {
    rtf += createSectionHeader('Professional Experience', 'experience');
    
    data.experience.forEach((exp, index) => {
      if (index > 0) rtf += '\\par';
      
      // Job title in primary color and bold
      rtf += `\\cf1\\b\\fs24 ${escapeRTF(exp.jobTitle)}\\cf4\\b0\\fs20\\par`;
      
      // Company and date on same line
      rtf += `\\cf2\\b ${escapeRTF(exp.company)}\\cf4\\b0`;
      const dateRange = `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      rtf += `\\qr\\cf2\\i ${escapeRTF(dateRange)}\\cf4\\i0\\ql\\par`;
      
      // Description with proper bullets
      if (exp.description) {
        rtf += '\\li720\\par'; // Indent for bullets
        exp.description.split('\n').forEach(line => {
          if (line.trim()) {
            const bulletStyle = customization.sections.experience?.bulletStyle || '•';
            rtf += `\\cf3 ${bulletStyle}\\cf4\\tab ${escapeRTF(line.trim())}\\par`;
          }
        });
        rtf += '\\li0'; // Reset indent
      }
      rtf += '\\par';
    });
  }

  // Education
  if (data.education.length > 0) {
    rtf += createSectionHeader('Education', 'education');
    
    data.education.forEach((edu, index) => {
      if (index > 0) rtf += '\\par';
      
      // Degree in primary color and bold
      rtf += `\\cf1\\b\\fs24 ${escapeRTF(edu.degree)}\\cf4\\b0\\fs20\\par`;
      
      // School and year
      rtf += `\\cf2\\b ${escapeRTF(edu.school)}\\cf4\\b0`;
      const yearRange = `${edu.startYear} - ${edu.current ? 'Present' : edu.endYear}`;
      rtf += `\\qr\\cf2\\i ${escapeRTF(yearRange)}\\cf4\\i0\\ql\\par`;
      
      // Grade information
      const gradeInfo = [];
      if (edu.cgpa && edu.cgpaScale) gradeInfo.push(`CGPA: ${edu.cgpa}/${edu.cgpaScale}`);
      if (edu.percentage) gradeInfo.push(`Percentage: ${edu.percentage}%`);
      if (edu.letterGrade) gradeInfo.push(`Grade: ${edu.letterGrade}`);
      
      if (gradeInfo.length > 0) {
        rtf += `\\cf3 ${escapeRTF(gradeInfo.join(' | '))}\\cf4\\par`;
      }
      
      // Description with bullets
      if (edu.description) {
        rtf += '\\li720\\par';
        edu.description.split('\n').forEach(line => {
          if (line.trim()) {
            const bulletStyle = customization.sections.education?.bulletStyle || '•';
            rtf += `\\cf3 ${bulletStyle}\\cf4\\tab ${escapeRTF(line.trim())}\\par`;
          }
        });
        rtf += '\\li0';
      }
      rtf += '\\par';
    });
  }

  // Skills & Technologies
  if (data.skills.length > 0) {
    rtf += createSectionHeader('Skills & Technologies', 'skills');
    
    const skillsByCategory = data.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof data.skills>);
    
    Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
      rtf += `\\cf1\\b\\fs22 ${escapeRTF(category)}\\cf4\\b0\\fs20\\par`;
      const skillList = categorySkills.map(skill => {
        const levelIndicator = skill.level === 'Expert' ? '★★★' : 
                             skill.level === 'Intermediate' ? '★★☆' : '★☆☆';
        return `${skill.name} ${levelIndicator}`;
      }).join(' • ');
      rtf += `\\li360\\cf3 ${escapeRTF(skillList)}\\cf4\\li0\\par\\par`;
    });
  }

  // Certifications
  if (data.certificates.length > 0) {
    rtf += createSectionHeader('Certifications', 'certificates');
    
    data.certificates.forEach((cert, index) => {
      if (index > 0) rtf += '\\par';
      
      // Certificate name in primary color
      rtf += `\\cf1\\b\\fs22 🏆 ${escapeRTF(cert.name)}\\cf4\\b0\\fs20\\par`;
      
      // Issuer
      rtf += `\\cf2 ${escapeRTF(cert.issuer)}\\cf4\\par`;
      
      // Dates
      const dateText = [];
      if (cert.issueDate) dateText.push(`Issued: ${formatDate(cert.issueDate)}`);
      if (cert.expiryDate) dateText.push(`Expires: ${formatDate(cert.expiryDate)}`);
      if (dateText.length > 0) {
        rtf += `\\cf3\\i ${escapeRTF(dateText.join(' | '))}\\cf4\\i0\\par`;
      }
      
      // URL if available
      if (cert.url) {
        rtf += `\\cf2 🔗 Certificate: ${escapeRTF(cert.url)}\\cf4\\par`;
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