/**
 * constants.ts
 * =============
 * Provides app constants that can be freely referenced
 */

// Local Storage. Prefixed before the workspace id. The current path in that workspace.
export const kCurrentPathKeyPrefix = '__ahq_current_path::' as const;

// Local Storage. Prefixed before the workspace id. The timestamp of the last SFX played in that workspace.
export const kLastSFXPlayedKeyPrefix = '__ahq_last_sfx_played::' as const;

// Local Storage. Prefixed before the workspace id. A set of "favorited" items in that workspace.
export const kFavoritesKeyPrefix = '__ahq_favorites::' as const;

// Local Storage. Prefixed before the workspace id. Whether or not the user prefers to combine folders and files for a given path.
export const kFolderCombinePrefix = '__ahq_folder_combine::' as const;

// Local Storage. Whether or not the user prefers to combine folders and files for a given path.
export const kFolderAlwaysCombine = '__ahq_folder_combine_always' as const;

// Local Storage. Whether or not the user prefers to always alphabetically sort folders.
export const kFolderAlwaysAlphasort = '__ahq_folder_always_alphasort' as const;

// Local Storage. Whether or not the user prefers to always alphabetically sort files.
export const kFileAlwaysAlphasort = '__ahq_folder_always_alphasort' as const;

// Local Storage. The volume for the user.
export const kGlobalVolumeKey = '__ahq_global_volume' as const;

// Local Storage. A set of workspace IDs recently visited.
export const kRecentsKey = '__ahq_recents' as const;

// Local Storage. Whether the user prefers dark or light mode.
export const kColorModeKey = '__ahq_color_mode' as const;

// IndexedDB, used for idb-keyval. Contains whether the offline cache is enabled.
export const kCacheEnabledKey = '__ahq_should_cache' as const;

// Used in the service worker; determines concurrency when caching multiple URLs.
export const kMaxConcurrentDownloads = 2 as const;

// The number of recents to show on the home page
export const kMaxRecents = 5 as const;

// The default volume level
export const kDefaultVolume = 0.2 as const;

// The maximum amount we allow the audio to drift from what's defined on the server before
//  correcting it
export const kMaxAudioDriftAllowance = 1.5 as const;
