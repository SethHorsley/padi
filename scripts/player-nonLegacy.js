if ("undefined" == typeof jQuery)
  throw Error("Bootstrap's JavaScript requires jQuery");
+(function (b) {
  b = b.fn.jquery.split(" ")[0].split(".");
  if ((2 > b[0] && 9 > b[1]) || (1 == b[0] && 9 == b[1] && 1 > b[2]))
    throw Error(
      "Bootstrap's JavaScript requires jQuery version 1.9.1 or higher",
    );
})(jQuery);
+(function (b) {
  function f() {
    var b = document.createElement("bootstrap"),
      c = {
        WebkitTransition: "webkitTransitionEnd",
        MozTransition: "transitionend",
        OTransition: "oTransitionEnd otransitionend",
        transition: "transitionend",
      },
      a;
    for (a in c)
      if (void 0 !== b.style[a])
        return {
          end: c[a],
        };
    return !1;
  }
  b.fn.emulateTransitionEnd = function (d) {
    var c = !1,
      a = this;
    b(this).one("bsTransitionEnd", function () {
      c = !0;
    });
    return (
      setTimeout(function () {
        c || b(a).trigger(b.support.transition.end);
      }, d),
      this
    );
  };
  b(function () {
    b.support.transition = f();
    b.support.transition &&
      (b.event.special.bsTransitionEnd = {
        bindType: b.support.transition.end,
        delegateType: b.support.transition.end,
        handle: function (d) {
          return b(d.target).is(this)
            ? d.handleObj.handler.apply(this, arguments)
            : void 0;
        },
      });
  });
})(jQuery);
+(function (b) {
  var f = function (c) {
    b(c).on("click", '[data-dismiss\x3d"alert"]', this.close);
  };
  f.VERSION = "3.3.5";
  f.TRANSITION_DURATION = 150;
  f.prototype.close = function (c) {
    function a() {
      h.detach().trigger("closed.bs.alert").remove();
    }
    var e = b(this),
      g = e.attr("data-target");
    g || ((g = e.attr("href")), (g = g && g.replace(/.*(?=#[^\s]*$)/, "")));
    var h = b(g);
    c && c.preventDefault();
    h.length || (h = e.closest(".alert"));
    h.trigger((c = b.Event("close.bs.alert")));
    c.isDefaultPrevented() ||
      (h.removeClass("in"),
      b.support.transition && h.hasClass("fade")
        ? h
            .one("bsTransitionEnd", a)
            .emulateTransitionEnd(f.TRANSITION_DURATION)
        : a());
  };
  var d = b.fn.alert;
  b.fn.alert = function (c) {
    return this.each(function () {
      var a = b(this),
        e = a.data("bs.alert");
      e || a.data("bs.alert", (e = new f(this)));
      "string" == typeof c && e[c].call(a);
    });
  };
  b.fn.alert.Constructor = f;
  b.fn.alert.noConflict = function () {
    return (b.fn.alert = d), this;
  };
  b(document).on(
    "click.bs.alert.data-api",
    '[data-dismiss\x3d"alert"]',
    f.prototype.close,
  );
})(jQuery);
+(function (b) {
  function f(a) {
    return this.each(function () {
      var e = b(this),
        c = e.data("bs.button"),
        h = "object" == typeof a && a;
      c || e.data("bs.button", (c = new d(this, h)));
      "toggle" == a ? c.toggle() : a && c.setState(a);
    });
  }
  var d = function (a, e) {
    this.$element = b(a);
    this.options = b.extend({}, d.DEFAULTS, e);
    this.isLoading = !1;
  };
  d.VERSION = "3.3.5";
  d.DEFAULTS = {
    loadingText: "loading...",
  };
  d.prototype.setState = function (a) {
    var e = this.$element,
      c = e.is("input") ? "val" : "html",
      h = e.data();
    a += "Text";
    null == h.resetText && e.data("resetText", e[c]());
    setTimeout(
      b.proxy(function () {
        e[c](null == h[a] ? this.options[a] : h[a]);
        "loadingText" == a
          ? ((this.isLoading = !0),
            e.addClass("disabled").attr("disabled", "disabled"))
          : this.isLoading &&
            ((this.isLoading = !1),
            e.removeClass("disabled").removeAttr("disabled"));
      }, this),
      0,
    );
  };
  d.prototype.toggle = function () {
    var a = !0,
      e = this.$element.closest('[data-toggle\x3d"buttons"]');
    if (e.length) {
      var b = this.$element.find("input");
      "radio" == b.prop("type")
        ? (b.prop("checked") && (a = !1),
          e.find(".active").removeClass("active"),
          this.$element.addClass("active"))
        : "checkbox" == b.prop("type") &&
          (b.prop("checked") !== this.$element.hasClass("active") && (a = !1),
          this.$element.toggleClass("active"));
      b.prop("checked", this.$element.hasClass("active"));
      a && b.trigger("change");
    } else
      this.$element.attr("aria-pressed", !this.$element.hasClass("active")),
        this.$element.toggleClass("active");
  };
  var c = b.fn.button;
  b.fn.button = f;
  b.fn.button.Constructor = d;
  b.fn.button.noConflict = function () {
    return (b.fn.button = c), this;
  };
  b(document)
    .on("click.bs.button.data-api", '[data-toggle^\x3d"button"]', function (a) {
      var e = b(a.target);
      e.hasClass("btn") || (e = e.closest(".btn"));
      f.call(e, "toggle");
      b(a.target).is('input[type\x3d"radio"]') ||
        b(a.target).is('input[type\x3d"checkbox"]') ||
        a.preventDefault();
    })
    .on(
      "focus.bs.button.data-api blur.bs.button.data-api",
      '[data-toggle^\x3d"button"]',
      function (a) {
        b(a.target)
          .closest(".btn")
          .toggleClass("focus", /^focus(in)?$/.test(a.type));
      },
    );
})(jQuery);
+(function (b) {
  function f(a) {
    return this.each(function () {
      var c = b(this),
        h = c.data("bs.carousel"),
        l = b.extend({}, d.DEFAULTS, c.data(), "object" == typeof a && a),
        k = "string" == typeof a ? a : l.slide;
      h || c.data("bs.carousel", (h = new d(this, l)));
      "number" == typeof a
        ? h.to(a)
        : k
          ? h[k]()
          : l.interval && h.pause().cycle();
    });
  }
  var d = function (a, c) {
    this.$element = b(a);
    this.$indicators = this.$element.find(".carousel-indicators");
    this.options = c;
    this.$items =
      this.$active =
      this.interval =
      this.sliding =
      this.paused =
        null;
    this.options.keyboard &&
      this.$element.on("keydown.bs.carousel", b.proxy(this.keydown, this));
    "hover" != this.options.pause ||
      "ontouchstart" in document.documentElement ||
      this.$element
        .on("mouseenter.bs.carousel", b.proxy(this.pause, this))
        .on("mouseleave.bs.carousel", b.proxy(this.cycle, this));
  };
  d.VERSION = "3.3.5";
  d.TRANSITION_DURATION = 600;
  d.DEFAULTS = {
    interval: 5e3,
    pause: "hover",
    wrap: !0,
    keyboard: !0,
  };
  d.prototype.keydown = function (a) {
    if (!/input|textarea/i.test(a.target.tagName)) {
      switch (a.which) {
        case 37:
          this.prev();
          break;
        case 39:
          this.next();
          break;
        default:
          return;
      }
      a.preventDefault();
    }
  };
  d.prototype.cycle = function (a) {
    return (
      a || (this.paused = !1),
      this.interval && clearInterval(this.interval),
      this.options.interval &&
        !this.paused &&
        (this.interval = setInterval(
          b.proxy(this.next, this),
          this.options.interval,
        )),
      this
    );
  };
  d.prototype.getItemIndex = function (a) {
    return (
      (this.$items = a.parent().children(".item")),
      this.$items.index(a || this.$active)
    );
  };
  d.prototype.getItemForDirection = function (a, b) {
    var c = this.getItemIndex(b);
    return (("prev" == a && 0 === c) ||
      ("next" == a && c == this.$items.length - 1)) &&
      !this.options.wrap
      ? b
      : this.$items.eq((c + ("prev" == a ? -1 : 1)) % this.$items.length);
  };
  d.prototype.to = function (a) {
    var b = this,
      c = this.getItemIndex(
        (this.$active = this.$element.find(".item.active")),
      );
    return a > this.$items.length - 1 || 0 > a
      ? void 0
      : this.sliding
        ? this.$element.one("slid.bs.carousel", function () {
            b.to(a);
          })
        : c == a
          ? this.pause().cycle()
          : this.slide(a > c ? "next" : "prev", this.$items.eq(a));
  };
  d.prototype.pause = function (a) {
    return (
      a || (this.paused = !0),
      this.$element.find(".next, .prev").length &&
        b.support.transition &&
        (this.$element.trigger(b.support.transition.end), this.cycle(!0)),
      (this.interval = clearInterval(this.interval)),
      this
    );
  };
  d.prototype.next = function () {
    return this.sliding ? void 0 : this.slide("next");
  };
  d.prototype.prev = function () {
    return this.sliding ? void 0 : this.slide("prev");
  };
  d.prototype.slide = function (a, c) {
    var h = this.$element.find(".item.active"),
      l = c || this.getItemForDirection(a, h);
    c = this.interval;
    var k = "next" == a ? "left" : "right",
      f = this;
    if (l.hasClass("active")) return (this.sliding = !1);
    var x = l[0],
      z = b.Event("slide.bs.carousel", {
        relatedTarget: x,
        direction: k,
      });
    if ((this.$element.trigger(z), !z.isDefaultPrevented())) {
      if (((this.sliding = !0), c && this.pause(), this.$indicators.length))
        this.$indicators.find(".active").removeClass("active"),
          (z = b(this.$indicators.children()[this.getItemIndex(l)])) &&
            z.addClass("active");
      var v = b.Event("slid.bs.carousel", {
        relatedTarget: x,
        direction: k,
      });
      return (
        b.support.transition && this.$element.hasClass("slide")
          ? (l.addClass(a),
            l[0].offsetWidth,
            h.addClass(k),
            l.addClass(k),
            h
              .one("bsTransitionEnd", function () {
                l.removeClass([a, k].join(" ")).addClass("active");
                h.removeClass(["active", k].join(" "));
                f.sliding = !1;
                setTimeout(function () {
                  f.$element.trigger(v);
                }, 0);
              })
              .emulateTransitionEnd(d.TRANSITION_DURATION))
          : (h.removeClass("active"),
            l.addClass("active"),
            (this.sliding = !1),
            this.$element.trigger(v)),
        c && this.cycle(),
        this
      );
    }
  };
  var c = b.fn.carousel;
  b.fn.carousel = f;
  b.fn.carousel.Constructor = d;
  b.fn.carousel.noConflict = function () {
    return (b.fn.carousel = c), this;
  };
  var a = function (a) {
    var c,
      h = b(this),
      l = b(
        h.attr("data-target") ||
          ((c = h.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "")),
      );
    l.hasClass("carousel") &&
      ((c = b.extend({}, l.data(), h.data())),
      (h = h.attr("data-slide-to")) && (c.interval = !1),
      f.call(l, c),
      h && l.data("bs.carousel").to(h),
      a.preventDefault());
  };
  b(document)
    .on("click.bs.carousel.data-api", "[data-slide]", a)
    .on("click.bs.carousel.data-api", "[data-slide-to]", a);
  b(window).on("load", function () {
    b('[data-ride\x3d"carousel"]').each(function () {
      var a = b(this);
      f.call(a, a.data());
    });
  });
})(jQuery);
+(function (b) {
  function f(a) {
    var c;
    a =
      a.attr("data-target") ||
      ((c = a.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, ""));
    return b(a);
  }
  function d(a) {
    return this.each(function () {
      var g = b(this),
        h = g.data("bs.collapse"),
        l = b.extend({}, c.DEFAULTS, g.data(), "object" == typeof a && a);
      !h && l.toggle && /show|hide/.test(a) && (l.toggle = !1);
      h || g.data("bs.collapse", (h = new c(this, l)));
      "string" == typeof a && h[a]();
    });
  }
  var c = function (a, g) {
    this.$element = b(a);
    this.options = b.extend({}, c.DEFAULTS, g);
    this.$trigger = b(
      '[data-toggle\x3d"collapse"][href\x3d"#' +
        a.id +
        '"],[data-toggle\x3d"collapse"][data-target\x3d"#' +
        a.id +
        '"]',
    );
    this.transitioning = null;
    this.options.parent
      ? (this.$parent = this.getParent())
      : this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    this.options.toggle && this.toggle();
  };
  c.VERSION = "3.3.5";
  c.TRANSITION_DURATION = 350;
  c.DEFAULTS = {
    toggle: !0,
  };
  c.prototype.dimension = function () {
    return this.$element.hasClass("width") ? "width" : "height";
  };
  c.prototype.show = function () {
    if (!this.transitioning && !this.$element.hasClass("in")) {
      var a,
        g =
          this.$parent &&
          this.$parent.children(".panel").children(".in, .collapsing");
      if (
        !(g && g.length && ((a = g.data("bs.collapse")), a && a.transitioning))
      ) {
        var h = b.Event("show.bs.collapse");
        if ((this.$element.trigger(h), !h.isDefaultPrevented())) {
          g &&
            g.length &&
            (d.call(g, "hide"), a || g.data("bs.collapse", null));
          var l = this.dimension();
          this.$element
            .removeClass("collapse")
            .addClass("collapsing")
            [l](0)
            .attr("aria-expanded", !0);
          this.$trigger.removeClass("collapsed").attr("aria-expanded", !0);
          this.transitioning = 1;
          a = function () {
            this.$element
              .removeClass("collapsing")
              .addClass("collapse in")
              [l]("");
            this.transitioning = 0;
            this.$element.trigger("shown.bs.collapse");
          };
          if (!b.support.transition) return a.call(this);
          g = b.camelCase(["scroll", l].join("-"));
          this.$element
            .one("bsTransitionEnd", b.proxy(a, this))
            .emulateTransitionEnd(c.TRANSITION_DURATION)
            [l](this.$element[0][g]);
        }
      }
    }
  };
  c.prototype.hide = function () {
    if (!this.transitioning && this.$element.hasClass("in")) {
      var a = b.Event("hide.bs.collapse");
      if ((this.$element.trigger(a), !a.isDefaultPrevented())) {
        a = this.dimension();
        this.$element[a](this.$element[a]())[0].offsetHeight;
        this.$element
          .addClass("collapsing")
          .removeClass("collapse in")
          .attr("aria-expanded", !1);
        this.$trigger.addClass("collapsed").attr("aria-expanded", !1);
        this.transitioning = 1;
        var g = function () {
          this.transitioning = 0;
          this.$element
            .removeClass("collapsing")
            .addClass("collapse")
            .trigger("hidden.bs.collapse");
        };
        return b.support.transition
          ? void this.$element[a](0)
              .one("bsTransitionEnd", b.proxy(g, this))
              .emulateTransitionEnd(c.TRANSITION_DURATION)
          : g.call(this);
      }
    }
  };
  c.prototype.toggle = function () {
    this[this.$element.hasClass("in") ? "hide" : "show"]();
  };
  c.prototype.getParent = function () {
    return b(this.options.parent)
      .find(
        '[data-toggle\x3d"collapse"][data-parent\x3d"' +
          this.options.parent +
          '"]',
      )
      .each(
        b.proxy(function (a, c) {
          a = b(c);
          this.addAriaAndCollapsedClass(f(a), a);
        }, this),
      )
      .end();
  };
  c.prototype.addAriaAndCollapsedClass = function (a, b) {
    var c = a.hasClass("in");
    a.attr("aria-expanded", c);
    b.toggleClass("collapsed", !c).attr("aria-expanded", c);
  };
  var a = b.fn.collapse;
  b.fn.collapse = d;
  b.fn.collapse.Constructor = c;
  b.fn.collapse.noConflict = function () {
    return (b.fn.collapse = a), this;
  };
  b(document).on(
    "click.bs.collapse.data-api",
    '[data-toggle\x3d"collapse"]',
    function (a) {
      var c = b(this);
      c.attr("data-target") || a.preventDefault();
      a = f(c);
      c = a.data("bs.collapse") ? "toggle" : c.data();
      d.call(a, c);
    },
  );
})(jQuery);
+(function (b) {
  function f(a) {
    var c = a.attr("data-target");
    c ||
      ((c = a.attr("href")),
      (c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, "")));
    return (c = c && b(c)) && c.length ? c : a.parent();
  }
  function d(e) {
    (e && 3 === e.which) ||
      (b(c).remove(),
      b(a).each(function () {
        var a = b(this),
          c = f(a),
          g = {
            relatedTarget: this,
          };
        c.hasClass("open") &&
          ((e &&
            "click" == e.type &&
            /input|textarea/i.test(e.target.tagName) &&
            b.contains(c[0], e.target)) ||
            (c.trigger((e = b.Event("hide.bs.dropdown", g))),
            e.isDefaultPrevented() ||
              (a.attr("aria-expanded", "false"),
              c.removeClass("open").trigger("hidden.bs.dropdown", g))));
      }));
  }
  var c = ".dropdown-backdrop",
    a = '[data-toggle\x3d"dropdown"]',
    e = function (a) {
      b(a).on("click.bs.dropdown", this.toggle);
    };
  e.VERSION = "3.3.5";
  e.prototype.toggle = function (a) {
    var c = b(this);
    if (!c.is(".disabled, :disabled")) {
      var e = f(c),
        g = e.hasClass("open");
      if ((d(), !g)) {
        "ontouchstart" in document.documentElement &&
          !e.closest(".navbar-nav").length &&
          b(document.createElement("div"))
            .addClass("dropdown-backdrop")
            .insertAfter(b(this))
            .on("click", d);
        g = {
          relatedTarget: this,
        };
        if (
          (e.trigger((a = b.Event("show.bs.dropdown", g))),
          a.isDefaultPrevented())
        )
          return;
        c.trigger("focus").attr("aria-expanded", "true");
        e.toggleClass("open").trigger("shown.bs.dropdown", g);
      }
      return !1;
    }
  };
  e.prototype.keydown = function (c) {
    if (
      /(38|40|27|32)/.test(c.which) &&
      !/input|textarea/i.test(c.target.tagName)
    ) {
      var e = b(this);
      if (
        (c.preventDefault(), c.stopPropagation(), !e.is(".disabled, :disabled"))
      ) {
        var g = f(e),
          d = g.hasClass("open");
        if ((!d && 27 != c.which) || (d && 27 == c.which))
          return (
            27 == c.which && g.find(a).trigger("focus"), e.trigger("click")
          );
        e = g.find(".dropdown-menu li:not(.disabled):visible a");
        e.length &&
          ((g = e.index(c.target)),
          38 == c.which && 0 < g && g--,
          40 == c.which && g < e.length - 1 && g++,
          ~g || (g = 0),
          e.eq(g).trigger("focus"));
      }
    }
  };
  var g = b.fn.dropdown;
  b.fn.dropdown = function (a) {
    return this.each(function () {
      var c = b(this),
        g = c.data("bs.dropdown");
      g || c.data("bs.dropdown", (g = new e(this)));
      "string" == typeof a && g[a].call(c);
    });
  };
  b.fn.dropdown.Constructor = e;
  b.fn.dropdown.noConflict = function () {
    return (b.fn.dropdown = g), this;
  };
  b(document)
    .on("click.bs.dropdown.data-api", d)
    .on("click.bs.dropdown.data-api", ".dropdown form", function (a) {
      a.stopPropagation();
    })
    .on("click.bs.dropdown.data-api", a, e.prototype.toggle)
    .on("keydown.bs.dropdown.data-api", a, e.prototype.keydown)
    .on("keydown.bs.dropdown.data-api", ".dropdown-menu", e.prototype.keydown);
})(jQuery);
+(function (b) {
  function f(a, c) {
    return this.each(function () {
      var g = b(this),
        h = g.data("bs.modal"),
        f = b.extend({}, d.DEFAULTS, g.data(), "object" == typeof a && a);
      h || g.data("bs.modal", (h = new d(this, f)));
      "string" == typeof a ? h[a](c) : f.show && h.show(c);
    });
  }
  var d = function (a, c) {
    this.options = c;
    this.$body = b(document.body);
    this.$element = b(a);
    this.$dialog = this.$element.find(".modal-dialog");
    this.originalBodyPad = this.isShown = this.$backdrop = null;
    this.scrollbarWidth = 0;
    this.ignoreBackdropClick = !1;
    this.options.remote &&
      this.$element.find(".modal-content").load(
        this.options.remote,
        b.proxy(function () {
          this.$element.trigger("loaded.bs.modal");
        }, this),
      );
  };
  d.VERSION = "3.3.5";
  d.TRANSITION_DURATION = 300;
  d.BACKDROP_TRANSITION_DURATION = 150;
  d.DEFAULTS = {
    backdrop: !0,
    keyboard: !0,
    show: !0,
  };
  d.prototype.toggle = function (a) {
    return this.isShown ? this.hide() : this.show(a);
  };
  d.prototype.show = function (a) {
    var c = this,
      g = b.Event("show.bs.modal", {
        relatedTarget: a,
      });
    this.$element.trigger(g);
    this.isShown ||
      g.isDefaultPrevented() ||
      ((this.isShown = !0),
      this.checkScrollbar(),
      this.setScrollbar(),
      this.$body.addClass("modal-open"),
      this.escape(),
      this.resize(),
      this.$element.on(
        "click.dismiss.bs.modal",
        '[data-dismiss\x3d"modal"]',
        b.proxy(this.hide, this),
      ),
      this.$dialog.on("mousedown.dismiss.bs.modal", function () {
        c.$element.one("mouseup.dismiss.bs.modal", function (a) {
          b(a.target).is(c.$element) && (c.ignoreBackdropClick = !0);
        });
      }),
      this.backdrop(function () {
        var g = b.support.transition && c.$element.hasClass("fade");
        c.$element.parent().length || c.$element.appendTo(c.$body);
        c.$element.show().scrollTop(0);
        c.adjustDialog();
        g && c.$element[0].offsetWidth;
        c.$element.addClass("in");
        c.enforceFocus();
        var f = b.Event("shown.bs.modal", {
          relatedTarget: a,
        });
        g
          ? c.$dialog
              .one("bsTransitionEnd", function () {
                c.$element.trigger("focus").trigger(f);
              })
              .emulateTransitionEnd(d.TRANSITION_DURATION)
          : c.$element.trigger("focus").trigger(f);
      }));
  };
  d.prototype.hide = function (a) {
    a && a.preventDefault();
    a = b.Event("hide.bs.modal");
    this.$element.trigger(a);
    this.isShown &&
      !a.isDefaultPrevented() &&
      ((this.isShown = !1),
      this.escape(),
      this.resize(),
      b(document).off("focusin.bs.modal"),
      this.$element
        .removeClass("in")
        .off("click.dismiss.bs.modal")
        .off("mouseup.dismiss.bs.modal"),
      this.$dialog.off("mousedown.dismiss.bs.modal"),
      b.support.transition && this.$element.hasClass("fade")
        ? this.$element
            .one("bsTransitionEnd", b.proxy(this.hideModal, this))
            .emulateTransitionEnd(d.TRANSITION_DURATION)
        : this.hideModal());
  };
  d.prototype.enforceFocus = function () {
    b(document)
      .off("focusin.bs.modal")
      .on(
        "focusin.bs.modal",
        b.proxy(function (a) {
          this.$element[0] === a.target ||
            this.$element.has(a.target).length ||
            this.$element.trigger("focus");
        }, this),
      );
  };
  d.prototype.escape = function () {
    this.isShown && this.options.keyboard
      ? this.$element.on(
          "keydown.dismiss.bs.modal",
          b.proxy(function (a) {
            27 == a.which && this.hide();
          }, this),
        )
      : this.isShown || this.$element.off("keydown.dismiss.bs.modal");
  };
  d.prototype.resize = function () {
    this.isShown
      ? b(window).on("resize.bs.modal", b.proxy(this.handleUpdate, this))
      : b(window).off("resize.bs.modal");
  };
  d.prototype.hideModal = function () {
    var a = this;
    this.$element.hide();
    this.backdrop(function () {
      a.$body.removeClass("modal-open");
      a.resetAdjustments();
      a.resetScrollbar();
      a.$element.trigger("hidden.bs.modal");
    });
  };
  d.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };
  d.prototype.backdrop = function (a) {
    var c = this,
      g = this.$element.hasClass("fade") ? "fade" : "";
    if (this.isShown && this.options.backdrop) {
      var h = b.support.transition && g;
      if (
        ((this.$backdrop = b(document.createElement("div"))
          .addClass("modal-backdrop " + g)
          .appendTo(this.$body)),
        this.$element.on(
          "click.dismiss.bs.modal",
          b.proxy(function (a) {
            return this.ignoreBackdropClick
              ? void (this.ignoreBackdropClick = !1)
              : void (
                  a.target === a.currentTarget &&
                  ("static" == this.options.backdrop
                    ? this.$element[0].focus()
                    : this.hide())
                );
          }, this),
        ),
        h && this.$backdrop[0].offsetWidth,
        this.$backdrop.addClass("in"),
        a)
      )
        h
          ? this.$backdrop
              .one("bsTransitionEnd", a)
              .emulateTransitionEnd(d.BACKDROP_TRANSITION_DURATION)
          : a();
    } else
      !this.isShown && this.$backdrop
        ? (this.$backdrop.removeClass("in"),
          (g = function () {
            c.removeBackdrop();
            a && a();
          }),
          b.support.transition && this.$element.hasClass("fade")
            ? this.$backdrop
                .one("bsTransitionEnd", g)
                .emulateTransitionEnd(d.BACKDROP_TRANSITION_DURATION)
            : g())
        : a && a();
  };
  d.prototype.handleUpdate = function () {
    this.adjustDialog();
  };
  d.prototype.adjustDialog = function () {
    var a =
      this.$element[0].scrollHeight > document.documentElement.clientHeight;
    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && a ? this.scrollbarWidth : "",
      paddingRight: this.bodyIsOverflowing && !a ? this.scrollbarWidth : "",
    });
  };
  d.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: "",
      paddingRight: "",
    });
  };
  d.prototype.checkScrollbar = function () {
    var a = window.innerWidth;
    a ||
      ((a = document.documentElement.getBoundingClientRect()),
      (a = a.right - Math.abs(a.left)));
    this.bodyIsOverflowing = document.body.clientWidth < a;
    this.scrollbarWidth = this.measureScrollbar();
  };
  d.prototype.setScrollbar = function () {
    var a = parseInt(this.$body.css("padding-right") || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || "";
    this.bodyIsOverflowing &&
      this.$body.css("padding-right", a + this.scrollbarWidth);
  };
  d.prototype.resetScrollbar = function () {
    this.$body.css("padding-right", this.originalBodyPad);
  };
  d.prototype.measureScrollbar = function () {
    var a = document.createElement("div");
    a.className = "modal-scrollbar-measure";
    this.$body.append(a);
    var b = a.offsetWidth - a.clientWidth;
    return this.$body[0].removeChild(a), b;
  };
  var c = b.fn.modal;
  b.fn.modal = f;
  b.fn.modal.Constructor = d;
  b.fn.modal.noConflict = function () {
    return (b.fn.modal = c), this;
  };
  b(document).on(
    "click.bs.modal.data-api",
    '[data-toggle\x3d"modal"]',
    function (a) {
      var c = b(this),
        g = c.attr("href"),
        h = b(c.attr("data-target") || (g && g.replace(/.*(?=#[^\s]+$)/, ""))),
        g = h.data("bs.modal")
          ? "toggle"
          : b.extend(
              {
                remote: !/#/.test(g) && g,
              },
              h.data(),
              c.data(),
            );
      c.is("a") && a.preventDefault();
      h.one("show.bs.modal", function (a) {
        a.isDefaultPrevented() ||
          h.one("hidden.bs.modal", function () {
            c.is(":visible") && c.trigger("focus");
          });
      });
      f.call(h, g, this);
    },
  );
})(jQuery);
+(function (b) {
  var f = function (b, a) {
    this.inState =
      this.$element =
      this.hoverState =
      this.timeout =
      this.enabled =
      this.options =
      this.type =
        null;
    this.init("tooltip", b, a);
  };
  f.VERSION = "3.3.5";
  f.TRANSITION_DURATION = 150;
  f.DEFAULTS = {
    animation: !0,
    placement: "top",
    selector: !1,
    template:
      '\x3cdiv class\x3d"tooltip" role\x3d"tooltip"\x3e\x3cdiv class\x3d"tooltip-arrow"\x3e\x3c/div\x3e\x3cdiv class\x3d"tooltip-inner"\x3e\x3c/div\x3e\x3c/div\x3e',
    trigger: "hover focus",
    title: "",
    delay: 0,
    html: !1,
    container: !1,
    viewport: {
      selector: "body",
      padding: 0,
    },
  };
  f.prototype.init = function (c, a, e) {
    if (
      ((this.enabled = !0),
      (this.type = c),
      (this.$element = b(a)),
      (this.options = this.getOptions(e)),
      (this.$viewport =
        this.options.viewport &&
        b(
          b.isFunction(this.options.viewport)
            ? this.options.viewport.call(this, this.$element)
            : this.options.viewport.selector || this.options.viewport,
        )),
      (this.inState = {
        click: !1,
        hover: !1,
        focus: !1,
      }),
      this.$element[0] instanceof document.constructor &&
        !this.options.selector)
    )
      throw Error(
        "`selector` option must be specified when initializing " +
          this.type +
          " on the window.document object!",
      );
    c = this.options.trigger.split(" ");
    for (a = c.length; a--; )
      if (((e = c[a]), "click" == e))
        this.$element.on(
          "click." + this.type,
          this.options.selector,
          b.proxy(this.toggle, this),
        );
      else if ("manual" != e) {
        var g = "hover" == e ? "mouseleave" : "focusout";
        this.$element.on(
          ("hover" == e ? "mouseenter" : "focusin") + "." + this.type,
          this.options.selector,
          b.proxy(this.enter, this),
        );
        this.$element.on(
          g + "." + this.type,
          this.options.selector,
          b.proxy(this.leave, this),
        );
      }
    this.options.selector
      ? (this._options = b.extend({}, this.options, {
          trigger: "manual",
          selector: "",
        }))
      : this.fixTitle();
  };
  f.prototype.getDefaults = function () {
    return f.DEFAULTS;
  };
  f.prototype.getOptions = function (c) {
    return (
      (c = b.extend({}, this.getDefaults(), this.$element.data(), c)),
      c.delay &&
        "number" == typeof c.delay &&
        (c.delay = {
          show: c.delay,
          hide: c.delay,
        }),
      c
    );
  };
  f.prototype.getDelegateOptions = function () {
    var c = {},
      a = this.getDefaults();
    return (
      this._options &&
        b.each(this._options, function (b, g) {
          a[b] != g && (c[b] = g);
        }),
      c
    );
  };
  f.prototype.enter = function (c) {
    var a =
      c instanceof this.constructor
        ? c
        : b(c.currentTarget).data("bs." + this.type);
    return (
      a ||
        ((a = new this.constructor(c.currentTarget, this.getDelegateOptions())),
        b(c.currentTarget).data("bs." + this.type, a)),
      c instanceof b.Event &&
        (a.inState["focusin" == c.type ? "focus" : "hover"] = !0),
      a.tip().hasClass("in") || "in" == a.hoverState
        ? void (a.hoverState = "in")
        : (clearTimeout(a.timeout),
          (a.hoverState = "in"),
          a.options.delay && a.options.delay.show
            ? void (a.timeout = setTimeout(function () {
                "in" == a.hoverState && a.show();
              }, a.options.delay.show))
            : a.show())
    );
  };
  f.prototype.isInStateTrue = function () {
    for (var b in this.inState) if (this.inState[b]) return !0;
    return !1;
  };
  f.prototype.leave = function (c) {
    var a =
      c instanceof this.constructor
        ? c
        : b(c.currentTarget).data("bs." + this.type);
    return (
      a ||
        ((a = new this.constructor(c.currentTarget, this.getDelegateOptions())),
        b(c.currentTarget).data("bs." + this.type, a)),
      c instanceof b.Event &&
        (a.inState["focusout" == c.type ? "focus" : "hover"] = !1),
      a.isInStateTrue()
        ? void 0
        : (clearTimeout(a.timeout),
          (a.hoverState = "out"),
          a.options.delay && a.options.delay.hide
            ? void (a.timeout = setTimeout(function () {
                "out" == a.hoverState && a.hide();
              }, a.options.delay.hide))
            : a.hide())
    );
  };
  f.prototype.show = function () {
    var c = b.Event("show.bs." + this.type);
    if (this.hasContent() && this.enabled) {
      this.$element.trigger(c);
      var a = b.contains(
        this.$element[0].ownerDocument.documentElement,
        this.$element[0],
      );
      if (!c.isDefaultPrevented() && a) {
        var e = this,
          c = this.tip(),
          a = this.getUID(this.type);
        this.setContent();
        c.attr("id", a);
        this.$element.attr("aria-describedby", a);
        this.options.animation && c.addClass("fade");
        var a =
            "function" == typeof this.options.placement
              ? this.options.placement.call(this, c[0], this.$element[0])
              : this.options.placement,
          g = /\s?auto?\s?/i,
          h = g.test(a);
        h && (a = a.replace(g, "") || "top");
        c.detach()
          .css({
            top: 0,
            left: 0,
            display: "block",
          })
          .addClass(a)
          .data("bs." + this.type, this);
        this.options.container
          ? c.appendTo(this.options.container)
          : c.insertAfter(this.$element);
        this.$element.trigger("inserted.bs." + this.type);
        var g = this.getPosition(),
          d = c[0].offsetWidth,
          k = c[0].offsetHeight;
        if (h) {
          var h = a,
            p = this.getPosition(this.$viewport),
            a =
              "bottom" == a && g.bottom + k > p.bottom
                ? "top"
                : "top" == a && g.top - k < p.top
                  ? "bottom"
                  : "right" == a && g.right + d > p.width
                    ? "left"
                    : "left" == a && g.left - d < p.left
                      ? "right"
                      : a;
          c.removeClass(h).addClass(a);
        }
        g = this.getCalculatedOffset(a, g, d, k);
        this.applyPlacement(g, a);
        a = function () {
          var a = e.hoverState;
          e.$element.trigger("shown.bs." + e.type);
          e.hoverState = null;
          "out" == a && e.leave(e);
        };
        b.support.transition && this.$tip.hasClass("fade")
          ? c
              .one("bsTransitionEnd", a)
              .emulateTransitionEnd(f.TRANSITION_DURATION)
          : a();
      }
    }
  };
  f.prototype.applyPlacement = function (c, a) {
    var e = this.tip(),
      g = e[0].offsetWidth,
      h = e[0].offsetHeight,
      d = parseInt(e.css("margin-top"), 10),
      k = parseInt(e.css("margin-left"), 10);
    isNaN(d) && (d = 0);
    isNaN(k) && (k = 0);
    c.top += d;
    c.left += k;
    b.offset.setOffset(
      e[0],
      b.extend(
        {
          using: function (a) {
            e.css({
              top: Math.round(a.top),
              left: Math.round(a.left),
            });
          },
        },
        c,
      ),
      0,
    );
    e.addClass("in");
    d = e[0].offsetWidth;
    k = e[0].offsetHeight;
    "top" == a && k != h && (c.top = c.top + h - k);
    var f = this.getViewportAdjustedDelta(a, c, d, k);
    f.left ? (c.left += f.left) : (c.top += f.top);
    g = (a = /top|bottom/.test(a)) ? 2 * f.left - g + d : 2 * f.top - h + k;
    h = a ? "offsetWidth" : "offsetHeight";
    e.offset(c);
    this.replaceArrow(g, e[0][h], a);
  };
  f.prototype.replaceArrow = function (b, a, e) {
    this.arrow()
      .css(e ? "left" : "top", 50 * (1 - b / a) + "%")
      .css(e ? "top" : "left", "");
  };
  f.prototype.setContent = function () {
    var b = this.tip(),
      a = this.getTitle();
    b.find(".tooltip-inner")[this.options.html ? "html" : "text"](a);
    b.removeClass("fade in top bottom left right");
  };
  f.prototype.hide = function (c) {
    function a() {
      "in" != e.hoverState && g.detach();
      e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type);
      c && c();
    }
    var e = this,
      g = b(this.$tip),
      d = b.Event("hide.bs." + this.type);
    return (
      this.$element.trigger(d),
      d.isDefaultPrevented()
        ? void 0
        : (g.removeClass("in"),
          b.support.transition && g.hasClass("fade")
            ? g
                .one("bsTransitionEnd", a)
                .emulateTransitionEnd(f.TRANSITION_DURATION)
            : a(),
          (this.hoverState = null),
          this)
    );
  };
  f.prototype.fixTitle = function () {
    var b = this.$element;
    (b.attr("title") || "string" != typeof b.attr("data-original-title")) &&
      b.attr("data-original-title", b.attr("title") || "").attr("title", "");
  };
  f.prototype.hasContent = function () {
    return this.getTitle();
  };
  f.prototype.getPosition = function (c) {
    c = c || this.$element;
    var a = c[0],
      e = "BODY" == a.tagName,
      a = a.getBoundingClientRect();
    null == a.width &&
      (a = b.extend({}, a, {
        width: a.right - a.left,
        height: a.bottom - a.top,
      }));
    var g = e
      ? {
          top: 0,
          left: 0,
        }
      : c.offset();
    c = {
      scroll: e
        ? document.documentElement.scrollTop || document.body.scrollTop
        : c.scrollTop(),
    };
    e = e
      ? {
          width: b(window).width(),
          height: b(window).height(),
        }
      : null;
    return b.extend({}, a, c, e, g);
  };
  f.prototype.getCalculatedOffset = function (b, a, e, g) {
    return "bottom" == b
      ? {
          top: a.top + a.height,
          left: a.left + a.width / 2 - e / 2,
        }
      : "top" == b
        ? {
            top: a.top - g,
            left: a.left + a.width / 2 - e / 2,
          }
        : "left" == b
          ? {
              top: a.top + a.height / 2 - g / 2,
              left: a.left - e,
            }
          : {
              top: a.top + a.height / 2 - g / 2,
              left: a.left + a.width,
            };
  };
  f.prototype.getViewportAdjustedDelta = function (b, a, e, g) {
    var d = {
      top: 0,
      left: 0,
    };
    if (!this.$viewport) return d;
    var f = (this.options.viewport && this.options.viewport.padding) || 0,
      k = this.getPosition(this.$viewport);
    /right|left/.test(b)
      ? ((e = a.top - f - k.scroll),
        (a = a.top + f - k.scroll + g),
        e < k.top
          ? (d.top = k.top - e)
          : a > k.top + k.height && (d.top = k.top + k.height - a))
      : ((g = a.left - f),
        (a = a.left + f + e),
        g < k.left
          ? (d.left = k.left - g)
          : a > k.right && (d.left = k.left + k.width - a));
    return d;
  };
  f.prototype.getTitle = function () {
    var b = this.$element,
      a = this.options;
    return (
      b.attr("data-original-title") ||
      ("function" == typeof a.title ? a.title.call(b[0]) : a.title)
    );
  };
  f.prototype.getUID = function (b) {
    do b += ~~(1e6 * Math.random());
    while (document.getElementById(b));
    return b;
  };
  f.prototype.tip = function () {
    if (
      !this.$tip &&
      ((this.$tip = b(this.options.template)), 1 != this.$tip.length)
    )
      throw Error(
        this.type +
          " `template` option must consist of exactly 1 top-level element!",
      );
    return this.$tip;
  };
  f.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow"));
  };
  f.prototype.enable = function () {
    this.enabled = !0;
  };
  f.prototype.disable = function () {
    this.enabled = !1;
  };
  f.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
  };
  f.prototype.toggle = function (c) {
    var a = this;
    c &&
      ((a = b(c.currentTarget).data("bs." + this.type)),
      a ||
        ((a = new this.constructor(c.currentTarget, this.getDelegateOptions())),
        b(c.currentTarget).data("bs." + this.type, a)));
    c
      ? ((a.inState.click = !a.inState.click),
        a.isInStateTrue() ? a.enter(a) : a.leave(a))
      : a.tip().hasClass("in")
        ? a.leave(a)
        : a.enter(a);
  };
  f.prototype.destroy = function () {
    var b = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      b.$element.off("." + b.type).removeData("bs." + b.type);
      b.$tip && b.$tip.detach();
      b.$tip = null;
      b.$arrow = null;
      b.$viewport = null;
    });
  };
  var d = b.fn.tooltip;
  b.fn.tooltip = function (c) {
    return this.each(function () {
      var a = b(this),
        e = a.data("bs.tooltip"),
        g = "object" == typeof c && c;
      (!e && /destroy|hide/.test(c)) ||
        (e || a.data("bs.tooltip", (e = new f(this, g))),
        "string" != typeof c || e[c]());
    });
  };
  b.fn.tooltip.Constructor = f;
  b.fn.tooltip.noConflict = function () {
    return (b.fn.tooltip = d), this;
  };
})(jQuery);
+(function (b) {
  var f = function (b, a) {
    this.init("popover", b, a);
  };
  if (!b.fn.tooltip) throw Error("Popover requires tooltip.js");
  f.VERSION = "3.3.5";
  f.DEFAULTS = b.extend({}, b.fn.tooltip.Constructor.DEFAULTS, {
    placement: "right",
    trigger: "click",
    content: "",
    template:
      '\x3cdiv class\x3d"popover" role\x3d"tooltip"\x3e\x3cdiv class\x3d"arrow"\x3e\x3c/div\x3e\x3ch3 class\x3d"popover-title"\x3e\x3c/h3\x3e\x3cdiv class\x3d"popover-content"\x3e\x3c/div\x3e\x3c/div\x3e',
  });
  f.prototype = b.extend({}, b.fn.tooltip.Constructor.prototype);
  f.prototype.constructor = f;
  f.prototype.getDefaults = function () {
    return f.DEFAULTS;
  };
  f.prototype.setContent = function () {
    var b = this.tip(),
      a = this.getTitle(),
      e = this.getContent();
    b.find(".popover-title")[this.options.html ? "html" : "text"](a);
    b.find(".popover-content")
      .children()
      .detach()
      .end()
      [
        this.options.html ? ("string" == typeof e ? "html" : "append") : "text"
      ](e);
    b.removeClass("fade top bottom left right in");
    b.find(".popover-title").html() || b.find(".popover-title").hide();
  };
  f.prototype.hasContent = function () {
    return this.getTitle() || this.getContent();
  };
  f.prototype.getContent = function () {
    var b = this.$element,
      a = this.options;
    return (
      b.attr("data-content") ||
      ("function" == typeof a.content ? a.content.call(b[0]) : a.content)
    );
  };
  f.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find(".arrow"));
  };
  var d = b.fn.popover;
  b.fn.popover = function (c) {
    return this.each(function () {
      var a = b(this),
        e = a.data("bs.popover"),
        g = "object" == typeof c && c;
      (!e && /destroy|hide/.test(c)) ||
        (e || a.data("bs.popover", (e = new f(this, g))),
        "string" != typeof c || e[c]());
    });
  };
  b.fn.popover.Constructor = f;
  b.fn.popover.noConflict = function () {
    return (b.fn.popover = d), this;
  };
})(jQuery);
+(function (b) {
  function f(a, c) {
    this.$body = b(document.body);
    this.$scrollElement = b(b(a).is(document.body) ? window : a);
    this.options = b.extend({}, f.DEFAULTS, c);
    this.selector = (this.options.target || "") + " .nav li \x3e a";
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;
    this.$scrollElement.on("scroll.bs.scrollspy", b.proxy(this.process, this));
    this.refresh();
    this.process();
  }
  function d(a) {
    return this.each(function () {
      var c = b(this),
        g = c.data("bs.scrollspy"),
        d = "object" == typeof a && a;
      g || c.data("bs.scrollspy", (g = new f(this, d)));
      "string" == typeof a && g[a]();
    });
  }
  f.VERSION = "3.3.5";
  f.DEFAULTS = {
    offset: 10,
  };
  f.prototype.getScrollHeight = function () {
    return (
      this.$scrollElement[0].scrollHeight ||
      Math.max(
        this.$body[0].scrollHeight,
        document.documentElement.scrollHeight,
      )
    );
  };
  f.prototype.refresh = function () {
    var a = this,
      c = "offset",
      g = 0;
    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();
    b.isWindow(this.$scrollElement[0]) ||
      ((c = "position"), (g = this.$scrollElement.scrollTop()));
    this.$body
      .find(this.selector)
      .map(function () {
        var a = b(this),
          a = a.data("target") || a.attr("href"),
          d = /^#./.test(a) && b(a);
        return (
          (d && d.length && d.is(":visible") && [[d[c]().top + g, a]]) || null
        );
      })
      .sort(function (a, b) {
        return a[0] - b[0];
      })
      .each(function () {
        a.offsets.push(this[0]);
        a.targets.push(this[1]);
      });
  };
  f.prototype.process = function () {
    var a,
      b = this.$scrollElement.scrollTop() + this.options.offset,
      c = this.getScrollHeight(),
      d = this.options.offset + c - this.$scrollElement.height(),
      f = this.offsets,
      k = this.targets,
      p = this.activeTarget;
    if ((this.scrollHeight != c && this.refresh(), b >= d))
      return p != (a = k[k.length - 1]) && this.activate(a);
    if (p && b < f[0]) return (this.activeTarget = null), this.clear();
    for (a = f.length; a--; )
      p != k[a] &&
        b >= f[a] &&
        (void 0 === f[a + 1] || b < f[a + 1]) &&
        this.activate(k[a]);
  };
  f.prototype.activate = function (a) {
    this.activeTarget = a;
    this.clear();
    a = b(
      this.selector +
        '[data-target\x3d"' +
        a +
        '"],' +
        this.selector +
        '[href\x3d"' +
        a +
        '"]',
    )
      .parents("li")
      .addClass("active");
    a.parent(".dropdown-menu").length &&
      (a = a.closest("li.dropdown").addClass("active"));
    a.trigger("activate.bs.scrollspy");
  };
  f.prototype.clear = function () {
    b(this.selector)
      .parentsUntil(this.options.target, ".active")
      .removeClass("active");
  };
  var c = b.fn.scrollspy;
  b.fn.scrollspy = d;
  b.fn.scrollspy.Constructor = f;
  b.fn.scrollspy.noConflict = function () {
    return (b.fn.scrollspy = c), this;
  };
  b(window).on("load.bs.scrollspy.data-api", function () {
    b('[data-spy\x3d"scroll"]').each(function () {
      var a = b(this);
      d.call(a, a.data());
    });
  });
})(jQuery);
+(function (b) {
  function f(a) {
    return this.each(function () {
      var c = b(this),
        f = c.data("bs.tab");
      f || c.data("bs.tab", (f = new d(this)));
      "string" == typeof a && f[a]();
    });
  }
  var d = function (a) {
    this.element = b(a);
  };
  d.VERSION = "3.3.5";
  d.TRANSITION_DURATION = 150;
  d.prototype.show = function () {
    var a = this.element,
      c = a.closest("ul:not(.dropdown-menu)"),
      d = a.data("target");
    if (
      (d || ((d = a.attr("href")), (d = d && d.replace(/.*(?=#[^\s]*$)/, ""))),
      !a.parent("li").hasClass("active"))
    ) {
      var f = c.find(".active:last a"),
        k = b.Event("hide.bs.tab", {
          relatedTarget: a[0],
        }),
        p = b.Event("show.bs.tab", {
          relatedTarget: f[0],
        });
      (f.trigger(k),
      a.trigger(p),
      p.isDefaultPrevented() || k.isDefaultPrevented()) ||
        ((d = b(d)),
        this.activate(a.closest("li"), c),
        this.activate(d, d.parent(), function () {
          f.trigger({
            type: "hidden.bs.tab",
            relatedTarget: a[0],
          });
          a.trigger({
            type: "shown.bs.tab",
            relatedTarget: f[0],
          });
        }));
    }
  };
  d.prototype.activate = function (a, c, f) {
    function l() {
      k.removeClass("active")
        .find("\x3e .dropdown-menu \x3e .active")
        .removeClass("active")
        .end()
        .find('[data-toggle\x3d"tab"]')
        .attr("aria-expanded", !1);
      a.addClass("active")
        .find('[data-toggle\x3d"tab"]')
        .attr("aria-expanded", !0);
      p ? (a[0].offsetWidth, a.addClass("in")) : a.removeClass("fade");
      a.parent(".dropdown-menu").length &&
        a
          .closest("li.dropdown")
          .addClass("active")
          .end()
          .find('[data-toggle\x3d"tab"]')
          .attr("aria-expanded", !0);
      f && f();
    }
    var k = c.find("\x3e .active"),
      p =
        f &&
        b.support.transition &&
        ((k.length && k.hasClass("fade")) || !!c.find("\x3e .fade").length);
    k.length && p
      ? k.one("bsTransitionEnd", l).emulateTransitionEnd(d.TRANSITION_DURATION)
      : l();
    k.removeClass("in");
  };
  var c = b.fn.tab;
  b.fn.tab = f;
  b.fn.tab.Constructor = d;
  b.fn.tab.noConflict = function () {
    return (b.fn.tab = c), this;
  };
  var a = function (a) {
    a.preventDefault();
    f.call(b(this), "show");
  };
  b(document)
    .on("click.bs.tab.data-api", '[data-toggle\x3d"tab"]', a)
    .on("click.bs.tab.data-api", '[data-toggle\x3d"pill"]', a);
})(jQuery);
+(function (b) {
  function f(a) {
    return this.each(function () {
      var c = b(this),
        g = c.data("bs.affix"),
        f = "object" == typeof a && a;
      g || c.data("bs.affix", (g = new d(this, f)));
      "string" == typeof a && g[a]();
    });
  }
  var d = function (a, c) {
    this.options = b.extend({}, d.DEFAULTS, c);
    this.$target = b(this.options.target)
      .on("scroll.bs.affix.data-api", b.proxy(this.checkPosition, this))
      .on(
        "click.bs.affix.data-api",
        b.proxy(this.checkPositionWithEventLoop, this),
      );
    this.$element = b(a);
    this.pinnedOffset = this.unpin = this.affixed = null;
    this.checkPosition();
  };
  d.VERSION = "3.3.5";
  d.RESET = "affix affix-top affix-bottom";
  d.DEFAULTS = {
    offset: 0,
    target: window,
  };
  d.prototype.getState = function (a, b, c, d) {
    var f = this.$target.scrollTop(),
      k = this.$element.offset(),
      p = this.$target.height();
    if (null != c && "top" == this.affixed) return c > f ? "top" : !1;
    if ("bottom" == this.affixed)
      return null != c
        ? f + this.unpin <= k.top
          ? !1
          : "bottom"
        : a - d >= f + p
          ? !1
          : "bottom";
    var x = null == this.affixed,
      k = x ? f : k.top;
    return null != c && c >= f
      ? "top"
      : null != d && k + (x ? p : b) >= a - d
        ? "bottom"
        : !1;
  };
  d.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(d.RESET).addClass("affix");
    var a = this.$target.scrollTop();
    return (this.pinnedOffset = this.$element.offset().top - a);
  };
  d.prototype.checkPositionWithEventLoop = function () {
    setTimeout(b.proxy(this.checkPosition, this), 1);
  };
  d.prototype.checkPosition = function () {
    if (this.$element.is(":visible")) {
      var a = this.$element.height(),
        c = this.options.offset,
        f = c.top,
        h = c.bottom,
        l = Math.max(b(document).height(), b(document.body).height());
      "object" != typeof c && (h = f = c);
      "function" == typeof f && (f = c.top(this.$element));
      "function" == typeof h && (h = c.bottom(this.$element));
      c = this.getState(l, a, f, h);
      if (this.affixed != c) {
        null != this.unpin && this.$element.css("top", "");
        var f = "affix" + (c ? "-" + c : ""),
          k = b.Event(f + ".bs.affix");
        if ((this.$element.trigger(k), k.isDefaultPrevented())) return;
        this.affixed = c;
        this.unpin = "bottom" == c ? this.getPinnedOffset() : null;
        this.$element
          .removeClass(d.RESET)
          .addClass(f)
          .trigger(f.replace("affix", "affixed") + ".bs.affix");
      }
      "bottom" == c &&
        this.$element.offset({
          top: l - a - h,
        });
    }
  };
  var c = b.fn.affix;
  b.fn.affix = f;
  b.fn.affix.Constructor = d;
  b.fn.affix.noConflict = function () {
    return (b.fn.affix = c), this;
  };
  b(window).on("load", function () {
    b('[data-spy\x3d"affix"]').each(function () {
      var a = b(this),
        c = a.data();
      c.offset = c.offset || {};
      null != c.offsetBottom && (c.offset.bottom = c.offsetBottom);
      null != c.offsetTop && (c.offset.top = c.offsetTop);
      f.call(a, c);
    });
  });
})(jQuery);
(function (b) {
  function f(b, a) {
    a.find(".active").removeClass("active");
    b.addClass("active");
  }
  function d(c) {
    var a = b(this),
      d = a.attr("href"),
      g = b(c.liveFired);
    /^#\w+/.test(d) &&
      (c.preventDefault(),
      a.hasClass("active") ||
        (($href = b(d)), f(a.parent("li"), g), f($href, $href.parent())));
  }
  b.fn.tabs = b.fn.pills = function (c) {
    return this.each(function () {
      b(this).delegate(
        c || ".tabs li \x3e a, .pills \x3e li \x3e a",
        "click",
        d,
      );
    });
  };
  b(document).ready(function () {
    b("body").tabs("ul[data-tabs] li \x3e a, ul[data-pills] \x3e li \x3e a");
  });
})(window.jQuery || window.ender);
DKI.templates.popupPanel = {
  wrap: '\x3cdiv class\x3d"modal fancybox-wrap" tabindex\x3d"-1" role\x3d"dialog"\x3e\x3cdiv class\x3d"fancybox-outer modal-content"\x3e\x3cdiv class\x3d"modal-header"\x3e\x3cbutton type\x3d"button" class\x3d"close popup-close" data-dismiss\x3d"modal" aria-label\x3d"Close"\x3e\x3cspan aria-hidden\x3d"true"\x3e\x26times;\x3c/span\x3e\x3c/button\x3e\x3ch4 class\x3d"modal-title popup-title"\x3eModal title\x3c/h4\x3e\x3c/div\x3e\x3cdiv class\x3d"fancybox-inner modal-body"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e',
  closeBtn: "",
};
!(function (b) {
  var f = function (d, c) {
    this.options = c;
    this.tab = b(d);
    this.tabGroup = this.tab.find("\x3e.nav");
    this.resizeEvent = "resize";
    "undefined" != typeof settings &&
      settings.resizeEvent &&
      (this.resizeEvent = settings.resizeEvent);
    var a = "",
      f = "";
    if (0 == c.collapseDisplayed.length)
      return (
        this.alignTabHeights(),
        b(window).on(
          this.resizeEvent,
          b.proxy(function () {
            this.alignTabHeights();
          }, this),
        ),
        !1
      );
    b.each(c.collapseDisplayed, function () {
      a += " hidden-" + this;
      f += " visible-" + this;
    });
    d = this.tabGroup.find("\x3e li a");
    var g = b("\x3cdiv\x3e\x3c/div\x3e", {
        class: "panel-group responsive" + f,
        id: "collapse-" + this.tabGroup.attr("id"),
      }),
      h = this;
    b.each(d, function (a) {
      var c = h.options.accordionStart,
        d = b(this),
        f = void 0 === d.attr("class") ? "" : d.attr("class"),
        e = "accordion-toggle",
        v =
          void 0 === d.parent().attr("class")
            ? ""
            : d
                .parent()
                .attr("class")
                .replace("dki-authoring-element-element", ""),
        t = "panel panel-default",
        n = d.get(0).hash.replace("#", "collapse-"),
        y = "panel-collapse collapse";
      0 < f.length && (e += " " + f);
      0 < v.length &&
        ((v = v.replace(/\bactive\b/g, "")),
        (t = (t + (" " + v)).replace(/\s{2,}/g, " ")),
        (t = t.replace(/^\s+|\s+$/g, "")));
      "" != n &&
        "closed" != c &&
        (d.parent().hasClass("active") ||
          ("first" == c && 0 == a) ||
          "open" == c) &&
        ((t += " active expanded"), (y += " in"));
      g.append(
        b("\x3cdiv\x3e")
          .attr("class", t)
          .html(
            b("\x3cdiv\x3e")
              .attr("class", "panel-heading clearfix")
              .html(
                b("\x3ch4\x3e")
                  .attr("class", "panel-title")
                  .html(
                    b("\x3ca\x3e", {
                      tabindex: "1",
                      class: e,
                      "data-toggle": "collapse",
                      "data-id": d.data("id"),
                      href: "#" + n,
                      "data-target": "#" + n,
                      "data-idx": d.data("idx"),
                      "data-for": d.data("for"),
                    }),
                  ),
              ),
          )
          .append(
            b("\x3cdiv\x3e", {
              id: n,
              class: y,
            }),
          ),
      );
    });
    this.tabGroup.next()[0]
      ? this.tabGroup.next().after(g)
      : this.tabGroup.after(g);
    this.tabGroup.addClass(a);
    this.tab.find("\x3e .tab-content").addClass(a);
    this.checkResize();
    this.bindTabToCollapse();
    b(window).on(
      this.resizeEvent,
      b.proxy(function () {
        this.checkResize();
      }, this),
    );
  };
  f.DEFAULTS = {
    collapseDisplayed: ["xs", "sm"],
    currentPosition: "tabs",
  };
  f.prototype.checkResize = function () {
    "block" == this.tab.find("\x3e .panel-group").css("display") &&
    "tabs" === this.options.currentPosition
      ? (this.tabToPanel(), (this.options.currentPosition = "panel"))
      : "none" == this.tab.find("\x3e .panel-group").css("display") &&
        "panel" === this.options.currentPosition &&
        (this.panelToTab(), (this.options.currentPosition = "tabs"));
    this.alignTabHeights();
  };
  f.prototype.tabToPanel = function () {
    var d = this,
      c = this.tabGroup.parent().find("\x3e .nav \x3e li \x3e a");
    b.each(c, function (a, c) {
      a = b(c).data("id");
      a = d.tab
        .closest(".dki-element-content")
        .find(".panel a[data-id\x3d'" + a + "']");
      b(c).children().appendTo(a);
      b(a).attr("data-viewed", b(c).data("viewed"));
    });
    c = this.tabGroup.parent().find("\x3e .tab-content \x3e .tab-pane");
    b.each(c, function (a, c) {
      a = b(c).attr("id").replace(/^/, "#collapse-");
      b(c).removeClass("tab-pane").addClass("panel-body").appendTo(b(a));
    });
    d.tab
      .closest(".dki-element-content")
      .addClass("accordionPanel")
      .removeClass("tabs");
  };
  f.prototype.panelToTab = function () {
    var d = this,
      c = this.tab.find("\x3e .panel-group"),
      a = c.find(
        "\x3e .panel \x3e .panel-heading \x3e .panel-title \x3e a.accordion-toggle",
      );
    b.each(a, function (a, c) {
      a = b(c).data("id");
      a = d.tab
        .closest(".dki-element-content")
        .find(".nav a[data-id\x3d'" + a + "']");
      b(c).children().appendTo(a);
      a.attr("data-viewed", b(c).data("viewed"));
    });
    b.each(c, function (a, c) {
      a = b(c).attr("id").replace("collapse-", "#");
      a = b(a).parent().find("\x3e .tab-content").html("");
      b(c)
        .find("\x3e .panel \x3e div \x3e .panel-body")
        .removeClass("panel-body")
        .addClass("tab-pane")
        .appendTo(a);
    });
    d.tab
      .closest(".dki-element-content")
      .addClass("tabs")
      .removeClass("accordionPanel");
  };
  f.prototype.bindTabToCollapse = function () {
    var d = this,
      c = this.tab.find("\x3e .nav \x3e li \x3e a"),
      a = this.tab.find("\x3e .panel-group \x3e .panel \x3e .panel-collapse");
    c.on("shown.bs.tab", function (a) {
      b(a.currentTarget.hash.replace(/#/, "#collapse-")).collapse("show");
      a.relatedTarget && b(a.relatedTarget.hash.replace(/#/, "#collapse-"));
      d.checkResize();
    });
    a.on("show.bs.collapse", function (a) {
      var c = b(a.target).context.id.replace(/collapse-/g, "#"),
        d = b(a.currentTarget).closest(".panel-group.responsive");
      d.find(".panel-body").removeClass("active");
      b('a[href\x3d"' + c + '"]').tab("show");
      d = b(a.currentTarget).closest(".panel-group.responsive");
      b(d).find(".panel, .panel-body").removeClass("active");
      b(a.currentTarget).find(".panel-body").addClass("active");
      b(a.currentTarget).parent().addClass("active");
    });
    a.on("hide.bs.collapse", function (a) {
      b("li", d.tabGroup).removeClass("active");
      b(a.currentTarget).find(".panel-body").removeClass("active");
      b(a.currentTarget).parent().removeClass("active");
    });
  };
  f.prototype.alignTabHeights = function () {
    if (
      "tabs" == this.options.currentPosition &&
      this.tab.find("\x3e .panel-group").is(":visible")
    ) {
      var b = this.tabGroup.parent().find("\x3e .nav \x3e li \x3e a");
      b.height("");
      b.height(b.height());
    }
  };
  b.fn.ResponsiveTabs = function (d) {
    var c = d;
    return this.each(function () {
      var a = b(this),
        e = b(this).data("dki.responsiveTabs");
      d = b.extend({}, f.DEFAULTS, a.data(), "object" === typeof c && c);
      e || a.data("dki.responsiveTabs", new f(this, d));
    });
  };
  b.fn.ResponsiveTabs.Constructor = f;
})(window.jQuery);
var DateFormat = {};
!(function (b) {
  var f = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
    d = "Sun Mon Tue Wed Thu Fri Sat".split(" "),
    c = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),
    a =
      "January February March April May June July August September October November December".split(
        " ",
      ),
    e = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    },
    g = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[Z\-+]?(\d{2}:?\d{2})?/;
  b.format = (function () {
    function b(a) {
      var c,
        d,
        f,
        g,
        e,
        h = "";
      return (
        -1 !== a.indexOf(".") &&
          ((g = a.split(".")), (a = g[0]), (h = g[g.length - 1])),
        (e = a.split(":")),
        3 === e.length
          ? ((c = e[0]),
            (d = e[1]),
            (f = e[2].replace(/\s.+/, "").replace(/[a-z]/gi, "")),
            (a = a.replace(/\s.+/, "").replace(/[a-z]/gi, "")),
            {
              time: a,
              hour: c,
              minute: d,
              second: f,
              millis: h,
            })
          : {
              time: "",
              hour: "",
              minute: "",
              second: "",
              millis: "",
            }
      );
    }
    function l(a, b) {
      b -= String(a).length;
      for (var c = 0; b > c; c++) a = "0" + a;
      return a;
    }
    return {
      parseDate: function (a) {
        var c,
          d = {
            date: null,
            year: null,
            month: null,
            dayOfMonth: null,
            dayOfWeek: null,
            time: null,
          };
        if ("number" == typeof a) return this.parseDate(new Date(a));
        if ("function" == typeof a.getFullYear)
          (d.year = String(a.getFullYear())),
            (d.month = String(a.getMonth() + 1)),
            (d.dayOfMonth = String(a.getDate())),
            (d.time = b(a.toTimeString() + "." + a.getMilliseconds()));
        else if (-1 != a.search(g))
          (c = a.split(/[T\+-]/)),
            (d.year = c[0]),
            (d.month = c[1]),
            (d.dayOfMonth = c[2]),
            (d.time = b(c[3].split(".")[0]));
        else
          switch (
            ((c = a.split(" ")),
            6 === c.length && isNaN(c[5]) && (c[c.length] = "()"),
            c.length)
          ) {
            case 6:
              d.year = c[5];
              a = c[1];
              d.month = e[a] || a;
              d.dayOfMonth = c[2];
              d.time = b(c[3]);
              break;
            case 2:
              a = c[0].split("-");
              d.year = a[0];
              d.month = a[1];
              d.dayOfMonth = a[2];
              d.time = b(c[1]);
              break;
            case 7:
            case 9:
            case 10:
              d.year = c[3];
              a = c[1];
              d.month = e[a] || a;
              d.dayOfMonth = c[2];
              d.time = b(c[4]);
              break;
            case 1:
              a = c[0].split("");
              d.year = a[0] + a[1] + a[2] + a[3];
              d.month = a[5] + a[6];
              d.dayOfMonth = a[8] + a[9];
              d.time = b(
                a[13] + a[14] + a[15] + a[16] + a[17] + a[18] + a[19] + a[20],
              );
              break;
            default:
              return null;
          }
        return (
          (d.date = d.time
            ? new Date(
                d.year,
                d.month - 1,
                d.dayOfMonth,
                d.time.hour,
                d.time.minute,
                d.time.second,
                d.time.millis,
              )
            : new Date(d.year, d.month - 1, d.dayOfMonth)),
          (d.dayOfWeek = String(d.date.getDay())),
          d
        );
      },
      date: function (b, g) {
        try {
          var e = this.parseDate(b);
          if (null === e) return b;
          for (
            var h,
              v = e.year,
              t = e.month,
              n = e.dayOfMonth,
              y = e.dayOfWeek,
              q = e.time,
              m = (e = ""),
              D = "",
              C = !1,
              A = 0;
            A < g.length;
            A++
          ) {
            var B = g.charAt(A),
              r = g.charAt(A + 1);
            if (C)
              "'" == B
                ? ((m += "" === e ? "'" : e), (e = ""), (C = !1))
                : (e += B);
            else
              switch (((e += B), (D = ""), e)) {
                case "ddd":
                  var w = m,
                    E,
                    u = y;
                  E = f[parseInt(u, 10)] || u;
                  m = w + E;
                  e = "";
                  break;
                case "dd":
                  if ("d" === r) break;
                  m += l(n, 2);
                  e = "";
                  break;
                case "d":
                  if ("d" === r) break;
                  m += parseInt(n, 10);
                  e = "";
                  break;
                case "D":
                  n =
                    1 == n || 21 == n || 31 == n
                      ? parseInt(n, 10) + "st"
                      : 2 == n || 22 == n
                        ? parseInt(n, 10) + "nd"
                        : 3 == n || 23 == n
                          ? parseInt(n, 10) + "rd"
                          : parseInt(n, 10) + "th";
                  m += n;
                  e = "";
                  break;
                case "MMMM":
                  var w = m,
                    u = t,
                    H = parseInt(u, 10) - 1,
                    m = w + (a[H] || u),
                    e = "";
                  break;
                case "MMM":
                  if ("M" === r) break;
                  var w = m,
                    u = t,
                    I = parseInt(u, 10) - 1,
                    m = w + (c[I] || u),
                    e = "";
                  break;
                case "MM":
                  if ("M" === r) break;
                  m += l(t, 2);
                  e = "";
                  break;
                case "M":
                  if ("M" === r) break;
                  m += parseInt(t, 10);
                  e = "";
                  break;
                case "y":
                case "yyy":
                  if ("y" === r) break;
                  m += e;
                  e = "";
                  break;
                case "yy":
                  if ("y" === r) break;
                  m += String(v).slice(-2);
                  e = "";
                  break;
                case "yyyy":
                  m += v;
                  e = "";
                  break;
                case "HH":
                  m += l(q.hour, 2);
                  e = "";
                  break;
                case "H":
                  if ("H" === r) break;
                  m += parseInt(q.hour, 10);
                  e = "";
                  break;
                case "hh":
                  h =
                    0 === parseInt(q.hour, 10)
                      ? 12
                      : 13 > q.hour
                        ? q.hour
                        : q.hour - 12;
                  m += l(h, 2);
                  e = "";
                  break;
                case "h":
                  if ("h" === r) break;
                  h =
                    0 === parseInt(q.hour, 10)
                      ? 12
                      : 13 > q.hour
                        ? q.hour
                        : q.hour - 12;
                  m += parseInt(h, 10);
                  e = "";
                  break;
                case "mm":
                  m += l(q.minute, 2);
                  e = "";
                  break;
                case "m":
                  if ("m" === r) break;
                  m += q.minute;
                  e = "";
                  break;
                case "ss":
                  m += l(q.second.substring(0, 2), 2);
                  e = "";
                  break;
                case "s":
                  if ("s" === r) break;
                  m += q.second;
                  e = "";
                  break;
                case "S":
                case "SS":
                  if ("S" === r) break;
                  m += e;
                  e = "";
                  break;
                case "SSS":
                  var F = "000" + q.millis.substring(0, 3),
                    m = m + F.substring(F.length - 3),
                    e = "";
                  break;
                case "a":
                  m += 12 <= q.hour ? "PM" : "AM";
                  e = "";
                  break;
                case "p":
                  m += 12 <= q.hour ? "p.m." : "a.m.";
                  e = "";
                  break;
                case "E":
                  var w = m,
                    G,
                    u = y;
                  G = d[parseInt(u, 10)] || u;
                  m = w + G;
                  e = "";
                  break;
                case "'":
                  e = "";
                  C = !0;
                  break;
                default:
                  (m += B), (e = "");
              }
          }
          return m + D;
        } catch (J) {
          return b;
        }
      },
      prettyDate: function (a) {
        var b, c, d;
        return (
          ("string" == typeof a || "number" == typeof a) && (b = new Date(a)),
          "object" == typeof a && (b = new Date(a.toString())),
          (c = (new Date().getTime() - b.getTime()) / 1e3),
          (d = Math.floor(c / 86400)),
          isNaN(d) || 0 > d
            ? void 0
            : 60 > c
              ? "just now"
              : 120 > c
                ? "1 minute ago"
                : 3600 > c
                  ? Math.floor(c / 60) + " minutes ago"
                  : 7200 > c
                    ? "1 hour ago"
                    : 86400 > c
                      ? Math.floor(c / 3600) + " hours ago"
                      : 1 === d
                        ? "Yesterday"
                        : 7 > d
                          ? d + " days ago"
                          : 31 > d
                            ? Math.ceil(d / 7) + " weeks ago"
                            : 31 <= d
                              ? "more than 5 weeks ago"
                              : void 0
        );
      },
      toBrowserTimeZone: function (a, b) {
        return this.date(new Date(a), b || "MM/dd/yyyy HH:mm:ss");
      },
    };
  })();
})(DateFormat);
(function (b) {
  b.format = DateFormat.format;
})(jQuery);
