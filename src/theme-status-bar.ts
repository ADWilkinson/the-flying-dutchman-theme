import * as vscode from 'vscode';
import { ThemeSwitcher } from './theme-switcher';

export class ThemeStatusBar implements vscode.Disposable {
    private statusBarItem: vscode.StatusBarItem;
    private themeSwitcher: ThemeSwitcher;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.themeSwitcher = new ThemeSwitcher();
    }

    public initialize(): void {
        this.statusBarItem.command = 'flyingDutchman.switchThemeVariant';
        this.statusBarItem.tooltip = 'Click to switch Flying Dutchman theme variant';
        this.updateForCurrentTheme();
        this.statusBarItem.show();
    }

    public updateForCurrentTheme(): void {
        const currentVariant = this.themeSwitcher.getCurrentVariant();
        
        if (currentVariant) {
            // Extract emoji from the label for a clean status bar display
            const emoji = this.getVariantEmoji(currentVariant.id);
            this.statusBarItem.text = `⚓ ${emoji}`;
            this.statusBarItem.tooltip = `Flying Dutchman: ${currentVariant.description}\nClick to switch variant`;
            this.statusBarItem.show();
        } else {
            // Hide status bar item if not using a Flying Dutchman theme
            this.statusBarItem.hide();
        }
    }

    private getVariantEmoji(variantId: string): string {
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

    public dispose(): void {
        this.statusBarItem.dispose();
    }
}