import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { ResumeData, CustomizationOptions, ResumeTheme } from '@/components/resume/types';

// Convert resume data to DOCX
export const exportToDocx = async (
  data: ResumeData,
  customization: CustomizationOptions,
  theme: ResumeTheme,
  filename: string = 'resume.docx'
) => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: generateDocxContent(data, customization, theme),
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    
    saveAs(blob, filename);
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    throw new Error('Failed to export resume as Word document');
  }
};

const generateDocxContent = (
  data: ResumeData,
  customization: CustomizationOptions,
  theme: ResumeTheme
) => {
  const content = [];
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Header
  content.push(
    new Paragraph({
      text: data.personalInfo.fullName,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    })
  );

  // Contact Info
  const contactInfo = [];
  if (data.personalInfo.email) contactInfo.push(`Email: ${data.personalInfo.email}`);
  if (data.personalInfo.phone) contactInfo.push(`Phone: ${data.personalInfo.phone}`);
  if (data.personalInfo.location) contactInfo.push(`Location: ${data.personalInfo.location}`);
  
  if (contactInfo.length > 0) {
    content.push(
      new Paragraph({
        text: contactInfo.join(' | '),
        alignment: AlignmentType.CENTER,
      })
    );
  }

  // Links
  const links = [];
  if (data.publicLinks.github) links.push(`GitHub: ${data.publicLinks.github}`);
  if (data.publicLinks.linkedin) links.push(`LinkedIn: ${data.publicLinks.linkedin}`);
  if (data.publicLinks.portfolio) links.push(`Portfolio: ${data.publicLinks.portfolio}`);
  if (data.publicLinks.website) links.push(`Website: ${data.publicLinks.website}`);
  
  if (links.length > 0) {
    content.push(
      new Paragraph({
        text: links.join(' | '),
        alignment: AlignmentType.CENTER,
      })
    );
  }

  content.push(new Paragraph({ text: "" })); // Empty line

  // Summary
  if (data.personalInfo.summary) {
    content.push(
      new Paragraph({
        text: "Professional Summary",
        heading: HeadingLevel.HEADING_1,
      })
    );
    content.push(
      new Paragraph({
        text: data.personalInfo.summary,
      })
    );
    content.push(new Paragraph({ text: "" }));
  }

  // Experience
  if (data.experience.length > 0) {
    content.push(
      new Paragraph({
        text: "Professional Experience",
        heading: HeadingLevel.HEADING_1,
      })
    );
    
    data.experience.forEach(exp => {
      content.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.jobTitle, bold: true }),
          ],
        })
      );
      content.push(
        new Paragraph({
          text: exp.company,
        })
      );
      content.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`,
              italics: true 
            }),
          ],
        })
      );
      if (exp.description) {
        exp.description.split('\n').forEach(line => {
          content.push(
            new Paragraph({
              text: `• ${line}`,
            })
          );
        });
      }
      content.push(new Paragraph({ text: "" }));
    });
  }

  // Education
  if (data.education.length > 0) {
    content.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_1,
      })
    );
    
    data.education.forEach(edu => {
      content.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
          ],
        })
      );
      content.push(
        new Paragraph({
          text: edu.school,
        })
      );
      content.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `${edu.startYear} - ${edu.current ? 'Present' : edu.endYear}`,
              italics: true 
            }),
          ],
        })
      );
      
      const gradeInfo = [];
      if (edu.cgpa && edu.cgpaScale) gradeInfo.push(`CGPA: ${edu.cgpa}/${edu.cgpaScale}`);
      if (edu.percentage) gradeInfo.push(`Percentage: ${edu.percentage}`);
      if (edu.letterGrade) gradeInfo.push(`Grade: ${edu.letterGrade}`);
      
      if (gradeInfo.length > 0) {
        content.push(
          new Paragraph({
            text: gradeInfo.join(' | '),
          })
        );
      }
      
      if (edu.description) {
        edu.description.split('\n').forEach(line => {
          content.push(
            new Paragraph({
              text: `• ${line}`,
            })
          );
        });
      }
      content.push(new Paragraph({ text: "" }));
    });
  }

  // Skills
  if (data.skills.length > 0) {
    content.push(
      new Paragraph({
        text: "Skills & Technologies",
        heading: HeadingLevel.HEADING_1,
      })
    );
    
    const skillsByCategory = data.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof data.skills>);
    
    Object.entries(skillsByCategory).forEach(([category, categorySkills]) => {
      content.push(
        new Paragraph({
          children: [
            new TextRun({ text: category, bold: true }),
          ],
        })
      );
      content.push(
        new Paragraph({
          text: categorySkills.map(skill => `${skill.name} (${skill.level})`).join(', '),
        })
      );
      content.push(new Paragraph({ text: "" }));
    });
  }

  // Certificates
  if (data.certificates.length > 0) {
    content.push(
      new Paragraph({
        text: "Certifications",
        heading: HeadingLevel.HEADING_1,
      })
    );
    
    data.certificates.forEach(cert => {
      content.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true }),
          ],
        })
      );
      content.push(
        new Paragraph({
          text: cert.issuer,
        })
      );
      const dateText = [];
      if (cert.issueDate) dateText.push(formatDate(cert.issueDate));
      if (cert.expiryDate) dateText.push(formatDate(cert.expiryDate));
      if (dateText.length > 0) {
        content.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: dateText.join(' - '),
                italics: true 
              }),
            ],
          })
        );
      }
      if (cert.url) {
        content.push(
          new Paragraph({
            text: `Certificate URL: ${cert.url}`,
          })
        );
      }
      content.push(new Paragraph({ text: "" }));
    });
  }

  return content;
};