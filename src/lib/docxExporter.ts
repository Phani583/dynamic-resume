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

  // Get font mapping
  const getFontMapping = (fontFamily: string) => {
    if (fontFamily.includes('Times')) return '\\f1';
    if (fontFamily.includes('Calibri')) return '\\f2';
    return '\\f0'; // Default to Arial
  };

  // Get spacing based on customization
  const getSpacingValue = () => {
    switch (customization.spacing) {
      case 'compact': return '\\sb120\\sa120'; // 6pt before/after
      case 'spacious': return '\\sb240\\sa240'; // 12pt before/after
      default: return '\\sb180\\sa180'; // 9pt before/after
    }
  };

  // Get section font size based on customization
  const getSectionFontSize = (sectionId: string) => {
    const section = customization.sections[sectionId];
    if (section?.fontSize) {
      const size = parseInt(section.fontSize.replace('px', ''));
      return Math.round(size * 2); // Convert px to half-points
    }
    return 24; // Default 12pt
  };

  // Enhanced RTF with color table and font table
  let rtf = '{\\rtf1\\ansi\\deff0 ';
  
  // Font table with modern fonts matching the preview
  rtf += '{\\fonttbl {\\f0\\fswiss\\fcharset0 Arial;}{\\f1\\froman\\fcharset0 Times New Roman;}{\\f2\\fmodern\\fcharset0 Calibri;}{\\f3\\fswiss\\fcharset0 Helvetica;}}';
  
  // Color table
  rtf += '{\\colortbl ;';
  rtf += hexToRTFColor(customization.colors.primary) + ';'; // \cf1
  rtf += hexToRTFColor(customization.colors.secondary) + ';'; // \cf2  
  rtf += hexToRTFColor(customization.colors.accent) + ';'; // \cf3
  rtf += hexToRTFColor(customization.colors.text) + ';'; // \cf4
  rtf += hexToRTFColor(customization.colors.background) + ';'; // \cf5
  rtf += '\\red0\\green0\\blue0;'; // \cf6 - black
  rtf += '\\red255\\green255\\blue255;'; // \cf7 - white
  rtf += '}';

  // Page layout with background color
  rtf += '\\paperw12240\\paperh15840\\margl720\\margr720\\margt720\\margb720';
  rtf += `\\cb5`; // Set background color
  
  // Header styling to match preview exactly
  const headerAlignment = theme.headerStyle === 'centered' ? '\\qc' : 
                         theme.headerStyle === 'right' ? '\\qr' : '\\ql';
  
  // Helper function to create section headers matching preview styling
  const createSectionHeader = (title: string, sectionId: string) => {
    const section = customization.sections[sectionId];
    const icon = section?.icon || '';
    const fontSize = getSectionFontSize(sectionId);
    const fontFamily = getFontMapping(section?.fontFamily || theme.fontFamily);
    
    // Divider line based on section style
    const dividerStyle = section?.dividerStyle || 'simple';
    let dividerLine = '';
    
    switch (dividerStyle) {
      case 'double':
        dividerLine = '\\cf1\\fs16' + '═'.repeat(60) + '\\cf4\\fs20\\par';
        break;
      case 'dotted':
        dividerLine = '\\cf1\\fs16' + '·'.repeat(80) + '\\cf4\\fs20\\par';
        break;
      case 'dashed':
        dividerLine = '\\cf1\\fs16' + '- '.repeat(40) + '\\cf4\\fs20\\par';
        break;
      default:
        dividerLine = '\\cf1\\fs16' + '_'.repeat(60) + '\\cf4\\fs20\\par';
    }
    
    return `\\ql${fontFamily}\\fs${fontSize}\\cf1\\b ${icon ? icon + ' ' : ''}${title}\\cf4\\b0\\fs20\\par${dividerLine}\\par`;
  };

  // Get bullet style for sections
  const getBulletStyle = (sectionId: string) => {
    return customization.sections[sectionId]?.bulletStyle || '•';
  };
  
  // Header section with profile image placeholder
  rtf += `${headerAlignment}${getFontMapping(theme.fontFamily)}\\fs48\\cf1\\b ${escapeRTF(data.personalInfo.fullName)}\\b0\\fs20\\cf4\\par\\par`;
  
  if (data.personalInfo.profileImage) {
    rtf += `\\qc\\cf2\\i [Profile Image]\\i0\\cf4\\par`;
  }
  
  // Contact info styled like the preview with proper spacing
  const contactParts = [];
  if (data.personalInfo.email) contactParts.push(`✉ ${data.personalInfo.email}`);
  if (data.personalInfo.phone) contactParts.push(`📞 ${data.personalInfo.phone}`);
  if (data.personalInfo.location) contactParts.push(`📍 ${data.personalInfo.location}`);
  
  if (contactParts.length > 0) {
    const alignment = theme.headerStyle === 'centered' ? '\\qc' : 
                     theme.headerStyle === 'right' ? '\\qr' : '\\ql';
    rtf += `${alignment}\\cf2\\fs20 ${escapeRTF(contactParts.join('  |  '))}\\cf4\\par`;
  }

  // Public links styled like the preview
  const linkParts = [];
  if (data.publicLinks.github) linkParts.push(`🔗 ${data.publicLinks.github}`);
  if (data.publicLinks.linkedin) linkParts.push(`💼 ${data.publicLinks.linkedin}`);
  if (data.publicLinks.portfolio) linkParts.push(`🌐 ${data.publicLinks.portfolio}`);
  if (data.publicLinks.website) linkParts.push(`🌍 ${data.publicLinks.website}`);
  
  if (linkParts.length > 0) {
    const alignment = theme.headerStyle === 'centered' ? '\\qc' : 
                     theme.headerStyle === 'right' ? '\\qr' : '\\ql';
    rtf += `${alignment}\\cf3\\fs18 ${escapeRTF(linkParts.join('  |  '))}\\cf4\\par\\par`;
  }

  rtf += getSpacingValue();

  // Professional Summary
  if (data.personalInfo.summary) {
    rtf += createSectionHeader('Professional Summary', 'summary');
    rtf += `\\ql\\li360\\fs22 ${escapeRTF(data.personalInfo.summary)}\\li0\\fs20\\par\\par`;
  }

  // Professional Experience - Enhanced to match preview layout
  if (data.experience.length > 0) {
    rtf += createSectionHeader('Professional Experience', 'experience');
    
    data.experience.forEach((exp, index) => {
      if (index > 0) rtf += getSpacingValue();
      
      // Job title in primary color and bold, larger font
      rtf += `\\cf1\\b\\fs26 ${escapeRTF(exp.jobTitle)}\\cf4\\b0\\fs20\\par`;
      
      // Company in secondary color with date aligned to right using tabs
      rtf += `\\cf2\\b\\fs22 ${escapeRTF(exp.company)}\\cf4\\b0\\fs20`;
      const dateRange = `📅 ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
      rtf += `\\tab\\tab\\tab\\tab\\qr\\cf2\\i\\fs18 ${escapeRTF(dateRange)}\\cf4\\i0\\fs20\\ql\\par`;
      
      // Description with enhanced bullet styling matching preview
      if (exp.description) {
        rtf += '\\par'; 
        exp.description.split('\n').forEach(line => {
          if (line.trim()) {
            const bulletStyle = getBulletStyle('experience');
            rtf += `\\li720\\cf3\\fs16 ${bulletStyle}\\cf4\\fs20\\tab ${escapeRTF(line.trim())}\\par`;
          }
        });
        rtf += '\\li0'; 
      }
      rtf += '\\par';
    });
  }

  // Education - Enhanced to match preview layout
  if (data.education.length > 0) {
    rtf += createSectionHeader('Education', 'education');
    
    data.education.forEach((edu, index) => {
      if (index > 0) rtf += getSpacingValue();
      
      // Degree in primary color and bold
      rtf += `\\cf1\\b\\fs26 ${escapeRTF(edu.degree)}\\cf4\\b0\\fs20\\par`;
      
      // School with secondary color
      rtf += `\\cf2\\b\\fs22 ${escapeRTF(edu.school)}\\cf4\\b0\\fs20\\par`;
      
      // Year range aligned to right
      const yearRange = `${edu.startYear} - ${edu.current ? 'Present' : edu.endYear}`;
      rtf += `\\qr\\cf2\\i\\fs18 ${escapeRTF(yearRange)}\\cf4\\i0\\fs20\\ql\\par`;
      
      // Academic performance section (matching preview exactly)
      const gradeInfo = [];
      if (edu.cgpa) gradeInfo.push(`CGPA: ${edu.cgpa}`);
      if (edu.percentage) gradeInfo.push(`Percentage: ${edu.percentage}%`);
      if (edu.letterGrade) gradeInfo.push(`Grade: ${edu.letterGrade}`);
      
      if (gradeInfo.length > 0) {
        rtf += `\\cf2\\fs18 ${escapeRTF(gradeInfo.join(' | '))}\\cf4\\fs20\\par`;
      }
      
      // Description with enhanced bullet styling
      if (edu.description) {
        rtf += '\\par';
        edu.description.split('\n').forEach(line => {
          if (line.trim()) {
            const bulletStyle = getBulletStyle('education');
            rtf += `\\li720\\cf3\\fs16 ${bulletStyle}\\cf4\\fs20\\tab ${escapeRTF(line.trim())}\\par`;
          }
        });
        rtf += '\\li0';
      }
      rtf += '\\par';
    });
  }

  // Skills & Technologies - Enhanced to match preview pill-style
  if (data.skills.length > 0) {
    rtf += createSectionHeader('Skills & Technologies', 'skills');
    
    const skillsByCategory = data.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof data.skills>);
    
    Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
      // Category header with secondary color
      rtf += `\\cf2\\b\\fs20 ${escapeRTF(category)}\\cf4\\b0\\fs20\\par`;
      
      // Skills as pill-like format with background highlighting
      categorySkills.forEach((skill, skillIndex) => {
        const levelIndicator = skill.level === 'Expert' ? '●●●' : 
                             skill.level === 'Intermediate' ? '●●○' : '●○○';
        
        // Simulate pill styling with borders and background
        if (skillIndex > 0) rtf += ' ';
        rtf += `\\highlight3\\cf4 ${escapeRTF(skill.name)} (${skill.level}) \\highlight0`;
      });
      rtf += '\\par\\par';
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