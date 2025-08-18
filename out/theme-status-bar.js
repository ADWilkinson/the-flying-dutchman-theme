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
exports.ThemeStatusBar = void 0;
const vscode = __importStar(require("vscode"));
const theme_switcher_1 = require("./theme-switcher");
class ThemeStatusBar {
    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.themeSwitcher = new theme_switcher_1.ThemeSwitcher();
    }
    initialize() {
        this.statusBarItem.command = 'flyingDutchman.switchThemeVariant';
        this.statusBarItem.tooltip = 'Click to switch Flying Dutchman theme variant';
        this.updateForCurrentTheme();
        this.statusBarItem.show();
    }
    updateForCurrentTheme() {
        const currentVariant = this.themeSwitcher.getCurrentVariant();
        if (currentVariant) {
            // Extract emoji from the label for a clean status bar display
            const emoji = this.getVariantEmoji(currentVariant.id);
            this.statusBarItem.text = `⚓ ${emoji}`;
            this.statusBarItem.tooltip = `Flying Dutchman: ${currentVariant.description}\nClick to switch variant`;
            this.statusBarItem.show();
        }
        else {
            // Hide status bar item if not using a Flying Dutchman theme
            this.statusBarItem.hide();
        }
    }
    getVariantEmoji(variantId) {
        switch (variantId) {
            case 'standard':
                return '🌊';
            case 'high-contrast':
                return '⚡';
            case 'soft':
                return '🌫️';
            default:
                return '⚓';
        }
    }
    dispose() {
        this.statusBarItem.dispose();
    }
}
exports.ThemeStatusBar = ThemeStatusBar;
//# sourceMappingURL=theme-status-bar.js.map