import * as fs from 'fs';
import * as path from 'path';

export interface VSCodeTheme {
  name: string;
  author?: string;
  type: 'dark' | 'light';
  colors: Record<string, string>;
  tokenColors?: Array<{
    scope: string | string[];
    settings: {
      foreground?: string;
      fontStyle?: string;
    };
  }>;
  semanticTokenColors?: Record<string, any>;
}

export interface ColorPalette {
  background: string[];
  foreground: string[];
  keywords: string[];
  strings: string[];
  functions: string[];
  constants: string[];
  properties: string[];
  errors: string[];
  comments: string[];
}

export class ThemeValidator {
  private readonly EXPECTED_PALETTE: ColorPalette = {
    background: ['#0d1117', '#0b1929'],
    foreground: ['#a8c3d8', '#8b9dc3', '#94a3b8', '#b0c4de'],
    keywords: ['#7fb3d5'],
    strings: ['#48bb78'],
    functions: ['#5dade2', '#5c7c8a', '#4a7c7e'],
    constants: ['#d4af37', '#d1a458', '#e4b968'],
    properties: ['#4dc1b5', '#4dbdba'],
    errors: ['#e53e3e'],
    comments: ['#4a5568']
  };

  private readonly HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
  private readonly HEX_COLOR_WITH_ALPHA_REGEX = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/;

  validateVSCodeTheme(themePath: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const themeContent = fs.readFileSync(themePath, 'utf8');
      const theme: VSCodeTheme = JSON.parse(themeContent);

      // Validate basic structure
      if (!theme.name) errors.push('Theme must have a name');
      if (theme.type !== 'dark') errors.push('Theme type must be "dark"');
      if (!theme.colors || typeof theme.colors !== 'object') {
        errors.push('Theme must have a colors object');
      }

      // Validate color format
      if (theme.colors) {
        for (const [key, color] of Object.entries(theme.colors)) {
          if (typeof color === 'string' && !this.isValidHexColor(color)) {
            errors.push(`Invalid color format for ${key}: ${color}`);
          }
        }
      }

      // Validate semantic token colors
      if (theme.semanticTokenColors) {
        this.validateSemanticTokens(theme.semanticTokenColors, errors);
      }

      // Validate required UI colors
      const requiredColors = [
        'editor.background',
        'editor.foreground',
        'activityBar.background',
        'sideBar.background',
        'terminal.background',
        'terminal.foreground'
      ];

      for (const required of requiredColors) {
        if (!theme.colors[required]) {
          errors.push(`Missing required color: ${required}`);
        }
      }

      return { valid: errors.length === 0, errors };
    } catch (error) {
      return { 
        valid: false, 
        errors: [`Failed to parse theme file: ${error instanceof Error ? error.message : 'Unknown error'}`] 
      };
    }
  }

  validateColorConsistency(platforms: string[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const colorMappings: Map<string, Set<string>> = new Map();

    for (const platform of platforms) {
      const colors = this.extractPlatformColors(platform);
      for (const [usage, color] of colors) {
        if (!colorMappings.has(usage)) {
          colorMappings.set(usage, new Set());
        }
        colorMappings.get(usage)!.add(color);
      }
    }

    // Check for inconsistencies
    for (const [usage, colors] of colorMappings) {
      if (colors.size > 1) {
        errors.push(`Inconsistent colors for ${usage}: ${Array.from(colors).join(', ')}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private isValidHexColor(color: string, allowAlpha: boolean = true): boolean {
    if (allowAlpha) {
      return this.HEX_COLOR_WITH_ALPHA_REGEX.test(color);
    }
    return this.HEX_COLOR_REGEX.test(color);
  }

  private validateSemanticTokens(tokens: Record<string, any>, errors: string[]): void {
    for (const [token, settings] of Object.entries(tokens)) {
      if (typeof settings === 'object' && settings.foreground) {
        if (!this.isValidHexColor(settings.foreground)) {
          errors.push(`Invalid semantic token color for ${token}: ${settings.foreground}`);
        }
      }
    }
  }

  private extractPlatformColors(platformPath: string): Map<string, string> {
    const colors = new Map<string, string>();
    
    if (platformPath.endsWith('.json')) {
      // VS Code or Windows Terminal
      const content = JSON.parse(fs.readFileSync(platformPath, 'utf8'));
      if (content.colors) {
        for (const [key, value] of Object.entries(content.colors)) {
          if (typeof value === 'string') {
            colors.set(key, value);
          }
        }
      }
    } else if (platformPath.endsWith('.yaml')) {
      // Warp terminal
      const content = fs.readFileSync(platformPath, 'utf8');
      const colorMatches = content.match(/(\w+):\s*["']?(#[0-9a-fA-F]{6})["']?/g);
      if (colorMatches) {
        for (const match of colorMatches) {
          const [key, color] = match.split(':').map(s => s.trim().replace(/["']/g, ''));
          colors.set(key, color);
        }
      }
    }
    
    return colors;
  }

  validateColorPaletteAdherence(themePath: string): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const themeContent = fs.readFileSync(themePath, 'utf8');
    const theme: VSCodeTheme = JSON.parse(themeContent);
    
    const usedColors = new Set<string>();
    
    // Collect all colors used
    if (theme.colors) {
      Object.values(theme.colors).forEach(color => {
        if (typeof color === 'string') usedColors.add(color.toLowerCase());
      });
    }
    
    if (theme.semanticTokenColors) {
      this.collectSemanticColors(theme.semanticTokenColors, usedColors);
    }
    
    // Check if colors match the expected palette
    const allExpectedColors = Object.values(this.EXPECTED_PALETTE).flat();
    for (const color of usedColors) {
      if (!allExpectedColors.some(expected => expected.toLowerCase() === color)) {
        warnings.push(`Color ${color} is not in the expected nautical palette`);
      }
    }
    
    return { valid: warnings.length === 0, warnings };
  }

  private collectSemanticColors(tokens: Record<string, any>, colorSet: Set<string>): void {
    for (const settings of Object.values(tokens)) {
      if (typeof settings === 'object' && settings.foreground) {
        colorSet.add(settings.foreground.toLowerCase());
      }
    }
  }
}