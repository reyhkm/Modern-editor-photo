import React from 'react';
import type { Filters } from '../utils/imageUtils';

interface ControlsProps {
  filters: Filters;
  onFilterChange: (filter: keyof Filters, value: number) => void;
  onRotate: (direction: 'left' | 'right') => void;
  onFlip: (axis: 'horizontal' | 'vertical') => void;
  onReset: () => void;
  onDownload: () => void;
  hasImage: boolean;
}

const Controls: React.FC<ControlsProps> = ({ filters, onFilterChange, onRotate, onFlip, onReset, onDownload, hasImage }) => {
  return (
    <div className="controls-panel">
      <div className="control-group">
        <label htmlFor="brightness">Brightness: {filters.brightness}%</label>
        <input
          id="brightness"
          type="range"
          min="0"
          max="200"
          value={filters.brightness}
          onChange={(e) => onFilterChange('brightness', parseFloat(e.target.value))}
          disabled={!hasImage}
        />
      </div>
      <div className="control-group">
        <label htmlFor="contrast">Contrast: {filters.contrast}%</label>
        <input
          id="contrast"
          type="range"
          min="0"
          max="200"
          value={filters.contrast}
          onChange={(e) => onFilterChange('contrast', parseFloat(e.target.value))}
          disabled={!hasImage}
        />
      </div>
      <div className="control-group">
        <label htmlFor="saturation">Saturation: {filters.saturation}%</label>
        <input
          id="saturation"
          type="range"
          min="0"
          max="200"
          value={filters.saturation}
          onChange={(e) => onFilterChange('saturation', parseFloat(e.target.value))}
          disabled={!hasImage}
        />
      </div>
      <div className="control-group">
        <label htmlFor="grayscale">Grayscale: {filters.grayscale}%</label>
        <input
          id="grayscale"
          type="range"
          min="0"
          max="100"
          value={filters.grayscale}
          onChange={(e) => onFilterChange('grayscale', parseFloat(e.target.value))}
          disabled={!hasImage}
        />
      </div>
      <div className="control-group">
        <label htmlFor="sepia">Sepia: {filters.sepia}%</label>
        <input
          id="sepia"
          type="range"
          min="0"
          max="100"
          value={filters.sepia}
          onChange={(e) => onFilterChange('sepia', parseFloat(e.target.value))}
          disabled={!hasImage}
        />
      </div>
      <div className="control-group">
        <label htmlFor="invert">Invert: {filters.invert}%</label>
        <input
          id="invert"
          type="range"
          min="0"
          max="100"
          value={filters.invert}
          onChange={(e) => onFilterChange('invert', parseFloat(e.target.value))}
          disabled={!hasImage}
        />
      </div>
      <div className="control-group">
        <label htmlFor="blur">Blur: {filters.blur}px</label>
        <input
          id="blur"
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={filters.blur}
          onChange={(e) => onFilterChange('blur', parseFloat(e.target.value))}
          disabled={!hasImage}
        />
      </div>

      <div className="button-group" style={{ gridColumn: '1 / -1' }}>
        <button onClick={() => onRotate('left')} disabled={!hasImage}>Rotate Left</button>
        <button onClick={() => onRotate('right')} disabled={!hasImage}>Rotate Right</button>
        <button onClick={() => onFlip('horizontal')} disabled={!hasImage}>Flip Horizontal</button>
        <button onClick={() => onFlip('vertical')} disabled={!hasImage}>Flip Vertical</button>
        <button onClick={onReset} disabled={!hasImage} className="secondary">Reset</button>
        <button onClick={onDownload} disabled={!hasImage}>Download Image</button>
      </div>
    </div>
  );
};

export default Controls;
