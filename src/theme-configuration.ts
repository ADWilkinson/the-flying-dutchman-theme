import * as vscode from 'vscode';

export class ThemeConfiguration {
    public async toggleSemanticHighlighting(): Promise<void> {
        const config = vscode.workspace.getConfiguration('flyingDutchmanTheme');
        const currentValue = config.get<boolean>('enableSemanticHighlighting', true);
        
        try {
            await config.update(
                'enableSemanticHighlighting',
                !currentValue,
                vscode.ConfigurationTarget.Global
            );

            const newState = !currentValue ? 'enabled' : 'disabled';
            vscode.window.showInformationMessage(
                `Flying Dutchman semantic highlighting ${newState}`,
                'Reload Window'
            ).then(action => {
                if (action === 'Reload Window') {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to toggle semantic highlighting: ${error}`);
        }
    }

    public async openThemeSettings(): Promise<void> {
        await vscode.commands.executeCommand(
            'workbench.action.openSettings',
            'flyingDutchmanTheme'
        );
    }

    public async resetToDefaults(): Promise<void> {
        const config = vscode.workspace.getConfiguration('flyingDutchmanTheme');
        
        const choice = await vscode.window.showWarningMessage(
            'Reset all Flying Dutchman theme settings to defaults?',
            'Reset',
            'Cancel'
        );

        if (choice !== 'Reset') {
            return;
        }

        try {
            await Promise.all([
                config.update('preferredVariant', 'standard', vscode.ConfigurationTarget.Global),
                config.update('enableSemanticHighlighting', true, vscode.ConfigurationTarget.Global),
                config.update('terminalIntegration', true, vscode.ConfigurationTarget.Global)
            ]);

            vscode.window.showInformationMessage(
                'Flying Dutchman theme settings reset to defaults',
                'Reload Window'
            ).then(action => {
                if (action === 'Reload Window') {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to reset settings: ${error}`);
        }
    }

    public getCurrentConfiguration(): {
        preferredVariant: string;
        enableSemanticHighlighting: boolean;
        terminalIntegration: boolean;
    } {
        const config = vscode.workspace.getConfiguration('flyingDutchmanTheme');
        
        return {
            preferredVariant: config.get<string>('preferredVariant', 'standard'),
            enableSemanticHighlighting: config.get<boolean>('enableSemanticHighlighting', true),
            terminalIntegration: config.get<boolean>('terminalIntegration', true)
        };
    }
}