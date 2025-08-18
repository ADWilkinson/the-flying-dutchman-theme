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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const theme_switcher_1 = require("./theme-switcher");
const theme_status_bar_1 = require("./theme-status-bar");
const theme_configuration_1 = require("./theme-configuration");
function activate(context) {
    const themeSwitcher = new theme_switcher_1.ThemeSwitcher();
    const themeStatusBar = new theme_status_bar_1.ThemeStatusBar();
    const themeConfiguration = new theme_configuration_1.ThemeConfiguration();
    // Register theme switching commands
    const switchVariantCommand = vscode.commands.registerCommand('flyingDutchman.switchThemeVariant', () => themeSwitcher.showVariantPicker());
    const showThemeInfoCommand = vscode.commands.registerCommand('flyingDutchman.showThemeInfo', () => themeSwitcher.showThemeInformation());
    const switchToStandardCommand = vscode.commands.registerCommand('flyingDutchman.switchToStandard', () => themeSwitcher.switchToVariant('standard'));
    const switchToHighContrastCommand = vscode.commands.registerCommand('flyingDutchman.switchToHighContrast', () => themeSwitcher.switchToVariant('high-contrast'));
    const switchToSoftCommand = vscode.commands.registerCommand('flyingDutchman.switchToSoft', () => themeSwitcher.switchToVariant('soft'));
    const toggleSemanticHighlightingCommand = vscode.commands.registerCommand('flyingDutchman.toggleSemanticHighlighting', () => themeConfiguration.toggleSemanticHighlighting());
    const openThemeSettingsCommand = vscode.commands.registerCommand('flyingDutchman.openThemeSettings', () => themeConfiguration.openThemeSettings());
    // Register status bar item
    themeStatusBar.initialize();
    // Add commands to subscriptions
    context.subscriptions.push(switchVariantCommand, showThemeInfoCommand, switchToStandardCommand, switchToHighContrastCommand, switchToSoftCommand, toggleSemanticHighlightingCommand, openThemeSettingsCommand, themeStatusBar);
    // Listen for theme changes to update status bar
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('workbench.colorTheme')) {
            themeStatusBar.updateForCurrentTheme();
        }
    });
    // Initialize status bar with current theme
    themeStatusBar.updateForCurrentTheme();
    console.log('Flying Dutchman Theme Extension activated');
}
function deactivate() {
    console.log('Flying Dutchman Theme Extension deactivated');
}
//# sourceMappingURL=extension.js.map