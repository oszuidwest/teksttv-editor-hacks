<?php
/*
Plugin Name: Tekst TV Editor Hacks
Description: Enhances the Tekst TV editor with preview functionality and character limit warnings.
Version: 0.9.1
Author: Streekomroep ZuidWest
Author URI: https://www.zuidwesttv.nl
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

if (!defined('ABSPATH')) {
    exit; // Exits if accessed directly.
}

// Defines plugin constants.
define('ZW_TTVEDITOR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ZW_TTVEDITOR_PLUGIN_URL', plugin_dir_url(__FILE__));

// Includes required files.
require_once ZW_TTVEDITOR_PLUGIN_DIR . 'includes/class-ttveditor-settings.php';
require_once ZW_TTVEDITOR_PLUGIN_DIR . 'includes/class-ttveditor-scripts.php';

/**
 * Initializes the plugin by loading settings and scripts classes.
 *
 * @return void
 */
function zw_ttveditor_plugin_init(): void
{
    new \ZuidWest\TekstTVEditor\Settings();
    new \ZuidWest\TekstTVEditor\Scripts();
}
add_action('plugins_loaded', 'zw_ttveditor_plugin_init');
