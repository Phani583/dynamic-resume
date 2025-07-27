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
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, customization, theme }) => {
  const colors = customization.colors;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getSectionIcon = (sectionId: string) => {
    const icon = customization.sections[sectionId]?.icon;
    return icon || '';
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
              className="text-3xl font-bold mb-2" 
              style={{ 
                color: colors.primary,
                fontFamily: customization.sections.contact?.fontFamily || theme.fontFamily
              }}
            >
              {data.personalInfo.fullName}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: colors.secondary }}>
              {data.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {data.personalInfo.email}
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {data.personalInfo.phone}
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {data.personalInfo.location}
                </div>
              )}
            </div>

            {/* Public Links */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
              {data.publicLinks.github && (
                <a href={data.publicLinks.github} className="flex items-center gap-1 hover:underline" style={{ color: colors.accent }}>
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              )}
              {data.publicLinks.linkedin && (
                <a href={data.publicLinks.linkedin} className="flex items-center gap-1 hover:underline" style={{ color: colors.accent }}>
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              )}
              {data.publicLinks.portfolio && (
                <a href={data.publicLinks.portfolio} className="flex items-center gap-1 hover:underline" style={{ color: colors.accent }}>
                  <Globe className="w-4 h-4" />
                  Portfolio
                </a>
              )}
              {data.publicLinks.website && (
                <a href={data.publicLinks.website} className="flex items-center gap-1 hover:underline" style={{ color: colors.accent }}>
                  <Globe className="w-4 h-4" />
                  Website
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
          <p className="leading-relaxed">{data.personalInfo.summary}</p>
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
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && renderSection(
          'Education',
          'education',
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
        )}

        {/* Skills */}
        {data.skills.length > 0 && renderSection(
          'Skills & Technologies',
          'skills',
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: colors.accent + '20',
                  color: colors.accent,
                  border: `1px solid ${colors.accent}40`
                }}
              >
                {skill}
              </span>
            ))}
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
                    GitHub
                  </a>
                )}
                {data.publicLinks.linkedin && (
                  <a href={data.publicLinks.linkedin} className="flex items-center gap-2 hover:underline" style={{ color: colors.accent }}>
                    <Linkedin className="w-3 h-3" />
                    LinkedIn
                  </a>
                )}
                {data.publicLinks.portfolio && (
                  <a href={data.publicLinks.portfolio} className="flex items-center gap-2 hover:underline" style={{ color: colors.accent }}>
                    <Globe className="w-3 h-3" />
                    Portfolio
                  </a>
                )}
                {data.publicLinks.website && (
                  <a href={data.publicLinks.website} className="flex items-center gap-2 hover:underline" style={{ color: colors.accent }}>
                    <Globe className="w-3 h-3" />
                    Website
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
                    {skill}
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