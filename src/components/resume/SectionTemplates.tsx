import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  FolderOpen, 
  Award, 
  User, 
  Heart,
  PenTool,
  Signature,
  Calendar,
  MapPin,
  ExternalLink,
  CheckCircle,
  Circle
} from 'lucide-react';
import { EditableElement } from './EditableElement';
import { EditableList } from './EditableList';
import { ResumeData } from './types';

export type SectionTemplateType = 
  | 'experience-card' 
  | 'experience-timeline' 
  | 'education-compact' 
  | 'education-table'
  | 'projects-tags' 
  | 'projects-links'
  | 'skills-grid' 
  | 'skills-bars'
  | 'roles-bullets' 
  | 'roles-nested'
  | 'hobbies-simple'
  | 'declaration-simple'
  | 'signature-simple'
  | 'professional-classic';

export interface SectionTemplate {
  id: SectionTemplateType;
  name: string;
  description: string;
  category: 'experience' | 'education' | 'projects' | 'skills' | 'roles' | 'hobbies' | 'declaration' | 'signature' | 'complete';
  component: React.ComponentType<any>;
}

// Experience Templates
const ExperienceCardTemplate: React.FC<{ data: ResumeData['experience'], colors: any }> = ({ data, colors }) => (
  <EditableList
    items={data}
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
    renderItem={(exp, index) => (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <EditableElement
              value={exp.jobTitle}
              path={['experience', index.toString(), 'jobTitle']}
              as="h3"
              className="text-lg font-semibold mb-1"
              style={{ color: colors.primary }}
            />
            <EditableElement
              value={exp.company}
              path={['experience', index.toString(), 'company']}
              as="p"
              className="text-gray-600 font-medium"
            />
          </div>
          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <EditableElement
                value={exp.startDate}
                path={['experience', index.toString(), 'startDate']}
                className="inline"
              />
              {' - '}
              <EditableElement
                value={exp.current ? 'Present' : exp.endDate}
                path={['experience', index.toString(), exp.current ? 'current' : 'endDate']}
                className="inline"
              />
            </div>
          </div>
        </div>
        <EditableElement
          value={exp.description}
          path={['experience', index.toString(), 'description']}
          as="p"
          className="text-gray-700 mb-2 text-sm leading-relaxed"
          multiline
        />
        {exp.keyResponsibilities && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-800 mb-1">Key Responsibilities:</h4>
            <EditableElement
              value={exp.keyResponsibilities}
              path={['experience', index.toString(), 'keyResponsibilities']}
              as="div"
              className="text-sm text-gray-600 pl-3 border-l-2 border-gray-200"
              multiline
            />
          </div>
        )}
      </div>
    )}
  />
);

const ExperienceTimelineTemplate: React.FC<{ data: ResumeData['experience'], colors: any }> = ({ data, colors }) => (
  <EditableList
    items={data}
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
    renderItem={(exp, index) => (
      <div className="relative pl-8 pb-6">
        <div className="absolute left-0 top-0 w-4 h-4 rounded-full border-2 border-primary bg-white"></div>
        {index < data.length - 1 && (
          <div className="absolute left-2 top-4 w-0.5 h-full bg-gray-200"></div>
        )}
        <div className="ml-2">
          <div className="flex flex-wrap items-start justify-between mb-2">
            <EditableElement
              value={exp.jobTitle}
              path={['experience', index.toString(), 'jobTitle']}
              as="h3"
              className="text-lg font-semibold"
              style={{ color: colors.primary }}
            />
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              <EditableElement
                value={exp.startDate}
                path={['experience', index.toString(), 'startDate']}
                className="inline"
              />
              {' - '}
              <EditableElement
                value={exp.current ? 'Present' : exp.endDate}
                path={['experience', index.toString(), exp.current ? 'current' : 'endDate']}
                className="inline"
              />
            </span>
          </div>
          <EditableElement
            value={exp.company}
            path={['experience', index.toString(), 'company']}
            as="p"
            className="text-gray-600 font-medium mb-2"
          />
          <EditableElement
            value={exp.description}
            path={['experience', index.toString(), 'description']}
            as="p"
            className="text-gray-700 text-sm mb-2"
            multiline
          />
          {exp.keyResponsibilities && (
            <EditableElement
              value={exp.keyResponsibilities}
              path={['experience', index.toString(), 'keyResponsibilities']}
              as="div"
              className="text-sm text-gray-600"
              multiline
            />
          )}
        </div>
      </div>
    )}
  />
);

// Education Templates
const EducationCompactTemplate: React.FC<{ data: ResumeData['education'], colors: any }> = ({ data, colors }) => (
  <EditableList
    items={data}
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
    renderItem={(edu, index) => (
      <div className="border-l-4 border-primary pl-4 py-2">
        <div className="flex flex-wrap items-start justify-between">
          <div className="flex-1">
            <EditableElement
              value={edu.degree}
              path={['education', index.toString(), 'degree']}
              as="h3"
              className="font-semibold"
              style={{ color: colors.primary }}
            />
            <EditableElement
              value={edu.school}
              path={['education', index.toString(), 'school']}
              as="p"
              className="text-gray-600"
            />
          </div>
          <div className="text-right text-sm">
            <div className="text-gray-500">
              <EditableElement
                value={edu.startYear}
                path={['education', index.toString(), 'startYear']}
                className="inline"
              />
              {' - '}
              <EditableElement
                value={edu.current ? 'Present' : edu.endYear}
                path={['education', index.toString(), edu.current ? 'current' : 'endYear']}
                className="inline"
              />
            </div>
            {edu.cgpa && (
              <div className="font-medium" style={{ color: colors.primary }}>
                CGPA: <EditableElement
                  value={edu.cgpa}
                  path={['education', index.toString(), 'cgpa']}
                  className="inline"
                />
              </div>
            )}
          </div>
        </div>
        {edu.description && (
          <EditableElement
            value={edu.description}
            path={['education', index.toString(), 'description']}
            as="p"
            className="text-sm text-gray-600 mt-2"
            multiline
          />
        )}
      </div>
    )}
  />
);

const EducationTableTemplate: React.FC<{ data: ResumeData['education'], colors: any }> = ({ data, colors }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b-2" style={{ borderColor: colors.primary }}>
          <th className="text-left py-2 px-3 font-semibold" style={{ color: colors.primary }}>Degree</th>
          <th className="text-left py-2 px-3 font-semibold" style={{ color: colors.primary }}>Institution</th>
          <th className="text-left py-2 px-3 font-semibold" style={{ color: colors.primary }}>Year</th>
          <th className="text-left py-2 px-3 font-semibold" style={{ color: colors.primary }}>CGPA</th>
        </tr>
      </thead>
      <tbody>
        <EditableList
          items={data}
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
          renderItem={(edu, index) => (
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-3">
                <EditableElement
                  value={edu.degree}
                  path={['education', index.toString(), 'degree']}
                  className="font-medium"
                />
              </td>
              <td className="py-2 px-3">
                <EditableElement
                  value={edu.school}
                  path={['education', index.toString(), 'school']}
                />
              </td>
              <td className="py-2 px-3 text-sm">
                <EditableElement
                  value={edu.startYear}
                  path={['education', index.toString(), 'startYear']}
                  className="inline"
                />
                {' - '}
                <EditableElement
                  value={edu.current ? 'Present' : edu.endYear}
                  path={['education', index.toString(), edu.current ? 'current' : 'endYear']}
                  className="inline"
                />
              </td>
              <td className="py-2 px-3">
                <EditableElement
                  value={edu.cgpa}
                  path={['education', index.toString(), 'cgpa']}
                  className="font-medium"
                />
              </td>
            </tr>
          )}
        />
      </tbody>
    </table>
  </div>
);

// Projects Templates
const ProjectsTagsTemplate: React.FC<{ data: ResumeData['projects'], colors: any }> = ({ data, colors }) => (
  <EditableList
    items={data}
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
    renderItem={(project, index) => (
      <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <EditableElement
            value={project.name}
            path={['projects', index.toString(), 'name']}
            as="h3"
            className="text-lg font-semibold"
            style={{ color: colors.primary }}
          />
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        <EditableElement
          value={project.description}
          path={['projects', index.toString(), 'description']}
          as="p"
          className="text-gray-700 text-sm mb-3"
          multiline
        />
        <div className="flex flex-wrap gap-2 mb-2">
          {project.technologies.split(',').map((tech, techIndex) => (
            <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {tech.trim()}
            </span>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          <EditableElement
            value={project.startDate}
            path={['projects', index.toString(), 'startDate']}
            className="inline"
          />
          {' - '}
          <EditableElement
            value={project.current ? 'Present' : project.endDate}
            path={['projects', index.toString(), project.current ? 'current' : 'endDate']}
            className="inline"
          />
        </div>
      </div>
    )}
  />
);

// Skills Templates
const SkillsGridTemplate: React.FC<{ data: ResumeData['skills'], colors: any }> = ({ data, colors }) => {
  const skillsByCategory = data.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as { [key: string]: typeof data });

  return (
    <div className="space-y-4">
      {Object.entries(skillsByCategory).map(([category, skills]) => (
        <div key={category}>
          <h3 className="font-semibold mb-2 pb-1 border-b" style={{ color: colors.primary, borderColor: colors.primary }}>
            {category}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {skills.map((skill, index) => (
              <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <EditableElement
                  value={skill.name}
                  path={['skills', data.indexOf(skill).toString(), 'name']}
                  className="text-sm font-medium"
                />
                <div className="flex">
                  {[1, 2, 3].map((level) => (
                    <Circle
                      key={level}
                      className={`h-2 w-2 ml-1 ${
                        skill.level === 'Expert' ? (level <= 3 ? 'fill-current' : '') :
                        skill.level === 'Intermediate' ? (level <= 2 ? 'fill-current' : '') :
                        level <= 1 ? 'fill-current' : ''
                      }`}
                      style={{ color: colors.primary }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Simple Templates for other sections
const HobbiesSimpleTemplate: React.FC<{ data: ResumeData['hobbies'] }> = ({ data }) => (
  <EditableList
    items={data}
    path={['hobbies']}
    createNewItem={() => ({
      id: Date.now().toString(),
      name: ''
    })}
    renderItem={(hobby, index) => (
      <div className="inline-block mr-4 mb-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
          <Heart className="h-3 w-3 mr-1" />
          <EditableElement
            value={hobby.name}
            path={['hobbies', index.toString(), 'name']}
            className="inline"
          />
        </span>
      </div>
    )}
  />
);

const DeclarationSimpleTemplate: React.FC<{ data: ResumeData['declaration'] }> = ({ data }) => (
  <div className="bg-gray-50 p-4 rounded-lg border">
    <EditableElement
      value={data.text}
      path={['declaration', 'text']}
      as="p"
      className="text-sm text-gray-700 italic"
      multiline
    />
  </div>
);

const SignatureSimpleTemplate: React.FC<{ data: ResumeData['signature'] }> = ({ data }) => (
  <div className="border-t pt-4">
    <div className="flex justify-between items-end">
      <div>
        <p className="text-sm text-gray-600 mb-2">Signature:</p>
        {data.digitalSignature ? (
          <img src={data.digitalSignature} alt="Digital Signature" className="h-16 object-contain" />
        ) : (
          <div className="h-16 border-b border-gray-400 w-48 mb-2"></div>
        )}
        <EditableElement
          value={data.name}
          path={['signature', 'name']}
          as="p"
          className="text-sm font-medium"
        />
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Date:</p>
        <EditableElement
          value={data.date}
          path={['signature', 'date']}
          as="p"
          className="text-sm"
        />
        <EditableElement
          value={data.location}
          path={['signature', 'location']}
          as="p"
          className="text-sm text-gray-600"
        />
      </div>
    </div>
  </div>
);

// Professional Classic Complete Template (Based on uploaded image)
const ProfessionalClassicTemplate: React.FC<{ data: ResumeData, colors: any, customization: any }> = ({ data, colors, customization }) => (
  <div className="max-w-4xl mx-auto bg-white p-8 min-h-screen" style={{ fontFamily: 'serif' }}>
    {/* Header Section */}
    <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
      <EditableElement
        value={data.personalInfo.fullName || 'FIRST NAME LAST NAME'}
        path={['personalInfo', 'fullName']}
        as="h1"
        className="text-4xl font-bold tracking-wider text-gray-800 mb-4"
        style={{ letterSpacing: '0.1em' }}
      />
      <div className="text-gray-600 space-y-1">
        <EditableElement
          value={`${data.personalInfo.location || 'Address'} • ${data.personalInfo.phone || 'Phone'}`}
          path={['personalInfo', 'location']}
          as="p"
          className="text-sm"
        />
        <div className="flex justify-center items-center space-x-2 text-sm">
          <EditableElement
            value={data.personalInfo.email || 'Email'}
            path={['personalInfo', 'email']}
            className="text-green-600 hover:underline"
          />
          <span>•</span>
          <EditableElement
            value={data.publicLinks.linkedin || 'LinkedIn Profile'}
            path={['publicLinks', 'linkedin']}
            className="text-green-600 hover:underline"
          />
          <span>•</span>
          <EditableElement
            value={data.publicLinks.website || 'Twitter/Blog/Portfolio'}
            path={['publicLinks', 'website']}
            className="text-green-600 hover:underline"
          />
        </div>
      </div>
    </div>

    {/* Career Objective */}
    {data.personalInfo.summary && (
      <div className="mb-8">
        <EditableElement
          value={data.personalInfo.summary || 'To replace this text with your own, just click it and start typing. Briefly state your career objective, or summarize what makes you stand out. Use language from the job description as keywords.'}
          path={['personalInfo', 'summary']}
          as="p"
          className="text-gray-700 leading-relaxed text-justify"
          multiline
        />
      </div>
    )}

    {/* Experience Section */}
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">EXPERIENCE</h2>
      <EditableList
        items={data.experience}
        path={['experience']}
        createNewItem={() => ({
          id: Date.now().toString(),
          jobTitle: 'JOB TITLE',
          company: 'COMPANY',
          startDate: 'DATES FROM',
          endDate: 'TO',
          current: false,
          description: 'Describe your responsibilities and achievements in terms of impact and results. Use examples, but keep it short.',
          keyResponsibilities: ''
        })}
        renderItem={(exp, index) => (
          <div className="mb-6 border-l-4 border-gray-400 pl-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-600 text-sm">
                  <EditableElement
                    value={exp.startDate}
                    path={['experience', index.toString(), 'startDate']}
                    className="inline"
                  />
                  {' - '}
                  <EditableElement
                    value={exp.current ? 'Present' : exp.endDate}
                    path={['experience', index.toString(), exp.current ? 'current' : 'endDate']}
                    className="inline"
                  />
                </p>
                <EditableElement
                  value={exp.jobTitle}
                  path={['experience', index.toString(), 'jobTitle']}
                  as="h3"
                  className="font-bold text-green-600 text-lg"
                />
                <EditableElement
                  value={exp.company}
                  path={['experience', index.toString(), 'company']}
                  as="p"
                  className="font-bold text-gray-800"
                />
              </div>
            </div>
            <EditableElement
              value={exp.description}
              path={['experience', index.toString(), 'description']}
              as="p"
              className="text-gray-700 text-sm leading-relaxed"
              multiline
            />
          </div>
        )}
      />
    </div>

    {/* Education Section */}
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">EDUCATION</h2>
      <EditableList
        items={data.education}
        path={['education']}
        createNewItem={() => ({
          id: Date.now().toString(),
          degree: 'DEGREE TITLE',
          school: 'SCHOOL',
          startYear: 'MONTH YEAR',
          endYear: 'MONTH YEAR',
          current: false,
          cgpa: '',
          percentage: '',
          letterGrade: '',
          description: "It's okay to brag about your GPA, awards, and honors. Feel free to summarize your coursework too."
        })}
        renderItem={(edu, index) => (
          <div className="mb-6 border-l-4 border-gray-400 pl-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-gray-600 text-sm">
                  <EditableElement
                    value={edu.startYear}
                    path={['education', index.toString(), 'startYear']}
                    className="inline"
                  />
                  {' - '}
                  <EditableElement
                    value={edu.current ? 'Present' : edu.endYear}
                    path={['education', index.toString(), edu.current ? 'current' : 'endYear']}
                    className="inline"
                  />
                </p>
                <EditableElement
                  value={edu.degree}
                  path={['education', index.toString(), 'degree']}
                  as="h3"
                  className="font-bold text-green-600 text-lg"
                />
                <EditableElement
                  value={edu.school}
                  path={['education', index.toString(), 'school']}
                  as="p"
                  className="font-bold text-gray-800"
                />
              </div>
            </div>
            {edu.description && (
              <EditableElement
                value={edu.description}
                path={['education', index.toString(), 'description']}
                as="p"
                className="text-gray-700 text-sm leading-relaxed"
                multiline
              />
            )}
          </div>
        )}
      />
    </div>

    {/* Skills Section */}
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">SKILLS</h2>
      <div className="grid grid-cols-2 gap-x-8">
        <div className="space-y-2">
          <EditableList
            items={data.skills.slice(0, Math.ceil(data.skills.length / 2))}
            path={['skills']}
            createNewItem={() => ({
              id: Date.now().toString(),
              name: 'List your strengths relevant for the role you\'re applying for',
              category: 'Technical',
              level: 'Intermediate'
            })}
            renderItem={(skill, index) => (
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <EditableElement
                  value={skill.name}
                  path={['skills', index.toString(), 'name']}
                  className="text-gray-700 text-sm"
                />
              </div>
            )}
          />
        </div>
        <div className="space-y-2">
          <EditableList
            items={data.skills.slice(Math.ceil(data.skills.length / 2))}
            path={['skills']}
            createNewItem={() => ({
              id: Date.now().toString(),
              name: 'List one of your strengths',
              category: 'Technical',
              level: 'Intermediate'
            })}
            renderItem={(skill, index) => (
              <div className="flex items-start">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <EditableElement
                  value={skill.name}
                  path={['skills', (Math.ceil(data.skills.length / 2) + index).toString(), 'name']}
                  className="text-gray-700 text-sm"
                />
              </div>
            )}
          />
        </div>
      </div>
    </div>

    {/* Activities Section */}
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-300">ACTIVITIES</h2>
      <EditableElement
        value={data.hobbies.map(h => h.name).join(', ') || 'Use this section to highlight your relevant passions, activities, and how you like to give back. It\'s good to include Leadership and volunteer experiences here. Or show off important extras like publications, certifications, languages and more.'}
        path={['hobbies']}
        as="p"
        className="text-gray-700 text-sm leading-relaxed"
        multiline
      />
    </div>
  </div>
);

export const sectionTemplates: SectionTemplate[] = [
  // Experience Templates
  {
    id: 'experience-card',
    name: 'Card View',
    description: 'Modern card-based layout with shadow effects',
    category: 'experience',
    component: ExperienceCardTemplate,
  },
  {
    id: 'experience-timeline',
    name: 'Timeline View',
    description: 'Timeline layout with connecting lines',
    category: 'experience',
    component: ExperienceTimelineTemplate,
  },
  // Education Templates
  {
    id: 'education-compact',
    name: 'Compact View',
    description: 'Space-efficient vertical layout',
    category: 'education',
    component: EducationCompactTemplate,
  },
  {
    id: 'education-table',
    name: 'Table View',
    description: 'Structured table format',
    category: 'education',
    component: EducationTableTemplate,
  },
  // Projects Templates
  {
    id: 'projects-tags',
    name: 'With Technology Tags',
    description: 'Projects with technology badges',
    category: 'projects',
    component: ProjectsTagsTemplate,
  },
  // Skills Templates
  {
    id: 'skills-grid',
    name: 'Grid with Levels',
    description: 'Organized grid with skill level indicators',
    category: 'skills',
    component: SkillsGridTemplate,
  },
  // Simple Templates
  {
    id: 'hobbies-simple',
    name: 'Simple Tags',
    description: 'Clean tag-based layout',
    category: 'hobbies',
    component: HobbiesSimpleTemplate,
  },
  {
    id: 'declaration-simple',
    name: 'Simple Box',
    description: 'Clean bordered text box',
    category: 'declaration',
    component: DeclarationSimpleTemplate,
  },
  {
    id: 'signature-simple',
    name: 'Simple Layout',
    description: 'Traditional signature layout',
    category: 'signature',
    component: SignatureSimpleTemplate,
  },
  // Complete Template
  {
    id: 'professional-classic',
    name: 'Professional Classic',
    description: 'Complete professional resume template with traditional formatting',
    category: 'complete',
    component: ProfessionalClassicTemplate,
  },
];

export const getSectionTemplate = (templateId: SectionTemplateType) => {
  return sectionTemplates.find(template => template.id === templateId);
};

export const getTemplatesByCategory = (category: SectionTemplate['category']) => {
  return sectionTemplates.filter(template => template.category === category);
};