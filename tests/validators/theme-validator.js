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
exports.ThemeValidator = void 0;
const fs = __importStar(require("fs"));
class ThemeValidator {
    constructor() {
        this.EXPECTED_PALETTE = {
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
        this.HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
        this.HEX_COLOR_WITH_ALPHA_REGEX = /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/;
    }
    validateVSCodeTheme(themePath) {
        const errors = [];
        try {
            const themeContent = fs.readFileSync(themePath, 'utf8');
            const theme = JSON.parse(themeContent);
            // Validate basic structure
            if (!theme.name)
                errors.push('Theme must have a name');
            if (theme.type !== 'dark')
                errors.push('Theme type must be "dark"');
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
        }
        catch (error) {
            return {
                valid: false,
                errors: [`Failed to parse theme file: ${error instanceof Error ? error.message : 'Unknown error'}`]
            };
        }
    }
    validateColorConsistency(platforms) {
        const errors = [];
        const colorMappings = new Map();
        for (const platform of platforms) {
            const colors = this.extractPlatformColors(platform);
            for (const [usage, color] of colors) {
                if (!colorMappings.has(usage)) {
                    colorMappings.set(usage, new Set());
                }
                colorMappings.get(usage).add(color);
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
    isValidHexColor(color, allowAlpha = true) {
        if (allowAlpha) {
            return this.HEX_COLOR_WITH_ALPHA_REGEX.test(color);
        }
        return this.HEX_COLOR_REGEX.test(color);
    }
    validateSemanticTokens(tokens, errors) {
        for (const [token, settings] of Object.entries(tokens)) {
            if (typeof settings === 'object' && settings.foreground) {
                if (!this.isValidHexColor(settings.foreground)) {
                    errors.push(`Invalid semantic token color for ${token}: ${settings.foreground}`);
                }
            }
        }
    }
    extractPlatformColors(platformPath) {
        const colors = new Map();
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
        }
        else if (platformPath.endsWith('.yaml')) {
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
    validateColorPaletteAdherence(themePath) {
        const warnings = [];
        const themeContent = fs.readFileSync(themePath, 'utf8');
        const theme = JSON.parse(themeContent);
        const usedColors = new Set();
        // Collect all colors used
        if (theme.colors) {
            Object.values(theme.colors).forEach(color => {
                if (typeof color === 'string')
                    usedColors.add(color.toLowerCase());
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
    collectSemanticColors(tokens, colorSet) {
        for (const settings of Object.values(tokens)) {
            if (typeof settings === 'object' && settings.foreground) {
                colorSet.add(settings.foreground.toLowerCase());
            }
        }
    }
}
exports.ThemeValidator = ThemeValidator;
//# sourceMappingURL=theme-validator.js.map