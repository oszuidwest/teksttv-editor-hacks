<?php
namespace ZuidWest\TekstTVEditor;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class Settings
{
    private $options;

    public function __construct()
    {
        // Load plugin options
        $this->options = get_option('ttveditor_options');

        // Admin menu and settings
        add_action('admin_menu', array($this, 'add_plugin_page'));
        add_action('admin_init', array($this, 'page_init'));
    }

    // Add settings page
    public function add_plugin_page()
    {
        add_options_page(
            'Tekst TV Editor Hacks Settings',
            'Tekst TV Editor Hacks',
            'manage_options',
            'ttveditor-settings',
            array($this, 'create_admin_page')
        );
    }

    // Settings page content
    public function create_admin_page()
    {
        ?>
        <div class="wrap">
            <h1>Tekst TV Editor Hacks Settings</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('ttveditor_option_group');
                do_settings_sections('ttveditor-settings');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }

    // Register and add settings
    public function page_init()
    {
        register_setting(
            'ttveditor_option_group', // Option group
            'ttveditor_options',      // Option name
            array($this, 'sanitize')  // Sanitize callback
        );

        // Settings Section
        add_settings_section(
            'ttveditor_setting_section', // ID
            'Settings',                  // Title
            '__return_false',            // Callback
            'ttveditor-settings'         // Page
        );

        // Preview URL
        add_settings_field(
            'preview_url',
            'Preview URL',
            array($this, 'preview_url_callback'),
            'ttveditor-settings',
            'ttveditor_setting_section'
        );

        // Image URL
        add_settings_field(
            'image_url',
            'Image URL',
            array($this, 'image_url_callback'),
            'ttveditor-settings',
            'ttveditor_setting_section'
        );

        // Character Limits Section
        add_settings_section(
            'ttveditor_character_limits_section', // ID
            'Character Limits',                   // Title
            '__return_false',                     // Callback
            'ttveditor-settings'                  // Page
        );

        // Title Soft Limit
        add_settings_field(
            'soft_limit_title',
            'Title Soft Limit',
            array($this, 'soft_limit_title_callback'),
            'ttveditor-settings',
            'ttveditor_character_limits_section'
        );

        // Title Hard Limit
        add_settings_field(
            'hard_limit_title',
            'Title Hard Limit',
            array($this, 'hard_limit_title_callback'),
            'ttveditor-settings',
            'ttveditor_character_limits_section'
        );

        // Textarea Soft Limit
        add_settings_field(
            'soft_limit_textarea',
            'Textarea Soft Limit',
            array($this, 'soft_limit_textarea_callback'),
            'ttveditor-settings',
            'ttveditor_character_limits_section'
        );

        // Textarea Hard Limit
        add_settings_field(
            'hard_limit_textarea',
            'Textarea Hard Limit',
            array($this, 'hard_limit_textarea_callback'),
            'ttveditor-settings',
            'ttveditor_character_limits_section'
        );
    }

    // Sanitize input
    public function sanitize($input)
    {
        $new_input = array();

        if (isset($input['preview_url'])) {
            $new_input['preview_url'] = esc_url_raw($input['preview_url']);
        }

        if (isset($input['image_url'])) {
            $new_input['image_url'] = esc_url_raw($input['image_url']);
        }

        if (isset($input['soft_limit_title'])) {
            $new_input['soft_limit_title'] = absint($input['soft_limit_title']);
        }

        if (isset($input['hard_limit_title'])) {
            $new_input['hard_limit_title'] = absint($input['hard_limit_title']);
        }

        if (isset($input['soft_limit_textarea'])) {
            $new_input['soft_limit_textarea'] = absint($input['soft_limit_textarea']);
        }

        if (isset($input['hard_limit_textarea'])) {
            $new_input['hard_limit_textarea'] = absint($input['hard_limit_textarea']);
        }

        return $new_input;
    }

    // Callback functions for settings fields
    public function preview_url_callback()
    {
        printf(
            '<input type="text" id="preview_url" name="ttveditor_options[preview_url]" value="%s" style="width: 400px;" />',
            isset($this->options['preview_url']) ? esc_attr($this->options['preview_url']) : 'https://teksttv.pages.dev/preview?data='
        );
        echo '<p class="description">De basis-URL die wordt gebruikt voor previews. De base64-data wordt aan deze URL toegevoegd.</p>';
    }

    public function image_url_callback()
    {
        printf(
            '<input type="text" id="image_url" name="ttveditor_options[image_url]" value="%s" style="width: 400px;" />',
            isset($this->options['image_url']) ? esc_attr($this->options['image_url']) : 'https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png'
        );
        echo '<p class="description">De afbeelding die bij de preview wordt getoond.</p>';
    }

    public function soft_limit_title_callback()
    {
        printf(
            '<input type="number" id="soft_limit_title" name="ttveditor_options[soft_limit_title]" value="%s" />',
            isset($this->options['soft_limit_title']) ? esc_attr($this->options['soft_limit_title']) : '45'
        );
        echo '<p class="description">Zachte tekenlimiet voor de titel.</p>';
    }

    public function hard_limit_title_callback()
    {
        printf(
            '<input type="number" id="hard_limit_title" name="ttveditor_options[hard_limit_title]" value="%s" />',
            isset($this->options['hard_limit_title']) ? esc_attr($this->options['hard_limit_title']) : '50'
        );
        echo '<p class="description">Harde tekenlimiet voor de titel.</p>';
    }

    public function soft_limit_textarea_callback()
    {
        printf(
            '<input type="number" id="soft_limit_textarea" name="ttveditor_options[soft_limit_textarea]" value="%s" />',
            isset($this->options['soft_limit_textarea']) ? esc_attr($this->options['soft_limit_textarea']) : '450'
        );
        echo '<p class="description">Zachte tekenlimiet per pagina in het tekstvak.</p>';
    }

    public function hard_limit_textarea_callback()
    {
        printf(
            '<input type="number" id="hard_limit_textarea" name="ttveditor_options[hard_limit_textarea]" value="%s" />',
            isset($this->options['hard_limit_textarea']) ? esc_attr($this->options['hard_limit_textarea']) : '475'
        );
        echo '<p class="description">Harde tekenlimiet per pagina in het tekstvak.</p>';
    }
}
