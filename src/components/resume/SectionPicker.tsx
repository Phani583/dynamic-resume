import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Briefcase, 
  GraduationCap, 
  FolderOpen, 
  Award, 
  Heart,
  PenTool,
  Signature,
  Layout,
  Eye
} from 'lucide-react';
import { sectionTemplates, getTemplatesByCategory, SectionTemplateType, SectionTemplate } from './SectionTemplates';

interface SectionPickerProps {
  onTemplateSelect: (sectionType: string, templateId: SectionTemplateType) => void;
  children: React.ReactNode;
}

export const SectionPicker: React.FC<SectionPickerProps> = ({ onTemplateSelect, children }) => {
  const [selectedCategory, setSelectedCategory] = useState<SectionTemplate['category']>('complete');
  const [previewTemplate, setPreviewTemplate] = useState<SectionTemplateType | null>(null);

  const categories = [
    { id: 'complete', name: 'Complete Templates', icon: Layout, color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800' },
    { id: 'experience', name: 'Work Experience', icon: Briefcase, color: 'bg-blue-100 text-blue-800' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'bg-green-100 text-green-800' },
    { id: 'projects', name: 'Projects', icon: FolderOpen, color: 'bg-purple-100 text-purple-800' },
    { id: 'skills', name: 'Skills', icon: Award, color: 'bg-orange-100 text-orange-800' },
    { id: 'hobbies', name: 'Hobbies', icon: Heart, color: 'bg-pink-100 text-pink-800' },
    { id: 'declaration', name: 'Declaration', icon: PenTool, color: 'bg-indigo-100 text-indigo-800' },
    { id: 'signature', name: 'Signature', icon: Signature, color: 'bg-gray-100 text-gray-800' },
  ] as const;

  const handleTemplateSelect = (templateId: SectionTemplateType) => {
    const template = sectionTemplates.find(t => t.id === templateId);
    if (template) {
      if (template.category === 'complete') {
        // For complete templates, apply to the entire resume
        onTemplateSelect('complete', templateId);
      } else {
        onTemplateSelect(template.category, templateId);
      }
    }
  };

  const handleTemplateReset = (category: string) => {
    onTemplateSelect(category, 'default' as SectionTemplateType);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Section Template Picker
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as SectionTemplate['category'])}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex flex-col gap-1 py-3">
                  <Icon className="h-4 w-4" />
                  <span className="text-xs hidden sm:block">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">{category.name} Templates</h3>
                    <Badge className={category.color}>
                      {getTemplatesByCategory(category.id).length} templates
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTemplateReset(category.id)}
                    className="text-xs"
                  >
                    Reset to Default
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getTemplatesByCategory(category.id).map((template) => (
                    <Card key={template.id} className={`cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50 ${template.category === 'complete' ? 'bg-gradient-to-br from-purple-50 to-pink-50' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className={`text-base ${template.category === 'complete' ? 'text-purple-800' : ''}`}>
                            {template.name}
                            {template.category === 'complete' && <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Complete</span>}
                          </CardTitle>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setPreviewTemplate(template.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription className="text-sm">{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Template Preview Thumbnail */}
                          <div className={`w-full h-24 rounded border-2 border-dashed flex items-center justify-center ${
                            template.category === 'complete' 
                              ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200' 
                              : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                          }`}>
                            {template.id === 'professional-classic' ? (
                              <img 
                                src="/lovable-uploads/0fbd4044-8108-4e35-88c8-6a5cf01819ea.png" 
                                alt="Professional Classic Template Preview" 
                                className="w-full h-full object-cover rounded opacity-80"
                              />
                            ) : (
                              <div className="text-center">
                                <Layout className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">Preview</span>
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            size="sm" 
                            className={`w-full ${template.category === 'complete' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}`}
                            onClick={() => handleTemplateSelect(template.id)}
                          >
                            Apply Template
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Template Preview Modal */}
        {previewTemplate && (
          <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Template Preview</DialogTitle>
              </DialogHeader>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-center text-gray-500">Template preview will be rendered here</p>
                {/* Here you could render the actual template with sample data */}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};