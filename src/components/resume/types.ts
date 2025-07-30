export interface ResumeData {
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
    cgpa?: string;
    cgpaScale?: string;
    percentage?: string;
    letterGrade?: string;
    description?: string;
  }>;
  skills: string[];
}

export interface SectionCustomization {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
  icon?: string;
  bulletStyle?: string;
  dividerStyle?: string;
}

export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface ResumeTheme {
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

export interface CustomizationOptions {
  sections: {
    [key: string]: SectionCustomization;
  };
  layout: string;
  colors: CustomColors;
  spacing: 'compact' | 'normal' | 'spacious';
  typography: 'professional' | 'modern' | 'elegant' | 'bold' | 'minimal';
  bulletStyles: {
    [key: string]: string;
  };
  dividerStyles: {
    [key: string]: string;
  };
}