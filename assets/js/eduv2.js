$.fn.goValidate = function () {
    var $form = this,
        $inputs = $form.find('input:text, input:password');

    var validators = {
        name: {
            regex: /^[A-Za-z]{3,}$/
        },
        pass: {
            regex: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
        }
    };
    var validate = function (klass, value) {
        var isValid = true,
            error = '';

        if (!value && /required/.test(klass)) {
            error = 'This field is required';
            isValid = false;
        } else {
            klass = klass.split(/\s/);
            $.each(klass, function (i, k) {
                if (validators[k]) {
                    if (value && !validators[k].regex.test(value)) {
                        isValid = false;
                        error = validators[k].error;
                    }
                }
            });
        }
        return {
            isValid: isValid,
            error: error
        }
    };
    var showError = function ($input) {
        var klass = $input.attr('class'),
            value = $input.val(),
            test = validate(klass, value);

        $input.removeClass('invalid').parent().removeClass('has-error');

        if (!test.isValid) {
            $input.addClass('invalid');

            if (typeof $input.data("shown") == "undefined" || $input.data("shown") == false) {
                $input.popover('show').parent().addClass('has-error');
            }

        } else {
            $input.popover('hide');
        }
    };
    /*$inputs.each(function() {
     if ($(this).is('.required')) {
     //showError($(this)); /* rem comment to enable initial display of validation rules */
    /*    }
     });
     $inputs.keyup(function() {
     showError($(this));
     });*/

    $inputs.on('shown.bs.popover', function () {
        $(this).data("shown", true);
    });

    $inputs.on('hidden.bs.popover', function () {
        $(this).data("shown", false);
    });

    $form.submit(function (e) {
        $inputs.each(function () {
            if ($(this).is('.required') || $(this).hasClass('invalid')) {
                showError($(this));
                $(this).parent().addClass('has-error');
            }
        });
        if ($form.find('input.invalid').length) {
            e.preventDefault();
            alert('The form is not valid');
        }
    });
    return this;
};
(function (jQuery) {
    function gridOverlay() {
        $('#gridOverlay').remove();
        $('body').append(
            '<div id="gridOverlay">' +
            '</div>'
        );
        for (var overlayGridCol = 0; overlayGridCol < 12; overlayGridCol++) {
            $('#gridOverlay').append(
                '<div class="col">' +
                '</div>'
            );
        }
    }
    function overlayToggle() {
        $('.toggle-overlay').on('click', function (e) {
            if (!$('body').hasClass('overlay-active')) {
                $('body').addClass('overlay-active');
                gridOverlay();
            } else if ($('body').hasClass('overlay-active')) {
                $('body').removeClass('overlay-active');
                $('#gridOverlay').remove();
            }
            e.preventDefault();
        });
    }
    overlayToggle();
})(jQuery);
(function ($) {
    $.fn.viewportChecker = function (useroptions) {
        // Define options and extend with user
        var options = {
            classToAdd: 'visible',
            offset: 100,
            callbackFunction: function (elem) {}
        };
        $.extend(options, useroptions);

        // Cache the given element and height of the browser
        var $elem = this,
            windowHeight = $(window).height();

        this.checkElements = function () {
            // Set some vars to check with
            var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html'),
                viewportTop = $(scrollElem).scrollTop(),
                viewportBottom = (viewportTop + windowHeight);

            $elem.each(function () {
                var $obj = $(this);
                // If class already exists; quit
                if ($obj.hasClass(options.classToAdd)) {
                    return;
                }

                // define the top position of the element and include the offset which makes is appear earlier or later
                var elemTop = Math.round($obj.offset().top) + options.offset,
                    elemBottom = elemTop + ($obj.height());

                // Add class if in viewport
                if ((elemTop < viewportBottom) && (elemBottom > viewportTop)) {
                    $obj.addClass(options.classToAdd);

                    // Do the callback function. Callback wil send the jQuery object as parameter
                    options.callbackFunction($obj);
                }
            });
        };

        // Run checkelements on load and scroll
        $(window).scroll(this.checkElements);
        this.checkElements();

        // On resize change the height var
        $(window).resize(function (e) {
            windowHeight = e.currentTarget.innerHeight;
        });
    };
})(jQuery);
/**************************************/
(function ($) {
    $.fn.visible = function (partial) {
        var $t = $(this),
            $w = $(window),
            viewTop = $w.scrollTop(),
            viewBottom = viewTop + $w.height(),
            _top = $t.offset().top,
            _bottom = _top + $t.height(),
            compareTop = partial === true ? _bottom : _top,
            compareBottom = partial === true ? _top : _bottom;
        return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
    };
})(jQuery);
/****************************************/
(function ($) {
    $.fn.serializefiles = function () {
        var obj = $(this);
        /* ADD FILE TO PARAM AJAX */
        var formData = new FormData();
        $.each($(obj).find("input[type='file']"), function (i, tag) {
            $.each($(tag)[0].files, function (i, file) {
                formData.append(tag.name, file);
            });
        });
        var params = $(obj).serializeArray();
        $.each(params, function (i, val) {
            formData.append(val.name, val.value);
        });
        return formData;
    };
})(jQuery);
/****************************************/
/*(function($, window) {
 'use strict';
 var MultiModal = function(element) {
 this.$element = $(element);
 this.modalCount = 0;
 };

 MultiModal.BASE_ZINDEX = 1050;

 MultiModal.prototype.show = function(target) {
 var that = this;
 var $target = $(target);
 var modalIndex = that.modalCount++;
 console.log(that.modalCount);
 $target.css('z-index', MultiModal.BASE_ZINDEX + (modalIndex * 20) + 10);

 // Bootstrap triggers the show event at the beginning of the show function and before
 // the modal backdrop element has been created. The timeout here allows the modal
 // show function to complete, after which the modal backdrop will have been created
 // and appended to the DOM.
 window.setTimeout(function() {
 // we only want one backdrop; hide any extras
 if(modalIndex > 0)
 $('.modal-backdrop').not(':first').addClass('hidden');

 that.adjustBackdrop();
 });
 };

 MultiModal.prototype.hidden = function(target) {
 this.modalCount = this.modalCount-2;
 var that = this;
 console.log(that.modalCount);
 if(this.modalCount) {
 this.adjustBackdrop();

 // bootstrap removes the modal-open class when a modal is closed; add it back
 if(that.modalCount){
 $('body').addClass('modal-open');
 }else{
 $('body').removeClass('modal-open');
 }
 }
 };

 MultiModal.prototype.adjustBackdrop = function() {
 var modalIndex = this.modalCount - 1;
 $('.modal-backdrop:first').css('z-index', MultiModal.BASE_ZINDEX - (modalIndex * 20));
 };

 function Plugin(method, target) {
 return this.each(function() {
 var $this = $(this);
 var data = $this.data('multi-modal-plugin');

 if(!data)
 $this.data('multi-modal-plugin', (data = new MultiModal(this)));

 if(method)
 data[method](target);
 });
 }

 $.fn.multiModal = Plugin;
 $.fn.multiModal.Constructor = MultiModal;

 $(document).on('show.bs.modal', function(e) {
 $(document).multiModal('show', e.target);
 });

 $(document).on('hidden.bs.modal', function(e) {
 $(document).multiModal('hidden', e.target);
 });
 }(jQuery, window));*/
function searchresult(form, searchFrom) {
    var myform = searchFrom.attr('action');
    var me = $(form).find('#q').val();
    var parm = '';
    var url = myform.split('?');
    var baseurl = url[0];
    var parameters = url[1];
    var arr = parameters.split('&');
    var newurl = '';
    if (me != '') {
        if (!$(this).siblings('.dropdown-toggle').hasClass('chois'))
            $(this).siblings('.dropdown-toggle').addClass('chois')
    } else {
        if ($(this).siblings('.dropdown-toggle').hasClass('chois'))
            $(this).siblings('.dropdown-toggle').removeClass('chois')
    }
    $.each(arr, function (index, value) {
        var a = value.split('=');
        if ($.inArray(parm, a) != 0)
            newurl += value + '&';
    });
    newurl = newurl.substring(0, newurl.length - 1);
    //var r = (myform.split('?')[1] === undefined) ? ((parm) ? '?&' + parm + '=' : '?') : ((parm) ? '&' + parm + '=' : '');
    var r = ((parm) ? '&' + parm + '=' : '');
    r = trimChar(r, "&");
    searchFrom.attr('action', baseurl + '?' + newurl + r + me);
    //$searchFrom.submit();
    //console.log(newurl + r + me);
    window.location.href = baseurl + '?' + newurl + r + me;
    return false;
}
/***********************************************/
function YouTubeGetID(url) {
    var ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    } else {
        ID = url;
    }
    return ID;
}
/***********************************************/
function readURL(input, imgselector) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(imgselector).attr('src', e.target.result);
            $(imgselector).siblings('i').find('img').attr('src', site_url + 'img/addwth1.png');
        }

        reader.readAsDataURL(input.files[0]);
    } else {
        $(imgselector).attr('src', site_url + 'img/qqqw.png');
        $(imgselector).siblings('i').find('img').attr('src', site_url + 'img/addwth.png');
    }
}
function readURLfile(input, imgselector) {
    if (input.files && input.files[0]) {
        $(imgselector).attr('src', site_url + 'img/wth1.png');
    } else {
        $(imgselector).attr('src', site_url + 'img/addwth.png');
    }
}
/***********************************************/
function setURL(input, imgselector) {
    console.log(input);
    $(imgselector).attr('src', $(input).attr('value'));
}
/***********************************************/
function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    url = url.toLowerCase(); // This is just to avoid case sensitiveness
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var aniClass = "pullDown";
function progressbar(percentComplete) {
    //$("#prog").attr('value',percentComplete);
    //$("#percent").html(percentComplete+'%');
    $("#percent").html(percentComplete + '%');
    var styles = {width: percentComplete + "%", height: "50px"};
    if (percentComplete > 0) {
        styles = {background: "#ab1b1b", width: percentComplete + "%"};
    }
    if (percentComplete > 25) {
        styles = {background: "#d28c20", width: percentComplete + "%"};
    }
    if (percentComplete > 75) {
        styles = {background: "#b5d220", width: percentComplete + "%"};
    }
    if (percentComplete > 90) {
        styles = {background: "#50d848", width: percentComplete + "%"};
    }
    $("#loading").css(styles);
}
function applyAnimation() {
    var imagePos = $(this).offset().top;

    var topOfWindow = $(window).scrollTop();
    var repeat = false;
    if (imagePos < topOfWindow + 500) {
        var ele = $(this);
        ele.addClass(aniClass);

        if (repeat) {
            setTimeout(function () {
                ele.removeClass(aniClass);
            }, 1000);
        }
    }
}
/*************************************************/
/*$('h1').each(applyAnimation);*/
$(window).scroll(function () {
    //$('i,img,.list-group').each(applyAnimation);
    $('.anm').each(applyAnimation);
});

/**********************************************/
$('#text').keydown(function () {
    var max = $(this).attr('data-maxlength');
    var len = ($(this).val().split(' ').length);
    var cont = parseInt($('#count_message').html());
    if (len >= max) {
        $('#count_message').text('Ù„Ù‚Ø¯ ØªØ¬Ø§ÙˆØ²Øª Ø§Ù„Ø­Ø¯ Ø§Ù„Ù…Ø³Ù…ÙˆØ­');
        $('#count_message').addClass('red');
        $('#btnSubmit').addClass('disabled');
    } else {
        var ch = max - len;
        $('#count_message').text('ØªØ¨Ù‚Ù‰ ' + ch + 'ÙƒÙ„Ù…Ø© ');
        $('#btnSubmit').removeClass('disabled');
        $('#count_message').removeClass('red');
    }

});
/***********************************************/

var modal = '<div class="modal fade" id="msg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">' +
    ' <div class="modal-dialog modal-lg">' +
    '     <div class="modal-content">' +
    '        <div class="modal-header">' +
    '          <button type="button" class="close" data-dismiss="modal">&times;</button>' +
    '          <h4 class="modal-title"></h4>' +
    '        </div>' +
    '        <div class="modal-body">' +
    '          <p></p>' +
    '        </div>' +
    '        <div class="modal-footer">' +
    '          <button type="button" class="btn btn-default" data-dismiss="modal">Ø¥Ù„ØºØ§Ø¡</button>' +
    '        </div>' +
    '    </div>' +
    '</div>' +
    '</div>';

function showmsg(msg, title, modal, without, close, time) {
    if (!without) {
        $(modal + '.modal .modal-content .modal-title').html(title);
        $(modal + '.modal .modal-content .modal-body').html(msg);
        $(modal + '.modal .modal-content .modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Ø¥Ù„ØºØ§Ø¡</button>');
    } else {

        $(modal + '.modal').html(msg);
    }
    $(document.body).addClass('modal-open');
    $(modal).modal('show');
    if (close) {
        setTimeout(function () {
            $(modal).modal('hide');
            $(close).modal('hide');
        }, (time) ? time : 1000);
        $(document.body).removeClass('modal-open');
    }
}
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
    $(document.body).on('click', 'button.ajax', function () {  //<button data-url="ctrl/action?action=add" data-datastring="{id:' . $tnk->id . '}" data-title="Ø§Ù„Ø£Ù‡Ø¯Ø§Ù" data-refresh="" type="button" class=" btn btn-warning btn-sm ajax">Ø­ÙØ¸</button>
        var me = $(this);
        var url = $(this).attr('data-url');
        var refresh = $(this).attr('data-refresh');
        var title = $(this).attr('data-title');
        var shmsg = $(this).attr('data-showmsg');
        if (typeof shmsg === 'undefined' || shmsg == '1')
            shmsg = true;
        else
            shmsg = false;
        if (typeof url === 'undefined' && url == '')
            return false;
        var dataString = $(this).attr('data-datastring');
        if (typeof dataString === 'undefined' && dataString === '')
            return false;
        var dataString2 = $(this).attr('data-datastring-class'); // class name of all inputs can added to datastring
        if (!(typeof dataString2 === 'undefined' && dataString2 === '')) {
            var dt = "";//"{"
            $('.' + dataString2).each(function (e) {
                if (this.value)
                    dt += '"' + $(this).attr('name') + '":"' + this.value + '",';
                else if ($(this).text()) {
                    dt += '"' + $(this).attr('name') + '":"' + $(this).text() + '",';
                }
            });

            dt = dt.substring(0, dt.length - 1);
            dataString = dataString.substring(1, dataString.length - 1);
            dataString = "{" + dataString + "," + dt + "}";
        }
        eval('var dataString =' + dataString);
        //var d = {id: me.val()};
        //$.extend(true, dataString, d);
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data: dataString,
            cache: false,
            processData: true,
            beforeSend: function () {
                me.prop("disabled", true);
                //$(to).prop("disabled", true);
                showmsg('<span class="loading">.</span>', 'Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±', '#form');
            },
            success: function (data) {
                console.log(data);
                switch (data.state)
                {
                    case "trr":
                        me.prop("disabled", false);
                        //$(to).html(data.content);
                        //$(to).prop("disabled", false);
                        showmsg(data.content, title, '#form');
                        if (refresh) {
                            setTimeout(function () {
                                window.location.href = window.location.href;
                            }, 200);
                        }
                        break;
                    case "err":
                        me.prop("disabled", false);
                        showmsg(data.msg, 'ØªÙ†Ø¨ÙŠÙ‡', '#msg');
                        return false;
                        break;
                    default :
                        me.prop("disabled", false);
                        showmsg(data.msg, 'ØªÙ†Ø¨ÙŠÙ‡', '#msg');
                        return false;
                }
            }, error: function (data) {
                me.prop("disabled", false);
                console.log(data.responseText);
            }
        });

    });
    $(document.body).on('click', 'a.ajax', function () {  //<button data-url="ctrl/action?action=add" data-datastring="{id:' . $tnk->id . '}" data-title="Ø§Ù„Ø£Ù‡Ø¯Ø§Ù" data-refresh="" type="button" class=" btn btn-warning btn-sm ajax">Ø­ÙØ¸</button>
        var me = $(this);
        var url = $(this).attr('data-url');
        var refresh = $(this).attr('data-refresh');
        var title = $(this).attr('data-title');
        var todiv = $(this).attr('data-todiv');
        var shmsg = $(this).attr('data-showmsg');
        var aftersuccess = $(this).attr('data-aftersuccess');
        var aftersuccess;
        //console.log(aftersuccess);
        if (typeof aftersuccess !== 'undefined')
            aftersuccess = aftersuccess.split("@");
        if (typeof shmsg === 'undefined' || shmsg == '1')
            shmsg = true;
        else
            shmsg = false;
        var dataString = $(this).attr('data-datastring');
        var dataString2 = $(this).attr('data-datastring-class'); // class name of all inputs can added to datastring
        var resptype = $(this).attr('data-type');
        if (typeof url === 'undefined' && url == '')
            return false;
        if (typeof dataString === 'undefined' && dataString === '')
            return false;
        if (!(typeof dataString2 === 'undefined' && dataString2 === '')) {
            var dt = "";//"{"
            $('.' + dataString2).each(function (e) {
                if (this.value)
                    dt += '"' + $(this).attr('name') + '":"' + this.value + '",';
                else if ($(this).text()) {
                    dt += '"' + $(this).attr('name') + '":"' + $(this).text() + '",';
                }
            });
            if (resptype)
                dt += '"resptype":"' + resptype + '",';
            dt = dt.substring(0, dt.length - 1);
            dataString = dataString.substring(1, dataString.length - 1);

            dataString = "{" + dataString + "," + dt + "}";
        }

        eval('var dataString =' + dataString);
        //var d = {id: me.val()};
        //$.extend(true, dataString, d);
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data: dataString,
            cache: false,
            processData: true,
            beforeSend: function () {
                //me.prop("disabled", true);
                //$(to).prop("disabled", true);
                if (todiv)
                    $(todiv).html('<span class="loading">Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±</span>');
                else {
                    if (shmsg)
                        showmsg('<span class="loading">.</span>', 'Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±', '#form');
                }
            },
            success: function (data) {
                console.log(data);
                switch (data.state)
                {
                    case "trr":
                        //me.prop("disabled", false);
                        //$(to).html(data.content);
                        //$(to).prop("disabled", false);
                        if (todiv)
                            $(todiv).html(data.content);
                        else {
                            if (shmsg)
                                showmsg(data.content, title, '#form');
                        }
                        if (refresh) {
                            setTimeout(function () {
                                window.location.href = window.location.href;
                            }, 200);
                        }
                        if (aftersuccess)
                            eval(aftersuccess[1]);

                        break;
                    case "err":
                        //me.prop("disabled", false);
                        if (todiv)
                            $(todiv).html(data.msg);
                        if (shmsg)
                            showmsg(data.msg, 'ØªÙ†Ø¨ÙŠÙ‡', '#msg');
                        return false;
                        break;
                    default :
                        //me.prop("disabled", false);
                        if (todiv)
                            $(todiv).html(data.msg);
                        if (shmsg)
                            showmsg(data.msg, 'ØªÙ†Ø¨ÙŠÙ‡', '#msg');
                        return false;
                }
            }, error: function (data) {
                //me.prop("disabled", false);
                if (todiv)
                    $(todiv).html(data.responseText);
                console.log(data.responseText);
            }
        });

    });
    $(document.body).on('change', 'select.ajax', function () {
        var me = $(this);
        var url = $(this).attr('data-url');
        var to = $(this).attr('data-to');
        if (typeof url === 'undefined' && url == '')
            return false;
        var dataString = $(this).attr('data-datastring');
        if (typeof dataString === 'undefined' && dataString === '')
            return false;
        eval('var dataString =' + dataString);
        var d = {id: me.val()};
        $.extend(true, dataString, d);
        $.ajax({
            type: 'post',
            url: url,
            dataType: 'json',
            data: dataString,
            cache: false,
            processData: true,
            beforeSend: function () {
                me.prop("disabled", true);
                $(to).prop("disabled", true);
                //showmsg('<span class="loading">.</span>', 'Ø§Ù„Ø±Ø¬Ø§Ø¡ Ø§Ù„Ø§Ù†ØªØ¸Ø§Ø±', '#form');
            },
            success: function (data) {
                console.log(data);
                switch (data.state)
                {
                    case "trr":
                        me.prop("disabled", false);
                        $(to).html(data.result);
                        $(to).prop("disabled", false);
                        //showmsg(data.msg, 'ØªÙ…Øª Ø§Ù„Ø¹Ù…Ù„ÙŠØ©', '#form', 1);
                        break;
                    case "err":
                        me.prop("disabled", false);
                        showmsg(data.msg, 'ØªÙ†Ø¨ÙŠÙ‡', '#msg');
                        return false;
                        break;
                    default :
                        me.prop("disabled", false);
                        showmsg(data.msg, 'ØªÙ†Ø¨ÙŠÙ‡', '#msg');
                        return false;
                }
            }, error: function (data) {
                me.prop("disabled", false);
                console.log(data.responseText);
            }
        });

    });
    $(document).on({
        'show.bs.modal': function () {
            var zIndex = 1050 + (10 * $('.modal:visible').length);
            $(this).css('z-index', zIndex);
            setTimeout(function () {
                $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            }, 0);
        },
        'hidden.bs.modal': function () {
            if ($('.modal:visible').length > 0) {
                // restore the modal-open class to the body element, so that scrolling works
                // properly after de-stacking a modal.
                setTimeout(function () {
                    //$(document.body).addClass('modal-open');
                }, 0);
            }
        }
    }, '.modal');

    $('.facsebookshare').on('click', function () {
        var url = window.location.href;
        window.open('http://www.facebook.com/sharer.php?u=' + url, 'sharer', 'toolbar=0,status=0,width=548,height=325');

    });
    //$('.news .newscontent .fullnews .shareto>div:nth-child(3)').on('click',function(){
    $('.tweetershare').on('click', function () {
        var url = window.location.href;
        window.open('https://twitter.com/intent/tweet?url=' + url, 'sharer', 'toolbar=0,status=0,width=548,height=325');

    });

    $('.img.show').on('click', function () {
        var src = $(this).attr('data-url');
        var img = '<img src="' + src + '" class="img-responsive center-block" />';
        showmsg(img, '', '#photo');
    });

    $(document).on('change', ':file', function () {
        var me = $(this);
        var imgtochange = me.attr('data-image-to-chaneg');
        if (typeof imgtochange === "undefined") {
            console.log('Ù„Ù… ØªÙ‚Ù… Ø¨ØªØ­Ø¯ÙŠØ¯ ' + 'data-image-to-chaneg');
        } else {
            if (imgtochange.length === 0) {
                console.log('ÙØ§Ø±ØºØ© ' + 'data-image-to-chaneg');
            } else {
                readURL(this, imgtochange);
            }
        }


    });
});

