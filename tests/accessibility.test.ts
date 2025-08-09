import * as path from 'path';
import * as fs from 'fs';
import { AccessibilityValidator } from './validators/accessibility-validator';

describe('WCAG Accessibility Compliance', () => {
  const validator = new AccessibilityValidator();
  const themePath = path.join(__dirname, '..', 'themes', 'flying-dutchman-color-theme.json');
  
  let theme: any;
  
  beforeAll(() => {
    const themeContent = fs.readFileSync(themePath, 'utf8');
    theme = JSON.parse(themeContent);
  });

  describe('WCAG AA Compliance (4.5:1 ratio)', () => {
    test('editor text should meet AA contrast requirements', () => {
      const background = theme.colors['editor.background'];
      const foreground = theme.colors['editor.foreground'];
      
      const ratio = validator.getContrastRatio(background, foreground);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('terminal text should meet AA contrast requirements', () => {
      const background = theme.colors['terminal.background'];
      const foreground = theme.colors['terminal.foreground'];
      
      const ratio = validator.getContrastRatio(background, foreground);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('sidebar text should meet AA contrast requirements', () => {
      const background = theme.colors['sideBar.background'];
      const foreground = theme.colors['sideBar.foreground'];
      
      const ratio = validator.getContrastRatio(background, foreground);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('status bar text should meet AA contrast requirements', () => {
      const background = theme.colors['statusBar.background'];
      const foreground = theme.colors['statusBar.foreground'];
      
      const ratio = validator.getContrastRatio(background, foreground);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('activity bar text should meet AA contrast requirements', () => {
      const background = theme.colors['activityBar.background'];
      const foreground = theme.colors['activityBar.foreground'];
      
      const ratio = validator.getContrastRatio(background, foreground);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Syntax highlighting contrast', () => {
    test('comments should have sufficient contrast', () => {
      const background = theme.colors['editor.background'];
      const commentColor = '#4a5568';
      
      const ratio = validator.getContrastRatio(background, commentColor);
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    test('strings should have sufficient contrast', () => {
      const background = theme.colors['editor.background'];
      const stringColor = '#48bb78';
      
      const ratio = validator.getContrastRatio(background, stringColor);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('keywords should have sufficient contrast', () => {
      const background = theme.colors['editor.background'];
      const keywordColor = '#7fb3d5';
      
      const ratio = validator.getContrastRatio(background, keywordColor);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('functions should have sufficient contrast', () => {
      const background = theme.colors['editor.background'];
      const functionColor = '#5dade2';
      
      const ratio = validator.getContrastRatio(background, functionColor);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('errors should have sufficient contrast', () => {
      const background = theme.colors['editor.background'];
      const errorColor = '#e53e3e';
      
      const ratio = validator.getContrastRatio(background, errorColor);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Accessibility report', () => {
    test('should generate comprehensive accessibility report', () => {
      const report = validator.generateAccessibilityReport(theme);
      
      expect(report).toHaveProperty('wcagAACompliant');
      expect(report).toHaveProperty('wcagAAACompliant');
      expect(report).toHaveProperty('colorblindSafe');
      expect(report).toHaveProperty('contrastRatios');
      expect(report).toHaveProperty('recommendations');
      
      expect(report.wcagAACompliant).toBe(true);
      
      if (!report.wcagAACompliant || report.recommendations.length > 0) {
        console.log('Accessibility Report:', JSON.stringify(report, null, 2));
      }
    });
  });
});