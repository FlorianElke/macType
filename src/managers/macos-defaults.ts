/**
 * Type-safe macOS defaults settings based on https://macos-defaults.com/
 * This file provides IntelliSense support for all documented macOS settings
 */

// ============================================================================
// DOCK SETTINGS
// ============================================================================

export interface DockSettings {
  /** Dock position: 'left', 'bottom', 'right' */
  orientation?: 'left' | 'bottom' | 'right';

  /** Icon size in pixels (default: 48) */
  tilesize?: number;

  /** Auto-hide the Dock */
  autohide?: boolean;

  /** Auto-hide animation time modifier (default: 0.5) */
  'autohide-time-modifier'?: number;

  /** Auto-hide delay in seconds (default: 0.5) */
  'autohide-delay'?: number;

  /** Show recent applications in Dock */
  'show-recents'?: boolean;

  /** Minimize animation effect: 'genie' or 'scale' */
  mineffect?: 'genie' | 'scale';

  /** Show only active applications */
  'static-only'?: boolean;

  /** Scroll to open Exposé for an app */
  'scroll-to-open'?: boolean;

  /** Rearrange Spaces automatically (Mission Control) */
  'mru-spaces'?: boolean;
}

// ============================================================================
// FINDER SETTINGS
// ============================================================================

export interface FinderSettings {
  /** Allow quitting Finder via ⌘ + Q */
  QuitMenuItem?: boolean;

  /** Show all file extensions */
  AppleShowAllExtensions?: boolean;

  /** Show hidden files */
  AppleShowAllFiles?: boolean;

  /** Show path bar */
  ShowPathbar?: boolean;

  /** Default view style: 'icnv' (icon), 'clmv' (column), 'Nlsv' (list), 'glyv' (gallery) */
  FXPreferredViewStyle?: 'icnv' | 'clmv' | 'Nlsv' | 'glyv';

  /** Keep folders on top when sorting by name */
  _FXSortFoldersFirst?: boolean;

  /** Open folders in tabs instead of new windows */
  FinderSpawnTab?: boolean;

  /** Default search scope: 'SCev' (This Mac), 'SCcf' (Current Folder), 'SCsp' (Previous Scope) */
  FXDefaultSearchScope?: 'SCev' | 'SCcf' | 'SCsp';

  /** Remove items in Trash after 30 days */
  FXRemoveOldTrashItems?: boolean;

  /** Show warning before changing file extension */
  FXEnableExtensionChangeWarning?: boolean;

  /** Save new documents to iCloud by default */
  NSDocumentSaveNewDocumentsToCloud?: boolean;

  /** Show icons in window title bars */
  ShowWindowTitlebarIcons?: boolean;

  /** Toolbar title rollover delay */
  NSToolbarTitleViewRolloverDelay?: number;

  /** Sidebar icon size: 1 (small), 2 (medium), 3 (large) */
  NSTableViewDefaultSizeMode?: 1 | 2 | 3;
}

// ============================================================================
// DESKTOP SETTINGS
// ============================================================================

export interface DesktopSettings {
  /** Keep folders on top on desktop */
  _FXSortFoldersFirstOnDesktop?: boolean;

  /** Show all desktop icons */
  CreateDesktop?: boolean;

  /** Show hard disks on desktop */
  ShowHardDrivesOnDesktop?: boolean;

  /** Show external hard disks on desktop */
  ShowExternalHardDrivesOnDesktop?: boolean;

  /** Show removable media on desktop */
  ShowRemovableMediaOnDesktop?: boolean;

  /** Show mounted servers on desktop */
  ShowMountedServersOnDesktop?: boolean;
}

// ============================================================================
// SCREENSHOTS SETTINGS
// ============================================================================

export interface ScreenshotSettings {
  /** Disable shadow in screenshots */
  'disable-shadow'?: boolean;

  /** Include date in screenshot filename */
  'include-date'?: boolean;

  /** Screenshot save location (path) */
  location?: string;

  /** Show thumbnail after taking screenshot */
  'show-thumbnail'?: boolean;

  /** Screenshot file format: 'png', 'jpg', 'pdf', 'tiff', 'bmp', 'gif' */
  type?: 'png' | 'jpg' | 'pdf' | 'tiff' | 'bmp' | 'gif';
}

// ============================================================================
// MENUBAR SETTINGS
// ============================================================================

export interface MenuBarSettings {
  /** Flash clock time separators */
  FlashDateSeparators?: boolean;

  /** Digital clock format (e.g., "EEE MMM d  h:mm a") */
  DateFormat?: string;
}

// ============================================================================
// MOUSE SETTINGS
// ============================================================================

export interface MouseSettings {
  /** Disable mouse acceleration */
  'com.apple.mouse.linear'?: boolean;

  /** Mouse tracking speed (0.0 - 3.0+, default: 1.0) */
  'com.apple.mouse.scaling'?: number;

  /** Focus follows mouse (X11-style) */
  focusFollowsMouse?: boolean;
}

// ============================================================================
// TRACKPAD SETTINGS
// ============================================================================

export interface TrackpadSettings {
  /** Click weight/threshold: 0 (light), 1 (medium), 2 (firm) */
  FirstClickThreshold?: 0 | 1 | 2;

  /** Enable dragging with drag lock */
  DragLock?: boolean;

  /** Enable dragging without drag lock */
  Dragging?: boolean;

  /** Enable three finger drag */
  TrackpadThreeFingerDrag?: boolean;
}

// ============================================================================
// KEYBOARD SETTINGS
// ============================================================================

export interface KeyboardSettings {
  /** Enable press and hold for accent menu (true) or key repeat (false) */
  ApplePressAndHoldEnabled?: boolean;

  /** Fn/🌐 key usage type */
  AppleFnUsageType?: number;

  /** Function keys behavior: true (F-keys), false (media keys) */
  'com.apple.keyboard.fnState'?: boolean;

  /** Keyboard navigation mode: 0 (disabled), 2 (enabled) */
  AppleKeyboardUIMode?: 0 | 2;
}

// ============================================================================
// MISSION CONTROL SETTINGS
// ============================================================================

export interface MissionControlSettings {
  /** Automatically rearrange Spaces based on recent use */
  'mru-spaces'?: boolean;

  /** Group windows by application in Exposé */
  'expose-group-apps'?: boolean;

  /** When switching apps, switch to Space with open windows */
  AppleSpacesSwitchOnActivate?: boolean;

  /** Displays have separate Spaces */
  'spans-displays'?: boolean;
}

// ============================================================================
// XCODE SETTINGS
// ============================================================================

export interface XcodeSettings {
  /** Additional counterpart suffixes for "Related Items" menu */
  IDEAdditionalCounterpartSuffixes?: string[];

  /** Show build operation duration in toolbar */
  ShowBuildOperationDuration?: boolean;
}

// ============================================================================
// MISCELLANEOUS SETTINGS
// ============================================================================

export interface MiscSettings {
  /** Enable spring loading for all Dock items */
  'enable-spring-load-actions-on-all-items'?: boolean;

  /** Show Music song notifications */
  userWantsPlaybackNotifications?: boolean;

  /** Disable quarantine message for downloaded applications */
  LSQuarantine?: boolean;

  /** Show "unsaved changes" popup when closing documents */
  NSCloseAlwaysConfirmsChanges?: boolean;

  /** Restore windows when quitting and re-opening apps */
  NSQuitAlwaysKeepsWindows?: boolean;

  /** Help menu position (developer mode) */
  DevMode?: boolean;
}

// ============================================================================
// SAFARI SETTINGS
// ============================================================================

export interface SafariSettings {
  /** Show full URL in Smart Search Field */
  ShowFullURLInSmartSearchField?: boolean;
}

// ============================================================================
// ACTIVITY MONITOR SETTINGS
// ============================================================================

export interface ActivityMonitorSettings {
  /** Update frequency: 1 (very often), 2 (often), 5 (normally) */
  UpdatePeriod?: 1 | 2 | 5;

  /** Dock icon type: 0 (app icon), 2 (network), 3 (disk), 5 (CPU), 6 (GPU) */
  IconType?: 0 | 2 | 3 | 5 | 6;
}

// ============================================================================
// TEXTEDIT SETTINGS
// ============================================================================

export interface TextEditSettings {
  /** Use rich text format by default */
  RichText?: boolean;

  /** Use smart quotes */
  SmartQuotes?: boolean;
}

// ============================================================================
// TIME MACHINE SETTINGS
// ============================================================================

export interface TimeMachineSettings {
  /** Don't offer new disks for Time Machine backup */
  DoNotOfferNewDisksForBackup?: boolean;
}

// ============================================================================
// MESSAGES SETTINGS
// ============================================================================

export interface MessagesSettings {
  /** Show subject field in new messages */
  'show-subject-field'?: boolean;
}

// ============================================================================
// SIMULATOR SETTINGS
// ============================================================================

export interface SimulatorSettings {
  /** Screenshot save location (path) */
  ScreenShotSaveLocation?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a Dock setting
 */
export function dockSetting<K extends keyof DockSettings>(
  key: K,
  value: DockSettings[K]
) {
  return {
    domain: 'com.apple.dock',
    key,
    value,
  };
}

/**
 * Create a Finder setting
 */
export function finderSetting<K extends keyof FinderSettings>(
  key: K,
  value: FinderSettings[K]
) {
  return {
    domain: 'com.apple.finder',
    key,
    value,
  };
}

/**
 * Create a Desktop setting (uses Finder domain)
 */
export function desktopSetting<K extends keyof DesktopSettings>(
  key: K,
  value: DesktopSettings[K]
) {
  return {
    domain: 'com.apple.finder',
    key,
    value,
  };
}

/**
 * Create a Screenshot setting
 */
export function screenshotSetting<K extends keyof ScreenshotSettings>(
  key: K,
  value: ScreenshotSettings[K]
) {
  return {
    domain: 'com.apple.screencapture',
    key,
    value,
  };
}

/**
 * Create a MenuBar setting
 */
export function menuBarSetting<K extends keyof MenuBarSettings>(
  key: K,
  value: MenuBarSettings[K]
) {
  return {
    domain: 'com.apple.menuextra.clock',
    key,
    value,
  };
}

/**
 * Create a Mouse setting (uses NSGlobalDomain)
 */
export function mouseSetting<K extends keyof MouseSettings>(
  key: K,
  value: MouseSettings[K]
) {
  return {
    domain: 'NSGlobalDomain',
    key,
    value,
  };
}

/**
 * Create a Trackpad setting
 */
export function trackpadSetting<K extends keyof TrackpadSettings>(
  key: K,
  value: TrackpadSettings[K]
) {
  return {
    domain: 'com.apple.AppleMultitouchTrackpad',
    key,
    value,
  };
}

/**
 * Create a Keyboard setting (uses NSGlobalDomain)
 */
export function keyboardSetting<K extends keyof KeyboardSettings>(
  key: K,
  value: KeyboardSettings[K]
) {
  return {
    domain: 'NSGlobalDomain',
    key,
    value,
  };
}

/**
 * Create a Mission Control setting (uses Dock domain)
 */
export function missionControlSetting<K extends keyof MissionControlSettings>(
  key: K,
  value: MissionControlSettings[K]
) {
  return {
    domain: 'com.apple.dock',
    key,
    value,
  };
}

/**
 * Create an Xcode setting
 */
export function xcodeSetting<K extends keyof XcodeSettings>(
  key: K,
  value: XcodeSettings[K]
) {
  return {
    domain: 'com.apple.dt.Xcode',
    key,
    value,
  };
}

/**
 * Create a Safari setting
 */
export function safariSetting<K extends keyof SafariSettings>(
  key: K,
  value: SafariSettings[K]
) {
  return {
    domain: 'com.apple.Safari',
    key,
    value,
  };
}

/**
 * Create an Activity Monitor setting
 */
export function activityMonitorSetting<K extends keyof ActivityMonitorSettings>(
  key: K,
  value: ActivityMonitorSettings[K]
) {
  return {
    domain: 'com.apple.ActivityMonitor',
    key,
    value,
  };
}

/**
 * Create a TextEdit setting
 */
export function textEditSetting<K extends keyof TextEditSettings>(
  key: K,
  value: TextEditSettings[K]
) {
  return {
    domain: 'com.apple.TextEdit',
    key,
    value,
  };
}

/**
 * Create a Time Machine setting
 */
export function timeMachineSetting<K extends keyof TimeMachineSettings>(
  key: K,
  value: TimeMachineSettings[K]
) {
  return {
    domain: 'com.apple.TimeMachine',
    key,
    value,
  };
}

/**
 * Create a Messages setting
 */
export function messagesSetting<K extends keyof MessagesSettings>(
  key: K,
  value: MessagesSettings[K]
) {
  return {
    domain: 'com.apple.MobileSMS',
    key,
    value,
  };
}

/**
 * Create a Simulator setting
 */
export function simulatorSetting<K extends keyof SimulatorSettings>(
  key: K,
  value: SimulatorSettings[K]
) {
  return {
    domain: 'com.apple.iphonesimulator',
    key,
    value,
  };
}

/**
 * Create a miscellaneous NSGlobalDomain setting
 */
export function globalSetting<K extends keyof MiscSettings>(
  key: K,
  value: MiscSettings[K]
) {
  return {
    domain: 'NSGlobalDomain',
    key,
    value,
  };
}
