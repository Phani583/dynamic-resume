import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Loader2,
  FolderOpen,
  FileText,
  Heart,
  PenTool,
  Signature
} from 'lucide-react';
import { ResumeData } from './types';
import { initializeOpenAI, generateExperienceDescription, generateEducationDescription, generateSkillsSuggestions } from '@/lib/aiGenerator';
import AIKeyModal from './AIKeyModal';

interface ResumeFormProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onDataChange }) => {
  const [newSkill, setNewSkill] = useState('');
  const [showAIKeyModal, setShowAIKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '');
  const [isGenerating, setIsGenerating] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handleInputChange = (section: keyof ResumeData, field: string, value: any) => {
    if (section === 'additionalInfo') {
      onDataChange({
        ...data,
        additionalInfo: value
      });
    } else {
      onDataChange({
        ...data,
        [section]: {
          ...(data[section] as any),
          [field]: value
        }
      });
    }
  };

  const handleArrayItemChange = (section: keyof ResumeData, index: number, field: string, value: any) => {
    const items = [...(data[section] as any[])];
    items[index] = {
      ...items[index],
      [field]: value
    };
    onDataChange({
      ...data,
      [section]: items
    });
  };

  const addArrayItem = (section: keyof ResumeData, newItem: any) => {
    onDataChange({
      ...data,
      [section]: [...(data[section] as any[]), newItem]
    });
  };

  const removeArrayItem = (section: keyof ResumeData, index: number) => {
    const items = [...(data[section] as any[])];
    items.splice(index, 1);
    onDataChange({
      ...data,
      [section]: items
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const newSkillObj = {
        id: Date.now().toString(),
        name: newSkill.trim(),
        category: 'General',
        level: 'Intermediate' as const
      };
      onDataChange({
        ...data,
        skills: [...data.skills, newSkillObj]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const skills = [...data.skills];
    skills.splice(index, 1);
    onDataChange({
      ...data,
      skills
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('personalInfo', 'profileImage', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIKeySubmit = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('openai_api_key', newApiKey);
    initializeOpenAI(newApiKey);
    toast({
      title: "API Key Saved",
      description: "AI generation features are now available.",
    });
  };

  const generateExperienceAI = async (index: number) => {
    const exp = data.experience[index];
    if (!exp.jobTitle || !exp.company) {
      toast({
        title: "Missing Information",
        description: "Please fill in job title and company first.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      setShowAIKeyModal(true);
      return;
    }

    setIsGenerating(prev => ({ ...prev, [`exp-${index}`]: true }));
    
    try {
      const description = await generateExperienceDescription(
        exp.jobTitle,
        exp.company,
        exp.description
      );
      
      handleArrayItemChange('experience', index, 'description', description);
      
      toast({
        title: "Description Generated",
        description: "AI-generated content has been added. Feel free to edit it.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate description.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, [`exp-${index}`]: false }));
    }
  };

  const generateEducationAI = async (index: number) => {
    const edu = data.education[index];
    if (!edu.degree || !edu.school) {
      toast({
        title: "Missing Information", 
        description: "Please fill in degree and school first.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      setShowAIKeyModal(true);
      return;
    }

    setIsGenerating(prev => ({ ...prev, [`edu-${index}`]: true }));
    
    try {
      const description = await generateEducationDescription(
        edu.degree,
        edu.school
      );
      
      // Add description field to education if it doesn't exist
      handleArrayItemChange('education', index, 'description', description);
      
      toast({
        title: "Description Generated",
        description: "AI-generated content has been added.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate description.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, [`edu-${index}`]: false }));
    }
  };

  const generateSkillsAI = async () => {
    if (data.experience.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add some work experience first.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      setShowAIKeyModal(true);
      return;
    }

    setIsGenerating(prev => ({ ...prev, 'skills': true }));
    
    try {
      const jobTitles = data.experience.map(exp => exp.jobTitle).filter(Boolean);
      const mainJobTitle = jobTitles[0] || 'Professional';
      
      const suggestions = await generateSkillsSuggestions(
        mainJobTitle,
        data.experience.map(exp => `${exp.jobTitle} at ${exp.company}`)
      );
      
      // Convert suggestions to skill objects
      const newSkills = suggestions.map((skill, index) => ({
        id: `ai-${Date.now()}-${index}`,
        name: skill,
        category: 'General',
        level: 'Intermediate' as const
      }));
      
      // Merge with existing skills, avoiding duplicates
      const existingSkills = data.skills.map(s => s.name.toLowerCase());
      const uniqueNewSkills = newSkills.filter(skill => 
        !existingSkills.includes(skill.name.toLowerCase())
      );
      
      onDataChange({
        ...data,
        skills: [...data.skills, ...uniqueNewSkills]
      });
      
      toast({
        title: "Skills Generated",
        description: `Added ${newSkills.length} new skill suggestions.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate skills.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(prev => ({ ...prev, 'skills': false }));
    }
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={data.personalInfo.fullName}
                onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={data.personalInfo.phone}
                onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={data.personalInfo.location}
                onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                placeholder="New York, NY"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="profileImage">Profile Image</Label>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-upload"
              />
              <label htmlFor="profile-upload">
                <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </span>
                </Button>
              </label>
              {data.personalInfo.profileImage && (
                <img
                  src={data.personalInfo.profileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={data.personalInfo.summary}
              onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
              placeholder="Brief professional summary highlighting your key skills and experience..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Public Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Public Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={data.publicLinks.github}
                onChange={(e) => handleInputChange('publicLinks', 'github', e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={data.publicLinks.linkedin}
                onChange={(e) => handleInputChange('publicLinks', 'linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio</Label>
              <Input
                id="portfolio"
                value={data.publicLinks.portfolio}
                onChange={(e) => handleInputChange('publicLinks', 'portfolio', e.target.value)}
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div>
              <Label htmlFor="website">Personal Website</Label>
              <Input
                id="website"
                value={data.publicLinks.website}
                onChange={(e) => handleInputChange('publicLinks', 'website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience {index + 1}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('experience', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    value={exp.jobTitle}
                    onChange={(e) => handleArrayItemChange('experience', index, 'jobTitle', e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => handleArrayItemChange('experience', index, 'company', e.target.value)}
                    placeholder="Tech Corp Inc."
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => handleArrayItemChange('experience', index, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleArrayItemChange('experience', index, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => handleArrayItemChange('experience', index, 'current', e.target.checked)}
                      className="mr-2"
                    />
                    <Label className="text-sm">Present</Label>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Description</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateExperienceAI(index)}
                    disabled={isGenerating[`exp-${index}`]}
                    className="text-xs"
                  >
                    {isGenerating[`exp-${index}`] ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1" />
                    )}
                    Generate with AI
                  </Button>
                </div>
                <Textarea
                  value={exp.description}
                  onChange={(e) => handleArrayItemChange('experience', index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Key Roles and Responsibilities</Label>
                <Textarea
                  value={exp.keyResponsibilities || ''}
                  onChange={(e) => handleArrayItemChange('experience', index, 'keyResponsibilities', e.target.value)}
                  placeholder="List your key roles and responsibilities..."
                  rows={2}
                />
              </div>
            </div>
          ))}
          <Button
            onClick={() =>
              addArrayItem('experience', {
                id: Date.now().toString(),
                jobTitle: '',
                company: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                keyResponsibilities: ''
              })
            }
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={edu.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Education {index + 1}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('education', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Degree *</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => handleArrayItemChange('education', index, 'degree', e.target.value)}
                    placeholder="Bachelor of Science"
                  />
                </div>
                <div>
                  <Label>School/University *</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => handleArrayItemChange('education', index, 'school', e.target.value)}
                    placeholder="University of Example"
                  />
                </div>
                <div>
                  <Label>Start Year</Label>
                  <Input
                    value={edu.startYear}
                    onChange={(e) => handleArrayItemChange('education', index, 'startYear', e.target.value)}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <Label>End Year</Label>
                  <Input
                    value={edu.endYear}
                    onChange={(e) => handleArrayItemChange('education', index, 'endYear', e.target.value)}
                    placeholder="2024"
                    disabled={edu.current}
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={edu.current}
                      onChange={(e) => handleArrayItemChange('education', index, 'current', e.target.checked)}
                      className="mr-2"
                    />
                    <Label className="text-sm">Currently Studying</Label>
                  </div>
                </div>
              </div>
              
              {/* Academic Performance */}
               <div className="border-t pt-4">
                 <Label className="text-sm font-medium mb-3 block">Academic Performance (Optional)</Label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <Label className="text-xs">CGPA</Label>
                     <Input
                       value={edu.cgpa || ''}
                       onChange={(e) => handleArrayItemChange('education', index, 'cgpa', e.target.value)}
                       placeholder="3.8 / 4.0"
                       className="text-sm"
                     />
                   </div>
                   <div>
                     <Label className="text-xs">Percentage/Letter Grade</Label>
                     <div className="flex gap-2">
                       <Input
                         value={edu.percentage || ''}
                         onChange={(e) => handleArrayItemChange('education', index, 'percentage', e.target.value)}
                         placeholder="85%"
                         className="text-sm"
                       />
                       <Input
                         value={edu.letterGrade || ''}
                         onChange={(e) => handleArrayItemChange('education', index, 'letterGrade', e.target.value)}
                         placeholder="A"
                         className="text-sm w-16"
                       />
                     </div>
                   </div>
                </div>
              </div>
              
              {/* Description with AI */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Description (Optional)</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateEducationAI(index)}
                    disabled={isGenerating[`edu-${index}`]}
                    className="text-xs"
                  >
                    {isGenerating[`edu-${index}`] ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1" />
                    )}
                    Generate with AI
                  </Button>
                </div>
                <Textarea
                  value={edu.description || ''}
                  onChange={(e) => handleArrayItemChange('education', index, 'description', e.target.value)}
                  placeholder="Relevant coursework, projects, or achievements..."
                  rows={2}
                />
              </div>
            </div>
          ))}
          <Button
            onClick={() =>
              addArrayItem('education', {
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
              })
            }
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Skills
            <Button
              variant="outline"
              size="sm"
              onClick={generateSkillsAI}
              disabled={isGenerating['skills']}
              className="ml-auto text-xs"
            >
              {isGenerating['skills'] ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              Generate with AI
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {data.skills.map((skill, index) => (
              <div key={skill.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{skill.name}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Category</Label>
                    <select
                      value={skill.category}
                      onChange={(e) => handleArrayItemChange('skills', index, 'category', e.target.value)}
                      className="w-full p-1 text-sm border rounded"
                    >
                      <option value="General">General</option>
                      <option value="Technical">Technical</option>
                      <option value="Programming">Programming</option>
                      <option value="Tools">Tools</option>
                      <option value="Languages">Languages</option>
                      <option value="Soft Skills">Soft Skills</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Level</Label>
                    <select
                      value={skill.level}
                      onChange={(e) => handleArrayItemChange('skills', index, 'level', e.target.value)}
                      className="w-full p-1 text-sm border rounded"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certificates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.certificates.map((cert, index) => (
            <div key={cert.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Certificate {index + 1}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('certificates', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Certificate Name *</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => handleArrayItemChange('certificates', index, 'name', e.target.value)}
                    placeholder="AWS Certified Developer"
                  />
                </div>
                <div>
                  <Label>Issuing Organization *</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => handleArrayItemChange('certificates', index, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <Label>Issue Date</Label>
                  <Input
                    type="date"
                    value={cert.issueDate}
                    onChange={(e) => handleArrayItemChange('certificates', index, 'issueDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={cert.expiryDate || ''}
                    onChange={(e) => handleArrayItemChange('certificates', index, 'expiryDate', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Certificate URL (Optional)</Label>
                  <Input
                    type="url"
                    value={cert.url || ''}
                    onChange={(e) => handleArrayItemChange('certificates', index, 'url', e.target.value)}
                    placeholder="https://www.credly.com/badges/..."
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={() =>
              addArrayItem('certificates', {
                id: Date.now().toString(),
                name: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
                url: ''
              })
            }
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certificate
          </Button>
        </CardContent>
      </Card>

      {/* Projects & Internships */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Projects & Internships
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.projects.map((project, index) => (
            <div key={project.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Project {index + 1}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('projects', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Project Name *</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => handleArrayItemChange('projects', index, 'name', e.target.value)}
                    placeholder="E-commerce Website"
                  />
                </div>
                <div>
                  <Label>Technologies Used</Label>
                  <Input
                    value={project.technologies}
                    onChange={(e) => handleArrayItemChange('projects', index, 'technologies', e.target.value)}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={project.startDate}
                    onChange={(e) => handleArrayItemChange('projects', index, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={project.endDate}
                    onChange={(e) => handleArrayItemChange('projects', index, 'endDate', e.target.value)}
                    disabled={project.current}
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={project.current}
                      onChange={(e) => handleArrayItemChange('projects', index, 'current', e.target.checked)}
                      className="mr-2"
                    />
                    <Label className="text-sm">Currently Working</Label>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label>Project URL (Optional)</Label>
                  <Input
                    type="url"
                    value={project.url || ''}
                    onChange={(e) => handleArrayItemChange('projects', index, 'url', e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => handleArrayItemChange('projects', index, 'description', e.target.value)}
                  placeholder="Describe the project, your role, and key achievements..."
                  rows={3}
                />
              </div>
            </div>
          ))}
          <Button
            onClick={() =>
              addArrayItem('projects', {
                id: Date.now().toString(),
                name: '',
                description: '',
                technologies: '',
                url: '',
                startDate: '',
                endDate: '',
                current: false
              })
            }
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              value={data.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', '', e.target.value)}
              placeholder="Any additional information you'd like to include (awards, publications, volunteer work, etc.)..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hobbies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Hobbies & Interests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {data.hobbies.map((hobby, index) => (
              <div key={hobby.id} className="flex items-center gap-2 p-2 border rounded">
                <Input
                  value={hobby.name}
                  onChange={(e) => handleArrayItemChange('hobbies', index, 'name', e.target.value)}
                  placeholder="Photography, Reading, etc."
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeArrayItem('hobbies', index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={() =>
              addArrayItem('hobbies', {
                id: Date.now().toString(),
                name: ''
              })
            }
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Hobby
          </Button>
        </CardContent>
      </Card>

      {/* Declaration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Declaration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.declaration.enabled}
              onChange={(e) => handleInputChange('declaration', 'enabled', e.target.checked)}
              className="mr-2"
            />
            <Label>Include Declaration</Label>
          </div>
          {data.declaration.enabled && (
            <div>
              <Label>Declaration Text</Label>
              <Textarea
                value={data.declaration.text}
                onChange={(e) => handleInputChange('declaration', 'text', e.target.value)}
                placeholder="I hereby declare that the information provided above is true to the best of my knowledge."
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Signature className="w-5 h-5" />
            Signature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.signature.enabled}
              onChange={(e) => handleInputChange('signature', 'enabled', e.target.checked)}
              className="mr-2"
            />
            <Label>Include Signature Section</Label>
          </div>
          {data.signature.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Signature Name</Label>
                <Input
                  value={data.signature.name}
                  onChange={(e) => handleInputChange('signature', 'name', e.target.value)}
                  placeholder="Your Full Name"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={data.signature.date}
                  onChange={(e) => handleInputChange('signature', 'date', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Location</Label>
                <Input
                  value={data.signature.location}
                  onChange={(e) => handleInputChange('signature', 'location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Digital Signature (Optional)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          handleInputChange('signature', 'digitalSignature', event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="signature-upload"
                  />
                  <label htmlFor="signature-upload">
                    <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Signature
                      </span>
                    </Button>
                  </label>
                  {data.signature.digitalSignature && (
                    <img
                      src={data.signature.digitalSignature}
                      alt="Digital Signature"
                      className="h-12 object-contain border rounded"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Key Modal */}
      <AIKeyModal
        isOpen={showAIKeyModal}
        onClose={() => setShowAIKeyModal(false)}
        onSubmit={handleAIKeySubmit}
      />
    </div>
  );
};

export default ResumeForm;