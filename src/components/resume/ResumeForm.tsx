import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Award
} from 'lucide-react';
import { ResumeData } from './types';

interface ResumeFormProps {
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onDataChange }) => {
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (section: keyof ResumeData, field: string, value: any) => {
    onDataChange({
      ...data,
      [section]: {
        ...data[section],
        [field]: value
      }
    });
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
      onDataChange({
        ...data,
        skills: [...data.skills, newSkill.trim()]
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
                    <Label className="text-sm">Current Position</Label>
                  </div>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => handleArrayItemChange('experience', index, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
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
                description: ''
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
                current: false
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
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-2">
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeForm;