export interface Filters {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: number;
  sepia: number;
  invert: number;
  blur: number;
}

// Helper to apply a single pixel transformation
const applyPixelFilter = (pixel: Uint8ClampedArray, index: number, filter: keyof Filters, value: number) => {
  const r = pixel[index];
  const g = pixel[index + 1];
  const b = pixel[index + 2];

  let newR = r, newG = g, newB = b;

  switch (filter) {
    case 'brightness':
      const brightnessFactor = value / 100;
      newR = r * brightnessFactor;
      newG = g * brightnessFactor;
      newB = b * brightnessFactor;
      break;
    case 'contrast':
      const contrastFactor = (value / 100);
      const intercept = 128 * (1 - contrastFactor);
      newR = r * contrastFactor + intercept;
      newG = g * contrastFactor + intercept;
      newB = b * contrastFactor + intercept;
      break;
    case 'saturation':
      const saturationFactor = value / 100;
      const lumR = 0.3086;
      const lumG = 0.6094;
      const lumB = 0.0820;
      const gray = lumR * r + lumG * g + lumB * b;
      newR = gray * (1 - saturationFactor) + r * saturationFactor;
      newG = gray * (1 - saturationFactor) + g * saturationFactor;
      newB = gray * (1 - saturationFactor) + b * saturationFactor;
      break;
    case 'grayscale':
      const gsFactor = value / 100;
      const grayVal = r * 0.299 + g * 0.587 + b * 0.114;
      newR = r * (1 - gsFactor) + grayVal * gsFactor;
      newG = g * (1 - gsFactor) + grayVal * gsFactor;
      newB = b * (1 - gsFactor) + grayVal * gsFactor;
      break;
    case 'sepia':
      const sepiaFactor = value / 100;
      const sr = (r * 0.393 + g * 0.769 + b * 0.189);
      const sg = (r * 0.349 + g * 0.686 + b * 0.168);
      const sb = (r * 0.272 + g * 0.534 + b * 0.131);
      newR = r * (1 - sepiaFactor) + sr * sepiaFactor;
      newG = g * (1 - sepiaFactor) + sg * sepiaFactor;
      newB = b * (1 - sepiaFactor) + sb * sepiaFactor;
      break;
    case 'invert':
      const invertFactor = value / 100;
      newR = r * (1 - invertFactor) + (255 - r) * invertFactor;
      newG = g * (1 - invertFactor) + (255 - g) * invertFactor;
      newB = b * (1 - invertFactor) + (255 - b) * invertFactor;
      break;
  }

  pixel[index] = Math.min(255, Math.max(0, newR));
  pixel[index + 1] = Math.min(255, Math.max(0, newG));
  pixel[index + 2] = Math.min(255, Math.max(0, newB));
};

// Simple Box Blur (for demonstration, more advanced blurs are complex)
const applyBlur = (pixels: Uint8ClampedArray, width: number, height: number, radius: number) => {
  if (radius === 0) return pixels;

  const newPixels = new Uint8ClampedArray(pixels.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rSum = 0, gSum = 0, bSum = 0;
      let count = 0;

      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const nx = x + kx;
          const ny = y + ky;

          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const index = (ny * width + nx) * 4;
            rSum += pixels[index];
            gSum += pixels[index + 1];
            bSum += pixels[index + 2];
            count++;
          }
        }
      }

      const targetIndex = (y * width + x) * 4;
      newPixels[targetIndex] = rSum / count;
      newPixels[targetIndex + 1] = gSum / count;
      newPixels[targetIndex + 2] = bSum / count;
      newPixels[targetIndex + 3] = pixels[targetIndex + 3]; // Alpha channel
    }
  }
  return newPixels;
};

export const applyFiltersToCanvas = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  filters: Filters,
  rotation: number,
  flipH: boolean,
  flipV: boolean
) => {
  // Reset canvas transformations
  resetCanvasTransform(ctx, canvas);

  // Calculate new dimensions and position for rotation/flip
  let imgWidth = image.naturalWidth;
  let imgHeight = image.naturalHeight;

  // Adjust canvas size to fit the image while maintaining aspect ratio
  const aspectRatio = imgWidth / imgHeight;
  const maxCanvasWidth = 800; // Max width for display
  const maxCanvasHeight = 600; // Max height for display

  if (imgWidth > maxCanvasWidth) {
    imgWidth = maxCanvasWidth;
    imgHeight = imgWidth / aspectRatio;
  }
  if (imgHeight > maxCanvasHeight) {
    imgHeight = maxCanvasHeight;
    imgWidth = imgHeight * aspectRatio;
  }

  canvas.width = imgWidth;
  canvas.height = imgHeight;

  // Save the un-transformed state
  ctx.save();

  // Apply transformations (rotation, flip)
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  // Draw the image
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Restore context to apply pixel filters without affecting transformations
  ctx.restore();

  // Get image data for pixel manipulation
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Apply pixel-based filters
  for (let i = 0; i < pixels.length; i += 4) {
    applyPixelFilter(pixels, i, 'brightness', filters.brightness);
    applyPixelFilter(pixels, i, 'contrast', filters.contrast);
    applyPixelFilter(pixels, i, 'saturation', filters.saturation);
    applyPixelFilter(pixels, i, 'grayscale', filters.grayscale);
    applyPixelFilter(pixels, i, 'sepia', filters.sepia);
    applyPixelFilter(pixels, i, 'invert', filters.invert);
  }

  // Apply blur separately as it needs the full pixel array
  if (filters.blur > 0) {
    const blurredPixels = applyBlur(pixels, canvas.width, canvas.height, Math.floor(filters.blur));
    imageData.data.set(blurredPixels);
  }

  // Put the modified image data back on the canvas
  ctx.putImageData(imageData, 0, 0);
};

export const resetCanvasTransform = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset to identity matrix
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};
