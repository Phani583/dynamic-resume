import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditMode: boolean;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  isEditMode,
  multiline = false,
  placeholder,
  className = '',
  style
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      setIsEditing(false);
      onChange(editValue);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      } else {
        inputRef.current.setSelectionRange(0, editValue.length);
      }
    }
  }, [isEditing, editValue.length]);

  if (isEditMode && isEditing) {
    const Component = multiline ? Textarea : Input;
    return (
      <Component
        ref={inputRef as any}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`border-2 border-blue-400 ${className}`}
        style={style}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      className={`${isEditMode ? 'cursor-text hover:bg-blue-50 border border-dashed border-transparent hover:border-blue-300 rounded px-1' : ''} ${className}`}
      style={style}
    >
      {value || (isEditMode ? placeholder : '')}
    </span>
  );
};

export default EditableText;