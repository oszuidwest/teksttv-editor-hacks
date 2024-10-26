<?php
/*
Plugin Name: Tekst TV Editor Hacks
Description: Enhances the Tekst TV editor with preview functionality and character limit warnings.
Version: 0.9
Author: Streekomroep ZuidWest
*/

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

// Define plugin constants
define( 'TTVEDITOR_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'TTVEDITOR_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Include required files
require_once TTVEDITOR_PLUGIN_DIR . 'includes/class-ttveditor-settings.php';
require_once TTVEDITOR_PLUGIN_DIR . 'includes/class-ttveditor-scripts.php';

// Initialize the plugin
function ttveditor_init() {
    new TTVEditor_Settings();
    new TTVEditor_Scripts();
}
add_action( 'plugins_loaded', 'ttveditor_init' );
