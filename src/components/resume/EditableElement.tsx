import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLiveEditing } from './LiveEditingProvider';
import { cn } from '@/lib/utils';

interface EditableElementProps {
  value: string;
  path: string[];
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  multiline?: boolean;
  children?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const EditableElement: React.FC<EditableElementProps> = ({
  value,
  path,
  className,
  style,
  placeholder = 'Click to edit...',
  multiline = false,
  children,
  as: Component = 'div'
}) => {
  const { isEditMode, focusedElement, setFocusedElement, updateData } = useLiveEditing();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const elementRef = useRef<HTMLElement>(null);
  const pathString = path.join('.');

  const isFocused = focusedElement === pathString;

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleClick = useCallback(() => {
    if (isEditMode) {
      setFocusedElement(pathString);
      setIsEditing(true);
    }
  }, [isEditMode, pathString, setFocusedElement]);

  const handleBlur = useCallback(() => {
    if (editValue !== value) {
      updateData(path, editValue);
    }
    setIsEditing(false);
    setFocusedElement(null);
  }, [editValue, value, updateData, path, setFocusedElement]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
      setFocusedElement(null);
    }
  }, [multiline, handleBlur, value, setFocusedElement]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue(e.target.value);
  }, []);

  if (isEditMode && isEditing) {
    return multiline ? (
      <textarea
        ref={elementRef as React.RefObject<HTMLTextAreaElement>}
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full bg-transparent border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none',
          className
        )}
        style={style}
        placeholder={placeholder}
        autoFocus
        rows={Math.max(2, editValue.split('\n').length)}
      />
    ) : (
      <input
        ref={elementRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={editValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full bg-transparent border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500',
          className
        )}
        style={style}
        placeholder={placeholder}
        autoFocus
      />
    );
  }

  const componentProps = {
    className: cn(
      className,
      isEditMode && 'cursor-text hover:bg-blue-50/50 transition-colors duration-200',
      isFocused && 'ring-2 ring-blue-300 ring-opacity-50',
      isEditMode && !value && 'min-h-[1.5rem] bg-gray-100/50 border border-dashed border-gray-300'
    ),
    style,
    onClick: handleClick,
    title: isEditMode ? 'Click to edit' : undefined,
  };

  return React.createElement(
    Component,
    componentProps,
    children || value || (isEditMode && !value ? placeholder : '')
  );
};