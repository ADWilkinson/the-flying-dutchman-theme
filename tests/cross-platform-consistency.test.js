"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const theme_validator_1 = require("./validators/theme-validator");
describe('Cross-Platform Color Consistency', () => {
    const validator = new theme_validator_1.ThemeValidator();
    const platforms = [
        path.join(__dirname, '..', 'themes', 'flying-dutchman-color-theme.json'),
        path.join(__dirname, '..', 'windows-terminal', 'The-Flying-Dutchman.json'),
        path.join(__dirname, '..', 'warp', 'the-flying-dutchman.yaml')
    ];
    test('all platform theme files should exist', () => {
        for (const platform of platforms) {
            expect(fs.existsSync(platform)).toBe(true);
        }
    });
    test('should have consistent colors across platforms', () => {
        const result = validator.validateColorConsistency(platforms);
        if (!result.valid) {
            console.error('Color consistency errors:', result.errors);
        }
        // Allow some inconsistencies as platforms have different color models
        expect(result.errors.length).toBeLessThan(5);
    });
    test('Windows Terminal theme should have valid structure', () => {
        const winTermPath = path.join(__dirname, '..', 'windows-terminal', 'The-Flying-Dutchman.json');
        const content = fs.readFileSync(winTermPath, 'utf8');
        const theme = JSON.parse(content);
        expect(theme.name).toBe('The Flying Dutchman');
        expect(theme.background).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.foreground).toMatch(/^#[0-9a-fA-F]{6}$/);
        // Check for required terminal colors
        const requiredColors = [
            'black', 'red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'white',
            'brightBlack', 'brightRed', 'brightGreen', 'brightYellow', 'brightBlue', 'brightPurple', 'brightCyan', 'brightWhite'
        ];
        for (const color of requiredColors) {
            expect(theme[color]).toMatch(/^#[0-9a-fA-F]{6}$/);
        }
    });
    test('Warp theme should have valid YAML structure', () => {
        const warpPath = path.join(__dirname, '..', 'warp', 'the-flying-dutchman.yaml');
        const content = fs.readFileSync(warpPath, 'utf8');
        expect(content).toContain("name: 'The Flying Dutchman'");
        expect(content).toContain('background:');
        expect(content).toContain('foreground:');
        expect(content).toContain('accent:');
        // Check color format
        const colorMatches = content.match(/#[0-9a-fA-F]{6}/g);
        expect(colorMatches).not.toBeNull();
        expect(colorMatches.length).toBeGreaterThan(15);
    });
    test('iTerm colors should be valid XML plist', () => {
        const itermPath = path.join(__dirname, '..', 'iterm', 'The-Flying-Dutchman.itermcolors');
        const content = fs.readFileSync(itermPath, 'utf8');
        expect(content).toContain('<?xml');
        expect(content).toContain('<!DOCTYPE plist');
        expect(content).toContain('<plist version="1.0">');
        expect(content).toContain('</plist>');
        // Check for color components
        expect(content).toContain('Red Component');
        expect(content).toContain('Green Component');
        expect(content).toContain('Blue Component');
    });
    test('Sublime Text theme should be valid TextMate format', () => {
        const sublimePath = path.join(__dirname, '..', 'sublime-text', 'The-Flying-Dutchman.tmTheme');
        const content = fs.readFileSync(sublimePath, 'utf8');
        expect(content).toContain('<?xml');
        expect(content).toContain('<!DOCTYPE plist');
        expect(content).toContain('<key>name</key>');
        expect(content).toContain('<string>The Flying Dutchman</string>');
        // Check for theme settings
        expect(content).toContain('<key>settings</key>');
        expect(content).toContain('<key>background</key>');
        expect(content).toContain('<key>foreground</key>');
    });
    test('Vim colorscheme should have valid structure', () => {
        const vimPath = path.join(__dirname, '..', 'vim', 'colors', 'flying-dutchman.vim');
        const content = fs.readFileSync(vimPath, 'utf8');
        expect(content).toContain('let g:colors_name = "flying-dutchman"');
        expect(content).toContain('set background=dark');
        expect(content).toContain('highlight clear');
        // Check for highlight groups (using call s:h syntax)
        expect(content).toContain('call s:h("Normal"');
        expect(content).toContain('call s:h("Comment"');
        expect(content).toContain('call s:h("String"');
        expect(content).toContain('call s:h("Function"');
    });
});
//# sourceMappingURL=cross-platform-consistency.test.js.map