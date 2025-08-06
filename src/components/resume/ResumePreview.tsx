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
  Award,
  Layout
} from 'lucide-react';
import { LiveEditingProvider } from './LiveEditingProvider';
import { EditableElement } from './EditableElement';
import { EditableImage } from './EditableImage';
import { EditableList } from './EditableList';
import { SectionPicker } from './SectionPicker';
import { TemplateManager, useTemplateManager, SectionTemplateConfig } from './TemplateManager';
import { SectionTemplateType } from './SectionTemplates';

interface ResumePreviewProps {
  data: ResumeData;
  customization: CustomizationOptions;
  theme: ResumeTheme;
  isEditMode?: boolean;
  onDataChange?: (data: ResumeData) => void;
  templateConfig?: SectionTemplateConfig;
  onTemplateChange?: (sectionKey: string, templateId: SectionTemplateType) => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  data, 
  customization, 
  theme, 
  isEditMode = false, 
  onDataChange,
  templateConfig,
  onTemplateChange 
}) => {
  const { templateConfig: defaultTemplateConfig, updateTemplate } = useTemplateManager();
  const finalTemplateConfig = templateConfig || defaultTemplateConfig;
  const finalOnTemplateChange = onTemplateChange || updateTemplate;
  const colors = customization.colors;

  // Helper function to check if resume data is empty
  const isResumeEmpty = () => {
    return !data.personalInfo.fullName && 
           !data.personalInfo.email && 
           !data.personalInfo.phone && 
           !data.personalInfo.location &&
           !data.personalInfo.summary &&
           data.experience.length === 0 &&
           data.education.length === 0 &&
           data.skills.length === 0 &&
           data.certificates.length === 0 &&
           data.projects.length === 0 &&
           data.hobbies.length === 0;
  };

  // Helper function to check if a specific section has data
  const hasData = (sectionKey: string) => {
    switch (sectionKey) {
      case 'experience': return data.experience.length > 0;
      case 'education': return data.education.length > 0;
      case 'skills': return data.skills.length > 0;
      case 'certificates': return data.certificates.length > 0;
      case 'projects': return data.projects.length > 0;
      case 'hobbies': return data.hobbies.length > 0;
      case 'summary': return data.personalInfo.summary.trim() !== '';
      case 'additionalInfo': return data.additionalInfo.trim() !== '';
      default: return false;
    }
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
          <EditableImage
            value={data.personalInfo.profileImage || ''}
            path={['personalInfo', 'profileImage']}
            width={80}
            height={80}
            shape="circle"
            style={{ borderColor: colors.primary }}
          />
          
          <div className="flex-1">
            <EditableElement
              value={data.personalInfo.fullName}
              path={['personalInfo', 'fullName']}
              as="h1"
              className="text-3xl font-bold mb-2"
              style={{ 
                color: colors.primary,
                fontFamily: customization.sections.contact?.fontFamily || theme.fontFamily
              }}
              placeholder="Your Full Name"
            />
            
            <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: colors.secondary }}>
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <EditableElement
                  value={data.personalInfo.email}
                  path={['personalInfo', 'email']}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <EditableElement
                  value={data.personalInfo.phone}
                  path={['personalInfo', 'phone']}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <EditableElement
                  value={data.personalInfo.location}
                  path={['personalInfo', 'location']}
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Public Links */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1" style={{ color: colors.accent }}>
                <Github className="w-4 h-4" />
                <EditableElement
                  value={data.publicLinks.github}
                  path={['publicLinks', 'github']}
                  placeholder="github.com/username"
                />
              </div>
              <div className="flex items-center gap-1" style={{ color: colors.accent }}>
                <Linkedin className="w-4 h-4" />
                <EditableElement
                  value={data.publicLinks.linkedin}
                  path={['publicLinks', 'linkedin']}
                  placeholder="linkedin.com/in/username"
                />
              </div>
              <div className="flex items-center gap-1" style={{ color: colors.accent }}>
                <Globe className="w-4 h-4" />
                <EditableElement
                  value={data.publicLinks.portfolio}
                  path={['publicLinks', 'portfolio']}
                  placeholder="portfolio.com"
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
          {isEditMode && (
            <SectionPicker onTemplateSelect={finalOnTemplateChange}>
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-xs text-blue-600 hover:bg-blue-100 cursor-pointer transition-colors">
                <Layout className="h-3 w-3" />
                Template
              </div>
            </SectionPicker>
          )}
        </div>
        <div className={`${dividerClass} mb-4`} style={{ borderColor: colors.primary }}></div>
        <div style={getSectionStyle(sectionId)}>
          {children}
        </div>
      </div>
    );
  };

  const renderEmptyState = () => {
    if (!isResumeEmpty() || !isEditMode) return null;
    
    return (
      <div className="text-center py-16 text-gray-400">
        <User className="h-24 w-24 mx-auto mb-6 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Start Building Your Resume</h3>
        <p className="text-sm mb-4">Fill out the form on the left to create your professional resume</p>
        <p className="text-xs">Your content will appear here as you add it</p>
      </div>
    );
  };

  const renderTraditionalLayout = () => (
    <TemplateManager
      data={data}
      customization={customization}
      templateConfig={finalTemplateConfig}
      onTemplateChange={finalOnTemplateChange}
    >
      {(renderSectionTemplate, renderCompleteTemplate) => {
        // Check if a complete template is selected
        const completeTemplateId = finalTemplateConfig['complete'] as SectionTemplateType;
        if (completeTemplateId && completeTemplateId !== 'default' && completeTemplateId === 'professional-classic') {
          return renderCompleteTemplate(completeTemplateId);
        }
        
        return (
          <div className="max-w-4xl mx-auto p-8" style={{ backgroundColor: colors.background, color: colors.text }}>
            {renderHeader()}
            
            {renderEmptyState()}
            
            {!isResumeEmpty() && (
              <div className={getSpacingClass()}>
                {/* Summary */}
                {(hasData('summary') || isEditMode) && renderSection(
                  'Professional Summary',
                  'summary',
                  data.personalInfo.summary ? (
                    <EditableElement
                      value={data.personalInfo.summary}
                      path={['personalInfo', 'summary']}
                      multiline={true}
                      className="leading-relaxed"
                      placeholder="Write a compelling professional summary..."
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No professional summary added yet</p>
                      <p className="text-xs mt-1">Click here to add a compelling summary</p>
                    </div>
                  )
                )}

                {/* Experience */}
                {(hasData('experience') || isEditMode) && renderSection(
                  'Professional Experience',
                  'experience',
                  renderSectionTemplate('experience', data.experience) || (
                    data.experience.length > 0 ? (
                      <EditableList
                        items={data.experience}
                        path={['experience']}
                        createNewItem={() => ({
                          id: Date.now().toString(),
                          jobTitle: '',
                          company: '',
                          startDate: '',
                          endDate: '',
                          current: false,
                          description: '',
                          keyResponsibilities: ''
                        })}
                        addButtonText="Add Experience"
                        renderItem={(exp, index) => (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <EditableElement
                                  value={exp.jobTitle}
                                  path={['experience', index.toString(), 'jobTitle']}
                                  as="h3"
                                  className="font-semibold text-lg"
                                  placeholder="Job Title"
                                />
                                <EditableElement
                                  value={exp.company}
                                  path={['experience', index.toString(), 'company']}
                                  className="font-medium"
                                  style={{ color: colors.secondary }}
                                  placeholder="Company Name"
                                />
                              </div>
                              <div className="text-sm flex items-center gap-1" style={{ color: colors.secondary }}>
                                <Calendar className="h-3 w-3" />
                                <EditableElement
                                  value={exp.startDate}
                                  path={['experience', index.toString(), 'startDate']}
                                  placeholder="Start Date"
                                />
                                <span> - </span>
                                {exp.current ? 'Present' : (
                                  <EditableElement
                                    value={exp.endDate}
                                    path={['experience', index.toString(), 'endDate']}
                                    placeholder="End Date"
                                  />
                                )}
                              </div>
                            </div>
                            <EditableElement
                              value={exp.description}
                              path={['experience', index.toString(), 'description']}
                              multiline={true}
                              className="text-sm leading-relaxed mb-2"
                              placeholder="Describe your responsibilities and achievements..."
                            />
                            <EditableElement
                              value={exp.keyResponsibilities}
                              path={['experience', index.toString(), 'keyResponsibilities']}
                              multiline={true}
                              className="text-sm leading-relaxed"
                              placeholder="Key roles and responsibilities..."
                            />
                          </div>
                        )}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No work experience added yet</p>
                        <p className="text-xs mt-1">Click "Add Experience" in the form or use the edit mode to add directly here</p>
                      </div>
                    )
                  )
                )}

                {/* Education */}
                {(hasData('education') || isEditMode) && renderSection(
                  'Education',
                  'education',
                  renderSectionTemplate('education', data.education) || (
                    data.education.length > 0 ? (
                      <EditableList
                        items={data.education}
                        path={['education']}
                        createNewItem={() => ({
                          id: Date.now().toString(),
                          degree: '',
                          school: '',
                          startYear: '',
                          endYear: '',
                          current: false,
                          cgpa: '',
                          percentage: '',
                          letterGrade: '',
                          description: ''
                        })}
                        addButtonText="Add Education"
                        renderItem={(edu, index) => (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <EditableElement
                                  value={edu.degree}
                                  path={['education', index.toString(), 'degree']}
                                  as="h3"
                                  className="font-semibold text-lg"
                                  placeholder="Degree/Program"
                                />
                                <EditableElement
                                  value={edu.school}
                                  path={['education', index.toString(), 'school']}
                                  className="font-medium"
                                  style={{ color: colors.secondary }}
                                  placeholder="Institution Name"
                                />
                                {/* Academic Performance */}
                                <div className="text-sm mt-1 space-x-2" style={{ color: colors.secondary }}>
                                  {(edu.cgpa || isEditMode) && (
                                    <EditableElement
                                      value={edu.cgpa ? `CGPA: ${edu.cgpa}` : ''}
                                      path={['education', index.toString(), 'cgpa']}
                                      placeholder="CGPA: 0.0"
                                    />
                                  )}
                                  {(edu.percentage || isEditMode) && (
                                    <EditableElement
                                      value={edu.percentage ? `${edu.percentage}%` : ''}
                                      path={['education', index.toString(), 'percentage']}
                                      placeholder="Percentage: 00%"
                                    />
                                  )}
                                  {(edu.letterGrade || isEditMode) && (
                                    <EditableElement
                                      value={edu.letterGrade ? `Grade: ${edu.letterGrade}` : ''}
                                      path={['education', index.toString(), 'letterGrade']}
                                      placeholder="Grade: A+"
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="text-sm flex items-center gap-1" style={{ color: colors.secondary }}>
                                <Calendar className="h-3 w-3" />
                                <EditableElement
                                  value={edu.startYear}
                                  path={['education', index.toString(), 'startYear']}
                                  placeholder="Start Year"
                                />
                                <span> - </span>
                                {edu.current ? 'Present' : (
                                  <EditableElement
                                    value={edu.endYear}
                                    path={['education', index.toString(), 'endYear']}
                                    placeholder="End Year"
                                  />
                                )}
                              </div>
                            </div>
                            {(edu.description || isEditMode) && (
                              <EditableElement
                                value={edu.description || ''}
                                path={['education', index.toString(), 'description']}
                                multiline={true}
                                className="text-sm leading-relaxed"
                                placeholder="Describe coursework, achievements, or relevant details..."
                              />
                            )}
                          </div>
                        )}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No education details added yet</p>
                        <p className="text-xs mt-1">Click "Add Education" in the form or use the edit mode to add directly here</p>
                      </div>
                    )
                  )
                )}

                {/* Skills */}
                {(hasData('skills') || isEditMode) && renderSection(
                  'Skills & Technologies',
                  'skills',
                  renderSectionTemplate('skills', data.skills) || (
                    data.skills.length > 0 ? (
                      <EditableList
                        items={data.skills}
                        path={['skills']}
                        createNewItem={() => ({
                          id: Date.now().toString(),
                          name: '',
                          category: 'Technical',
                          level: 'Intermediate' as const
                        })}
                        addButtonText="Add Skill"
                        renderItem={(skill, index) => (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <EditableElement
                              value={skill.name}
                              path={['skills', index.toString(), 'name']}
                              placeholder="Skill name"
                              className="flex-1 font-medium"
                            />
                            <EditableElement
                              value={skill.category}
                              path={['skills', index.toString(), 'category']}
                              placeholder="Category"
                              className="text-sm text-gray-600"
                            />
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {skill.level}
                            </span>
                          </div>
                        )}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No skills added yet</p>
                        <p className="text-xs mt-1">Click "Add Skill" in the form or use the edit mode to add directly here</p>
                      </div>
                    )
                  )
                )}

                {/* Certificates */}
                {(hasData('certificates') || isEditMode) && renderSection(
                  'Certifications',
                  'certificates',
                  data.certificates.length > 0 ? (
                    <EditableList
                      items={data.certificates}
                      path={['certificates']}
                      createNewItem={() => ({
                        id: Date.now().toString(),
                        name: '',
                        issuer: '',
                        issueDate: '',
                        expiryDate: '',
                        url: ''
                      })}
                      addButtonText="Add Certificate"
                      renderItem={(cert, index) => (
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex-1">
                              <EditableElement
                                value={cert.name}
                                path={['certificates', index.toString(), 'name']}
                                as="h3"
                                className="font-semibold"
                                placeholder="Certificate Name"
                              />
                              <EditableElement
                                value={cert.issuer}
                                path={['certificates', index.toString(), 'issuer']}
                                className="font-medium"
                                style={{ color: colors.secondary }}
                                placeholder="Issuing Organization"
                              />
                            </div>
                            <div className="text-sm" style={{ color: colors.secondary }}>
                              <EditableElement
                                value={cert.issueDate}
                                path={['certificates', index.toString(), 'issueDate']}
                                placeholder="Issue Date"
                              />
                              {(cert.expiryDate || isEditMode) && (
                                <>
                                  <span> - </span>
                                  <EditableElement
                                    value={cert.expiryDate || ''}
                                    path={['certificates', index.toString(), 'expiryDate']}
                                    placeholder="Expiry Date"
                                  />
                                </>
                              )}
                            </div>
                          </div>
                          {(cert.url || isEditMode) && (
                            <EditableElement
                              value={cert.url || ''}
                              path={['certificates', index.toString(), 'url']}
                              className="text-sm hover:underline"
                              style={{ color: colors.accent }}
                              placeholder="Certificate URL"
                            />
                          )}
                        </div>
                      )}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No certifications added yet</p>
                      <p className="text-xs mt-1">Click "Add Certificate" in the form or use the edit mode to add directly here</p>
                    </div>
                  )
                )}

                {/* Projects */}
                {(hasData('projects') || isEditMode) && renderSection(
                  'Projects & Internships',
                  'projects',
                  renderSectionTemplate('projects', data.projects) || (
                    data.projects.length > 0 ? (
                      <EditableList
                        items={data.projects}
                        path={['projects']}
                        createNewItem={() => ({
                          id: Date.now().toString(),
                          name: '',
                          description: '',
                          technologies: '',
                          url: '',
                          startDate: '',
                          endDate: '',
                          current: false
                        })}
                        addButtonText="Add Project"
                        renderItem={(project, index) => (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <EditableElement
                                  value={project.name}
                                  path={['projects', index.toString(), 'name']}
                                  as="h3"
                                  className="font-semibold text-lg"
                                  placeholder="Project Name"
                                />
                                <EditableElement
                                  value={project.technologies}
                                  path={['projects', index.toString(), 'technologies']}
                                  className="font-medium text-sm"
                                  style={{ color: colors.secondary }}
                                  placeholder="Technologies Used"
                                />
                              </div>
                              <div className="text-sm flex items-center gap-1" style={{ color: colors.secondary }}>
                                <Calendar className="h-3 w-3" />
                                <EditableElement
                                  value={project.startDate}
                                  path={['projects', index.toString(), 'startDate']}
                                  placeholder="Start Date"
                                />
                                <span> - </span>
                                {project.current ? 'Present' : (
                                  <EditableElement
                                    value={project.endDate}
                                    path={['projects', index.toString(), 'endDate']}
                                    placeholder="End Date"
                                  />
                                )}
                              </div>
                            </div>
                            <EditableElement
                              value={project.description}
                              path={['projects', index.toString(), 'description']}
                              multiline={true}
                              className="text-sm leading-relaxed mb-2"
                              placeholder="Describe the project, your role, and key achievements..."
                            />
                            {(project.url || isEditMode) && (
                              <EditableElement
                                value={project.url || ''}
                                path={['projects', index.toString(), 'url']}
                                className="text-sm hover:underline"
                                style={{ color: colors.accent }}
                                placeholder="Project URL"
                              />
                            )}
                          </div>
                        )}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <Layout className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No projects added yet</p>
                        <p className="text-xs mt-1">Click "Add Project" in the form or use the edit mode to add directly here</p>
                      </div>
                    )
                  )
                )}

                {/* Additional Information */}
                {(hasData('additionalInfo') || isEditMode) && renderSection(
                  'Additional Information',
                  'additionalInfo',
                  data.additionalInfo ? (
                    <EditableElement
                      value={data.additionalInfo}
                      path={['additionalInfo']}
                      multiline={true}
                      className="text-sm leading-relaxed"
                      placeholder="Add any additional information, awards, languages, or other details..."
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                      <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No additional information added yet</p>
                      <p className="text-xs mt-1">Click here to add awards, languages, or other details</p>
                    </div>
                  )
                )}

                {/* Hobbies */}
                {(hasData('hobbies') || isEditMode) && renderSection(
                  'Hobbies & Interests',
                  'hobbies',
                  renderSectionTemplate('hobbies', data.hobbies) || (
                    data.hobbies.length > 0 ? (
                      <EditableList
                        items={data.hobbies}
                        path={['hobbies']}
                        createNewItem={() => ({
                          id: Date.now().toString(),
                          name: ''
                        })}
                        addButtonText="Add Hobby"
                        renderItem={(hobby, index) => (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <EditableElement
                              value={hobby.name}
                              path={['hobbies', index.toString(), 'name']}
                              placeholder="Hobby or interest"
                              className="flex-1"
                            />
                          </div>
                        )}
                      />
                    ) : (
                      <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No hobbies or interests added yet</p>
                        <p className="text-xs mt-1">Click "Add Hobby" in the form or use the edit mode to add directly here</p>
                      </div>
                    )
                  )
                )}

                {/* Declaration */}
                {data.declaration.enabled && renderSection(
                  'Declaration',
                  'declaration',
                  renderSectionTemplate('declaration', data.declaration) || (
                    <EditableElement
                      value={data.declaration.text}
                      path={['declaration', 'text']}
                      multiline={true}
                      className="text-sm leading-relaxed italic"
                      placeholder="I hereby declare that the information provided above is true to the best of my knowledge."
                    />
                  )
                )}

                {/* Signature */}
                {data.signature.enabled && renderSection(
                  'Signature',
                  'signature',
                  renderSectionTemplate('signature', data.signature) || (
                    <div className="space-y-4">
                      {data.signature.digitalSignature && (
                        <EditableImage
                          value={data.signature.digitalSignature}
                          path={['signature', 'digitalSignature']}
                          width={150}
                          height={60}
                          shape="square"
                        />
                      )}
                      <div className="flex gap-8 text-sm">
                        <div>
                          <EditableElement
                            value={data.signature.name || data.personalInfo.fullName}
                            path={['signature', 'name']}
                            placeholder="Full Name"
                            className="border-b border-gray-300 pb-1"
                          />
                          <p className="mt-1 text-xs" style={{ color: colors.secondary }}>Name</p>
                        </div>
                        <div>
                          <EditableElement
                            value={data.signature.date}
                            path={['signature', 'date']}
                            placeholder="Date"
                            className="border-b border-gray-300 pb-1"
                          />
                          <p className="mt-1 text-xs" style={{ color: colors.secondary }}>Date</p>
                        </div>
                        <div>
                          <EditableElement
                            value={data.signature.location}
                            path={['signature', 'location']}
                            placeholder="Location"
                            className="border-b border-gray-300 pb-1"
                          />
                          <p className="mt-1 text-xs" style={{ color: colors.secondary }}>Place</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        );
      }}
    </TemplateManager>
  );

  if (!onDataChange) {
    return renderTraditionalLayout();
  }

  return (
    <LiveEditingProvider
      data={data}
      onDataChange={onDataChange}
      isEditMode={isEditMode}
    >
      {renderTraditionalLayout()}
    </LiveEditingProvider>
  );
};

export default ResumePreview;