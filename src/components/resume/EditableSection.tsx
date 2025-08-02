import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

interface EditableSectionProps {
  isEditMode: boolean;
  onAdd?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  children: React.ReactNode;
  className?: string;
}

const EditableSection: React.FC<EditableSectionProps> = ({
  isEditMode,
  onAdd,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  children,
  className = ''
}) => {
  if (!isEditMode) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative group ${className}`}>
      {children}
      
      {/* Edit controls */}
      <div className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
        {onMoveUp && canMoveUp && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0"
            onClick={onMoveUp}
          >
            <MoveUp className="h-3 w-3" />
          </Button>
        )}
        
        {onMoveDown && canMoveDown && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0"
            onClick={onMoveDown}
          >
            <MoveDown className="h-3 w-3" />
          </Button>
        )}
        
        {onDelete && (
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-6 p-0"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Add button for the last item */}
      {onAdd && (
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="sm"
            variant="outline"
            onClick={onAdd}
            className="w-full h-8"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableSection;