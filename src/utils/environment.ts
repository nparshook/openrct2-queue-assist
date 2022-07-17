/**
 * Returns the build configuration of the plugin.
 */
export const pluginName = '__PLUGIN_NAME__';

/**
 * Returns the current version number of the plugin.
 */
export const pluginVersionNumber = '__PLUGIN_VERSION__';


/**
 * Returns the build configuration of the plugin.
 */
export const buildConfiguration = '__BUILD_CONFIGURATION__';

/**
 * Returns true if the current build is a production build.
 */
// @ts-expect-error: boolean expression is affected by build variable
// replacement.
export const isProduction = (buildConfiguration === 'production');


/**
 * Returns true if the current build is a development build.
 */
// @ts-expect-error: boolean expression is affected by build variable
// replacement.
export const isDevelopment = (buildConfiguration === 'development');

/**
 * Returns the full version of the plugin
 */
export const pluginVersion =
    `${pluginVersionNumber}${isDevelopment ? '-' : ''}${buildConfiguration}`

/**
 * Returns true if the UI is available, or false if the game is running in
 * headless mode.
 */
export const isUiAvailable = (typeof ui !== 'undefined');
