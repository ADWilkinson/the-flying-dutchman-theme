// Mock VS Code API for testing

const vscode = {
  ConfigurationTarget: {
    Global: 1,
    Workspace: 2,
    WorkspaceFolder: 3
  },
  StatusBarAlignment: {
    Left: 1,
    Right: 2
  },
  commands: {
    registerCommand: jest.fn(),
    executeCommand: jest.fn()
  },
  window: {
    showQuickPick: jest.fn(),
    showInformationMessage: jest.fn(),
    showErrorMessage: jest.fn(),
    showWarningMessage: jest.fn(),
    showTextDocument: jest.fn(),
    createStatusBarItem: jest.fn(() => ({
      text: '',
      tooltip: '',
      command: '',
      show: jest.fn(),
      hide: jest.fn(),
      dispose: jest.fn()
    }))
  },
  workspace: {
    getConfiguration: jest.fn((section) => ({
      get: jest.fn((key, defaultValue) => {
        // Return defaults for Flying Dutchman theme configuration
        if (section === 'flyingDutchmanTheme') {
          const defaults = {
            'preferredVariant': 'standard',
            'enableSemanticHighlighting': true,
            'terminalIntegration': true
          };
          return defaults[key] || defaultValue;
        }
        return defaultValue;
      }),
      update: jest.fn()
    })),
    onDidChangeConfiguration: jest.fn(),
    openTextDocument: jest.fn()
  },
  Uri: {
    file: jest.fn(),
    parse: jest.fn()
  }
};

module.exports = vscode;