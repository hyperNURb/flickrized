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
                    return $this.append('<ul id="ui-flickrized" />');
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
        getList : function(json_data, size, title, modal ) {
                    flickr_list = '';
                    $.each(json_data.items, function(i,item) {
                        flickr_list += modal ? '\t<li><a href="'+methods.getItemURLbySize(item.media.m, 'l')+'">\n' : '\t<li><a href="'+item.link+'">\n'
                        if(title) flickr_list += '\t\t<span>'+item.title+'</span>';
                        flickr_list += '\t\t<img src="'+methods.getItemURLbySize(item.media.m, size)+'" title="'+item.title+'" />\n';
                        flickr_list += '\t</a></li>\n';
                    });
                    return flickr_list;
        },
        modalShow : function(imgHref) {
                        var photo = new Image();
                            photo.src = imgHref;

                        var modal = '<div id="ui-flickrized-modal">\n'
                                    +'\t<div id="ui-flickrized-modal-overlay"></div>\n'
                                    +'\t<div id="ui-flickrized-modal-content">\n'
                                    +'\t\t<a id="ui-flickrized-modal-close" href="#">Close</a>\n'
                                    +'\t\t<div id="ui-flickrized-modal-photo" />\n'
                                    +'\t</div>\n'
                                    +'</div>';
                        $('body').append(modal);

                        $(photo).load( function() {
                            var me = this,
                                browserWidth = window.innerWidth,
                                browserHeight = window.innerHeight - 40,
                                imgHeight = me.height < browserHeight ? me.height : browserHeight,
                                aspectRatio = me.width / me.height,
                                imgWidth = imgHeight * aspectRatio,
                                offsetLeft = -((imgWidth/2)),
                                offsetTop = -((imgHeight/2) + 10);

                            $('#ui-flickrized-modal-photo').html(me);
                            $('#ui-flickrized-modal-content').animate({
                                'width':  imgWidth,
                                'height': imgHeight,
                                'margin-left': offsetLeft,
                                'margin-top': offsetTop
                            }, 150, function() {
                                $('img', '#ui-flickrized-modal-photo').css({
                                    'height': imgHeight,
                                    'width': imgWidth
                                }).fadeIn(50);
                            });
                            $('#ui-flickrized-modal-overlay').one('click', function() {
                                methods.modalHide();
                            });
                        });
        },
        modalHide : function() {
                        return $('#ui-flickrized-modal').fadeOut(150, function() { $(this).remove() });
        },
        getImageSize : function($image) {
                        return $image.width();
        },
        getNextItem : function($item, $items) {
                        return $item.next().length ? $item.next() : $items.first();
        },
        getPrevItem : function( ) {
                        return $item.prev().length ? $item.prev() : $items.last();
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
        var $flickrized = $('#ui-flickrized');

        $.getJSON( 'http://api.flickr.com/services/feeds/photos_public.gne?id='+opts.uid+'&lang=en-us&format=json&jsoncallback=?', function(json_data) {
            $flickrized.html(methods.getList(json_data, opts.size, opts.title, opts.modal));

            if (opts.group != null || opts.group != "" || opts.group != 0) {
                $filter_items = $flickrized.children();
                for ( var i = 0; i < methods.getNumberOfElements(json_data); i+=opts.group) {
                    $filter_items.filter(':eq('+i+'), :lt('+(i+opts.group)+'):gt('+i+')').wrapAll('<li><ul></ul></li>');
                }
            }
            $flickrized.children().each( function(i) {
                $(this).data('slideNo', i+1);
            });

            if (opts.modal) {
                $('#ui-flickrized').find('a').live('click', function() {
                    methods.modalShow(this.href);
                    return false;
                });
                $('#ui-flickrized-modal-close').live('click', function() {
                    methods.modalHide();

                    return false;
                });
            }
        });
    };

    // Default options
    $.fn.flickrized.defaults = {
        uid: null,              // User ID
        group: null,            // Group elements
        size: 'm',              // Thumb default size: small (s), medium (m), large (l)
        title: false,           // Shows item title
        modal: true             // Show large image in modal
    };
})(jQuery);
