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
  onCompleteTemplateApply?: (templateId: SectionTemplateType) => void;
  children: (
    renderSection: (sectionKey: string, sectionData: any) => React.ReactNode,
    renderCompleteTemplate: (templateId: SectionTemplateType) => React.ReactNode
  ) => React.ReactNode;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  data,
  customization,
  templateConfig,
  onTemplateChange,
  onCompleteTemplateApply,
  children
}) => {
  const renderSection = (sectionKey: string, sectionData: any) => {
    const templateId = templateConfig[sectionKey];
    
    // If template is 'default' or not found, return null to use original layout
    if (!templateId || templateId === 'default') {
      return null;
    }
    
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

  const renderCompleteTemplate = (templateId: SectionTemplateType) => {
    // If template is 'default', don't render complete template
    if (!templateId || templateId === 'default') {
      return null;
    }
    
    const template = getSectionTemplate(templateId);
    if (!template || template.category !== 'complete') {
      return null;
    }

    const TemplateComponent = template.component;
    
    return (
      <TemplateComponent
        data={data}
        colors={customization.colors}
        customization={customization}
      />
    );
  };

  return (
    <>
      {children(renderSection, renderCompleteTemplate)}
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