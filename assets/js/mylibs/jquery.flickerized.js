/*
* Flickr photo slider
*
* Copyright (c) 2010
* Aleksandar Dragojlovic <aleksandar.dragojlovic@gmail.com> & Ivan Tatic <ivan@simplified.me>
* Dual licensed under the MIT and GPL licenses.
* Uses the same license as jQuery, see:
* http://jquery.org/license
*
* @version 0.1
*/
;(function($) {
    var options = {
    };

    var methods = {
        _init : function($this) {
                    return $this.append('<ul id="ui-flickerized" />');
        },
        getNumberOfElements : function(json_data) {
                    return json_data.items.length;
        },
        getItemURLbySize : function(item_url, size) {
                        switch(size) {
                            case 's':
                                    return item_url.replace('_m.jpg', '_s.jpg');
                                break;
                            case 'l':
                                    return item_url.replace('_m.jpg', '_b.jpg');
                                break;
                            default:
                                    return item_url;
                                break;
                        }
        },
        getList : function(json_data, size, title) {
                    flickr_list = '';
                    $.each(json_data.items, function(i,item) {
                        flickr_list += '\t<li><a href="'+item.link+'">\n';
                        if(title) flickr_list += '\t\t<span>'+item.title+'</span>';
                        flickr_list += '\t\t<img src="'+methods.getItemURLbySize(item.media.m, size)+'" title="'+item.title+'" />\n';
                        flickr_list += '\t</a></li>\n';
                    });
                    return flickr_list;
        }
    };

    // Debugging
    function debug($obj) {
        if (window.console && window.console.log) {
            window.console.log($obj);
        }
    }


    $.fn.flickrized = function(options) {
        var opts = $.extend({}, $.fn.flickrized.defaults, options);
        var $this = $(this);

        methods._init($this);

        $.getJSON( 'http://api.flickr.com/services/feeds/photos_public.gne?id='+opts.uid+'&lang=en-us&format=json&jsoncallback=?', function(json_data) {

            $('#ui-flickerized').html(methods.getList(json_data, opts.size, opts.title));
            if (opts.group != null) {
                $filter_items = $('#ui-flickerized').children();
                for ( var i = 0; i < methods.getNumberOfElements(json_data); i+=opts.group) {
                    $filter_items.filter(':eq('+i+'), :lt('+(i+opts.group)+'):gt('+i+')').wrapAll('<li><ul></ul></li>');
                }
            }
        });
    };

    // Default options
    $.fn.flickrized.defaults = {
        uid: null,              // User ID
        group: null,            // Group elements
        size: 's',              // Thumb default size: small (s), medium (m), large (l)
        title: false            // Shows item title
    };
})(jQuery);
