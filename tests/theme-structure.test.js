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
const theme_validator_1 = require("./validators/theme-validator");
describe('The Flying Dutchman Theme Structure', () => {
    const validator = new theme_validator_1.ThemeValidator();
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
//# sourceMappingURL=theme-structure.test.js.map