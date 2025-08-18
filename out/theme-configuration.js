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
exports.ThemeConfiguration = void 0;
const vscode = __importStar(require("vscode"));
class ThemeConfiguration {
    async toggleSemanticHighlighting() {
        const config = vscode.workspace.getConfiguration('flyingDutchmanTheme');
        const currentValue = config.get('enableSemanticHighlighting', true);
        try {
            await config.update('enableSemanticHighlighting', !currentValue, vscode.ConfigurationTarget.Global);
            const newState = !currentValue ? 'enabled' : 'disabled';
            vscode.window.showInformationMessage(`Flying Dutchman semantic highlighting ${newState}`, 'Reload Window').then(action => {
                if (action === 'Reload Window') {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to toggle semantic highlighting: ${error}`);
        }
    }
    async openThemeSettings() {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'flyingDutchmanTheme');
    }
    async resetToDefaults() {
        const config = vscode.workspace.getConfiguration('flyingDutchmanTheme');
        const choice = await vscode.window.showWarningMessage('Reset all Flying Dutchman theme settings to defaults?', 'Reset', 'Cancel');
        if (choice !== 'Reset') {
            return;
        }
        try {
            await Promise.all([
                config.update('preferredVariant', 'standard', vscode.ConfigurationTarget.Global),
                config.update('enableSemanticHighlighting', true, vscode.ConfigurationTarget.Global),
                config.update('terminalIntegration', true, vscode.ConfigurationTarget.Global)
            ]);
            vscode.window.showInformationMessage('Flying Dutchman theme settings reset to defaults', 'Reload Window').then(action => {
                if (action === 'Reload Window') {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to reset settings: ${error}`);
        }
    }
    getCurrentConfiguration() {
        const config = vscode.workspace.getConfiguration('flyingDutchmanTheme');
        return {
            preferredVariant: config.get('preferredVariant', 'standard'),
            enableSemanticHighlighting: config.get('enableSemanticHighlighting', true),
            terminalIntegration: config.get('terminalIntegration', true)
        };
    }
}
exports.ThemeConfiguration = ThemeConfiguration;
//# sourceMappingURL=theme-configuration.js.map