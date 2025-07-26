import React, { useState, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
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
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Palette,
  FileText,
  Star,
  Layout,
  Settings,
  Circle
} from 'lucide-react';

// Types
interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    profileImage?: string;
    summary: string;
  };
  publicLinks: {
    github: string;
    linkedin: string;
    portfolio: string;
    website: string;
  };
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    startYear: string;
    endYear: string;
    current: boolean;
  }>;
  skills: string[];
}

interface ResumeTheme {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  layout: 'traditional' | 'modern' | 'creative' | 'minimal' | 'sidebar' | 'two-column' | 'executive' | 'academic';
  headerStyle: 'centered' | 'left' | 'right' | 'banner' | 'sidebar';
  sectionStyle: 'standard' | 'bordered' | 'filled' | 'minimal' | 'cards';
  spacing: 'compact' | 'normal' | 'spacious';
  typography: 'professional' | 'modern' | 'elegant' | 'bold' | 'minimal';
}

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

// Resume Themes
const resumeThemes: ResumeTheme[] = [
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional layout with elegant typography',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#1e40af',
    fontFamily: 'font-inter',
    layout: 'traditional',
    headerStyle: 'centered',
    sectionStyle: 'standard',
    spacing: 'normal',
    typography: 'professional'
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean design with lots of white space',
    primaryColor: '#0f172a',
    secondaryColor: '#64748b',
    accentColor: '#334155',
    fontFamily: 'font-source',
    layout: 'minimal',
    headerStyle: 'left',
    sectionStyle: 'minimal',
    spacing: 'spacious',
    typography: 'minimal'
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Vibrant colors and dynamic layout',
    primaryColor: '#7c3aed',
    secondaryColor: '#ec4899',
    accentColor: '#8b5cf6',
    fontFamily: 'font-open',
    layout: 'creative',
    headerStyle: 'banner',
    sectionStyle: 'filled',
    spacing: 'normal',
    typography: 'bold'
  },
  {
    id: 'executive-dark',
    name: 'Executive',
    description: 'Sophisticated dark accents for leadership roles',
    primaryColor: '#1f2937',
    secondaryColor: '#6b7280',
    accentColor: '#374151',
    fontFamily: 'font-playfair',
    layout: 'executive',
    headerStyle: 'centered',
    sectionStyle: 'bordered',
    spacing: 'normal',
    typography: 'elegant'
  },
  {
    id: 'tech-focus',
    name: 'Tech Focus',
    description: 'Modern design perfect for developers',
    primaryColor: '#0d9488',
    secondaryColor: '#2563eb',
    accentColor: '#14b8a6',
    fontFamily: 'font-roboto',
    layout: 'modern',
    headerStyle: 'left',
    sectionStyle: 'bordered',
    spacing: 'normal',
    typography: 'modern'
  },
  {
    id: 'academic-scholar',
    name: 'Academic Scholar',
    description: 'Education-focused with clean sections',
    primaryColor: '#4f46e5',
    secondaryColor: '#6b7280',
    accentColor: '#6366f1',
    fontFamily: 'font-source',
    layout: 'academic',
    headerStyle: 'centered',
    sectionStyle: 'standard',
    spacing: 'spacious',
    typography: 'professional'
  },
  {
    id: 'startup-style',
    name: 'Startup Style',
    description: 'Trendy and innovative design',
    primaryColor: '#f97316',
    secondaryColor: '#dc2626',
    accentColor: '#ea580c',
    fontFamily: 'font-inter',
    layout: 'creative',
    headerStyle: 'banner',
    sectionStyle: 'cards',
    spacing: 'compact',
    typography: 'bold'
  },
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Business-oriented professional layout',
    primaryColor: '#2563eb',
    secondaryColor: '#3b82f6',
    accentColor: '#1d4ed8',
    fontFamily: 'font-inter',
    layout: 'traditional',
    headerStyle: 'centered',
    sectionStyle: 'bordered',
    spacing: 'normal',
    typography: 'professional'
  },
  {
    id: 'designer-portfolio',
    name: 'Designer Portfolio',
    description: 'Creative layout showcasing design skills',
    primaryColor: '#ec4899',
    secondaryColor: '#7c3aed',
    accentColor: '#db2777',
    fontFamily: 'font-playfair',
    layout: 'sidebar',
    headerStyle: 'sidebar',
    sectionStyle: 'filled',
    spacing: 'normal',
    typography: 'elegant'
  },
  {
    id: 'developer-focus',
    name: 'Developer Focus',
    description: 'Code-oriented with technical emphasis',
    primaryColor: '#16a34a',
    secondaryColor: '#6b7280',
    accentColor: '#15803d',
    fontFamily: 'font-roboto',
    layout: 'two-column',
    headerStyle: 'left',
    sectionStyle: 'minimal',
    spacing: 'compact',
    typography: 'modern'
  },
  {
    id: 'sales-professional',
    name: 'Sales Professional',
    description: 'Results-focused design',
    primaryColor: '#dc2626',
    secondaryColor: '#f97316',
    accentColor: '#b91c1c',
    fontFamily: 'font-open',
    layout: 'modern',
    headerStyle: 'banner',
    sectionStyle: 'bordered',
    spacing: 'normal',
    typography: 'bold'
  },
  {
    id: 'healthcare-pro',
    name: 'Healthcare Professional',
    description: 'Clean, trustworthy medical field design',
    primaryColor: '#0d9488',
    secondaryColor: '#10b981',
    accentColor: '#059669',
    fontFamily: 'font-source',
    layout: 'traditional',
    headerStyle: 'centered',
    sectionStyle: 'standard',
    spacing: 'spacious',
    typography: 'professional'
  },
  {
    id: 'education-sector',
    name: 'Education Sector',
    description: 'Teaching-focused professional layout',
    primaryColor: '#4f46e5',
    secondaryColor: '#2563eb',
    accentColor: '#4338ca',
    fontFamily: 'font-inter',
    layout: 'academic',
    headerStyle: 'centered',
    sectionStyle: 'standard',
    spacing: 'normal',
    typography: 'professional'
  },
  {
    id: 'finance-professional',
    name: 'Finance Professional',
    description: 'Conservative and trustworthy design',
    primaryColor: '#374151',
    secondaryColor: '#2563eb',
    accentColor: '#1f2937',
    fontFamily: 'font-playfair',
    layout: 'executive',
    headerStyle: 'centered',
    sectionStyle: 'bordered',
    spacing: 'normal',
    typography: 'elegant'
  },
  {
    id: 'creative-arts',
    name: 'Creative Arts',
    description: 'Artistic layout for creative professionals',
    primaryColor: '#7c3aed',
    secondaryColor: '#ec4899',
    accentColor: '#6d28d9',
    fontFamily: 'font-playfair',
    layout: 'creative',
    headerStyle: 'banner',
    sectionStyle: 'filled',
    spacing: 'spacious',
    typography: 'elegant'
  },
  {
    id: 'consultant-expert',
    name: 'Consultant Expert',
    description: 'Professional consulting layout',
    primaryColor: '#2563eb',
    secondaryColor: '#0d9488',
    accentColor: '#1d4ed8',
    fontFamily: 'font-inter',
    layout: 'sidebar',
    headerStyle: 'sidebar',
    sectionStyle: 'bordered',
    spacing: 'normal',
    typography: 'professional'
  }
];

const Index = () => {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [selectedTheme, setSelectedTheme] = useState<string>('classic-professional');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [customColors, setCustomColors] = useState<CustomColors>({
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#1e40af',
    text: '#111827',
    background: '#ffffff'
  });
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<string>('traditional');

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    publicLinks: {
      github: '',
      linkedin: '',
      portfolio: '',
      website: ''
    },
    experience: [],
    education: [],
    skills: []
  });

  // Get current theme
  const currentTheme = resumeThemes.find(theme => theme.id === selectedTheme) || resumeThemes[0];
  
  // Apply custom colors if enabled
  const appliedTheme = useCustomColors ? {
    ...currentTheme,
    primaryColor: customColors.primary,
    secondaryColor: customColors.secondary,
    accentColor: customColors.accent
  } : currentTheme;

  // Handlers
  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updatePublicLinks = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      publicLinks: {
        ...prev.publicLinks,
        [field]: value
      }
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      startYear: '',
      endYear: '',
      current: false
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id: string, field: string, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updatePersonalInfo('profileImage', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${resumeData.personalInfo.fullName || 'Resume'}_Resume`,
    onAfterPrint: () => {
      setIsGeneratingPDF(false);
      toast({
        title: "Resume Downloaded!",
        description: "Your resume has been successfully generated and downloaded.",
      });
    }
  });

  const triggerPrint = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Validation
  const isValidForDownload = () => {
    return (
      resumeData.personalInfo.fullName.trim() &&
      resumeData.personalInfo.email.trim() &&
      (resumeData.experience.length > 0 || resumeData.education.length > 0)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
                <p className="text-sm text-muted-foreground">Create professional resumes in minutes</p>
              </div>
            </div>
            <Button 
              onClick={triggerPrint}
              disabled={!isValidForDownload() || isGeneratingPDF}
              className="gap-2"
            >
              {isGeneratingPDF ? (
                <>Generating...</>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Form */}
          <div className="lg:col-span-5 space-y-6">
            {/* Theme Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Design & Theme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Resume Theme</Label>
                  <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {resumeThemes.map(theme => (
                        <SelectItem key={theme.id} value={theme.id}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full border-2"
                              style={{ backgroundColor: theme.primaryColor, borderColor: theme.secondaryColor }}
                            />
                            <div>
                              <div className="font-medium">{theme.name}</div>
                              <div className="text-xs text-muted-foreground">{theme.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Layout Options */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Layout Style</Label>
                  <Select value={selectedLayout} onValueChange={setSelectedLayout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="two-column">Two Column</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Color Customization */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Custom Colors</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="useCustomColors"
                        checked={useCustomColors}
                        onChange={(e) => setUseCustomColors(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="useCustomColors" className="text-sm">Enable</Label>
                    </div>
                  </div>
                  
                  {useCustomColors && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Primary</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customColors.primary}
                            onChange={(e) => setCustomColors(prev => ({...prev, primary: e.target.value}))}
                            className="w-8 h-8 rounded border"
                          />
                          <Input
                            value={customColors.primary}
                            onChange={(e) => setCustomColors(prev => ({...prev, primary: e.target.value}))}
                            className="text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Secondary</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customColors.secondary}
                            onChange={(e) => setCustomColors(prev => ({...prev, secondary: e.target.value}))}
                            className="w-8 h-8 rounded border"
                          />
                          <Input
                            value={customColors.secondary}
                            onChange={(e) => setCustomColors(prev => ({...prev, secondary: e.target.value}))}
                            className="text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Accent</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customColors.accent}
                            onChange={(e) => setCustomColors(prev => ({...prev, accent: e.target.value}))}
                            className="w-8 h-8 rounded border"
                          />
                          <Input
                            value={customColors.accent}
                            onChange={(e) => setCustomColors(prev => ({...prev, accent: e.target.value}))}
                            className="text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Text</Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customColors.text}
                            onChange={(e) => setCustomColors(prev => ({...prev, text: e.target.value}))}
                            className="w-8 h-8 rounded border"
                          />
                          <Input
                            value={customColors.text}
                            onChange={(e) => setCustomColors(prev => ({...prev, text: e.target.value}))}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {resumeData.personalInfo.profileImage ? (
                        <img 
                          src={resumeData.personalInfo.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 p-1 h-8 w-8"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="New York, NY"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      placeholder="Brief overview of your professional background and key achievements..."
                      rows={4}
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Public Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Public Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/username"
                    value={resumeData.publicLinks.github}
                    onChange={(e) => updatePublicLinks('github', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={resumeData.publicLinks.linkedin}
                    onChange={(e) => updatePublicLinks('linkedin', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio</Label>
                  <Input
                    id="portfolio"
                    placeholder="https://yourportfolio.com"
                    value={resumeData.publicLinks.portfolio}
                    onChange={(e) => updatePublicLinks('portfolio', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={resumeData.publicLinks.website}
                    onChange={(e) => updatePublicLinks('website', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Work Experience
                  </CardTitle>
                  <Button size="sm" onClick={addExperience} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Experience #{index + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          placeholder="Software Engineer"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          placeholder="Tech Company Inc."
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            disabled={exp.current}
                            value={exp.current ? '' : exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {resumeData.experience.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No work experience added yet</p>
                    <Button size="sm" onClick={addExperience} className="mt-2">
                      Add your first experience
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                  <Button size="sm" onClick={addEducation} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="border border-border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Education #{index + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          placeholder="Bachelor of Science in Computer Science"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>School/University</Label>
                        <Input
                          placeholder="University of Technology"
                          value={edu.school}
                          onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Year</Label>
                          <Input
                            type="number"
                            placeholder="2020"
                            value={edu.startYear}
                            onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>End Year</Label>
                          <Input
                            type="number"
                            placeholder="2024"
                            disabled={edu.current}
                            value={edu.current ? '' : edu.endYear}
                            onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`current-edu-${edu.id}`}
                          checked={edu.current}
                          onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`current-edu-${edu.id}`}>Currently studying</Label>
                      </div>
                    </div>
                  </div>
                ))}
                {resumeData.education.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No education added yet</p>
                    <Button size="sm" onClick={addEducation} className="mt-2">
                      Add your education
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} disabled={!newSkill.trim()}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                {resumeData.skills.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No skills added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-7">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Live Preview - {currentTheme.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="border border-border rounded-lg p-8 shadow-medium overflow-hidden"
                  style={{ backgroundColor: useCustomColors ? customColors.background : '#ffffff' }}
                >
                  <div ref={printRef}>
                    <ResumePreview 
                      data={resumeData} 
                      theme={appliedTheme} 
                      layout={selectedLayout}
                      customColors={useCustomColors ? customColors : undefined}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Resume Preview Component
const ResumePreview: React.FC<{ 
  data: ResumeData; 
  theme: ResumeTheme; 
  layout?: string;
  customColors?: CustomColors;
}> = ({ data, theme, layout = 'traditional', customColors }) => {
  const getSpacing = (spacing: string) => {
    switch (spacing) {
      case 'compact': return { section: 'mb-4', title: 'mb-2', content: 'mb-2' };
      case 'spacious': return { section: 'mb-8', title: 'mb-4', content: 'mb-4' };
      default: return { section: 'mb-6', title: 'mb-3', content: 'mb-3' };
    }
  };

  const spacing = getSpacing(theme.spacing);
  
  const getTypographyClasses = (typography: string) => {
    switch (typography) {
      case 'modern': return { name: 'text-3xl font-light', section: 'text-lg font-medium', body: 'text-sm font-light' };
      case 'elegant': return { name: 'text-3xl font-serif', section: 'text-lg font-serif', body: 'text-sm' };
      case 'bold': return { name: 'text-3xl font-black', section: 'text-lg font-bold', body: 'text-sm font-medium' };
      case 'minimal': return { name: 'text-2xl font-thin', section: 'text-base font-normal', body: 'text-xs' };
      default: return { name: 'text-3xl font-bold', section: 'text-lg font-semibold', body: 'text-sm' };
    }
  };

  const typography = getTypographyClasses(theme.typography);

  const colors = customColors || {
    primary: theme.primaryColor,
    secondary: theme.secondaryColor,
    accent: theme.accentColor,
    text: '#111827',
    background: '#ffffff'
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const renderLayout = () => {
    const layoutStyle = layout || theme.layout;
    
    switch (layoutStyle) {
      case 'sidebar':
        return renderSidebarLayout();
      case 'two-column':
        return renderTwoColumnLayout();
      case 'creative':
        return renderCreativeLayout();
      case 'minimal':
        return renderMinimalLayout();
      case 'executive':
        return renderExecutiveLayout();
      case 'academic':
        return renderAcademicLayout();
      default:
        return renderTraditionalLayout();
    }
  };

  const renderTraditionalLayout = () => (
    <div className={`${theme.fontFamily} text-gray-900`} style={{ color: colors.text }}>
      {/* Header */}
      <div className="text-center mb-8">
        {data.personalInfo.profileImage && (
          <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
            <img 
              src={data.personalInfo.profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className={`${typography.name} mb-2`} style={{ color: colors.primary }}>
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm" style={{ color: colors.secondary }}>
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {data.personalInfo.location}
            </div>
          )}
        </div>
        
        {/* Public Links */}
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm" style={{ color: colors.secondary }}>
          {data.publicLinks.github && (
            <div className="flex items-center gap-1">
              <Github className="h-4 w-4" />
              <span className="truncate max-w-32">{data.publicLinks.github.replace('https://', '')}</span>
            </div>
          )}
          {data.publicLinks.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              <span className="truncate max-w-32">{data.publicLinks.linkedin.replace('https://', '')}</span>
            </div>
          )}
          {data.publicLinks.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="truncate max-w-32">{data.publicLinks.portfolio.replace('https://', '')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className={spacing.section}>
          <h2 className={`${typography.section} border-b pb-1 ${spacing.title}`} style={{ color: colors.primary, borderColor: colors.primary }}>
            Professional Summary
          </h2>
          <p className={`${typography.body} leading-relaxed`} style={{ color: colors.text }}>
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className={spacing.section}>
          <h2 className={`${typography.section} border-b pb-1 ${spacing.title}`} style={{ color: colors.primary, borderColor: colors.primary }}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold" style={{ color: colors.text }}>{exp.jobTitle}</h3>
                    <p className="font-medium" style={{ color: colors.secondary }}>{exp.company}</p>
                  </div>
                  <div className="text-sm flex items-center gap-1" style={{ color: colors.secondary }}>
                    <Calendar className="h-3 w-3" />
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className={`${typography.body} leading-relaxed`} style={{ color: colors.text }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className={spacing.section}>
          <h2 className={`${typography.section} border-b pb-1 ${spacing.title}`} style={{ color: colors.primary, borderColor: colors.primary }}>
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold" style={{ color: colors.text }}>{edu.degree}</h3>
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

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className={spacing.section}>
          <h2 className={`${typography.section} border-b pb-1 ${spacing.title}`} style={{ color: colors.primary, borderColor: colors.primary }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${colors.primary}15`, 
                  color: colors.primary 
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSidebarLayout = () => (
    <div className={`${theme.fontFamily} grid grid-cols-3 gap-6 min-h-full`}>
      {/* Sidebar */}
      <div className="p-6 space-y-6 rounded-lg" style={{ backgroundColor: `${colors.primary}08` }}>
        {/* Profile */}
        <div className="text-center">
          {data.personalInfo.profileImage && (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
              <img 
                src={data.personalInfo.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className={`text-xl font-bold mb-2`} style={{ color: colors.primary }}>
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3" style={{ color: colors.primary }}>Contact</h3>
          <div className="space-y-2 text-sm">
            {data.personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span className="break-all">{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Links */}
        {(data.publicLinks.github || data.publicLinks.linkedin || data.publicLinks.portfolio) && (
          <div>
            <h3 className="font-semibold mb-3" style={{ color: colors.primary }}>Links</h3>
            <div className="space-y-2 text-sm">
              {data.publicLinks.github && (
                <div className="flex items-center gap-2">
                  <Github className="h-3 w-3" />
                  <span className="break-all text-xs">{data.publicLinks.github.replace('https://', '')}</span>
                </div>
              )}
              {data.publicLinks.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-3 w-3" />
                  <span className="break-all text-xs">{data.publicLinks.linkedin.replace('https://', '')}</span>
                </div>
              )}
              {data.publicLinks.portfolio && (
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <span className="break-all text-xs">{data.publicLinks.portfolio.replace('https://', '')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3" style={{ color: colors.primary }}>Skills</h3>
            <div className="space-y-1">
              {data.skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="text-sm px-2 py-1 rounded"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="col-span-2 space-y-6">
        {/* Summary */}
        {data.personalInfo.summary && (
          <div>
            <h2 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>Summary</h2>
            <p className="leading-relaxed text-sm" style={{ color: colors.text }}>
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>Experience</h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold" style={{ color: colors.text }}>{exp.jobTitle}</h3>
                      <p className="font-medium" style={{ color: colors.secondary }}>{exp.company}</p>
                    </div>
                    <div className="text-sm flex items-center gap-1" style={{ color: colors.secondary }}>
                      <Calendar className="h-3 w-3" />
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>Education</h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold" style={{ color: colors.text }}>{edu.degree}</h3>
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
  );

  // Placeholder for other layouts - implement similar patterns
  const renderTwoColumnLayout = () => renderTraditionalLayout();
  const renderCreativeLayout = () => renderTraditionalLayout();
  const renderMinimalLayout = () => renderTraditionalLayout();
  const renderExecutiveLayout = () => renderTraditionalLayout();
  const renderAcademicLayout = () => renderTraditionalLayout();

  return (
    <div className="w-full h-full min-h-[800px] text-gray-900">
      {renderLayout()}
    </div>
  );
};

export default Index;