import React, { createContext, useContext, useState, useCallback } from 'react';
import { ResumeData } from './types';

interface LiveEditingContextType {
  isEditMode: boolean;
  focusedElement: string | null;
  setFocusedElement: (element: string | null) => void;
  updateData: (path: string[], value: any) => void;
  addArrayItem: (path: string[], item: any) => void;
  removeArrayItem: (path: string[], index: number) => void;
  reorderArrayItem: (path: string[], oldIndex: number, newIndex: number) => void;
}

const LiveEditingContext = createContext<LiveEditingContextType | undefined>(undefined);

interface LiveEditingProviderProps {
  children: React.ReactNode;
  data: ResumeData;
  onDataChange: (data: ResumeData) => void;
  isEditMode: boolean;
}

export const LiveEditingProvider: React.FC<LiveEditingProviderProps> = ({
  children,
  data,
  onDataChange,
  isEditMode
}) => {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  const updateData = useCallback((path: string[], value: any) => {
    const newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (current[path[i]] === undefined) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    onDataChange(newData);
  }, [data, onDataChange]);

  const addArrayItem = useCallback((path: string[], item: any) => {
    const newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    
    if (Array.isArray(current)) {
      current.push(item);
      onDataChange(newData);
    }
  }, [data, onDataChange]);

  const removeArrayItem = useCallback((path: string[], index: number) => {
    const newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    
    if (Array.isArray(current)) {
      current.splice(index, 1);
      onDataChange(newData);
    }
  }, [data, onDataChange]);

  const reorderArrayItem = useCallback((path: string[], oldIndex: number, newIndex: number) => {
    const newData = { ...data };
    let current: any = newData;
    
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    
    if (Array.isArray(current)) {
      const [removed] = current.splice(oldIndex, 1);
      current.splice(newIndex, 0, removed);
      onDataChange(newData);
    }
  }, [data, onDataChange]);

  const value = {
    isEditMode,
    focusedElement,
    setFocusedElement,
    updateData,
    addArrayItem,
    removeArrayItem,
    reorderArrayItem
  };

  return (
    <LiveEditingContext.Provider value={value}>
      {children}
    </LiveEditingContext.Provider>
  );
};

export const useLiveEditing = () => {
  const context = useContext(LiveEditingContext);
  if (context === undefined) {
    throw new Error('useLiveEditing must be used within a LiveEditingProvider');
  }
  return context;
};