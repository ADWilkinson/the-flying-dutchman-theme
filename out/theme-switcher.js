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
exports.ThemeSwitcher = void 0;
const vscode = __importStar(require("vscode"));
class ThemeSwitcher {
    constructor() {
        this.variants = [
            {
                id: 'standard',
                label: '🌊 The Flying Dutchman',
                description: 'Balanced nautical colors for everyday coding',
                themeId: 'The Flying Dutchman'
            },
            {
                id: 'high-contrast',
                label: '⚡ The Flying Dutchman High Contrast',
                description: 'Enhanced contrast for better accessibility',
                themeId: 'The Flying Dutchman High Contrast'
            },
            {
                id: 'soft',
                label: '🌫️ The Flying Dutchman Soft',
                description: 'Softer, muted nautical palette for reduced eye strain',
                themeId: 'The Flying Dutchman Soft'
            }
        ];
    }
    async showVariantPicker() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const items = this.variants.map(variant => ({
            label: variant.label,
            description: variant.description,
            detail: currentTheme === variant.themeId ? '$(check) Currently active' : '',
            variant: variant
        }));
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Choose a Flying Dutchman theme variant',
            matchOnDescription: true,
            matchOnDetail: true
        });
        if (selected) {
            await this.switchToVariant(selected.variant.id);
        }
    }
    async switchToVariant(variantId) {
        const variant = this.variants.find(v => v.id === variantId);
        if (!variant) {
            vscode.window.showErrorMessage(`Unknown theme variant: ${variantId}`);
            return;
        }
        try {
            await vscode.workspace.getConfiguration('workbench').update('colorTheme', variant.themeId, vscode.ConfigurationTarget.Global);
            // Update user preference
            await vscode.workspace.getConfiguration('flyingDutchmanTheme').update('preferredVariant', variantId, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Switched to ${variant.label}`, 'Open Settings').then(action => {
                if (action === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'flyingDutchmanTheme');
                }
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to switch theme: ${error}`);
        }
    }
    async showThemeInformation() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        const currentVariant = this.variants.find(v => v.themeId === currentTheme);
        const semanticHighlighting = vscode.workspace.getConfiguration('flyingDutchmanTheme')
            .get('enableSemanticHighlighting', true);
        const terminalIntegration = vscode.workspace.getConfiguration('flyingDutchmanTheme')
            .get('terminalIntegration', true);
        const info = [
            '⚓ **The Flying Dutchman Theme Information**',
            '',
            `**Current Variant:** ${currentVariant ? currentVariant.label : 'Not a Flying Dutchman theme'}`,
            currentVariant ? `**Description:** ${currentVariant.description}` : '',
            '',
            '**Available Variants:**',
            ...this.variants.map(v => `• ${v.label} - ${v.description}`),
            '',
            '**Current Settings:**',
            `• Semantic Highlighting: ${semanticHighlighting ? 'Enabled' : 'Disabled'}`,
            `• Terminal Integration: ${terminalIntegration ? 'Enabled' : 'Disabled'}`,
            '',
            '**Commands:**',
            '• Flying Dutchman: Switch Theme Variant',
            '• Flying Dutchman: Toggle Semantic Highlighting',
            '• Flying Dutchman: Open Theme Settings',
            '',
            '**Multi-Platform Support:**',
            '• VS Code (this extension)',
            '• iTerm2, Windows Terminal, Warp',
            '• Vim/Neovim, Sublime Text',
            '',
            '[GitHub Repository](https://github.com/ADWilkinson/the-flying-dutchman-theme) • [Marketplace](https://marketplace.visualstudio.com/items?itemName=DavyJones.the-flying-dutchman-theme)'
        ].filter(line => line !== '').join('\n');
        const document = await vscode.workspace.openTextDocument({
            content: info,
            language: 'markdown'
        });
        await vscode.window.showTextDocument(document);
    }
    getCurrentVariant() {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
        return this.variants.find(v => v.themeId === currentTheme);
    }
    getVariants() {
        return this.variants;
    }
}
exports.ThemeSwitcher = ThemeSwitcher;
//# sourceMappingURL=theme-switcher.js.map