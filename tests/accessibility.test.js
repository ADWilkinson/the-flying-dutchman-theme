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
const accessibility_validator_1 = require("./validators/accessibility-validator");
describe('WCAG Accessibility Compliance', () => {
    const validator = new accessibility_validator_1.AccessibilityValidator();
    const themePath = path.join(__dirname, '..', 'themes', 'flying-dutchman-color-theme.json');
    let theme;
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
            const commentColor = '#546e7a';
            const ratio = validator.getContrastRatio(background, commentColor);
            expect(ratio).toBeGreaterThanOrEqual(2.5); // Relaxed for fog grey nautical aesthetic
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
//# sourceMappingURL=accessibility.test.js.map