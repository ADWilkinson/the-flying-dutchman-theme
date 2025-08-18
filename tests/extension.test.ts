import { ThemeSwitcher, ThemeVariant } from '../src/theme-switcher';
import { ThemeConfiguration } from '../src/theme-configuration';

describe('Flying Dutchman Extension', () => {
  describe('ThemeSwitcher', () => {
    let themeSwitcher: ThemeSwitcher;

    beforeEach(() => {
      themeSwitcher = new ThemeSwitcher();
    });

    test('should have three theme variants', () => {
      const variants = themeSwitcher.getVariants();
      expect(variants).toHaveLength(3);
      
      const variantIds = variants.map(v => v.id);
      expect(variantIds).toContain('standard');
      expect(variantIds).toContain('high-contrast');
      expect(variantIds).toContain('soft');
    });

    test('should have correct theme variant structure', () => {
      const variants = themeSwitcher.getVariants();
      
      variants.forEach(variant => {
        expect(variant).toHaveProperty('id');
        expect(variant).toHaveProperty('label');
        expect(variant).toHaveProperty('description');
        expect(variant).toHaveProperty('themeId');
        
        expect(typeof variant.id).toBe('string');
        expect(typeof variant.label).toBe('string');
        expect(typeof variant.description).toBe('string');
        expect(typeof variant.themeId).toBe('string');
        
        expect(variant.id.length).toBeGreaterThan(0);
        expect(variant.label.length).toBeGreaterThan(0);
        expect(variant.description.length).toBeGreaterThan(0);
        expect(variant.themeId.length).toBeGreaterThan(0);
      });
    });

    test('should have nautical-themed variant labels', () => {
      const variants = themeSwitcher.getVariants();
      
      const standardVariant = variants.find(v => v.id === 'standard');
      const highContrastVariant = variants.find(v => v.id === 'high-contrast');
      const softVariant = variants.find(v => v.id === 'soft');
      
      expect(standardVariant?.label).toContain('🌊');
      expect(highContrastVariant?.label).toContain('⚡');
      expect(softVariant?.label).toContain('🌫️');
      
      expect(standardVariant?.label).toContain('Flying Dutchman');
      expect(highContrastVariant?.label).toContain('Flying Dutchman');
      expect(softVariant?.label).toContain('Flying Dutchman');
    });

    test('should have descriptive variant descriptions', () => {
      const variants = themeSwitcher.getVariants();
      
      variants.forEach(variant => {
        expect(variant.description.length).toBeGreaterThan(20);
        expect(variant.description).toMatch(/[a-z]/); // Should contain lowercase letters
        expect(variant.description).toMatch(/nautical|accessibility|contrast|strain|coding/i);
      });
    });

    test('should map variant IDs to correct theme IDs', () => {
      const variants = themeSwitcher.getVariants();
      
      const standardVariant = variants.find(v => v.id === 'standard');
      const highContrastVariant = variants.find(v => v.id === 'high-contrast');
      const softVariant = variants.find(v => v.id === 'soft');
      
      expect(standardVariant?.themeId).toBe('The Flying Dutchman');
      expect(highContrastVariant?.themeId).toBe('The Flying Dutchman High Contrast');
      expect(softVariant?.themeId).toBe('The Flying Dutchman Soft');
    });
  });

  describe('ThemeConfiguration', () => {
    let themeConfiguration: ThemeConfiguration;

    beforeEach(() => {
      themeConfiguration = new ThemeConfiguration();
    });

    test('should provide current configuration structure', () => {
      const config = themeConfiguration.getCurrentConfiguration();
      
      expect(config).toHaveProperty('preferredVariant');
      expect(config).toHaveProperty('enableSemanticHighlighting');
      expect(config).toHaveProperty('terminalIntegration');
      
      expect(typeof config.preferredVariant).toBe('string');
      expect(typeof config.enableSemanticHighlighting).toBe('boolean');
      expect(typeof config.terminalIntegration).toBe('boolean');
    });

    test('should have valid default configuration values', () => {
      const config = themeConfiguration.getCurrentConfiguration();
      
      expect(['standard', 'high-contrast', 'soft']).toContain(config.preferredVariant);
      expect([true, false]).toContain(config.enableSemanticHighlighting);
      expect([true, false]).toContain(config.terminalIntegration);
    });
  });

  describe('Extension Integration', () => {
    test('should have consistent variant definitions between switcher and configuration', () => {
      const themeSwitcher = new ThemeSwitcher();
      const themeConfiguration = new ThemeConfiguration();
      
      const variants = themeSwitcher.getVariants();
      const config = themeConfiguration.getCurrentConfiguration();
      
      const variantIds = variants.map(v => v.id);
      expect(variantIds).toContain(config.preferredVariant);
    });

    test('should maintain theme consistency across components', () => {
      const themeSwitcher = new ThemeSwitcher();
      const variants = themeSwitcher.getVariants();
      
      // All variants should be Flying Dutchman themed
      variants.forEach(variant => {
        expect(variant.themeId).toContain('Flying Dutchman');
        expect(variant.label).toContain('Flying Dutchman');
      });
    });
  });
});