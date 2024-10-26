<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class TTVEditor_Scripts {
    private $options;

    public function __construct() {
        // Load plugin options
        $this->options = get_option( 'ttveditor_options' );

        // Enqueue scripts
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
    }

    // Enqueue scripts
    public function enqueue_scripts( $hook_suffix ) {
        if ( 'post-new.php' === $hook_suffix || 'post.php' === $hook_suffix ) {
            $screen = get_current_screen();
            if ( 'post' === $screen->post_type ) {
                // Localize script with options
                $script_data = array(
                    'preview_url'          => isset( $this->options['preview_url'] ) ? $this->options['preview_url'] : 'https://previews.teksttv.pages.dev/preview?data=',
                    'image_url'            => isset( $this->options['image_url'] ) ? $this->options['image_url'] : 'https://preview.zuidwestupdate.nl/wp-content/uploads/2024/10/hamhammm.png',
                    'soft_limit_title'     => isset( $this->options['soft_limit_title'] ) ? $this->options['soft_limit_title'] : 45,
                    'hard_limit_title'     => isset( $this->options['hard_limit_title'] ) ? $this->options['hard_limit_title'] : 50,
                    'soft_limit_textarea'  => isset( $this->options['soft_limit_textarea'] ) ? $this->options['soft_limit_textarea'] : 450,
                    'hard_limit_textarea'  => isset( $this->options['hard_limit_textarea'] ) ? $this->options['hard_limit_textarea'] : 475,
                );

                // Enqueue JavaScript file
                wp_enqueue_script(
                    'ttveditor-script',
                    TTVEDITOR_PLUGIN_URL . 'assets/js/ttveditor.js',
                    array(),
                    '1.0',
                    true
                );

                // Localize script with data
                wp_localize_script( 'ttveditor-script', 'ttveditorData', $script_data );
            }
        }
    }
}
