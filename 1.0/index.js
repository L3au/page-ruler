/**
 * @fileoverview 
 * @author L3au<wb-liulele@taobao.com>
 * @module page-ruler
 **/
KISSY.add(function (S, Node,Base) {
    var EMPTY = '';
    var KeyCodes = Node.KeyCodes;
    var $ = Node.all, D = S.DOM, E = Event;

    /**
     * 
     * @class Page-ruler
     * @constructor
     * @extends Base
     */
    function PageRuler () {
        PageRuler.superclass.constructor.apply(this, arguments);
        this.init();
    }

    S.extend(PageRuler, Base, {
        init: function () {
            var self = this;

            self._buildHtml();
            self._buildEvent();
        },
        mkScales: function (isVertical, size) {
            var cursors = ['<span class="ks-cursor"></span>'];
            var opt = isVertical ? ['add', 'H', 'top', 'height', 'width'] : ['remove', 'W', 'left', 'width', 'height'];

            this.ruler[opt[0] + 'Class']('ks-page-ruler-v');
            this.figure.html(opt[1] + size + 'px').css(opt[2], size / 2 + 15);

            for (var i = 1; i < Math.floor(size / 5); i++) {
                if (i % 10 === 0) {
                    cursors.push('<s class="l" style="' + opt[2] + ': ' + i * 5 + 'px"><b>' + i * 5 + '</b></s>');
                } else if (i % 2 == 0) {
                    cursors.push('<s class="m" style="' + opt[2] + ': ' + i * 5 + 'px"></s>');
                } else {
                    cursors.push('<s class="s" style="' + opt[2] + ': ' + i * 5 + 'px"></s>');
                }
            }

            this.scales[opt[3]](size)[opt[4]](30).html(cursors.join(''));
            this.ruler[opt[3]](size - 2);
        },
        mkLines: function (lines) {
            var self = this;
            var ls = [];
            var vl = lines.v || [];
            var hl = lines.h || [];

            S.each(vl, function (v) {
                ls.push('<div class="ks-line ks-line-v" style="left: '+(parseFloat(v)-2)+'px;"></div>');
            });
            S.each(hl, function (h) {
                ls.push('<div class="ks-line ks-line-h" style="top: '+(parseFloat(h)-2)+'px;"></div>');
            });

            $(ls.join('')).appendTo('#J_KsPageTools .ks-page-line');
        },
        _buildHtml: function () {
            var self = this;
            var size = self.get('size');
            var lines = self.get('lines');
            var el = $('<div id="J_KsPageTools"></div>');

            self.set('el', el);
            el.appendTo('body');

            if (self.get('ruler')) {
                var pageRuler = ''
                    + '<div class="ks-page-ruler">'
                    + '<div class="ks-scales ks-scales-a"></div>'
                    + '<div class="ks-scales ks-scales-b"></div>'
                    + '<div class="ks-meter">'
                    +   '<i class="ks-resize ks-resize-a"></i>'
                    +   '<i class="ks-resize ks-resize-b"></i>'
                    + '<div class="ks-menus">'
                    +   '<a class="ks-orien" href="javascript:void(0);" title="shift + v"></a>'
                    +   '<a class="ks-brick" href="javascript:void(0);" title="shift + b"></a>'
                    +   '<a class="ks-mini" href="javascript:void(0);" title="shift + m">—</a>'
                    +   '<a class="ks-close" href="javascript:void(0);" title="shift + x">x</a>'
                    + '</div>'
                    + '<div class="ks-figure"></div>'
                    + '</div>';

                $(pageRuler).appendTo(el);

                self.ruler = el.children('.ks-page-ruler');
                self.scales = el.all('.ks-scales');
                self.meter = el.one('.ks-meter');
                self.menus = el.one('.ks-menus');
                self.figure = el.one('.ks-figure');

                self.mkScales(false, size);
            }

            if (S.isPlainObject(lines) && S.keys(lines.v).length > 0 || S.keys(lines.h).length > 0) {
                $('<div class="ks-page-line"></div>').appendTo(el);
                self.line = el.children('.ks-page-ruler');
            }
        },
        _buildEvent: function () {
            var self = this;
            var orien = self.menus.one('.ks-orien');

            orien.on('click', function (e) {
                if (self.ruler.hasClass('ks-page-ruler-vertical')) {
                    self.mkScales(false, self.ruler.outerHeight());
                    self.ruler.height(98);
                } else {
                    self.mkScales(true, self.ruler.outerWidth());
                    self.ruler.width(98);
                }
            });
        },
        _destroy: function () {

        }
    }, {
        ATTRS : {
            ruler: {
                value: true
            },
            size: {
                value: 500,
                setter: function (v) {
                    return Math.max(350, v);
                }
            },
            lines: {
                value: {}
            }
        }
    });
    return PageRuler;
}, {requires:['node', 'base', './index.css']});