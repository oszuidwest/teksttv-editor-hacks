<?php
/*
Plugin Name: Tekst TV Editor Hacks
Description: Enhances the Tekst TV editor with preview functionality and character limit warnings.
Version: 0.9.1
Author: Streekomroep ZuidWest
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define plugin constants
define('ZW_TTVEDITOR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ZW_TTVEDITOR_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include required files
require_once ZW_TTVEDITOR_PLUGIN_DIR . 'includes/class-ttveditor-settings.php';
require_once ZW_TTVEDITOR_PLUGIN_DIR . 'includes/class-ttveditor-scripts.php';

// Initialize the plugin
function zw_ttveditor_plugin_init(): void
{
    new \ZuidWest\TekstTVEditor\Settings();
    new \ZuidWest\TekstTVEditor\Scripts();
}
add_action('plugins_loaded', 'zw_ttveditor_plugin_init');
