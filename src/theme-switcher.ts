import * as vscode from 'vscode';

export interface ThemeVariant {
    id: string;
    label: string;
    description: string;
    themeId: string;
}

export class ThemeSwitcher {
    private readonly variants: ThemeVariant[] = [
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

    public async showVariantPicker(): Promise<void> {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme');
        
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

    public async switchToVariant(variantId: string): Promise<void> {
        const variant = this.variants.find(v => v.id === variantId);
        
        if (!variant) {
            vscode.window.showErrorMessage(`Unknown theme variant: ${variantId}`);
            return;
        }

        try {
            await vscode.workspace.getConfiguration('workbench').update(
                'colorTheme',
                variant.themeId,
                vscode.ConfigurationTarget.Global
            );

            // Update user preference
            await vscode.workspace.getConfiguration('flyingDutchmanTheme').update(
                'preferredVariant',
                variantId,
                vscode.ConfigurationTarget.Global
            );

            vscode.window.showInformationMessage(
                `Switched to ${variant.label}`,
                'Open Settings'
            ).then(action => {
                if (action === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'flyingDutchmanTheme');
                }
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to switch theme: ${error}`);
        }
    }

    public async showThemeInformation(): Promise<void> {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme');
        const currentVariant = this.variants.find(v => v.themeId === currentTheme);
        
        const semanticHighlighting = vscode.workspace.getConfiguration('flyingDutchmanTheme')
            .get<boolean>('enableSemanticHighlighting', true);
        
        const terminalIntegration = vscode.workspace.getConfiguration('flyingDutchmanTheme')
            .get<boolean>('terminalIntegration', true);

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

    public getCurrentVariant(): ThemeVariant | undefined {
        const currentTheme = vscode.workspace.getConfiguration('workbench').get<string>('colorTheme');
        return this.variants.find(v => v.themeId === currentTheme);
    }

    public getVariants(): readonly ThemeVariant[] {
        return this.variants;
    }
}