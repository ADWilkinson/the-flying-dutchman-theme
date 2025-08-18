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
        const durationMs = Number(endTime - startTime) / 1000000;
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
            const scopes = new Set();
            const duplicates = [];
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
//# sourceMappingURL=performance.test.js.map