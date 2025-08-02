import React from 'react';
import { FileText, Star, Download, File, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface NavigationProps {
  onDownload: () => void;
  onDownloadDocx: () => void;
  isDownloading: boolean;
  isEditMode?: boolean;
  onEditModeToggle?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onDownload, onDownloadDocx, isDownloading, isEditMode = false, onEditModeToggle }) => {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Resume Builder</h1>
              <p className="text-sm text-muted-foreground">Professional resume creator</p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-muted-foreground">
              <Star className="w-4 h-4 text-warning" />
              <span className="text-sm">Create stunning resumes in minutes</span>
            </div>
            
            {onEditModeToggle && (
              <Button 
                onClick={onEditModeToggle}
                variant={isEditMode ? "default" : "outline"}
                size="sm"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditMode ? "Exit Edit" : "Edit Preview"}
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  disabled={isDownloading}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isDownloading ? 'Generating...' : 'Download Resume'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onDownload}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownloadDocx}>
                  <File className="w-4 h-4 mr-2" />
                  Download as Word (.docx)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;