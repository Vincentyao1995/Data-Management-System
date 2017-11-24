function init_chosen() {
    try {
        $('[data-rel="chosen"],[rel="chosen"]').chosen({
            "width": "100%"
        });
    } catch (e) {
    }
}

function init_tooltips() {
    $('[data-toggle="tooltip"]').tooltip({
        "container": 'body'
    });
}

$(function () {
    init_chosen();
    init_tooltips();
});

var dialogs = (window.dialogs || {});

dialogs.close_text = "关闭";
dialogs.ok_text = "确定";
dialogs.confirm_title = "确认";
dialogs.alert_title = "警告";

dialogs.prev_text = "上一步";
dialogs.next_text = "下一步";

dialogs.z_index_base = 2000;

/**
 * options : { "id" : dialog_id, "buttons": buttons object, eg. [ { 'css' :
 * 'btn-primary', 'text' : 'OK', callback: function(){ } } ], "modal": true /
 * false, "width" : "400px" , "top": "100px" }
 */
dialogs._dialog = function (options) {
    var _id = options["id"] || "myModal";

    var get_z_index = function () {
        var z = dialogs.z_index_base;
        dialogs.z_index_base += 2;
        return z;
    }

    var _zindex = get_z_index();

    var _buttons = options["buttons"] || [{
            'css': 'btn-primary',
            'text': dialogs.close_text,
            'callback': function () {
                this.close();
                return false;
            }
        }];
    var _title = options["title"];
    var _text = options["text"] || "";

    var _modal = true;
    if (options["modal"] === false) {
        _modal = false;
    }

    var _width = options["width"] || "400px";
    var _top = options["top"] || ((100 + $(document).scrollTop()) + "px");

    var close_me = function () {
        $(".backdrop_" + _id).remove();
        $("#" + _id).removeClass("in").hide();
    }

    var remove_me = function () {
        $(".backdrop_" + _id).remove();
        $("#" + _id).remove();
    }

    var initTemplate = function () {
        $(".backdrop_" + _id).remove();
        if (_modal == true) {
            $('<div class="backdrop_' + _id + ' modal-backdrop fade"></div>').css({
                "z-index": _zindex
            }).appendTo($("body"));
        }

        var _arr_modal = [];

        var _style = [];
        _style.push("z-index:" + (_zindex + 1));
        _style.push("width:" + _width);
        _style.push("top:" + _top);
        _style.push("position: absolute");

        var _body_width = $("body").width();
        var _div_width = parseInt(_width);
        var _left = (_body_width - _div_width) / 2;

        _style.push("left:" + _left + "px");
        // $(window).resize(function() {
        // var _body_width = $("body").width();
        // var _div_width = parseInt(_width);
        // var _left = (_body_width - _div_width) / 2;
        // _left = (_left < 0) ? 0 : _left;
        // $('#' + _id).css({
        // "left" : _left
        // });
        // });

        if ($("#" + _id).length == 1) {
            $("#" + _id).css({
                "z-index": (_zindex + 1),
                "left": (_left + "px"),
                "top": _top
            });
            return true;
        }

        _arr_modal.push('<div id="' + _id + '" class="fade" tabindex="-1" style="' + _style.join(";") + '"> ');

        _arr_modal.push('<div class="modal-content">');

        if (_title) {
            _arr_modal.push('<div class="modal-header dlg-titlebar" style="cursor: move;">');
            _arr_modal.push('<button type="button" class="close dlg-close">&times;</button>');
            _arr_modal.push('<h4 class="modal-title" id="label_' + _id + '">');
            _arr_modal.push(_title);
            _arr_modal.push('</h4>');
            _arr_modal.push('</div>');

            _arr_modal.push('<div class="modal-body"><div class="c" style="min-height: 100px"></div></div>');
        } else {
            _arr_modal.push('<div class="dlg-titlebar" style="height: 20px; cursor: move;">&nbsp;</div>');
            _arr_modal.push('<div class="modal-body" style="padding-top:0px"><div class="c" ></div></div>');
        }

        if (_buttons.length > 0) {
            _arr_modal.push('<div class="modal-footer">');
            for (var i = 0; i < _buttons.length; i++) {
                var _button = _buttons[i];
                _arr_modal.push('<button idx="' + i + '" class="btn btn_' + i + ' ' + _button.css + '">' + _button.text
                    + '</button>');
            }
            _arr_modal.push('</div>');
        }

        _arr_modal.push('</div>');
        _arr_modal.push('</div>');

        $('body').append(_arr_modal.join("\n"));

        var that = {
            _blockFrames: function () {
                this.iframeBlocks = $(document).find("iframe").map(function () {
                    var iframe = $(this);

                    return $("<div>").css({
                        position: "absolute",
                        width: iframe.outerWidth(),
                        height: iframe.outerHeight()
                    }).appendTo(iframe.parent()).offset(iframe.offset())[0];
                });
            },

            _unblockFrames: function () {
                if (this.iframeBlocks) {
                    this.iframeBlocks.remove();
                    delete this.iframeBlocks;
                }
            }
        };
        $.data($('#' + _id).get(0), "dragdata", that);

        $('#' + _id).draggable({
            cancel: ".modal-body, .dlg-close",
            handle: ".dlg-titlebar",
            containment: "document",
            // iframeFix: true,
            start: function (event, ui) {
                var that = $.data($('#' + _id).get(0), "dragdata");
                that._blockFrames.apply(that);
            },
            drag: function (event, ui) {
            },
            stop: function (event, ui) {
                var that = $.data($('#' + _id).get(0), "dragdata");
                that._unblockFrames.apply(that);
            }
        });
    }

    var bootStrapConfirm = function () {
        if (!$.fn.modal.Constructor)
            return false;

        for (var i = 0; i < _buttons.length; i++) {
            $('body').off('click', '#' + _id + ' .btn_' + i);
            $('body').on('click', '#' + _id + ' .btn_' + i, function () {
                var o = $('#' + _id);
                o.close = close_me;
                o.remove = remove_me;
                _buttons[parseInt($(this).attr('idx'))].callback.apply(o);
            });
        }

        $(".modal").css({
            "overflow-y": "hidden"
        });

        $('#' + _id).find("button.close").click(function () {
            close_me();
        });

        return true;
    }

    initTemplate()

    if (bootStrapConfirm()) {
        if (_text != "") {
            $('#' + _id + ' .modal-body div.c').html(_text);
        }
        $('#' + _id).show().addClass("in");
    }
}

dialogs.confirm = function (text, cb, title, width) {
    var _op = {
        "text": text,
        "title": title || dialogs.confirm_title,
        "buttons": [{
            'css': 'btn-primary',
            'text': dialogs.close_text,
            'callback': function () {
                this.remove();
                return false;
            }
        }, {
            'css': 'btn-success',
            'text': dialogs.ok_text,
            'callback': function () {
                var ret = true;
                if (cb) {
                    ret = cb(true);
                }
                if (ret !== false) {
                    this.remove();
                    return true;
                }
                return ret;
            }
        }],
        "modal": true,
        "width": width,
        "id": "windowConfirmModal"
    };
    dialogs._dialog(_op);
};

dialogs.alert = function (text, cb, title, width) {
    var _op = {
        "text": text,
        "title": title || dialogs.alert_title,
        "buttons": [{
            'css': 'btn-success',
            'text': dialogs.ok_text,
            'callback': function () {
                var ret = true;
                if (cb) {
                    ret = cb(true);
                }
                if (ret !== false) {
                    this.remove();
                    return true;
                }
                return ret;
            }
        }],
        "modal": true,
        "width": width,
        "id": "windowAlertModal"
    };
    dialogs._dialog(_op);
};

dialogs.dialog = function (text, cb, id, width, top) {
    var _op = {
        "text": text,
        "buttons": [{
            'css': 'btn-primary',
            'text': dialogs.close_text,
            'callback': function () {
                this.close();
            }
        }, {
            'css': 'btn-success',
            'text': dialogs.ok_text,
            'callback': function () {
                var ret = true;
                if (cb) {
                    ret = cb(true);
                }
                if (ret !== false) {
                    this.close();
                }
            }
        }],
        "modal": true,
        "id": id,
        "width": width,
        "top": top
    };
    dialogs._dialog(_op);
};

dialogs.wizard = function (text, count, get_text_func, callback_func, id, width, top) {

    // //debugger;

    var obj_data = {
        "get_text_func": get_text_func,
        "callback_func": callback_func,
        "id": id,
        "idx": 0,
        "dir": 0,
        "count": count
    };

    var get_text = function (text) {
        var idx = obj_data.idx + obj_data.dir;
        if (idx <= 0) {
            idx = 0;
        }
        if (idx >= obj_data.count - 1) { // last one
            idx = obj_data.count - 1;
        }
        return $("<div class='wizard_body' id='_wizard_body_" + idx + "'>" + text + "</div>");
    };
    var update_btn = function () {
        obj_data.idx += obj_data.dir;
        if (obj_data.idx <= 0) {
            obj_data.idx = 0;
        }
        if (obj_data.idx >= obj_data.count - 1) { // last one
            obj_data.idx = obj_data.count - 1;
        }

        if (obj_data.idx <= 0) {
            $('#' + obj_data.id).find(".btn_1").addClass("hide"); // prev
        } else {
            $('#' + obj_data.id).find(".btn_1").removeClass("hide");
        }
        if (obj_data.idx >= obj_data.count - 1) { // last one
            $('#' + obj_data.id).find(".btn_2").addClass("hide");
            $('#' + obj_data.id).find(".btn_3").removeClass("hide");
        } else {
            $('#' + obj_data.id).find(".btn_2").removeClass("hide");
            $('#' + obj_data.id).find(".btn_3").addClass("hide");
        }
    };
    var set_text = function (text, dynamic) {
//		//debugger;

        $('#' + obj_data.id + ' .wizard_body_dynamic').remove();
        $(".wizard_body").hide();

        var _text = get_text(text);
        if (dynamic === true) {
            _text.addClass("wizard_body_dynamic");
        }

        $('#' + obj_data.id + ' .modal-body div.c').append(_text);
        update_btn();
    };
    if (text == null || text == '') {
    } else {
        text = get_text(text);
    }

    var _op = {
        "text": text,
        "buttons": [{
            'css': 'btn-primary', // 0
            'text': dialogs.close_text,
            'callback': function () {
                // //debugger;
                this.remove();
            }
        }, {
            'css': 'btn-success hide', // 1
            'text': dialogs.prev_text,
            'callback': function () {
//				//debugger;

                if (obj_data.callback_func(obj_data.idx) === false) {
                    return;
                }

                var idx = obj_data.idx - 1;
                if (idx <= 0) {
                    idx = 0;
                }

                // //debugger;
                obj_data.dir = -1;
                jdiv = $("#_wizard_body_" + idx);
                if (jdiv.length == 0) {
                    obj_data.get_text_func(idx, set_text);
                } else {
                    update_btn();
                    $('#' + obj_data.id + ' .wizard_body_dynamic').remove();
                    $(".wizard_body").hide();
                    jdiv.show();
                }
            }
        }, {
            'css': 'btn-success', // 2
            'text': dialogs.next_text,
            'callback': function () {
//				//debugger;

                if (obj_data.callback_func(obj_data.idx) === false) {
                    return;
                }
                // //debugger;
                var idx = obj_data.idx + 1;
                if (idx >= obj_data.count - 1) { // last one
                    idx = obj_data.count - 1;
                }

                obj_data.dir = 1;
                jdiv = $("#_wizard_body_" + idx);
                if (jdiv.length == 0) {
                    obj_data.get_text_func(idx, set_text);
                } else {
                    update_btn();
                    $('#' + id + ' .wizard_body_dynamic').remove();
                    $(".wizard_body").hide();
                    jdiv.show();
                }
            }
        }, {
            'css': 'btn-success hide',// 3
            'text': dialogs.ok_text,
            'callback': function () {
                if (obj_data.callback_func(-1) !== false) {
                    this.remove();
                }
            }
        }],
        "modal": true,
        "id": id,
        "width": width,
        "top": top
    };
    dialogs._dialog(_op);

    if (text == null || text == '') {
        $(".wizard_body").hide();

        var jdiv = $("#_wizard_body_" + obj_data.idx);
        if (jdiv.hasClass("dynamic")) {
            jdiv.remove();
        }

        jdiv = $("#_wizard_body_" + obj_data.idx);
        if (jdiv.length == 0) {
            obj_data.get_text_func(obj_data.idx, set_text);
        } else {
            $(".wizard_body").hide();
            jdiv.show();
        }
    }
}

dialogs.dialog_opt = dialogs._dialog;

dialogs.error = function (message) {
    jQuery.noty({
        "text": message,
        "layout": "bottomRight",
        "type": "error",
        "animateOpen": {
            "opacity": "show"
        }
    });
}
dialogs.info = function (message) {
    jQuery.noty({
        "text": message,
        "layout": "bottomRight",
        "type": "alert",
        "animateOpen": {
            "opacity": "show"
        }
    });
}
dialogs.success = function (message) {
    jQuery.noty({
        "text": message,
        "layout": "bottomRight",
        "type": "success",
        "animateOpen": {
            "opacity": "show"
        }
    });
};

dialogs.tips = function (message) {
    if($("#tips-mask").length == 0){
        var $tdlg = $('<div/>', {
            id: "tips-mask",
            class: "modal fade",
            html: ['<div class="modal-dialog modal-lg" style="width: 500px">' +
                   '<div class="modal-content" style="min-height: 100px">' +
                   '<div class="modal-body"><div id="tips_span"></div>' +
                   '</div></div></div>'].join("")
        });
        $("body").append($tdlg[0]);
    }

    $("#tips_span").html(message);

    $("#tips-mask").modal();
};

dialogs.wait_mask = function (message) {
    if ($('#waiting_mask').length == 0) {
        var $wdlg = $('<div/>', {
            id: "waiting_mask",
            style: "display: none; text-align: center; position: absolute; top: 0px; width: 100%; z-index: 10000;",
            html: ["<div style='width: 200px; margin: auto; border: 2px solid rgb(171, 155, 155); padding: 5px; background: white; margin-top: 100px;'>",
                "<img src='/static/img/loader/loader_green_48.gif'>",
                "<span id='waiting_msg' style='padding-left: 10px'>加载中，请稍后...</span>",
                "</div>"
            ].join("")
        });
        $("body").append($wdlg[0]);
    }

    if (message) {
        $("#waiting_msg").html(message);
    }
    $("#waiting_mask").modal({
        keyboard: false,
        backdrop: false
    });
}

dialogs.hide_wait_mask = function () {
    if ($('#waiting_mask').length > 0) {
        $('#waiting_mask').modal('hide');
    }
    $('#waiting_mask').remove();
};