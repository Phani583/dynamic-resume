import React from 'react';
import { ResumeData, CustomizationOptions, ResumeTheme } from './types';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Globe, 
  Calendar,
  Briefcase,
  GraduationCap,
  Award
} from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  customization: CustomizationOptions;
  theme: ResumeTheme;
  isEditMode?: boolean;
  onDataChange?: (data: ResumeData) => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, customization, theme, isEditMode = false, onDataChange }) => {
  const colors = customization.colors;

  // Helper function to handle contentEditable updates
  const updateField = (path: string[], value: string) => {
    if (!onDataChange) return;
    
    const newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    onDataChange(newData);
  };

  // Handle contentEditable blur events
  const handleBlur = (e: React.FocusEvent<HTMLElement>, path: string[]) => {
    if (!isEditMode) return;
    const value = e.currentTarget.textContent || '';
    updateField(path, value);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getSectionIcon = (sectionId: string) => {
    const section = customization.sections[sectionId];
    if (section?.customIcon) return section.customIcon;
    if (section?.icon === 'none') return '';
    return section?.icon || '';
  };

  const getBulletStyle = (sectionId: string) => {
    return customization.sections[sectionId]?.bulletStyle || '•';
  };

  const getDividerClass = (sectionId: string) => {
    const style = customization.sections[sectionId]?.dividerStyle || 'simple';
    switch (style) {
      case 'double': return 'border-t-2 border-double';
      case 'dotted': return 'border-t border-dotted';
      case 'dashed': return 'border-t border-dashed';
      default: return 'border-t';
    }
  };

  const getSectionStyle = (sectionId: string) => {
    const section = customization.sections[sectionId];
    return {
      fontFamily: section?.fontFamily || theme.fontFamily,
      color: section?.color || colors.text,
      fontSize: section?.fontSize || '14px',
      fontWeight: section?.fontWeight || 'normal'
    };
  };

  const getSpacingClass = () => {
    switch (customization.spacing) {
      case 'compact': return 'space-y-3';
      case 'spacious': return 'space-y-8';
      default: return 'space-y-6';
    }
  };

  const renderHeader = () => {
    const headerStyle = theme.headerStyle;
    const alignmentClass = headerStyle === 'centered' ? 'text-center' : 
                          headerStyle === 'right' ? 'text-right' : 'text-left';
    
    return (
      <div className={`mb-8 ${alignmentClass}`}>
        <div className="flex items-center justify-center gap-6 mb-4">
          {data.personalInfo.profileImage && (
            <img
              src={data.personalInfo.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2"
              style={{ borderColor: colors.primary }}
            />
          )}
          <div className="flex-1">
            <h1 
              className={`text-3xl font-bold mb-2 ${isEditMode ? 'border border-dashed border-blue-300 rounded px-1 hover:bg-blue-50 focus:outline-none focus:bg-blue-50' : ''}`}
              style={{ 
                color: colors.primary,
                fontFamily: customization.sections.contact?.fontFamily || theme.fontFamily
              }}
              contentEditable={isEditMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleBlur(e, ['personalInfo', 'fullName'])}
            >
              {data.personalInfo.fullName}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: colors.secondary }}>
               {data.personalInfo.email && (
                 <div className="flex items-center gap-1">
                   <Mail className="w-4 h-4" />
                   <span 
                     className={isEditMode ? 'border border-dashed border-blue-300 rounded px-1 hover:bg-blue-50 focus:outline-none focus:bg-blue-50' : ''}
                     contentEditable={isEditMode}
                     suppressContentEditableWarning={true}
                     onBlur={(e) => handleBlur(e, ['personalInfo', 'email'])}
                   >
                     {data.personalInfo.email}
                   </span>
                 </div>
               )}
               {data.personalInfo.phone && (
                 <div className="flex items-center gap-1">
                   <Phone className="w-4 h-4" />
                   <span 
                     className={isEditMode ? 'border border-dashed border-blue-300 rounded px-1 hover:bg-blue-50 focus:outline-none focus:bg-blue-50' : ''}
                     contentEditable={isEditMode}
                     suppressContentEditableWarning={true}
                     onBlur={(e) => handleBlur(e, ['personalInfo', 'phone'])}
                   >
                     {data.personalInfo.phone}
                   </span>
                 </div>
               )}
               {data.personalInfo.location && (
                 <div className="flex items-center gap-1">
                   <MapPin className="w-4 h-4" />
                   <span 
                     className={isEditMode ? 'border border-dashed border-blue-300 rounded px-1 hover:bg-blue-50 focus:outline-none focus:bg-blue-50' : ''}
                     contentEditable={isEditMode}
                     suppressContentEditableWarning={true}
                     onBlur={(e) => handleBlur(e, ['personalInfo', 'location'])}
                   >
                     {data.personalInfo.location}
                   </span>
                 </div>
               )}
            </div>

            {/* Public Links */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
              {data.publicLinks.github && (
                <a href={data.publicLinks.github} className="flex items-center gap-1 hover:underline" style={{ color: colors.accent }}>
                  <Github className="w-4 h-4" />
                  {data.publicLinks.github}
                </a>
              )}
              {data.publicLinks.linkedin && (
                <a href={data.publicLinks.linkedin} className="flex items-center gap-1 hover:underline" style={{ color: colors.accent }}>
                  <Linkedin className="w-4 h-4" />
                  {data.publicLinks.linkedin}
                </a>
              )}
              {data.publicLinks.portfolio && (
                <a href={data.publicLinks.portfolio} className="flex items-center gap-1 hover:underline" style={{ color: colors.accent }}>
                  <Globe className="w-4 h-4" />
                  {data.publicLinks.portfolio}
                </a>
              )}
              {data.publicLinks.website && (
                <a href={data.publicLinks.website} className="flex items-center gap-1 hover:underline" style={{ color: colors.accent }}>
                  <Globe className="w-4 h-4" />
                  {data.publicLinks.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (title: string, sectionId: string, children: React.ReactNode) => {
    const icon = getSectionIcon(sectionId);
    const dividerClass = getDividerClass(sectionId);
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {icon && <span className="text-lg">{icon}</span>}
          <h2 
            className="text-xl font-bold flex-1" 
            style={{ 
              color: colors.primary,
              ...getSectionStyle(sectionId)
            }}
          >
            {title}
          </h2>
        </div>
        <div className={`${dividerClass} mb-4`} style={{ borderColor: colors.primary }}></div>
        <div style={getSectionStyle(sectionId)}>
          {children}
        </div>
      </div>
    );
  };

  const renderTraditionalLayout = () => (
    <div className="max-w-4xl mx-auto p-8" style={{ backgroundColor: colors.background, color: colors.text }}>
      {renderHeader()}
      
      <div className={getSpacingClass()}>
        {/* Summary */}
        {data.personalInfo.summary && renderSection(
          'Professional Summary',
          'summary',
           <p 
             className={`leading-relaxed ${isEditMode ? 'border border-dashed border-blue-300 rounded p-2 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 min-h-[2rem]' : ''}`}
             contentEditable={isEditMode}
             suppressContentEditableWarning={true}
             onBlur={(e) => handleBlur(e, ['personalInfo', 'summary'])}
           >
             {data.personalInfo.summary}
           </p>
        )}

        {/* Experience */}
        {data.experience.length > 0 && renderSection(
          'Professional Experience',
          'experience',
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.jobTitle}</h3>
                    <p className="font-medium" style={{ color: colors.secondary }}>{exp.company}</p>
                  </div>
                  <div className="text-sm flex items-center gap-1" style={{ color: colors.secondary }}>
                    <Calendar className="h-3 w-3" />
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                 {exp.description && (
                   <div className="text-sm leading-relaxed">
                     {exp.description.split('\n').map((line, index) => (
                       <div key={index} className="flex items-start gap-2">
                         <span className="mt-1">{getBulletStyle('experience')}</span>
                         <span>{line}</span>
                       </div>
                     ))}
                   </div>
                 )}
                 {exp.keyResponsibilities && (
                   <div className="text-sm leading-relaxed mt-2">
                     <h4 className="font-medium text-xs uppercase tracking-wide mb-1" style={{ color: colors.secondary }}>Key Roles & Responsibilities:</h4>
                     {exp.keyResponsibilities.split('\n').map((line, index) => (
                       <div key={index} className="flex items-start gap-2">
                         <span className="mt-1">{getBulletStyle('experience')}</span>
                         <span>{line}</span>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && renderSection(
          'Education',
          'education',
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p style={{ color: colors.secondary }}>{edu.school}</p>
                    {/* Academic Performance */}
                    {(edu.cgpa || edu.percentage || edu.letterGrade) && (
                      <div className="text-sm mt-1" style={{ color: colors.secondary }}>
                        {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                        {edu.percentage && <span>{edu.cgpa ? ' | ' : ''}Percentage: {edu.percentage}%</span>}
                        {edu.letterGrade && <span>{(edu.cgpa || edu.percentage) ? ' | ' : ''}Grade: {edu.letterGrade}</span>}
                      </div>
                    )}
                  </div>
                  <div className="text-sm" style={{ color: colors.secondary }}>
                    {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                  </div>
                </div>
                {edu.description && (
                  <div className="text-sm leading-relaxed">
                    {edu.description.split('\n').map((line, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="mt-1">{getBulletStyle('education')}</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && renderSection(
          'Skills & Technologies',
          'skills',
          <div className="space-y-3">
            {Object.entries(
              data.skills.reduce((acc, skill) => {
                if (!acc[skill.category]) acc[skill.category] = [];
                acc[skill.category].push(skill);
                return acc;
              }, {} as Record<string, typeof data.skills>)
            ).map(([category, categorySkills]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: colors.secondary }}>
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: colors.accent + '20',
                        color: colors.accent,
                        border: `1px solid ${colors.accent}40`
                      }}
                    >
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs opacity-75 ml-1">({skill.level})</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificates */}
        {data.certificates.length > 0 && renderSection(
          'Certifications',
          'certificates',
          <div className="space-y-4">
            {data.certificates.map((cert) => (
              <div key={cert.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="font-medium" style={{ color: colors.secondary }}>{cert.issuer}</p>
                  </div>
                  <div className="text-sm" style={{ color: colors.secondary }}>
                    {cert.issueDate && formatDate(cert.issueDate)}
                    {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                  </div>
                </div>
                {cert.url && (
                  <div className="text-sm">
                    <a href={cert.url} className="hover:underline" style={{ color: colors.accent }}>
                      View Certificate
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && renderSection(
          'Projects & Internships',
          'projects',
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <p className="font-medium text-sm" style={{ color: colors.secondary }}>{project.technologies}</p>
                  </div>
                  <div className="text-sm flex items-center gap-1" style={{ color: colors.secondary }}>
                    <Calendar className="h-3 w-3" />
                    {formatDate(project.startDate)} - {project.current ? 'Present' : formatDate(project.endDate)}
                  </div>
                </div>
                {project.description && (
                  <div className="text-sm leading-relaxed mb-2">
                    {project.description.split('\n').map((line, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="mt-1">{getBulletStyle('projects')}</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
                {project.url && (
                  <div className="text-sm">
                    <a href={project.url} className="hover:underline" style={{ color: colors.accent }}>
                      View Project
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Additional Information */}
        {data.additionalInfo && renderSection(
          'Additional Information',
          'additionalInfo',
          <div className="text-sm leading-relaxed">
            {data.additionalInfo.split('\n').map((line, index) => (
              <p key={index} className="mb-2">{line}</p>
            ))}
          </div>
        )}

        {/* Hobbies */}
        {data.hobbies.length > 0 && renderSection(
          'Hobbies & Interests',
          'hobbies',
          <div className="flex flex-wrap gap-2">
            {data.hobbies.map((hobby, index) => (
              <span
                key={hobby.id}
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: colors.secondary + '20',
                  color: colors.secondary,
                  border: `1px solid ${colors.secondary}40`
                }}
              >
                {hobby.name}
              </span>
            ))}
          </div>
        )}

        {/* Declaration */}
        {data.declaration.enabled && renderSection(
          'Declaration',
          'declaration',
          <div className="text-sm leading-relaxed">
            <p>{data.declaration.text}</p>
          </div>
        )}

        {/* Signature */}
        {data.signature.enabled && renderSection(
          'Signature',
          'signature',
          <div className="flex justify-between items-end">
            <div>
              {data.signature.digitalSignature && (
                <img
                  src={data.signature.digitalSignature}
                  alt="Digital Signature"
                  className="h-16 object-contain mb-2"
                />
              )}
              <div className="text-sm">
                <p className="font-medium">{data.signature.name}</p>
                <p style={{ color: colors.secondary }}>{data.signature.date}</p>
              </div>
            </div>
            <div className="text-sm text-right" style={{ color: colors.secondary }}>
              <p>{data.signature.location}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderSidebarLayout = () => (
    <div className="max-w-4xl mx-auto" style={{ backgroundColor: colors.background, color: colors.text }}>
      <div className="grid grid-cols-3 gap-0 min-h-[800px]">
        {/* Sidebar */}
        <div className="p-6" style={{ backgroundColor: colors.primary + '10' }}>
          {/* Profile */}
          <div className="text-center mb-6">
            {data.personalInfo.profileImage && (
              <img
                src={data.personalInfo.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            <h1 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
              {data.personalInfo.fullName}
            </h1>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <h3 className="font-bold text-sm uppercase tracking-wide" style={{ color: colors.primary }}>
              {getSectionIcon('contact')} Contact
            </h3>
            <div className="space-y-2 text-sm">
              {data.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  {data.personalInfo.email}
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  {data.personalInfo.phone}
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {data.personalInfo.location}
                </div>
              )}
            </div>
          </div>

          {/* Public Links */}
          {(data.publicLinks.github || data.publicLinks.linkedin || data.publicLinks.portfolio || data.publicLinks.website) && (
            <div className="mb-6">
              <h3 className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: colors.primary }}>
                {getSectionIcon('links')} Links
              </h3>
               <div className="space-y-2 text-sm">
                {data.publicLinks.github && (
                  <a href={data.publicLinks.github} className="flex items-center gap-2 hover:underline" style={{ color: colors.accent }}>
                    <Github className="w-3 h-3" />
                    {data.publicLinks.github}
                  </a>
                )}
                {data.publicLinks.linkedin && (
                  <a href={data.publicLinks.linkedin} className="flex items-center gap-2 hover:underline" style={{ color: colors.accent }}>
                    <Linkedin className="w-3 h-3" />
                    {data.publicLinks.linkedin}
                  </a>
                )}
                {data.publicLinks.portfolio && (
                  <a href={data.publicLinks.portfolio} className="flex items-center gap-2 hover:underline" style={{ color: colors.accent }}>
                    <Globe className="w-3 h-3" />
                    {data.publicLinks.portfolio}
                  </a>
                )}
                {data.publicLinks.website && (
                  <a href={data.publicLinks.website} className="flex items-center gap-2 hover:underline" style={{ color: colors.accent }}>
                    <Globe className="w-3 h-3" />
                    {data.publicLinks.website}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: colors.primary }}>
                {getSectionIcon('skills')} Skills
              </h3>
              <div className="space-y-2">
                {data.skills.map((skill, index) => (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <span>{getBulletStyle('skills')}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-xs opacity-75">{skill.level} • {skill.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-2 p-6">
          <div className={getSpacingClass()}>
            {/* Summary */}
            {data.personalInfo.summary && (
              <div>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: colors.primary }}>
                  {getSectionIcon('summary')} Summary
                </h2>
                <p className="leading-relaxed text-sm">{data.personalInfo.summary}</p>
              </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: colors.primary }}>
                  {getSectionIcon('experience')} Experience
                </h2>
                <div className="space-y-4">
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold">{exp.jobTitle}</h3>
                          <p className="font-medium" style={{ color: colors.secondary }}>{exp.company}</p>
                        </div>
                        <div className="text-sm flex items-center gap-1" style={{ color: colors.secondary }}>
                          <Calendar className="h-3 w-3" />
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-sm leading-relaxed">
                          {exp.description.split('\n').map((line, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className="mt-1">{getBulletStyle('experience')}</span>
                              <span>{line}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: colors.primary }}>
                  {getSectionIcon('education')} Education
                </h2>
                <div className="space-y-3">
                  {data.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p style={{ color: colors.secondary }}>{edu.school}</p>
                      </div>
                      <div className="text-sm" style={{ color: colors.secondary }}>
                        {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (customization.layout) {
      case 'sidebar':
        return renderSidebarLayout();
      case 'modern':
      case 'creative':
      case 'minimal':
      case 'two-column':
      case 'executive':
      case 'academic':
        return renderTraditionalLayout();
      default:
        return renderTraditionalLayout();
    }
  };

  return (
    <div className="w-full h-full min-h-[800px]" style={{ color: colors.text }}>
      {renderLayout()}
    </div>
  );
};

export default ResumePreview;