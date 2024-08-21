var themes = {
    "default": "/sites/TenderEyesV3/SiteAssets/V4Themes/Default.css",
    "dark": "/sites/TenderEyesV3/SiteAssets/V4Themes/Dark.css",
    "light": "/sites/TenderEyesV3/SiteAssets/V4Themes/Light.css"
}
var themesheet = $('<link href="' + themes['default'] + '" rel="stylesheet" />');
if ($.cookie('tenderEyesTheme')) {
    themesheet = $('<link href="' + $.cookie('tenderEyesTheme') + '" rel="stylesheet" />');
}
themesheet.appendTo('head');
$(document).ready(function() {
    $('.theme-link').click(function() {
        var themeurl = themes[$(this).attr('data-theme')];
        themesheet.attr('href', themeurl);
        $('.themeSelector').removeClass("show")
        $.cookie('tenderEyesTheme', themeurl);
    });
});