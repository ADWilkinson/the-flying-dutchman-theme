export interface ContrastRatio {
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
}

export interface AccessibilityReport {
  wcagAACompliant: boolean;
  wcagAAACompliant: boolean;
  colorblindSafe: boolean;
  contrastRatios: ContrastRatio[];
  recommendations: string[];
}

export class AccessibilityValidator {
  private getLuminance(hexColor: string): number {
    const hex = hexColor.replace('#', '').substring(0, 6);
    
    const rgb = {
      r: parseInt(hex.substr(0, 2), 16) / 255,
      g: parseInt(hex.substr(2, 2), 16) / 255,
      b: parseInt(hex.substr(4, 2), 16) / 255
    };

    const gammaCorrect = (value: number): number => {
      return value <= 0.03928 
        ? value / 12.92 
        : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const r = gammaCorrect(rgb.r);
    const g = gammaCorrect(rgb.g);
    const b = gammaCorrect(rgb.b);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  meetsWCAGAA(ratio: number, largeText: boolean = false): boolean {
    return largeText ? ratio >= 3 : ratio >= 4.5;
  }

  meetsWCAGAAA(ratio: number, largeText: boolean = false): boolean {
    return largeText ? ratio >= 4.5 : ratio >= 7;
  }

  extractMainColors(theme: any): Map<string, string> {
    const colors = new Map<string, string>();
    
    if (theme.colors) {
      for (const [key, value] of Object.entries(theme.colors)) {
        if (typeof value === 'string' && value.startsWith('#')) {
          colors.set(key, value);
        }
      }
    }
    
    return colors;
  }

  checkColorblindAccessibility(colors: Map<string, string>): string[] {
    const issues: string[] = [];
    
    const errorColor = colors.get('editorError.foreground');
    const successColor = colors.get('editorInfo.foreground') || colors.get('editorWarning.foreground');
    
    if (errorColor && successColor) {
      const errorHue = this.getHue(errorColor);
      const successHue = this.getHue(successColor);
      
      if ((errorHue >= 340 || errorHue <= 20) && (successHue >= 80 && successHue <= 140)) {
        issues.push('Error and success states rely on red/green distinction which may be problematic for colorblind users');
      }
    }
    
    const criticalPairs = [
      ['editorError.foreground', 'editor.foreground'],
      ['editorWarning.foreground', 'editor.foreground'],
      ['editorInfo.foreground', 'editor.foreground']
    ];
    
    for (const [color1Key, color2Key] of criticalPairs) {
      const color1 = colors.get(color1Key);
      const color2 = colors.get(color2Key);
      
      if (color1 && color2) {
        const lum1 = this.getLuminance(color1);
        const lum2 = this.getLuminance(color2);
        const lumDiff = Math.abs(lum1 - lum2);
        
        if (lumDiff < 0.1) {
          issues.push(`${color1Key} and ${color2Key} have insufficient luminance difference for colorblind users`);
        }
      }
    }
    
    return issues;
  }

  getHue(hexColor: string): number {
    const hex = hexColor.replace('#', '').substring(0, 6);
    
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    if (delta === 0) return 0;
    
    let hue = 0;
    
    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }
    
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
    
    return hue;
  }

  generateAccessibilityReport(theme: any): AccessibilityReport {
    const report: AccessibilityReport = {
      wcagAACompliant: true,
      wcagAAACompliant: true,
      colorblindSafe: true,
      contrastRatios: [],
      recommendations: []
    };

    const colors = this.extractMainColors(theme);
    
    const textPairs = [
      ['editor.background', 'editor.foreground'],
      ['terminal.background', 'terminal.foreground'],
      ['sideBar.background', 'sideBar.foreground'],
      ['statusBar.background', 'statusBar.foreground'],
      ['activityBar.background', 'activityBar.foreground']
    ];
    
    for (const [bgKey, fgKey] of textPairs) {
      const bg = colors.get(bgKey);
      const fg = colors.get(fgKey);
      
      if (bg && fg) {
        const ratio = this.getContrastRatio(bg, fg);
        const wcagAA = this.meetsWCAGAA(ratio);
        const wcagAAA = this.meetsWCAGAAA(ratio);
        
        report.contrastRatios.push({
          background: bg,
          foreground: fg,
          ratio: Math.round(ratio * 100) / 100,
          wcagAA,
          wcagAAA
        });
        
        if (!wcagAA) {
          report.wcagAACompliant = false;
          const ratioStr = ratio.toFixed(2);
          report.recommendations.push(`${fgKey} on ${bgKey} does not meet WCAG AA standards (ratio: ${ratioStr})`);
        }
        
        if (!wcagAAA) {
          report.wcagAAACompliant = false;
        }
      }
    }
    
    const colorblindIssues = this.checkColorblindAccessibility(colors);
    if (colorblindIssues.length > 0) {
      report.colorblindSafe = false;
      report.recommendations.push(...colorblindIssues);
    }
    
    const syntaxColors = [
      ['editor.background', '#48bb78'],
      ['editor.background', '#7fb3d5'],
      ['editor.background', '#5dade2'],
      ['editor.background', '#d4af37'],
      ['editor.background', '#e53e3e']
    ];
    
    for (const [bgKey, syntaxColor] of syntaxColors) {
      const bg = colors.get(bgKey);
      
      if (bg && syntaxColor) {
        const ratio = this.getContrastRatio(bg, syntaxColor);
        
        if (!this.meetsWCAGAA(ratio)) {
          report.wcagAACompliant = false;
          const ratioStr = ratio.toFixed(2);
          report.recommendations.push(`Syntax color ${syntaxColor} has insufficient contrast (ratio: ${ratioStr})`);
        }
      }
    }
    
    if (report.wcagAACompliant && !report.wcagAAACompliant) {
      report.recommendations.push('Theme meets WCAG AA but not AAA standards. Consider improving contrast for better accessibility.');
    }
    
    if (report.recommendations.length === 0) {
      report.recommendations.push('Theme passes all accessibility checks!');
    }
    
    return report;
  }
}