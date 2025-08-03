import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLiveEditing } from './LiveEditingProvider';
import { cn } from '@/lib/utils';

interface EditableListProps {
  items: any[];
  path: string[];
  renderItem: (item: any, index: number) => React.ReactNode;
  createNewItem: () => any;
  className?: string;
  addButtonText?: string;
}

export const EditableList: React.FC<EditableListProps> = ({
  items,
  path,
  renderItem,
  createNewItem,
  className,
  addButtonText = 'Add Item'
}) => {
  const { isEditMode, addArrayItem, removeArrayItem, reorderArrayItem } = useLiveEditing();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    const newItem = createNewItem();
    addArrayItem(path, newItem);
  };

  const handleRemoveItem = (index: number) => {
    removeArrayItem(path, index);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderArrayItem(path, index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < items.length - 1) {
      reorderArrayItem(path, index, index + 1);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderArrayItem(path, draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className={cn(
            'relative group',
            isEditMode && 'border border-dashed border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors',
            draggedIndex === index && 'opacity-50'
          )}
          draggable={isEditMode}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          {/* Edit Mode Controls */}
          {isEditMode && (
            <div className="absolute -right-2 -top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border rounded shadow-sm">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-500 hover:text-blue-600"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-500 hover:text-blue-600 cursor-grab"
              >
                <GripVertical className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-gray-500 hover:text-blue-600"
                onClick={() => handleMoveDown(index)}
                disabled={index === items.length - 1}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveItem(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Item Content */}
          {renderItem(item, index)}
        </div>
      ))}

      {/* Add Button */}
      {isEditMode && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addButtonText}
        </Button>
      )}
    </div>
  );
};