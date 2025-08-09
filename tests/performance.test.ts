import * as path from 'path';
import * as fs from 'fs';

describe('Theme Performance', () => {
  const themePath = path.join(__dirname, '..', 'themes', 'flying-dutchman-color-theme.json');
  
  test('theme file should be under 50KB', () => {
    const stats = fs.statSync(themePath);
    const sizeInKB = stats.size / 1024;
    
    expect(sizeInKB).toBeLessThan(50);
  });

  test('theme should parse quickly', () => {
    const startTime = process.hrtime.bigint();
    
    // Parse the theme 100 times to get measurable timing
    for (let i = 0; i < 100; i++) {
      const content = fs.readFileSync(themePath, 'utf8');
      JSON.parse(content);
    }
    
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    
    // Should parse 100 times in under 100ms (1ms per parse)
    expect(durationMs).toBeLessThan(100);
  });

  test('theme should not have excessive token colors', () => {
    const content = fs.readFileSync(themePath, 'utf8');
    const theme = JSON.parse(content);
    
    // Check tokenColors array size
    if (theme.tokenColors) {
      expect(theme.tokenColors.length).toBeLessThan(500);
    }
  });

  test('theme should not have duplicate token scopes', () => {
    const content = fs.readFileSync(themePath, 'utf8');
    const theme = JSON.parse(content);
    
    if (theme.tokenColors) {
      const scopes = new Set<string>();
      const duplicates: string[] = [];
      
      for (const token of theme.tokenColors) {
        if (token.scope) {
          const scopeStr = Array.isArray(token.scope) ? token.scope.join(',') : token.scope;
          
          if (scopes.has(scopeStr)) {
            duplicates.push(scopeStr);
          }
          scopes.add(scopeStr);
        }
      }
      
      expect(duplicates).toHaveLength(0);
    }
  });

  test('theme colors should use efficient format', () => {
    const content = fs.readFileSync(themePath, 'utf8');
    const theme = JSON.parse(content);
    
    let inefficientColors = 0;
    
    if (theme.colors) {
      for (const [key, value] of Object.entries(theme.colors)) {
        if (typeof value === 'string') {
          // Check for inefficient formats like rgb() or rgba()
          if (value.includes('rgb')) {
            inefficientColors++;
          }
          
          // Check for uppercase hex (should be lowercase for consistency)
          if (value.match(/[A-F]/)) {
            inefficientColors++;
          }
        }
      }
    }
    
    expect(inefficientColors).toBe(0);
  });

  test('all platform theme files should be optimized', () => {
    const platforms = [
      { path: path.join(__dirname, '..', 'windows-terminal', 'The-Flying-Dutchman.json'), maxSize: 5 },
      { path: path.join(__dirname, '..', 'warp', 'the-flying-dutchman.yaml'), maxSize: 5 },
      { path: path.join(__dirname, '..', 'iterm', 'The-Flying-Dutchman.itermcolors'), maxSize: 20 },
      { path: path.join(__dirname, '..', 'sublime-text', 'The-Flying-Dutchman.tmTheme'), maxSize: 30 },
      { path: path.join(__dirname, '..', 'vim', 'colors', 'flying-dutchman.vim'), maxSize: 10 }
    ];
    
    for (const platform of platforms) {
      if (fs.existsSync(platform.path)) {
        const stats = fs.statSync(platform.path);
        const sizeInKB = stats.size / 1024;
        
        expect(sizeInKB).toBeLessThan(platform.maxSize);
      }
    }
  });

  test('theme should not have excessive nesting in semantic tokens', () => {
    const content = fs.readFileSync(themePath, 'utf8');
    const theme = JSON.parse(content);
    
    if (theme.semanticTokenColors) {
      const jsonStr = JSON.stringify(theme.semanticTokenColors);
      const nestingDepth = (jsonStr.match(/{/g) || []).length;
      
      // Semantic tokens should have reasonable nesting
      expect(nestingDepth).toBeLessThan(50);
    }
  });
});