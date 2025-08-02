import React from 'react';
import { ResumeData, CustomizationOptions, ResumeTheme } from './types';
import EditableText from './EditableText';
import EditableSection from './EditableSection';
import ImageUpload from './ImageUpload';
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
  Award,
  Plus
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

  // Helper function to handle field updates
  const updateField = (path: string[], value: any) => {
    if (!onDataChange) return;
    
    const newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    onDataChange(newData);
  };

  // Add new item to array
  const addArrayItem = (arrayPath: string, newItem: any) => {
    if (!onDataChange) return;
    
    const newData = { ...data };
    const array = arrayPath.split('.').reduce((obj, key) => obj[key], newData) as any[];
    array.push({ ...newItem, id: Date.now().toString() });
    onDataChange(newData);
  };

  // Remove item from array
  const removeArrayItem = (arrayPath: string, id: string) => {
    if (!onDataChange) return;
    
    const newData = { ...data };
    const array = arrayPath.split('.').reduce((obj, key) => obj[key], newData) as any[];
    const index = array.findIndex(item => item.id === id);
    if (index > -1) {
      array.splice(index, 1);
      onDataChange(newData);
    }
  };

  // Move item in array
  const moveArrayItem = (arrayPath: string, id: string, direction: 'up' | 'down') => {
    if (!onDataChange) return;
    
    const newData = { ...data };
    const array = arrayPath.split('.').reduce((obj, key) => obj[key], newData) as any[];
    const index = array.findIndex(item => item.id === id);
    
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= array.length) return;
    
    [array[index], array[newIndex]] = [array[newIndex], array[index]];
    onDataChange(newData);
  };
  
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
          <ImageUpload
            currentImage={data.personalInfo.profileImage}
            onImageChange={(imageUrl) => updateField(['personalInfo', 'profileImage'], imageUrl)}
            isEditMode={isEditMode}
          />
          <div className="flex-1">
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ 
                color: colors.primary,
                fontFamily: customization.sections.contact?.fontFamily || theme.fontFamily
              }}
            >
              <EditableText
                value={data.personalInfo.fullName}
                onChange={(value) => updateField(['personalInfo', 'fullName'], value)}
                isEditMode={isEditMode}
                placeholder="Your Name"
                className="text-3xl font-bold"
                style={{ 
                  color: colors.primary,
                  fontFamily: customization.sections.contact?.fontFamily || theme.fontFamily
                }}
              />
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: colors.secondary }}>
               <div className="flex items-center gap-1">
                 <Mail className="w-4 h-4" />
                 <EditableText
                   value={data.personalInfo.email}
                   onChange={(value) => updateField(['personalInfo', 'email'], value)}
                   isEditMode={isEditMode}
                   placeholder="your.email@example.com"
                 />
               </div>
               <div className="flex items-center gap-1">
                 <Phone className="w-4 h-4" />
                 <EditableText
                   value={data.personalInfo.phone}
                   onChange={(value) => updateField(['personalInfo', 'phone'], value)}
                   isEditMode={isEditMode}
                   placeholder="+1 (555) 123-4567"
                 />
               </div>
               <div className="flex items-center gap-1">
                 <MapPin className="w-4 h-4" />
                 <EditableText
                   value={data.personalInfo.location}
                   onChange={(value) => updateField(['personalInfo', 'location'], value)}
                   isEditMode={isEditMode}
                   placeholder="City, State"
                 />
               </div>
            </div>

            {/* Public Links */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Github className="w-4 h-4" />
                <EditableText
                  value={data.publicLinks.github}
                  onChange={(value) => updateField(['publicLinks', 'github'], value)}
                  isEditMode={isEditMode}
                  placeholder="GitHub URL"
                  style={{ color: colors.accent }}
                />
              </div>
              <div className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                <EditableText
                  value={data.publicLinks.linkedin}
                  onChange={(value) => updateField(['publicLinks', 'linkedin'], value)}
                  isEditMode={isEditMode}
                  placeholder="LinkedIn URL"
                  style={{ color: colors.accent }}
                />
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <EditableText
                  value={data.publicLinks.portfolio}
                  onChange={(value) => updateField(['publicLinks', 'portfolio'], value)}
                  isEditMode={isEditMode}
                  placeholder="Portfolio URL"
                  style={{ color: colors.accent }}
                />
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <EditableText
                  value={data.publicLinks.website}
                  onChange={(value) => updateField(['publicLinks', 'website'], value)}
                  isEditMode={isEditMode}
                  placeholder="Website URL"
                  style={{ color: colors.accent }}
                />
              </div>
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
        {(data.personalInfo.summary || isEditMode) && renderSection(
          'Professional Summary',
          'summary',
          <EditableText
            value={data.personalInfo.summary}
            onChange={(value) => updateField(['personalInfo', 'summary'], value)}
            isEditMode={isEditMode}
            multiline
            placeholder="Write a brief professional summary about yourself..."
            className="leading-relaxed w-full"
          />
        )}

        {/* Experience */}
        {(data.experience.length > 0 || isEditMode) && renderSection(
          'Professional Experience',
          'experience',
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <EditableSection
                key={exp.id}
                isEditMode={isEditMode}
                onDelete={() => removeArrayItem('experience', exp.id)}
                onMoveUp={index > 0 ? () => moveArrayItem('experience', exp.id, 'up') : undefined}
                onMoveDown={index < data.experience.length - 1 ? () => moveArrayItem('experience', exp.id, 'down') : undefined}
                canMoveUp={index > 0}
                canMoveDown={index < data.experience.length - 1}
                className="border-l-2 border-transparent hover:border-blue-200 pl-2"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      <EditableText
                        value={exp.jobTitle}
                        onChange={(value) => {
                          const newExp = [...data.experience];
                          newExp[index] = { ...exp, jobTitle: value };
                          updateField(['experience'], newExp);
                        }}
                        isEditMode={isEditMode}
                        placeholder="Job Title"
                        className="font-semibold text-lg"
                      />
                    </h3>
                    <p className="font-medium" style={{ color: colors.secondary }}>
                      <EditableText
                        value={exp.company}
                        onChange={(value) => {
                          const newExp = [...data.experience];
                          newExp[index] = { ...exp, company: value };
                          updateField(['experience'], newExp);
                        }}
                        isEditMode={isEditMode}
                        placeholder="Company Name"
                        className="font-medium"
                        style={{ color: colors.secondary }}
                      />
                    </p>
                  </div>
                  <div className="text-sm flex items-center gap-1" style={{ color: colors.secondary }}>
                    <Calendar className="h-3 w-3" />
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                <div className="text-sm leading-relaxed">
                  <EditableText
                    value={exp.description}
                    onChange={(value) => {
                      const newExp = [...data.experience];
                      newExp[index] = { ...exp, description: value };
                      updateField(['experience'], newExp);
                    }}
                    isEditMode={isEditMode}
                    multiline
                    placeholder="Describe your responsibilities and achievements..."
                    className="text-sm leading-relaxed w-full"
                  />
                </div>
              </EditableSection>
            ))}
            {isEditMode && (
              <EditableSection
                isEditMode={isEditMode}
                onAdd={() => addArrayItem('experience', {
                  jobTitle: '',
                  company: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: ''
                })}
              >
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer"
                     onClick={() => addArrayItem('experience', {
                       jobTitle: '',
                       company: '',
                       startDate: '',
                       endDate: '',
                       current: false,
                       description: ''
                     })}>
                  <Plus className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Add Experience</p>
                </div>
              </EditableSection>
            )}
          </div>
        )}

        {/* Education */}
        {(data.education.length > 0 || isEditMode) && renderSection(
          'Education',
          'education',
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <EditableSection
                key={edu.id}
                isEditMode={isEditMode}
                onDelete={() => removeArrayItem('education', edu.id)}
                onMoveUp={index > 0 ? () => moveArrayItem('education', edu.id, 'up') : undefined}
                onMoveDown={index < data.education.length - 1 ? () => moveArrayItem('education', edu.id, 'down') : undefined}
                canMoveUp={index > 0}
                canMoveDown={index < data.education.length - 1}
                className="border-l-2 border-transparent hover:border-blue-200 pl-2"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      <EditableText
                        value={edu.degree}
                        onChange={(value) => {
                          const newEdu = [...data.education];
                          newEdu[index] = { ...edu, degree: value };
                          updateField(['education'], newEdu);
                        }}
                        isEditMode={isEditMode}
                        placeholder="Degree"
                        className="font-semibold"
                      />
                    </h3>
                    <p style={{ color: colors.secondary }}>
                      <EditableText
                        value={edu.school}
                        onChange={(value) => {
                          const newEdu = [...data.education];
                          newEdu[index] = { ...edu, school: value };
                          updateField(['education'], newEdu);
                        }}
                        isEditMode={isEditMode}
                        placeholder="School/University"
                        style={{ color: colors.secondary }}
                      />
                    </p>
                    {/* Academic Performance */}
                    {(edu.cgpa || edu.percentage || edu.letterGrade || isEditMode) && (
                      <div className="text-sm mt-1 flex gap-2" style={{ color: colors.secondary }}>
                        <EditableText
                          value={edu.cgpa ? `CGPA: ${edu.cgpa}/${edu.cgpaScale || '10'}` : ''}
                          onChange={(value) => {
                            const match = value.match(/CGPA: ([0-9.]+)\/([0-9.]+)/);
                            const newEdu = [...data.education];
                            newEdu[index] = { 
                              ...edu, 
                              cgpa: match ? match[1] : '',
                              cgpaScale: match ? match[2] : ''
                            };
                            updateField(['education'], newEdu);
                          }}
                          isEditMode={isEditMode}
                          placeholder="CGPA: 8.5/10"
                          className="text-sm"
                          style={{ color: colors.secondary }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="text-sm" style={{ color: colors.secondary }}>
                    {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                  </div>
                </div>
                {(edu.description || isEditMode) && (
                  <div className="text-sm leading-relaxed">
                    <EditableText
                      value={edu.description || ''}
                      onChange={(value) => {
                        const newEdu = [...data.education];
                        newEdu[index] = { ...edu, description: value };
                        updateField(['education'], newEdu);
                      }}
                      isEditMode={isEditMode}
                      multiline
                      placeholder="Additional details about your education..."
                      className="text-sm leading-relaxed w-full"
                    />
                  </div>
                )}
              </EditableSection>
            ))}
            {isEditMode && (
              <EditableSection
                isEditMode={isEditMode}
                onAdd={() => addArrayItem('education', {
                  degree: '',
                  school: '',
                  startYear: '',
                  endYear: '',
                  current: false,
                  description: ''
                })}
              >
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer"
                     onClick={() => addArrayItem('education', {
                       degree: '',
                       school: '',
                       startYear: '',
                       endYear: '',
                       current: false,
                       description: ''
                     })}>
                  <Plus className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Add Education</p>
                </div>
              </EditableSection>
            )}
          </div>
        )}

        {/* Skills */}
        {(data.skills.length > 0 || isEditMode) && renderSection(
          'Skills & Technologies',
          'skills',
          <div className="space-y-3">
            {data.skills.map((skill, index) => (
              <EditableSection
                key={skill.id}
                isEditMode={isEditMode}
                onDelete={() => removeArrayItem('skills', skill.id)}
                onMoveUp={index > 0 ? () => moveArrayItem('skills', skill.id, 'up') : undefined}
                onMoveDown={index < data.skills.length - 1 ? () => moveArrayItem('skills', skill.id, 'down') : undefined}
                canMoveUp={index > 0}
                canMoveDown={index < data.skills.length - 1}
                className="border-l-2 border-transparent hover:border-blue-200 pl-2"
              >
                <div className="flex gap-2 items-center">
                  <EditableText
                    value={skill.name}
                    onChange={(value) => {
                      const newSkills = [...data.skills];
                      newSkills[index] = { ...skill, name: value };
                      updateField(['skills'], newSkills);
                    }}
                    isEditMode={isEditMode}
                    placeholder="Skill name"
                    className="font-medium"
                  />
                  <EditableText
                    value={skill.category}
                    onChange={(value) => {
                      const newSkills = [...data.skills];
                      newSkills[index] = { ...skill, category: value };
                      updateField(['skills'], newSkills);
                    }}
                    isEditMode={isEditMode}
                    placeholder="Category"
                    className="text-sm"
                    style={{ color: colors.secondary }}
                  />
                  <EditableText
                    value={skill.level}
                    onChange={(value) => {
                      const newSkills = [...data.skills];
                      newSkills[index] = { ...skill, level: value as any };
                      updateField(['skills'], newSkills);
                    }}
                    isEditMode={isEditMode}
                    placeholder="Level"
                    className="text-xs"
                    style={{ color: colors.accent }}
                  />
                </div>
              </EditableSection>
            ))}
            {isEditMode && (
              <EditableSection
                isEditMode={isEditMode}
                onAdd={() => addArrayItem('skills', {
                  name: '',
                  category: '',
                  level: 'Intermediate'
                })}
              >
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 cursor-pointer"
                     onClick={() => addArrayItem('skills', {
                       name: '',
                       category: '',
                       level: 'Intermediate'
                     })}>
                  <Plus className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Add Skill</p>
                </div>
              </EditableSection>
            )}
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