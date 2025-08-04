import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/resume/Navigation';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import CustomizationPanel from '@/components/resume/CustomizationPanel';
import { ResumeData, CustomizationOptions, ResumeTheme } from '@/components/resume/types';
import { RESUME_THEMES } from '@/components/resume/constants';
import { exportToDocx } from '@/lib/docxExporter';
import { useTemplateManager } from '@/components/resume/TemplateManager';

const Index = () => {
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  // Default resume data
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
    skills: [],
    certificates: [],
    projects: [],
    additionalInfo: '',
    hobbies: [],
    declaration: {
      enabled: false,
      text: 'I hereby declare that the information provided above is true to the best of my knowledge.'
    },
    signature: {
      enabled: false,
      name: '',
      date: '',
      location: ''
    }
  });

  // Current theme
  const [currentTheme, setCurrentTheme] = useState<ResumeTheme>(RESUME_THEMES[0]);

  // Customization options
  const [customization, setCustomization] = useState<CustomizationOptions>({
    sections: {
      summary: {
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 'normal',
        color: '#374151',
        icon: '📝',
        bulletStyle: '•',
        dividerStyle: 'simple'
      },
      experience: {
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 'normal',
        color: '#374151',
        icon: '💼',
        bulletStyle: '•',
        dividerStyle: 'simple'
      },
      education: {
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 'normal',
        color: '#374151',
        icon: '🎓',
        bulletStyle: '•',
        dividerStyle: 'simple'
      },
      skills: {
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 'normal',
        color: '#374151',
        icon: '🛠️',
        bulletStyle: '•',
        dividerStyle: 'simple'
      },
      contact: {
        fontFamily: 'Inter',
        fontSize: '14px',
        fontWeight: 'normal',
        color: '#374151',
        icon: '📞',
        bulletStyle: '•',
        dividerStyle: 'simple'
      }
    },
    layout: 'traditional',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#3b82f6',
      text: '#374151',
      background: '#ffffff'
    },
    spacing: 'normal',
    typography: 'professional',
    bulletStyles: {},
    dividerStyles: {}
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { templateConfig, updateTemplate } = useTemplateManager();

  // Update customization when theme changes
  useEffect(() => {
    setCustomization(prev => ({
      ...prev,
      colors: {
        primary: currentTheme.primaryColor,
        secondary: currentTheme.secondaryColor,
        accent: currentTheme.accentColor,
        text: '#374151',
        background: '#ffffff'
      },
      layout: currentTheme.layout,
      spacing: currentTheme.spacing,
      typography: currentTheme.typography
    }));
  }, [currentTheme]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    localStorage.setItem('resumeCustomization', JSON.stringify(customization));
    localStorage.setItem('currentTheme', JSON.stringify(currentTheme));
  }, [resumeData, customization, currentTheme]);

  // Load from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    const savedCustomization = localStorage.getItem('resumeCustomization');
    const savedTheme = localStorage.getItem('currentTheme');

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure all required arrays are initialized
        const validatedData = {
          ...parsedData,
          experience: parsedData.experience || [],
          education: parsedData.education || [],
          skills: parsedData.skills || [],
          certificates: parsedData.certificates || [],
          projects: parsedData.projects || [],
          hobbies: parsedData.hobbies || [],
          declaration: parsedData.declaration || {
            enabled: false,
            text: 'I hereby declare that the information provided above is true to the best of my knowledge.'
          },
          signature: parsedData.signature || {
            enabled: false,
            name: '',
            date: '',
            location: ''
          }
        };
        setResumeData(validatedData);
      } catch (error) {
        console.error('Error parsing saved resume data:', error);
        // Reset to default if corrupted
      }
    }
    if (savedCustomization) {
      try {
        setCustomization(JSON.parse(savedCustomization));
      } catch (error) {
        console.error('Error parsing saved customization:', error);
      }
    }
    if (savedTheme) {
      try {
        setCurrentTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Error parsing saved theme:', error);
      }
    }
  }, []);

  // Auto-layout adjustment based on content
  useEffect(() => {
    const adjustLayout = () => {
      const hasLongExperience = resumeData.experience.some(exp => 
        exp.description && exp.description.length > 200
      );
      const hasMultipleEducation = resumeData.education.length > 2;
      const hasManySkills = resumeData.skills.length > 10;

      if ((hasLongExperience || hasMultipleEducation || hasManySkills) && 
          customization.layout === 'traditional') {
        setCustomization(prev => ({
          ...prev,
          layout: 'two-column',
          spacing: 'compact'
        }));
      }
    };

    adjustLayout();
  }, [resumeData, customization.layout]);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `${resumeData.personalInfo.fullName}_Resume`,
    onAfterPrint: () => {
      setIsDownloading(false);
      toast({
        title: "Success!",
        description: "Your resume has been downloaded successfully.",
      });
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `,
  });

  const triggerDownload = useCallback(() => {
    if (!resumeData.personalInfo.fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name before downloading.",
        variant: "destructive",
      });
      return;
    }

    if (!resumeData.personalInfo.email.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter your email address before downloading.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);
    handlePrint();
  }, [resumeData.personalInfo.fullName, resumeData.personalInfo.email, handlePrint, toast]);

  const triggerDownloadDocx = useCallback(async () => {
    if (!resumeData.personalInfo.fullName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name before downloading.",
        variant: "destructive",
      });
      return;
    }

    if (!resumeData.personalInfo.email.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter your email address before downloading.",
        variant: "destructive",
      });
      return;
    }

    try {
      const filename = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.rtf`;
      await exportToDocx(resumeData, customization, currentTheme, filename);
      
      toast({
        title: "Success",
        description: "Resume downloaded as RTF (compatible with Word) successfully!",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate Word document. Please try again.",
        variant: "destructive",
      });
    }
  }, [resumeData, customization, currentTheme, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        onDownload={triggerDownload}
        onDownloadDocx={triggerDownloadDocx}
        isDownloading={isDownloading}
        isEditMode={isEditMode}
        onEditModeToggle={() => setIsEditMode(!isEditMode)}
      />

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <ResumeForm 
              data={resumeData}
              onDataChange={setResumeData}
            />
          </div>

          {/* Customization Panel */}
          <div className="lg:col-span-1">
            <CustomizationPanel
              customization={customization}
              onCustomizationChange={setCustomization}
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
            />
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-2 bg-card rounded-lg border shadow-sm overflow-hidden">
            <div className="h-full overflow-y-auto" ref={contentRef}>
              <ResumePreview
                data={resumeData}
                customization={customization}
                theme={currentTheme}
                isEditMode={isEditMode}
                onDataChange={setResumeData}
                templateConfig={templateConfig}
                onTemplateChange={updateTemplate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;