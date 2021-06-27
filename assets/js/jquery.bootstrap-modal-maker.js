/*
 *  jQuery Bootstrap Modal Maker - v1.0.0
 *  Create's a bootstrap modal, allowing you to specify the title, content, buttons and callbacks.
 *  https://github.com/styphon/jquery-bootstrap-modal
 *
 *  Made by Styphon
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {

    "use strict";

    var pluginName = "modalMaker",
        defaults = {
            id: "",
            title: "Congrats!",
            content: "Congratulations! You created a modal!",
            buttons: [
                {
                    "text": "OK",
                    "class": "btn-default",
                    "callback": function () {
                        alert("OK!");
                    },
                    "dismiss": true
                },
                {
                    "text": "Cancel",
                    "class": "btn-danger",
                    "callback": function () {
                        alert("Cancelled!");
                    },
                    "dismiss": true
                }
            ]
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.modal = null;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend( Plugin.prototype, {
        init: function() {
            if ( ! this.settings.id ) {
                this.setId();
            }
            this.generateHtml();
        },
        setId: function() {
            var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for ( var i = 0; i < 8; i++ ) {
                var pos = Math.floor(Math.random() * (chars.length));
                this.settings.id += chars.substring(pos, pos + 1);
            }
        },
        generateHtml: function () {
            var $modal = $('<div/>', {
                "class": "modal fade",
                "tabindex": "-1",
                "role": "dialog",
                "id": this.settings.id
            })
                .appendTo($('body'));
            var $dialogue = $('<div/>', {"class": "modal-dialog"})
                .appendTo($modal);
            var $content = $('<div/>', {"class": "modal-content"})
                .appendTo($dialogue);

            $('<header/>', {"class": "modal-header"}).append(
                $('<button/>', {
                    "class": "close",
                    "data-dismiss": "modal",
                    "aria-label": "Close"
                }).append(
                    $('<span/>', {
                        "aria-hidden": true
                    }).html("&times;")
                )
            ).append(
                $('<h4/>', {"class": "modal-title"})
                    .html(this.settings.title)
            ).appendTo($content);

            $('<article/>', {"class": "modal-body"})
                .html(this.settings.content)
                .appendTo($content);

            if ( this.settings.buttons.length > 0 ) {
                var $footer = $('<footer/>', {"class": "modal-footer"})
                    .appendTo($content);

                $.each ( this.settings.buttons, function (i, btn) {
                    var $btn = $('<button/>', {
                        "type": "button",
                        "class": "btn " + btn.class
                    })
                        .html(btn.text)
                        .appendTo($footer);
                    if ( btn.dismiss ) {
                        $btn.attr("data-dismiss", "modal");
                    }
                    if ( $.isFunction(btn.callback) ) {
                        $btn.click(btn.callback);
                    }
                });
            }

            this.modal = $modal.on('show.bs.modal', function () {
                $(this).focus();
            }).modal();
        }
    } );

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.modalMaker = function( options ) {
        if ( !$.data( this, "plugin_" + pluginName ) ) {
            $.data( this, "plugin_" +
                pluginName, new Plugin( this, options ) );
        }
    };

} )( jQuery, window, document );