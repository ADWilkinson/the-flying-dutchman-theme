import * as vscode from 'vscode';
import { ThemeSwitcher } from './theme-switcher';
import { ThemeStatusBar } from './theme-status-bar';
import { ThemeConfiguration } from './theme-configuration';

export function activate(context: vscode.ExtensionContext) {
    const themeSwitcher = new ThemeSwitcher();
    const themeStatusBar = new ThemeStatusBar();
    const themeConfiguration = new ThemeConfiguration();

    // Register theme switching commands
    const switchVariantCommand = vscode.commands.registerCommand(
        'flyingDutchman.switchThemeVariant',
        () => themeSwitcher.showVariantPicker()
    );

    const showThemeInfoCommand = vscode.commands.registerCommand(
        'flyingDutchman.showThemeInfo',
        () => themeSwitcher.showThemeInformation()
    );

    const switchToStandardCommand = vscode.commands.registerCommand(
        'flyingDutchman.switchToStandard',
        () => themeSwitcher.switchToVariant('standard')
    );

    const switchToHighContrastCommand = vscode.commands.registerCommand(
        'flyingDutchman.switchToHighContrast',
        () => themeSwitcher.switchToVariant('high-contrast')
    );

    const switchToSoftCommand = vscode.commands.registerCommand(
        'flyingDutchman.switchToSoft',
        () => themeSwitcher.switchToVariant('soft')
    );

    const toggleSemanticHighlightingCommand = vscode.commands.registerCommand(
        'flyingDutchman.toggleSemanticHighlighting',
        () => themeConfiguration.toggleSemanticHighlighting()
    );

    const openThemeSettingsCommand = vscode.commands.registerCommand(
        'flyingDutchman.openThemeSettings',
        () => themeConfiguration.openThemeSettings()
    );

    // Register status bar item
    themeStatusBar.initialize();

    // Add commands to subscriptions
    context.subscriptions.push(
        switchVariantCommand,
        showThemeInfoCommand,
        switchToStandardCommand,
        switchToHighContrastCommand,
        switchToSoftCommand,
        toggleSemanticHighlightingCommand,
        openThemeSettingsCommand,
        themeStatusBar
    );

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

export function deactivate() {
    console.log('Flying Dutchman Theme Extension deactivated');
}