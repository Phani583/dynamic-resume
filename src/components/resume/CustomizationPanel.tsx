import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Palette, Type, Layout, Settings } from 'lucide-react';
import { 
  FONT_FAMILIES, 
  SECTION_ICONS, 
  BULLET_STYLES, 
  DIVIDER_STYLES, 
  RESUME_THEMES, 
  LAYOUT_OPTIONS 
} from './constants';
import { CustomizationOptions, ResumeTheme, SectionCustomization } from './types';

interface CustomizationPanelProps {
  customization: CustomizationOptions;
  onCustomizationChange: (customization: CustomizationOptions) => void;
  currentTheme: ResumeTheme;
  onThemeChange: (theme: ResumeTheme) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  customization,
  onCustomizationChange,
  currentTheme,
  onThemeChange
}) => {
  const [selectedSection, setSelectedSection] = useState('summary');

  const sections = [
    { id: 'summary', name: 'Summary', icon: '📝' },
    { id: 'experience', name: 'Work Experience', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'skills', name: 'Skills', icon: '🛠️' },
    { id: 'contact', name: 'Contact', icon: '📞' },
    { id: 'projects', name: 'Projects', icon: '🚀' },
    { id: 'additionalInfo', name: 'Additional Info', icon: '📄' },
    { id: 'hobbies', name: 'Hobbies', icon: '❤️' },
    { id: 'declaration', name: 'Declaration', icon: '✍️' },
    { id: 'signature', name: 'Signature', icon: '✏️' }
  ];

  const updateSectionCustomization = (sectionId: string, updates: Partial<SectionCustomization>) => {
    const newCustomization = {
      ...customization,
      sections: {
        ...customization.sections,
        [sectionId]: {
          ...customization.sections[sectionId],
          ...updates
        }
      }
    };
    onCustomizationChange(newCustomization);
  };

  const updateColors = (colorKey: string, value: string) => {
    const newCustomization = {
      ...customization,
      colors: {
        ...customization.colors,
        [colorKey]: value
      }
    };
    onCustomizationChange(newCustomization);
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto h-[calc(100%-80px)]">
        <Tabs defaultValue="themes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="themes" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">
              <Layout className="w-3 h-3 mr-1" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="fonts" className="text-xs">
              <Type className="w-3 h-3 mr-1" />
              Fonts
            </TabsTrigger>
            <TabsTrigger value="colors" className="text-xs">
              <Palette className="w-3 h-3 mr-1" />
              Colors
            </TabsTrigger>
          </TabsList>

          {/* Themes Tab */}
          <TabsContent value="themes" className="space-y-4">
            <div className="grid gap-3">
              {RESUME_THEMES.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    currentTheme.id === theme.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => onThemeChange(theme)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{theme.name}</h4>
                    <div className="flex gap-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.secondaryColor }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                  <div className="flex gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {theme.layout}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {theme.typography}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Layout Style</Label>
              <div className="grid gap-2 mt-2">
                {LAYOUT_OPTIONS.map((layout) => (
                  <div
                    key={layout.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      customization.layout === layout.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => onCustomizationChange({ ...customization, layout: layout.id })}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-sm">{layout.name}</h4>
                        <p className="text-xs text-muted-foreground">{layout.description}</p>
                      </div>
                      <div className="text-xs bg-muted px-2 py-1 rounded">
                        {layout.preview}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Spacing</Label>
              <Select
                value={customization.spacing}
                onValueChange={(value: 'compact' | 'normal' | 'spacious') =>
                  onCustomizationChange({ ...customization, spacing: value })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Fonts Tab */}
          <TabsContent value="fonts" className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Section to Customize</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={selectedSection === section.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSection(section.id)}
                    className="text-xs"
                  >
                    {section.icon} {section.name}
                  </Button>
                ))}
              </div>
            </div>

            {selectedSection && (
              <div className="space-y-4 p-3 bg-muted/20 rounded-lg">
                <h4 className="font-medium text-sm">
                  Customize {sections.find(s => s.id === selectedSection)?.name}
                </h4>
                
                <div>
                  <Label className="text-xs">Font Family</Label>
                  <Select
                    value={customization.sections[selectedSection]?.fontFamily || 'Inter'}
                    onValueChange={(value) => updateSectionCustomization(selectedSection, { fontFamily: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(FONT_FAMILIES).map(([category, fonts]) => (
                        <div key={category}>
                          <div className="px-2 py-1 text-xs font-medium text-muted-foreground capitalize">
                            {category}
                          </div>
                          {fonts.map((font) => (
                            <SelectItem key={font.name} value={font.value}>
                              {font.name}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Section Icon</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {/* None option */}
                    <Button
                      variant={customization.sections[selectedSection]?.icon === 'none' ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSectionCustomization(selectedSection, { icon: 'none', customIcon: undefined })}
                      className="p-2 text-xs"
                    >
                      None
                    </Button>
                    {SECTION_ICONS[selectedSection as keyof typeof SECTION_ICONS]?.map((icon) => (
                      <Button
                        key={icon}
                        variant={customization.sections[selectedSection]?.icon === icon ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSectionCustomization(selectedSection, { icon, customIcon: undefined })}
                        className="p-2 text-sm"
                      >
                        {icon}
                      </Button>
                     ))}
                   </div>
                   <div className="mt-2">
                     <Label className="text-xs">Or use custom icon/emoji</Label>
                     <Input
                       value={customization.sections[selectedSection]?.customIcon || ''}
                       onChange={(e) => updateSectionCustomization(selectedSection, { customIcon: e.target.value, icon: e.target.value ? 'custom' : undefined })}
                       placeholder="Enter emoji or text (e.g., 🚀, •, ►)"
                       className="mt-1 text-sm"
                     />
                   </div>
                 </div>

                 <div>
                   <Label className="text-xs">Bullet Style</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {BULLET_STYLES.map((bullet) => (
                      <Button
                        key={bullet.value}
                        variant={customization.sections[selectedSection]?.bulletStyle === bullet.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSectionCustomization(selectedSection, { bulletStyle: bullet.value })}
                        className="p-2 text-xs"
                        title={bullet.name}
                      >
                        {bullet.symbol}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Divider Style</Label>
                  <Select
                    value={customization.sections[selectedSection]?.dividerStyle || 'simple'}
                    onValueChange={(value) => updateSectionCustomization(selectedSection, { dividerStyle: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIVIDER_STYLES.map((divider) => (
                        <SelectItem key={divider.value} value={divider.value}>
                          {divider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={customization.colors.primary}
                    onChange={(e) => updateColors('primary', e.target.value)}
                    className="w-12 h-8 p-1 border"
                  />
                  <Input
                    value={customization.colors.primary}
                    onChange={(e) => updateColors('primary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Secondary Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={customization.colors.secondary}
                    onChange={(e) => updateColors('secondary', e.target.value)}
                    className="w-12 h-8 p-1 border"
                  />
                  <Input
                    value={customization.colors.secondary}
                    onChange={(e) => updateColors('secondary', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Accent Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={customization.colors.accent}
                    onChange={(e) => updateColors('accent', e.target.value)}
                    className="w-12 h-8 p-1 border"
                  />
                  <Input
                    value={customization.colors.accent}
                    onChange={(e) => updateColors('accent', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={customization.colors.text}
                    onChange={(e) => updateColors('text', e.target.value)}
                    className="w-12 h-8 p-1 border"
                  />
                  <Input
                    value={customization.colors.text}
                    onChange={(e) => updateColors('text', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={customization.colors.background}
                    onChange={(e) => updateColors('background', e.target.value)}
                    className="w-12 h-8 p-1 border"
                  />
                  <Input
                    value={customization.colors.background}
                    onChange={(e) => updateColors('background', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomizationPanel;