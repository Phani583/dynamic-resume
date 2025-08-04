import React, { useState } from 'react';
import { ResumeData, CustomizationOptions } from './types';
import { SectionTemplateType, getSectionTemplate } from './SectionTemplates';

export interface SectionTemplateConfig {
  [sectionKey: string]: SectionTemplateType;
}

interface TemplateManagerProps {
  data: ResumeData;
  customization: CustomizationOptions;
  templateConfig: SectionTemplateConfig;
  onTemplateChange: (sectionKey: string, templateId: SectionTemplateType) => void;
  children: (renderSection: (sectionKey: string, sectionData: any) => React.ReactNode) => React.ReactNode;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  data,
  customization,
  templateConfig,
  onTemplateChange,
  children
}) => {
  const renderSection = (sectionKey: string, sectionData: any) => {
    const templateId = templateConfig[sectionKey];
    const template = getSectionTemplate(templateId);
    
    if (!template) {
      return null;
    }

    const TemplateComponent = template.component;
    
    return (
      <TemplateComponent
        data={sectionData}
        colors={customization.colors}
        customization={customization}
      />
    );
  };

  return (
    <>
      {children(renderSection)}
    </>
  );
};

export const useTemplateManager = (initialConfig: SectionTemplateConfig = {}) => {
  const [templateConfig, setTemplateConfig] = useState<SectionTemplateConfig>({
    experience: 'experience-card',
    education: 'education-compact',
    projects: 'projects-tags',
    skills: 'skills-grid',
    hobbies: 'hobbies-simple',
    declaration: 'declaration-simple',
    signature: 'signature-simple',
    ...initialConfig
  });

  const updateTemplate = (sectionKey: string, templateId: SectionTemplateType) => {
    setTemplateConfig(prev => ({
      ...prev,
      [sectionKey]: templateId
    }));
  };

  return {
    templateConfig,
    updateTemplate
  };
};