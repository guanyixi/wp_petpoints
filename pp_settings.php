<?php

add_action('admin_menu', 'pp_create_menu');
function pp_create_menu() {
	//create new top-level menu
    add_options_page('PetPoint Plugin Settings', 'WP Petpoint', 'manage_options', 'pp-plugin-settings', 'pp_settings_page');
}

add_action('admin_init', 'pp_register_settings');
function pp_register_settings() {
	//register settings
    register_setting( 'pp-settings-group', 'pp_auth_key' );
    register_setting( 'pp-settings-group', 'all_pets_page_id1' );
	register_setting( 'pp-settings-group', 'all_pets_page_id2' );
    register_setting( 'pp-settings-group', 'view_animal_page' );
}

function pp_settings_page() {
?>
<div class="wrap">
<h2>WP Petpoint Settings</h2>

<form method="post" action="options.php">
    <?php settings_fields( 'pp-settings-group' ); ?>
    <?php do_settings_sections( 'pp-settings-group' ); ?>


    <hr>
    <div class="field">
    <h3>Petpoint integration</h3>

    <label>Petpoint Auth. Key</label>
    <input type="text" name="pp_auth_key" value="<?php echo esc_attr( get_option('pp_auth_key') ); ?>" />
    </div>



    <hr>
    <h3>IDs of pages that show all adoptable animals</h3>
    <div class="field">
    <label>Page 1</label>
    <input type="text" name="all_pets_page_id1" value="<?php echo esc_attr( get_option('all_pets_page_id1') ); ?>" />

    <label>Page 2</label>
    <input type="text" name="all_pets_page_id2" value="<?php echo esc_attr( get_option('all_pets_page_id2') ); ?>" />
    </div>
    <br>


    <hr>
    <h3>Url of page that shows single pet</h3>
    <div class="field">
    <input type="text" name="view_animal_page" value="<?php echo esc_attr( get_option('view_animal_page') ); ?>" />
    </div>
    <br>

    
    <?php submit_button(); ?>

</form>
</div>
<?php } ?>
