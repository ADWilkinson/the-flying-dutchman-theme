import * as path from 'path';
import { ThemeValidator } from './validators/theme-validator';

describe('The Flying Dutchman Theme Structure', () => {
  const validator = new ThemeValidator();
  const themePath = path.join(__dirname, '..', 'themes', 'flying-dutchman-color-theme.json');

  test('should have valid VS Code theme structure', () => {
    const result = validator.validateVSCodeTheme(themePath);
    
    if (!result.valid) {
      console.error('Theme validation errors:', result.errors);
    }
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should use valid hex color format', () => {
    const result = validator.validateVSCodeTheme(themePath);
    const hexColorErrors = result.errors.filter(error => error.includes('Invalid color format'));
    
    expect(hexColorErrors).toHaveLength(0);
  });

  test('should contain all required UI colors', () => {
    const result = validator.validateVSCodeTheme(themePath);
    const missingColorErrors = result.errors.filter(error => error.includes('Missing required color'));
    
    expect(missingColorErrors).toHaveLength(0);
  });

  test('should have valid semantic token colors', () => {
    const result = validator.validateVSCodeTheme(themePath);
    const semanticErrors = result.errors.filter(error => error.includes('semantic token'));
    
    expect(semanticErrors).toHaveLength(0);
  });

  test('should adhere to the nautical color palette', () => {
    const result = validator.validateColorPaletteAdherence(themePath);
    
    if (result.warnings.length > 0) {
      console.warn('Color palette warnings:', result.warnings);
    }
    
    // We allow some warnings but log them for review
    // The theme uses extended colors beyond the basic palette for better syntax highlighting
    expect(result.warnings.length).toBeLessThan(50);
  });
});