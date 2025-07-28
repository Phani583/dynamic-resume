import { ResumeTheme } from './types';

export const FONT_FAMILIES = {
  professional: [
    { name: 'Lato', value: "'Lato', sans-serif" },
    { name: 'Source Sans Pro', value: "'Source Sans Pro', sans-serif" },
    { name: 'Open Sans', value: "'Open Sans', sans-serif" },
    { name: 'Roboto', value: "'Roboto', sans-serif" },
  ],
  modern: [
    { name: 'Montserrat', value: "'Montserrat', sans-serif" },
    { name: 'Raleway', value: "'Raleway', sans-serif" },
    { name: 'Poppins', value: "'Poppins', sans-serif" },
    { name: 'Inter', value: "'Inter', sans-serif" },
  ],
  creative: [
    { name: 'Pacifico', value: "'Pacifico', cursive" },
    { name: 'Indie Flower', value: "'Indie Flower', cursive" },
    { name: 'Dancing Script', value: "'Dancing Script', cursive" },
    { name: 'Comfortaa', value: "'Comfortaa', cursive" },
  ],
  elegant: [
    { name: 'Playfair Display', value: "'Playfair Display', serif" },
    { name: 'Merriweather', value: "'Merriweather', serif" },
    { name: 'Crimson Text', value: "'Crimson Text', serif" },
    { name: 'Libre Baskerville', value: "'Libre Baskerville', serif" },
  ]
};

export const SECTION_ICONS = {
  work: ['👨‍💼', '💼', '🏢', '⚡', '🚀', '💡'],
  education: ['🎓', '📚', '🏫', '📖', '🎒', '✏️'],
  skills: ['🛠️', '⚙️', '💪', '🎯', '⭐', '🔧'],
  summary: ['📝', '👤', '📄', '✨', '🎪', '📋'],
  contact: ['📞', '📧', '📍', '🌐', '📲', '💬'],
  links: ['🔗', '🌍', '📱', '💻', '🔥', '📊']
};

export const BULLET_STYLES = [
  { name: 'Checkmarks', value: '✅', symbol: '✅' },
  { name: 'Arrows', value: '▶', symbol: '▶' },
  { name: 'Dashes', value: '–', symbol: '–' },
  { name: 'Stars', value: '★', symbol: '★' },
  { name: 'Dots', value: '•', symbol: '•' },
  { name: 'Boxes', value: '■', symbol: '■' },
  { name: 'Circles', value: '●', symbol: '●' },
  { name: 'Diamonds', value: '◆', symbol: '◆' },
  { name: 'Roman I', value: 'I.', symbol: 'I.' },
  { name: 'Numbers', value: '1.', symbol: '1.' }
];

export const DIVIDER_STYLES = [
  { name: 'Simple Line', value: 'simple', component: 'border-t' },
  { name: 'Double Line', value: 'double', component: 'border-t-2 border-double' },
  { name: 'Dotted', value: 'dotted', component: 'border-t border-dotted' },
  { name: 'Dashed', value: 'dashed', component: 'border-t border-dashed' },
  { name: 'Wave', value: 'wave', component: 'wave-divider' },
  { name: 'Gradient', value: 'gradient', component: 'gradient-divider' },
  { name: 'Shadow', value: 'shadow', component: 'shadow-divider' }
];

// Professional Resume Templates (15+ distinct designs)
export const RESUME_TEMPLATES: ResumeTheme[] = [
  // Corporate & Professional Templates
  {
    id: 'executive-suite',
    name: 'Executive Suite',
    description: 'Premium design for C-level executives and senior management',
    primaryColor: '#1a365d',
    secondaryColor: '#2d3748',
    accentColor: '#e53e3e',
    fontFamily: 'Playfair Display',
    layout: 'executive',
    headerStyle: 'banner',
    sectionStyle: 'bordered',
    spacing: 'spacious',
    typography: 'elegant'
  },
  {
    id: 'corporate-classic',
    name: 'Corporate Classic',
    description: 'Traditional corporate design with modern touches',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    layout: 'traditional',
    headerStyle: 'centered',
    sectionStyle: 'standard',
    spacing: 'normal',
    typography: 'professional'
  },
  {
    id: 'business-elite',
    name: 'Business Elite',
    description: 'Sophisticated layout for business professionals',
    primaryColor: '#374151',
    secondaryColor: '#6b7280',
    accentColor: '#059669',
    fontFamily: 'Source Sans Pro',
    layout: 'two-column',
    headerStyle: 'banner',
    sectionStyle: 'filled',
    spacing: 'normal',
    typography: 'professional'
  },

  // Modern & Contemporary Templates
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'Clean and contemporary design with focus on content',
    primaryColor: '#0f172a',
    secondaryColor: '#64748b',
    accentColor: '#0ea5e9',
    fontFamily: 'Inter',
    layout: 'minimal',
    headerStyle: 'left',
    sectionStyle: 'minimal',
    spacing: 'compact',
    typography: 'minimal'
  },
  {
    id: 'tech-professional',
    name: 'Tech Professional',
    description: 'Modern tech-focused design with clean typography',
    primaryColor: '#0891b2',
    secondaryColor: '#0e7490',
    accentColor: '#f59e0b',
    fontFamily: 'Roboto',
    layout: 'sidebar',
    headerStyle: 'sidebar',
    sectionStyle: 'cards',
    spacing: 'normal',
    typography: 'modern'
  },
  {
    id: 'digital-native',
    name: 'Digital Native',
    description: 'Contemporary design for digital professionals',
    primaryColor: '#7c3aed',
    secondaryColor: '#a78bfa',
    accentColor: '#06d6a0',
    fontFamily: 'Montserrat',
    layout: 'modern',
    headerStyle: 'left',
    sectionStyle: 'cards',
    spacing: 'normal',
    typography: 'bold'
  },

  // Creative & Design Templates
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Artistic layout perfect for designers and creatives',
    primaryColor: '#dc2626',
    secondaryColor: '#f87171',
    accentColor: '#fbbf24',
    fontFamily: 'Poppins',
    layout: 'creative',
    headerStyle: 'sidebar',
    sectionStyle: 'cards',
    spacing: 'spacious',
    typography: 'modern'
  },
  {
    id: 'artistic-flair',
    name: 'Artistic Flair',
    description: 'Bold creative design with unique visual elements',
    primaryColor: '#7c2d12',
    secondaryColor: '#ea580c',
    accentColor: '#8b5cf6',
    fontFamily: 'Comfortaa',
    layout: 'creative',
    headerStyle: 'centered',
    sectionStyle: 'filled',
    spacing: 'normal',
    typography: 'bold'
  },
  {
    id: 'designer-showcase',
    name: 'Designer Showcase',
    description: 'Innovative layout to showcase creative work',
    primaryColor: '#be185d',
    secondaryColor: '#ec4899',
    accentColor: '#06b6d4',
    fontFamily: 'Raleway',
    layout: 'sidebar',
    headerStyle: 'banner',
    sectionStyle: 'bordered',
    spacing: 'spacious',
    typography: 'modern'
  },

  // Academic & Research Templates
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Scholarly design perfect for academics and researchers',
    primaryColor: '#1e3a8a',
    secondaryColor: '#3730a3',
    accentColor: '#059669',
    fontFamily: 'Crimson Text',
    layout: 'academic',
    headerStyle: 'centered',
    sectionStyle: 'standard',
    spacing: 'spacious',
    typography: 'elegant'
  },
  {
    id: 'scientific-journal',
    name: 'Scientific Journal',
    description: 'Professional academic layout with clear hierarchy',
    primaryColor: '#134e4a',
    secondaryColor: '#0f766e',
    accentColor: '#0891b2',
    fontFamily: 'Libre Baskerville',
    layout: 'traditional',
    headerStyle: 'centered',
    sectionStyle: 'minimal',
    spacing: 'normal',
    typography: 'elegant'
  },

  // Industry-Specific Templates
  {
    id: 'healthcare-professional',
    name: 'Healthcare Professional',
    description: 'Clean, trustworthy design for medical professionals',
    primaryColor: '#065f46',
    secondaryColor: '#047857',
    accentColor: '#0ea5e9',
    fontFamily: 'Source Sans Pro',
    layout: 'two-column',
    headerStyle: 'left',
    sectionStyle: 'standard',
    spacing: 'normal',
    typography: 'professional'
  },
  {
    id: 'finance-expert',
    name: 'Finance Expert',
    description: 'Conservative design perfect for financial professionals',
    primaryColor: '#1f2937',
    secondaryColor: '#4b5563',
    accentColor: '#dc2626',
    fontFamily: 'Lato',
    layout: 'executive',
    headerStyle: 'banner',
    sectionStyle: 'bordered',
    spacing: 'compact',
    typography: 'professional'
  },
  {
    id: 'consulting-pro',
    name: 'Consulting Pro',
    description: 'Professional consulting industry standard design',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    layout: 'traditional',
    headerStyle: 'banner',
    sectionStyle: 'filled',
    spacing: 'normal',
    typography: 'professional'
  },

  // Startup & Entrepreneurial Templates
  {
    id: 'startup-founder',
    name: 'Startup Founder',
    description: 'Dynamic design for entrepreneurs and startup leaders',
    primaryColor: '#7c2d12',
    secondaryColor: '#ea580c',
    accentColor: '#10b981',
    fontFamily: 'Montserrat',
    layout: 'modern',
    headerStyle: 'left',
    sectionStyle: 'cards',
    spacing: 'normal',
    typography: 'bold'
  },
  {
    id: 'innovation-leader',
    name: 'Innovation Leader',
    description: 'Forward-thinking design for innovation professionals',
    primaryColor: '#581c87',
    secondaryColor: '#8b5cf6',
    accentColor: '#06d6a0',
    fontFamily: 'Poppins',
    layout: 'creative',
    headerStyle: 'sidebar',
    sectionStyle: 'filled',
    spacing: 'spacious',
    typography: 'modern'
  }
];

// Refined Resume Themes (Distinct and differentiated)
export const RESUME_THEMES: ResumeTheme[] = [
  {
    id: 'professional-standard',
    name: 'Professional Standard',
    description: 'Classic business layout with traditional formatting',
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#3b82f6',
    fontFamily: 'Inter',
    layout: 'traditional',
    headerStyle: 'centered',
    sectionStyle: 'standard',
    spacing: 'normal',
    typography: 'professional'
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'Sophisticated design for senior leadership positions',
    primaryColor: '#1a365d',
    secondaryColor: '#2d3748',
    accentColor: '#e53e3e',
    fontFamily: 'Playfair Display',
    layout: 'executive',
    headerStyle: 'banner',
    sectionStyle: 'bordered',
    spacing: 'spacious',
    typography: 'elegant'
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Contemporary design optimized for technology roles',
    primaryColor: '#0891b2',
    secondaryColor: '#0e7490',
    accentColor: '#f59e0b',
    fontFamily: 'Roboto',
    layout: 'sidebar',
    headerStyle: 'sidebar',
    sectionStyle: 'cards',
    spacing: 'normal',
    typography: 'modern'
  },
  {
    id: 'creative-bold',
    name: 'Creative Bold',
    description: 'Vibrant layout perfect for creative professionals',
    primaryColor: '#dc2626',
    secondaryColor: '#f87171',
    accentColor: '#fbbf24',
    fontFamily: 'Poppins',
    layout: 'creative',
    headerStyle: 'sidebar',
    sectionStyle: 'filled',
    spacing: 'normal',
    typography: 'bold'
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    description: 'Clean design focusing on content clarity',
    primaryColor: '#374151',
    secondaryColor: '#9ca3af',
    accentColor: '#10b981',
    fontFamily: 'Source Sans Pro',
    layout: 'minimal',
    headerStyle: 'left',
    sectionStyle: 'minimal',
    spacing: 'compact',
    typography: 'minimal'
  },
  {
    id: 'academic-formal',
    name: 'Academic Formal',
    description: 'Scholarly design for academic and research positions',
    primaryColor: '#1e3a8a',
    secondaryColor: '#3730a3',
    accentColor: '#059669',
    fontFamily: 'Crimson Text',
    layout: 'academic',
    headerStyle: 'centered',
    sectionStyle: 'standard',
    spacing: 'spacious',
    typography: 'elegant'
  }
];

export const LAYOUT_OPTIONS = [
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Classic single-column layout with header',
    preview: 'Header | Content'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with dynamic sections',
    preview: 'Header | Dynamic Content'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic layout with unique positioning',
    preview: 'Creative | Layout'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design',
    preview: 'Name | Simple Content'
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    description: 'Two-column with sidebar for personal info',
    preview: 'Sidebar | Main Content'
  },
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Balanced two-column layout',
    preview: 'Left Col | Right Col'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional layout for senior positions',
    preview: 'Executive | Header Style'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Structured layout for academic professionals',
    preview: 'Academic | Structure'
  }
];