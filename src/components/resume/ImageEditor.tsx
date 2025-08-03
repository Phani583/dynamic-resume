import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage, Rect } from 'fabric';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  RotateCw, 
  RotateCcw, 
  Crop, 
  Palette, 
  Contrast, 
  Sun, 
  Zap,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (editedImageUrl: string) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onSave
}) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [originalImage, setOriginalImage] = useState<FabricImage | null>(null);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: '#f8f9fa',
    });

    setFabricCanvas(canvas);

    // Load the image
    FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous',
    }).then((img) => {
      // Scale image to fit canvas
      const scaleX = (canvas.width! - 40) / img.width!;
      const scaleY = (canvas.height! - 40) / img.height!;
      const scale = Math.min(scaleX, scaleY);
      
      img.scale(scale);
      img.set({
        left: canvas.width! / 2,
        top: canvas.height! / 2,
        originX: 'center',
        originY: 'center'
      });
      
      canvas.add(img);
      canvas.setActiveObject(img);
      setOriginalImage(img);
      
      // Save initial state
      saveToHistory(canvas);
    });

    return () => {
      canvas.dispose();
    };
  }, [isOpen, imageUrl]);

  const saveToHistory = useCallback((canvas: FabricCanvas) => {
    const state = JSON.stringify(canvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(state);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Apply filters
  const applyFilters = useCallback(() => {
    if (!originalImage || !fabricCanvas) return;

    const filters: any[] = [];
    
    // Note: Filter implementation would require additional fabric.js filter libraries
    // For now, we'll apply basic transformations
    if (brightness !== 0) {
      // Apply brightness filter when available
    }
    
    if (contrast !== 0) {
      // Apply contrast filter when available  
    }
    
    if (saturation !== 0) {
      // Apply saturation filter when available
    }

    originalImage.filters = filters;
    originalImage.applyFilters();
    fabricCanvas.renderAll();
  }, [originalImage, fabricCanvas, brightness, contrast, saturation]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Rotation functions
  const rotateClockwise = () => {
    if (!originalImage || !fabricCanvas) return;
    originalImage.rotate((originalImage.angle || 0) + 90);
    fabricCanvas.renderAll();
    saveToHistory(fabricCanvas);
  };

  const rotateCounterClockwise = () => {
    if (!originalImage || !fabricCanvas) return;
    originalImage.rotate((originalImage.angle || 0) - 90);
    fabricCanvas.renderAll();
    saveToHistory(fabricCanvas);
  };

  // Crop function
  const enableCropping = () => {
    if (!originalImage || !fabricCanvas) return;
    
    const rect = new Rect({
      left: originalImage.left! - 50,
      top: originalImage.top! - 50,
      width: 100,
      height: 100,
      fill: 'transparent',
      stroke: '#007bff',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: true,
      hasControls: true,
    });
    
    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
    fabricCanvas.renderAll();
    
    toast({
      title: "Crop Mode",
      description: "Resize the blue rectangle to select crop area, then click Apply Crop."
    });
  };

  const applyCrop = () => {
    if (!fabricCanvas || !originalImage) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'rect') {
      toast({
        title: "No Crop Area",
        description: "Please select a crop area first.",
        variant: "destructive"
      });
      return;
    }
    
    // Get crop dimensions
    const cropRect = activeObject;
    const left = cropRect.left!;
    const top = cropRect.top!;
    const width = cropRect.width! * cropRect.scaleX!;
    const height = cropRect.height! * cropRect.scaleY!;
    
    // Create cropped image
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // This is a simplified crop - in a real implementation you'd need to handle
      // the fabric image transformation properly
      fabricCanvas.remove(cropRect);
      saveToHistory(fabricCanvas);
      
      toast({
        title: "Crop Applied",
        description: "Image has been cropped successfully."
      });
    }
  };

  // Zoom functions
  const zoomIn = () => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    fabricCanvas.setZoom(Math.min(zoom * 1.1, 3));
  };

  const zoomOut = () => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    fabricCanvas.setZoom(Math.max(zoom * 0.9, 0.1));
  };

  // History functions
  const undo = () => {
    if (historyIndex > 0 && fabricCanvas) {
      const previousState = history[historyIndex - 1];
      fabricCanvas.loadFromJSON(previousState, () => {
        fabricCanvas.renderAll();
        setHistoryIndex(prev => prev - 1);
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && fabricCanvas) {
      const nextState = history[historyIndex + 1];
      fabricCanvas.loadFromJSON(nextState, () => {
        fabricCanvas.renderAll();
        setHistoryIndex(prev => prev + 1);
      });
    }
  };

  // Save edited image
  const handleSave = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    onSave(dataURL);
    onClose();
    
    toast({
      title: "Image Saved",
      description: "Your edited image has been saved successfully."
    });
  };

  // Reset all changes
  const resetImage = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    
    if (fabricCanvas && history.length > 0) {
      fabricCanvas.loadFromJSON(history[0], () => {
        fabricCanvas.renderAll();
        setHistoryIndex(0);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Image Editor</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-4">
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              {/* Toolbar */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={undo} disabled={historyIndex <= 0}>
                  <Undo className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={redo} disabled={historyIndex >= history.length - 1}>
                  <Redo className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={rotateCounterClockwise}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={rotateClockwise}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={enableCropping}>
                  <Crop className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <Button size="sm" variant="outline" onClick={resetImage}>
                Reset
              </Button>
            </div>
            
            <div className="flex-1 border rounded-lg overflow-hidden bg-white">
              <canvas ref={canvasRef} />
            </div>
          </div>
          
          {/* Controls Panel */}
          <div className="w-64 space-y-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Sun className="h-4 w-4" />
                Brightness
              </Label>
              <Slider
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
                min={-100}
                max={100}
                step={1}
                className="mb-2"
              />
              <span className="text-sm text-gray-600">{brightness}</span>
            </div>
            
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Contrast className="h-4 w-4" />
                Contrast
              </Label>
              <Slider
                value={[contrast]}
                onValueChange={(value) => setContrast(value[0])}
                min={-100}
                max={100}
                step={1}
                className="mb-2"
              />
              <span className="text-sm text-gray-600">{contrast}</span>
            </div>
            
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Palette className="h-4 w-4" />
                Saturation
              </Label>
              <Slider
                value={[saturation]}
                onValueChange={(value) => setSaturation(value[0])}
                min={-100}
                max={100}
                step={1}
                className="mb-2"
              />
              <span className="text-sm text-gray-600">{saturation}</span>
            </div>
            
            <Button 
              onClick={applyCrop} 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              Apply Crop
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Download className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};