import React, { useRef, useState, useEffect, useCallback } from 'react';
import Controls from './Controls';
import { applyFiltersToCanvas, Filters } from '../utils/imageUtils';

const defaultFilters: Filters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  blur: 0,
};

const ImageEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;

    if (canvas && image && originalImageSrc) {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      applyFiltersToCanvas(ctx, canvas, image, filters, rotation, flipH, flipV);
    }
  }, [originalImageSrc, filters, rotation, flipH, flipV]);

  useEffect(() => {
    if (originalImageSrc) {
      const image = new Image();
      image.onload = () => {
        imageRef.current = image;
        drawImage();
      };
      image.src = originalImageSrc;
    } else {
      // Clear canvas if no image
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [originalImageSrc, drawImage]);

  useEffect(() => {
    // Redraw whenever filters, rotation, or flip change
    drawImage();
  }, [filters, rotation, flipH, flipV, drawImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImageSrc(reader.result as string);
        setFilters(defaultFilters); // Reset filters on new image upload
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterChange = (filterName: keyof Filters, value: number) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleRotate = (direction: 'left' | 'right') => {
    setRotation((prev) => (direction === 'right' ? prev + 90 : prev - 90));
  };

  const handleFlip = (axis: 'horizontal' | 'vertical') => {
    if (axis === 'horizontal') setFlipH((prev) => !prev);
    if (axis === 'vertical') setFlipV((prev) => !prev);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas && originalImageSrc) {
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="editor-container">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        id="imageUpload"
      />
      <label htmlFor="imageUpload" className="file-upload-label">
        Upload Image
      </label>

      <div className="image-display">
        {originalImageSrc ? (
          <canvas ref={canvasRef}></canvas>
        ) : (
          <p className="no-image-placeholder">Upload an image to start editing</p>
        )}
      </div>

      <Controls
        filters={filters}
        onFilterChange={handleFilterChange}
        onRotate={handleRotate}
        onFlip={handleFlip}
        onReset={handleReset}
        onDownload={handleDownload}
        hasImage={!!originalImageSrc}
      />
    </div>
  );
};

export default ImageEditor;
