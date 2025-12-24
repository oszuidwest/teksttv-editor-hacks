<?php
namespace ZuidWest\TekstTVEditor;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Scripts
{
    public function __construct()
    {
        // Enqueue scripts
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
    }

    // Enqueue scripts
    public function enqueue_scripts(string $hook_suffix): void
    {
        if ('post-new.php' === $hook_suffix || 'post.php' === $hook_suffix) {
            $screen = get_current_screen();
            if ('post' === $screen->post_type) {
                // Load options here to ensure they are up-to-date
                $options = get_option('ttveditor_options');

                $script_data = array(
                    'preview_url'         => isset($options['preview_url']) ? $options['preview_url'] : 'https://previews.teksttv.pages.dev/preview?data=',
                    'image_url'           => isset($options['image_url']) ? $options['image_url'] : 'https://preview.zuidwestupdate.nl/wp-content/uploads/2024/10/hamhammm.png',
                    'soft_limit_title'    => isset($options['soft_limit_title']) ? $options['soft_limit_title'] : 45,
                    'hard_limit_title'    => isset($options['hard_limit_title']) ? $options['hard_limit_title'] : 50,
                    'soft_limit_textarea' => isset($options['soft_limit_textarea']) ? $options['soft_limit_textarea'] : 450,
                    'hard_limit_textarea' => isset($options['hard_limit_textarea']) ? $options['hard_limit_textarea'] : 475,
                );

                // Enqueue the script without dependencies
                wp_enqueue_script(
                    'ttveditor-script',
                    plugins_url('../assets/js/ttveditor.js', __FILE__),
                    array(), // No dependencies
                    '1.0',
                    true // Enqueue in the footer
                );

                // Localize script data
                wp_localize_script('ttveditor-script', 'ttveditorData', $script_data);
            }
        }
    }
}
