import { Configuration } from './src/types';
import { desktopSetting, dockSetting, menuBarSetting, trackpadSetting } from './src/managers/macos-defaults';

declare var __dirname: any;

const config: Configuration = {
  brew: {
    packages: [
      'git',
      'claude-code',
      'zsh-syntax-highlighting',
      'mas',
      'go'
    ],
    casks: [
      '1password',
      'google-chrome',
      'visual-studio-code',
      'postman',
      'discord'
    ],
  },

  appstore: {
    apps: [
      { id: 497714887, name: 'WebSSH' }
    ],
  },

  macos: {
    settings: [
      trackpadSetting('Clicking', true),
      dockSetting('show-recents', false),
    ],
    dockApps: [
      { name: 'Visual Studio Code', position: 1 },
      { name: 'Google Chrome' },
      { name: '1Password' },
      { name: 'Postman' }
    ],
    wallpaper: __dirname + '/wallpaper.png'
  },

  git: {
    settings: [
      { scope: 'global', key: 'user.name', value: 'Florian Elke' },
      { scope: 'global', key: 'user.email', value: 'flo@gentlent.com' },
    ]
  },

  files: [
    {
      source: 'configs/zshrc',
      target: '~/.zshrc',
      backup: true
    },
    {
      source: 'configs/ssh_config',
      target: '~/.ssh/config',
      backup: true
    }
  ]
};

export default config;
