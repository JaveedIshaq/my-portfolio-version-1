var $ = jQuery.noConflict();
$(".margin ul").quickPagination({
    pageSize: "6"
});
jQuery(document).ready(function () {
    jQuery('.skillbar').each(function () {
        jQuery(this).find('.skillbar-bar').animate({
            width: jQuery(this).attr('data-percent')
        }, 6000);
    });
});
var lastId, topMenu = $("#main-menu"),
    topMenuHeight = topMenu.outerHeight() + 15,
    menuItems = topMenu.find("a"),
    scrollItems = menuItems.map(function () {
        var item = $($(this).attr("href"));
        if (item.length) {
            return item;
        }
    });
menuItems.click(function (e) {
    var href = $(this).attr("href"),
        offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
    $('html, body').stop().animate({
        scrollTop: offsetTop
    }, 300);
    e.preventDefault();
});
$(window).scroll(function () {
    var fromTop = $(this).scrollTop() + topMenuHeight;
    var cur = scrollItems.map(function () {
        if ($(this).offset().top < fromTop) return this;
    });
    cur = cur[cur.length - 1];
    var id = cur && cur.length ? cur[0].id : "";
    if (lastId !== id) {
        lastId = id;
        menuItems.parent().removeClass("active").end().filter("[href=#" + id + "]").parent().addClass("active");
    }
});
$(window).on('load', function () {
    $('.fade-in').css({
        position: 'relative',
        opacity: 0,
        top: -14
    });
    setTimeout(function () {
        $('.loader').fadeOut(400, function () {
            $('#preload').fadeOut(800);
            setTimeout(function () {
                $('.fade-in').each(function (index) {
                    $(this).delay(400 * index).animate({
                        top: 0,
                        opacity: 1
                    }, 800);
                });
            }, 800);
        });
    }, 400);
});
new WOW().init();
$(window).scroll(function () {
    if ($(this).scrollTop() < 50) {
        $('#totop').fadeOut();
    } else {
        $('#totop').fadeIn();
    }
});
$('#totop').on('click', function () {
    $('html, body').animate({
        scrollTop: 0
    }, 'fast');
    return false;
});
$(function () {
    $('a[href*=#]:not([href=#])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    });
}
(function ($, window) {
    function Constellation(canvas, options) {
        var $canvas = $(canvas),
            context = canvas.getContext('2d'),
            defaults = {
                star: {
                    color: 'rgba(255, 255, 255, .5)',
                    width: 1
                },
                line: {
                    color: 'rgba(255, 255, 255, .5)',
                    width: 0.2
                },
                position: {
                    x: 0,
                    y: 0
                },
                width: window.innerWidth,
                height: window.innerHeight,
                velocity: 0.1,
                length: 100,
                distance: 120,
                radius: 150,
                stars: []
            }, config = $.extend(true, {}, defaults, options);

        function Star() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (config.velocity - (Math.random() * 0.5));
            this.vy = (config.velocity - (Math.random() * 0.5));
            this.radius = Math.random() * config.star.width;
        }
        Star.prototype = {
            create: function () {
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                context.fill();
            },
            animate: function () {
                var i;
                for (i = 0; i < config.length; i++) {
                    var star = config.stars[i];
                    if (star.y < 0 || star.y > canvas.height) {
                        star.vx = star.vx;
                        star.vy = -star.vy;
                    } else if (star.x < 0 || star.x > canvas.width) {
                        star.vx = -star.vx;
                        star.vy = star.vy;
                    }
                    star.x += star.vx;
                    star.y += star.vy;
                }
            },
            line: function () {
                var length = config.length,
                    iStar, jStar, i, j;
                for (i = 0; i < length; i++) {
                    for (j = 0; j < length; j++) {
                        iStar = config.stars[i];
                        jStar = config.stars[j];
                        if ((iStar.x - jStar.x) < config.distance && (iStar.y - jStar.y) < config.distance && (iStar.x - jStar.x) > -config.distance && (iStar.y - jStar.y) > -config.distance) {
                            if ((iStar.x - config.position.x) < config.radius && (iStar.y - config.position.y) < config.radius && (iStar.x - config.position.x) > -config.radius && (iStar.y - config.position.y) > -config.radius) {
                                context.beginPath();
                                context.moveTo(iStar.x, iStar.y);
                                context.lineTo(jStar.x, jStar.y);
                                context.stroke();
                                context.closePath();
                            }
                        }
                    }
                }
            }
        };
        this.createStars = function () {
            var length = config.length,
                star, i;
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (i = 0; i < length; i++) {
                config.stars.push(new Star());
                star = config.stars[i];
                star.create();
            }
            star.line();
            star.animate();
        };
        this.setCanvas = function () {
            canvas.width = config.width;
            canvas.height = config.height;
        };
        this.setContext = function () {
            context.fillStyle = config.star.color;
            context.strokeStyle = config.line.color;
            context.lineWidth = config.line.width;
        };
        this.setInitialPosition = function () {
            if (!options || !options.hasOwnProperty('position')) {
                config.position = {
                    x: canvas.width * 0.5,
                    y: canvas.height * 0.5
                };
            }
        };
        this.loop = function (callback) {
            callback();
            window.requestAnimationFrame(function () {
                this.loop(callback);
            }.bind(this));
        };
        this.bind = function () {
            $canvas.on('mousemove', function (e) {
                config.position.x = e.pageX - $canvas.offset().left;
                config.position.y = e.pageY - $canvas.offset().top;
            });
        };
        this.init = function () {
            this.setCanvas();
            this.setContext();
            this.setInitialPosition();
            this.loop(this.createStars);
            this.bind();
        };
    }
    $.fn.constellation = function (options) {
        return this.each(function () {
            var c = new Constellation(this, options);
            c.init();
        });
    };
})($, window);
$('canvas').constellation({
    line: {
        color: 'rgba(0, 255, 0, .5)'
    }
});
