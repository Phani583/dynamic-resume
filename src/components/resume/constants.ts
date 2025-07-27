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

export const RESUME_THEMES: ResumeTheme[] = [
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional layout with elegant typography',
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
    id: 'modern-executive',
    name: 'Modern Executive',
    description: 'Bold and contemporary design for leadership roles',
    primaryColor: '#1f2937',
    secondaryColor: '#6b7280',
    accentColor: '#ef4444',
    fontFamily: 'Montserrat',
    layout: 'modern',
    headerStyle: 'banner',
    sectionStyle: 'bordered',
    spacing: 'spacious',
    typography: 'bold'
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Innovative layout perfect for creative professionals',
    primaryColor: '#7c3aed',
    secondaryColor: '#a78bfa',
    accentColor: '#fbbf24',
    fontFamily: 'Poppins',
    layout: 'creative',
    headerStyle: 'sidebar',
    sectionStyle: 'cards',
    spacing: 'normal',
    typography: 'modern'
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Clean and minimalist design focusing on content',
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
    id: 'academic-scholar',
    name: 'Academic Scholar',
    description: 'Perfect for academic and research positions',
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
    id: 'tech-innovator',
    name: 'Tech Innovator',
    description: 'Modern tech-focused design with clean lines',
    primaryColor: '#0891b2',
    secondaryColor: '#0e7490',
    accentColor: '#f59e0b',
    fontFamily: 'Inter',
    layout: 'sidebar',
    headerStyle: 'sidebar',
    sectionStyle: 'filled',
    spacing: 'normal',
    typography: 'modern'
  },
  {
    id: 'corporate-elite',
    name: 'Corporate Elite',
    description: 'Sophisticated design for corporate environments',
    primaryColor: '#1f2937',
    secondaryColor: '#4b5563',
    accentColor: '#dc2626',
    fontFamily: 'Lato',
    layout: 'executive',
    headerStyle: 'banner',
    sectionStyle: 'bordered',
    spacing: 'spacious',
    typography: 'professional'
  },
  {
    id: 'startup-hustle',
    name: 'Startup Hustle',
    description: 'Dynamic design for startup environments',
    primaryColor: '#7c2d12',
    secondaryColor: '#ea580c',
    accentColor: '#fbbf24',
    fontFamily: 'Raleway',
    layout: 'modern',
    headerStyle: 'left',
    sectionStyle: 'cards',
    spacing: 'normal',
    typography: 'bold'
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