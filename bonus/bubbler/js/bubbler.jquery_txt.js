(function ($) {
    'use strict';

    $.bubbler = function (el, options) {


        var base = this,
            $canvas = $(el),
            $windows = $(window);
            base.el = el;
        
        var w = $canvas.width(),
            h = $canvas.height(),
            maxWidth,
            minWidth;

        $canvas.data("bubbler", base);
        
        base.init = function () {
            base.options = $.extend({},$.bubbler.defaultOptions, options);
            
            $canvas.css({background: this.options.color , overflow:"hidden" , position:"relative"});

            maxWidth = (w > h) ?  Math.floor(h * base.options.max) :  Math.floor(w * base.options.max);
            minWidth = (w > h) ?  Math.floor(h * base.options.min) :  Math.floor(w * base.options.min);

            for(var i=0;i<this.options.ammount;i++) {
                var $bubble = generateBubble();
                $canvas.append($bubble);
                animate($bubble);
            };
                
            $windows.bind('resize',resize());

        }

        var resize = function () {
            w = $canvas.width(),
            h = $canvas.height();

            maxWidth = (w > h) ?  Math.floor(h * base.options.max) :  Math.floor(w * base.options.max);
            minWidth = (w > h) ?  Math.floor(h * base.options.min) :  Math.floor(w * base.options.min);
        }

        var updatestyle =  function (style) {

            switch(style) {
                case 'circle':
                    return {"border-radius":"50%"}
                break;
                default:
                    return {}
            }
        }
        
        var generateBubble = function () {
            var $bubble = $("<bubble></bubble>"),
                size    = getsize(),
                shade   = (!!((Math.random() * 2) | 0)) ? shadeColor(base.options.color,Math.random()*3+2) : shadeColor(base.options.color,(Math.random()*3+2)*-1),
                pos     = position(size),
                style   = $.extend(
                            {display:"block" , position:"absolute" , width:size,height:size , background:shade , left:pos[0] , top:pos[1]},
                            updatestyle(base.options.style,size,shade)
                          );

            $bubble.css(style);
            $bubble.size = size;
            return $bubble;
        }

        var getsize = function () {
            return Math.floor((Math.random()*maxWidth)+minWidth);
        };

        var shadeColor =  function (color, percent) {   
            var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
        }

        var position = function (size) {
            var nw = Math.floor(Math.random() * (w+size))-size;
            var nh = Math.floor(Math.random() * (h+size))-size;
            return [nw,nh];
        }

        var animate  = function ($bubble) {
            var pos     = position($bubble.size),
                curpos  =  $bubble.offset(),
                options = {},
                diff    = 0,
                point1  =  {x:curpos.left,y:curpos.top},
                point2  =  {x:curpos.left,y:curpos.top};

            if(base.options.horizontal) {
                options.left = pos[0];
                point2.x     = pos[0];
            }
            if(base.options.vertical)   {
                options.top = pos[1];
                point2.y    = pos[1];
            };

            $bubble.animate(options,gettime(getdistance(point1,point2)),
                function () {
                    animate($bubble);        
                }
            );
        };

        var getdistance  = function ( point1, point2 ) {
            var xs = 0;
            var ys = 0;

            xs = point2.x - point1.x;
            xs = xs * xs;
             
            ys = point2.y - point1.y;
            ys = ys * ys;

            return Math.sqrt( xs + ys );
        }

        var gettime =  function (distance) {
            var maxdistance =  (w > h) ? w : h;
            return  (((base.options.time*1000)/maxdistance)*distance);
        }

        base.init();
    };
    
    $.bubbler.defaultOptions = {
        color: "#1D2833",
        ammount: 20,
        min: .1,
        max: .4,
        time: 60,
        vertical:true,
        horizontal:true,
        style: 'circle'
    };
    
    $.fn.bubbler = function (options) {

        return this.each(function () {
            (new $.bubbler(this, options));
        });
    };
    
})(jQuery);