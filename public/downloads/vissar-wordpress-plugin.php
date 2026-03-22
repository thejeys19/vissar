<?php
/**
 * Plugin Name: Vissar Reviews Widget
 * Description: Display beautiful Google review widgets on your WordPress site using the [vissar] shortcode.
 * Version: 1.0.0
 * Author: Vissar
 * Author URI: https://www.vissar.com
 * License: GPL-2.0-or-later
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the [vissar] shortcode.
 *
 * Usage: [vissar id="widget_xxx" layout="carousel" max_reviews="5"]
 */
function vissar_reviews_shortcode($atts) {
    $atts = shortcode_atts(array(
        'id'          => '',
        'layout'      => 'carousel',
        'max_reviews' => '5',
        'template'    => '',
        'min_rating'  => '',
    ), $atts, 'vissar');

    if (empty($atts['id'])) {
        return '<!-- Vissar: No widget ID provided -->';
    }

    $widget_id   = esc_attr($atts['id']);
    $layout      = esc_attr($atts['layout']);
    $max_reviews = intval($atts['max_reviews']);

    $extra_attrs = '';
    if (!empty($atts['template'])) {
        $extra_attrs .= ' data-vissar-template="' . esc_attr($atts['template']) . '"';
    }
    if (!empty($atts['min_rating'])) {
        $extra_attrs .= ' data-vissar-min-rating="' . esc_attr($atts['min_rating']) . '"';
    }

    $output  = '<div data-vissar-widget="' . $widget_id . '"';
    $output .= ' data-vissar-layout="' . $layout . '"';
    $output .= ' data-vissar-max-reviews="' . $max_reviews . '"';
    $output .= $extra_attrs;
    $output .= '></div>';

    return $output;
}
add_shortcode('vissar', 'vissar_reviews_shortcode');

/**
 * Enqueue the Vissar widget script on the frontend.
 */
function vissar_enqueue_script() {
    wp_enqueue_script(
        'vissar-widget',
        'https://www.vissar.com/widget/vissar-widget.min.js',
        array(),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'vissar_enqueue_script');
