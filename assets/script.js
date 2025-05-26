window.theme = window.theme || {};

!(function () {
  "undefined" == typeof window.Shopify && (window.Shopify = {}),
    (Shopify.each = function (t, e) {
    for (var n = 0; n < t.length; n++) e(t[n], n);
  }),
    (Shopify.money_format = "${{amount}}"),
    (Shopify.onCartUpdate = function (t) {
    alert("There are now " + t.item_count + " items in the cart.");
  }),
    (Shopify.formatMoney = function (t, e) {
    function n(t, e) {
      return "undefined" == typeof t ? e : t;
    }
    function i(t, e, i, r) {
      if (((e = n(e, 2)), (i = n(i, ",")), (r = n(r, ".")), isNaN(t) || null == t)) return 0;
      t = (t / 100).toFixed(e);
      var o = t.split("."),
          s = o[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + i),
          a = o[1] ? r + o[1] : "";
      return s + a;
    }
    "string" == typeof t && (t = t.replace(".", ""));
    var r = "",
        o = /\{\{\s*(\w+)\s*\}\}/,
        s = e || this.money_format;
    switch (s.match(o)[1]) {
      case "amount":
        r = i(t, 2);
        break;
      case "amount_no_decimals":
        r = i(t, 0);
        break;
      case "amount_with_comma_separator":
        r = i(t, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        r = i(t, 0, ".", ",");
        break;
      case "amount_no_decimals_with_space_separator":
        r = i(t, 0, " ");
        break;
      case "amount_with_apostrophe_separator":
        r = i(t, 2, "'");
    }
    return s.replace(o, r);
  })
})();

var sectionEvents = [];
var scriptsLoaded = [];

function sectionObserver(){  
  var lazySections = [].slice.call(document.querySelectorAll('.shopify-section section:not(.loaded)'));
  let lazySectionObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        let lazySection = entry.target;
        let lazyURL = lazySection.dataset.url;
        lazySection.classList.add('loaded');
        function sendSectionData(data){
          const sectionLoaded = new CustomEvent('Section:Loaded', {
            'detail': data
          });
          document.dispatchEvent(sectionLoaded);
          sectionEvents.push(sectionLoaded);
        }
        function loadScript(url, callback){
          var head = document.head;
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          script.async = false;
          script.onload = callback(lazySection);
          head.appendChild(script);
          scriptsLoaded.push(lazyURL);
        }
        if (lazyURL) {
          if (!scriptsLoaded.includes(lazyURL)) {
            loadScript(lazyURL, sendSectionData);
          } else {
            sendSectionData(lazySection)
          }
        }        
        lazySectionObserver.unobserve(lazySection);
      }
    });
  });
  lazySections.forEach(function(lazySection) {
    lazySectionObserver.observe(lazySection);
  });
};

if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
  sectionObserver();
}

var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) {
  window.setTimeout(fn, 1000/60);
}

var methods = {
  isVisible: function(el) {
    return !!el.getAttribute('data-revealer-visible');
  },
  show: function(el, force) {
    var el = el.$el;
    let heightEl = el.scrollHeight;
    let heightWindow = window.innerHeight;
    if (heightEl > heightWindow) {
      if (el.hasAttribute('data-height')) {
        var height = heightEl;
      } else {
        var height = heightWindow;
      }
    } else {
      var height = heightEl;
    }
    let parent = el.closest('.mobilenav-navigation .navmenu-depth-2');
    el.style.setProperty('--max-height', height + 'px');
    el.setAttribute('data-max-height', height);
    if (parent && el != parent) {
      let h = parent.scrollHeight;
      parent.style.setProperty('--max-height', h + height + 'px');
      parent.setAttribute('data-max-height', h + height);
    }
    if (methods.isVisible(el)) {
      el.classList.remove('animating','animating-in');
      return;
    }
    el.setAttribute('data-revealer-visible', true);
    if (force) {
      el.classList.add('visible');
      return;
    }
    raf(function(){
      el.classList.add('animating', 'animating-in');
      raf(function(){
        el.classList.add('visible');
        el.classList.remove('animating', 'animating-in');
      });
    });
  },
  hide: function(el, force) {
    var el = el.$el;
    if (!methods.isVisible(el)) {
      el.classList.remove('animating', 'animating-out', 'visible');
      return;
    }
    el.removeAttribute('data-revealer-visible');
    if (force) {
      el.classList.remove('visible');
      return;
    }
    raf(function(){
      el.classList.add('animating', 'animating-out');
      raf(function(){
        el.classList.remove('visible');
        el.classList.remove('animating', 'animating-in', 'animating-out');
      });
    });
  },
  toggle: function(el, force) {
    if (el.$el.hasAttribute('data-revealer-visible')) {
      methods.hide(el, force);
    } else {
      methods.show(el, force);
    }
  }
};

function Revealer(method, force, _this) {
  var action = methods[method || "toggle"];
  if (!action) return _this;
  if (method === 'isVisible') {
    return action(_this);
  }
  action(_this, force);
};

function changeItem(t, r, e) {
  fetch(window.theme.routes.cart_change_url + '.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: t,
      quantity: r
    })
  }).then(function(r) {        
    return r.json();        
  }).then(function(j) {
    "function" == typeof e ? e(t) : Shopify.onCartUpdate(t);
  }).catch(function(err) {
    console.error('!: ' + err)
  });
};

function getScript(scriptUrl, callback) {
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.onload = callback;
  document.body.appendChild(script);
}

function getBreakpoint() {
  return window.getComputedStyle(document.documentElement, ':after').getPropertyValue('content').replace(/"/g, '');
}

var eventHandlers = [];
var previousBreakpoint = getBreakpoint();

function isBreakpoint() {
  for (var i = 0; i < arguments.length; i++) {
    if (getBreakpoint() === (i < 0 || arguments.length <= i ? undefined : arguments[i])) {
      return true;
    }
  }
  return false;
}

function onBreakpointChange(eventHandler) {
  if (eventHandlers.indexOf(eventHandler) === -1) {
    eventHandlers.push(eventHandler);
  }
}

function offBreakpointChange(eventHandler) {
  var index = eventHandlers.indexOf(eventHandler);
  if (index !== -1) {
    eventHandlers.splice(index, 1);
  }
}

window.addEventListener('resize', (function (event) {
  var currentBreakpoint = getBreakpoint();
  if (previousBreakpoint !== currentBreakpoint) {
    eventHandlers.forEach(function (eventHandler) {
      return eventHandler(event, {
        previous: previousBreakpoint,
        current: currentBreakpoint
      });
    });
  }
  previousBreakpoint = currentBreakpoint;
}));

Layout = ({
  getBreakpoint: getBreakpoint,
  isBreakpoint: isBreakpoint,
  onBreakpointChange: onBreakpointChange,
  offBreakpointChange: offBreakpointChange
});

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
};
}

function Menu_createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = Menu_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function Menu_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Menu_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Menu_arrayLikeToArray(o, minLen); }
function Menu_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function Menu_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Menu_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Menu_createClass(Constructor, protoProps, staticProps) { if (protoProps) Menu_defineProperties(Constructor.prototype, protoProps); if (staticProps) Menu_defineProperties(Constructor, staticProps); return Constructor; }
var Menu = function () {
  function Menu($el, states, initialState) {
    var _this = this;
    Menu_classCallCheck(this, Menu);
    this.$html = document.querySelector('html');
    this.$el = $el;
    this.el = $el;
    this.states = states;
    this.currentState = initialState;
    this.$currentStateSlideout = {};
    if (this.$el) {
      _this.changeState(_this.currentState);
    }
  }
  Menu_createClass(Menu, [{
    key: "changeState",
    value: function changeState(newState, force) {
      var _this2 = this;
      Revealer('show', force, _this2);
      var oldState = this.currentState;
      var $oldSlideout = this.$el.querySelector(this.currentState.slideoutSelector);
      var $oldButtons = this.$el.querySelector(this.currentState.buttonsSelector);
      var $newSlideout = this.$el.querySelector(newState.slideoutSelector);
      var $newButtons = this.$el.querySelector(newState.buttonsSelector);
      var callback = newState.callback;
      if (callback) {
        callback(this.currentState);
      }
      this._unbindEvents();
      this._unbindSlideoutEvents();
      this.currentState = newState;
      this.$currentStateSlideout = $newSlideout;
      this._bindEvents();
      if ($oldButtons) {
        $oldButtons.style.display = 'none';
        $newButtons.style.display = 'grid';
      } else {
        $newButtons.style.display = 'grid';
      }
      if ($oldSlideout) {
        Revealer('hide', force, oldState);
        window.setTimeout(function() { 
          html.classList.remove('scroll-lock');
        }, 250);
        _this2._bindSlideoutEvents();
        if ($newSlideout) {
          $newSlideout.focus();
        }
      } else {
        if ($newSlideout) {
          this.$html.classList.add('scroll-lock');
          Revealer('show', force, newState);
          trapFocus(_this2.$el);
          setTimeout(function () {
            $newSlideout.focus();
            _this2._bindSlideoutEvents();
          }, 100);
        }
      }
      return true;
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this3 = this;
      var _iterator = Menu_createForOfIteratorHelper(this.currentState.buttons),
          _step;
      try {
        var _loop = function _loop() {
          var button = _step.value;
          var button_selectors = _this3.$el.querySelectorAll(button.selector);
          button_selectors.forEach(function (event) {
            if (!event) return
            event.onclick = function(event){
              return button.callback();
            }
          });
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      var _iterator2 = Menu_createForOfIteratorHelper(this.currentState.buttons),
          _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var button = _step2.value;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "_focusin",
    value: function _focusin(event) {
      var $target = event.target;
      var _this4 = this;
      if (!_this4.$currentStateSlideout) {
        return;
      }
      if (!_this4.$el.contains($target) && !_this4.$currentStateSlideout.contains($target)) {
        var dismiss = _this4.currentState.dismiss;
        if (dismiss) {
          dismiss(_this4.currentState);
        }
      }
    }
  }, {
    key: "_touchstop",
    value: function _touchstop(event) {
      event.stopPropagation();
    }
  }, {
    key: "_bindSlideoutEvents",
    value: function _bindSlideoutEvents() {
      if (!this.$currentStateSlideout) {
        return;
      }
      window.addEventListener('focusin', this._focusin);
      this.$el.addEventListener('touchstart', this._touchstop);
      this.$el.addEventListener('touchend', this._touchstop);
    }
  }, {
    key: "_unbindSlideoutEvents",
    value: function _unbindSlideoutEvents() {
      if (!this.$currentStateSlideout) {
        return;
      }
      window.removeEventListener('focusin', this._focusin);
      this.$el.removeEventListener('touchstart', this._touchstop); 
      this.$el.removeEventListener('touchend', this._touchstop);
    }
  }, {
    key: "unload",
    value: function unload() {
      this._unbindEvents();
      this._unbindSlideoutEvents();
    }
  }]);
  return Menu;
}();

function CartItem_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function CartItem_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function CartItem_createClass(Constructor, protoProps, staticProps) { if (protoProps) CartItem_defineProperties(Constructor.prototype, protoProps); if (staticProps) CartItem_defineProperties(Constructor, staticProps); return Constructor; }
var CartItem = function () {
  function CartItem(el, onUpdateCallback) {
    var _this = this;
    CartItem_classCallCheck(this, CartItem);
    this.el = el;
    this.onUpdateCallback = onUpdateCallback;
    this.id = el.dataset.cartItem;
    this.onQuantityInputChange = function () {
      return _this._onQuantityInputChange();
    };
    this.onRemoveButtonClick = function () {
      return _this._removeFromCart();        
    };
    this.removeEl = el.querySelector('[data-cart-item-remove]');
    this.removeEl.addEventListener('click', this.onRemoveButtonClick);
    if (el.querySelector('[data-quantity]')) {
      this.quantity = new Quantity(el.querySelector('[data-quantity]'));
      this.quantity.input.addEventListener('change', this.onQuantityInputChange);
    }
  }
  CartItem_createClass(CartItem, [{
    key: "unload",
    value: function unload() {
      this.removeEl.removeEventListener('click', this.onRemoveButtonClick);
      if (this.quantity) {
        this.quantity.input.removeEventListener('change', this.onQuantityInputChange);
      }
    }
  }, {
    key: "_onQuantityInputChange",
    value: function _onQuantityInputChange() {
      var value = this.quantity.value;
      if (value > 0) {
        this._changeCartQuantity(value, this.onUpdateCallback);
      } else {
        this._removeFromCart();
      }
    }
  }, {
    key: "_removeFromCart",
    value: function _removeFromCart(force) {
      var _this2 = this;
      this.$el = this.el;
      let height = this.el.scrollHeight;
      this.el.style.setProperty('--max-height', height + 'px');
      Revealer('hide', force, this);
      _this2._changeCartQuantity(0, function () {
        _this2.onUpdateCallback();
      });
    }
  }, {
    key: "_changeCartQuantity",
    value: function _changeCartQuantity(quantity, callback) {
      changeItem(this.id, quantity, callback);
    }
  }]);
  return CartItem;
}();

function Cart_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Cart_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Cart_createClass(Constructor, protoProps, staticProps) { if (protoProps) Cart_defineProperties(Constructor.prototype, protoProps); if (staticProps) Cart_defineProperties(Constructor, staticProps); return Constructor; }
var MonoCart = function () {
  function MonoCart() {
    Cart_classCallCheck(this, MonoCart);
    this.carts = [];
  }
  Cart_createClass(MonoCart, [{
    key: "addCart",
    value: function addCart(el, postMessage) {
      var el = el.el;
      var _this = this;
      var cartItemEls = el.querySelectorAll('[data-cart-item]');
      var cartItems = [];
      this.postMessage = postMessage;
      cartItemEls.forEach(function (cartItemEl) {
        return cartItems.push(new CartItem(cartItemEl, _this.update.bind(_this)));
      });
      this.carts.push({
        el: el,
        cartItems: cartItems
      });
    }
  }, {
    key: "update",
    value: function update(force) {
      var _this2 = this;
      return shopify_asyncview_dist_index_es.load(window.theme.routes.cart_url, {
        view: 'ajax'
      }).then(function (_ref) {
        if (_ref) {
          var html = _ref.html,
              data = _ref.data;
          _this2.postMessage('cart:update', data);
          _this2.carts.forEach(function (cart) {
            cart.cartItems.forEach(function (cartItem) {
              return cartItem.unload();
            });
            cart.cartItems = [];
            var cartElements = [{
              containers: cart.el.querySelectorAll('[data-cart-items]'),
              html: html.cart_items
            }, {
              containers: cart.el.querySelectorAll('[data-cart-discounts]'),
              html: html.cart_discounts
            }, {
              containers: cart.el.querySelectorAll('[data-cart-discounts-simplified]'),
              html: html.cart_discounts_simplified
            }, {
              containers: cart.el.querySelectorAll('[data-cart-subtotal]'),
              html: html.cart_subtotal
            }, {
              containers: cart.el.querySelectorAll('[data-cart-subtotal]'),
              html: html.cart_subtotal
            }];
            var section = cart.el.querySelector('[data-cart-section]');
            if (section) {
              section.setAttribute('data-calc',data.cart_shipping);              
              if (data.cart_shipping == 'false') {
                var calculator = cart.el.querySelector('#shipping-calculator'),
                    sticky = cart.el.querySelector('[data-sticky-menu-button-calculate-shipping]');
                if (calculator) {
                  calculator.remove();                  
                }
                if (sticky) {
                  sticky.closest('.sticky-menu-buttons').classList.add('sticky-menu-buttons-one');
                  sticky.remove();
                }
              }
            }
            cartElements.forEach(function (_ref2) {
              var containers = _ref2.containers,
                  html = _ref2.html;
              for (var i = 0; i < containers.length; i++) {
                var container = containers[i];
                container.innerHTML = html;
                var cartItemEls = container.querySelectorAll('[data-cart-item]');
                cartItemEls.forEach(function (cartItemEl) {
                  return cart.cartItems.push(new CartItem(cartItemEl, _this2.update.bind(_this2)));
                });
                var content = document.querySelector('.cart-content');
                if (data.item_count == 0) {
                  var empty = container.querySelector('.cart-mini-empty');
                  if (empty) {
                    container.classList.add('cart-empty');
                    empty.$el = empty;
                    Revealer('show', force, empty);
                  }
                  if (content) {
                    let height = content.scrollHeight;
                    content.style.setProperty('--max-height', height + 'px');
                    content.$el = content;
                    Revealer('hide', force, content);                  
                    var v = content.querySelector('.shipping-calculator-fields');
                    if (v) {
                      v.classList.remove('visible');
                    }                  
                    var s = cart.el.querySelector('[data-sticky-menu-container]');
                    if (s) {
                      s.classList.remove('visible');
                      setTimeout(function() {
                        s.classList.add('hidden');
                      }, 250);
                    }
                  }
                }
              }
            });
            document.dispatchEvent(new CustomEvent('cartItems', {
              bubbles: true
            }));
            return data;
          });
        }
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      this.carts.forEach(function (cart) {
        cart.cartItems.forEach(function (cartItem) {
          return cartItem.unload();
        });
      });
      this.carts = [];
    }
  }]);
  return MonoCart;
}();
var Cart = (new MonoCart());

function Quantity_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Quantity_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Quantity_createClass(Constructor, protoProps, staticProps) { if (protoProps) Quantity_defineProperties(Constructor.prototype, protoProps); if (staticProps) Quantity_defineProperties(Constructor, staticProps); return Constructor; }
var Quantity = function () {
  function Quantity(el) {
    var _this = this;
    Quantity_classCallCheck(this, Quantity);
    this.$el = el;    
    if (!this.$el) return;    
    this.$input = this.$el.querySelector('[data-quantity-input]');
    this.$decrement = this.$el.querySelector('[data-quantity-decrement]');
    this.$increment = this.$el.querySelector('[data-quantity-increment]');    
    this.events = [
      this.$input.onchange = function(event){
        return _this.change(_this.value);
      },
      this.$decrement.onclick = function(event){
        return _this.change(_this.value - 1);
      },
      this.$increment.onclick = function(event){
        return _this.change(_this.value + 1);
      }
    ];
    this._updateButtonState();
  }
  Quantity_createClass(Quantity, [{
    key: "input",
    get: function get() {
      return this.$input;
    }
  }, {
    key: "value",
    get: function get() {
      return parseInt(this.$input.value, 10) || 0;
    }
  }, {
    key: "range",
    get: function get() {
      var min = parseInt(this.$input.getAttribute('min'), 10) || 0;
      var max = parseInt(this.$input.getAttribute('max'), 10) || Infinity;
      return {
        min: min,
        max: max
      };
    }
  }, {
    key: "change",
    value: function change(value) {
      var trigger = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var range = this.range;
      var currentValue = this.value;
      if (value > range.max) {
        value = range.max;
      }
      if (value < range.min) {
        value = range.min;
      }
      if (value !== currentValue) {
        this.$input.value = value;
      }
      if (trigger && value !== currentValue) {
        var event = document.createEvent('Event');
        event.initEvent('change', true, true);
        this.input.dispatchEvent(event);
      }
      this._updateButtonState();
    }
  }, {
    key: "_updateButtonState",
    value: function _updateButtonState() {
      var range = this.range;
      var value = this.value;
      if (value == 0 || value == range.min) {
        this.$decrement.disabled = true;
      } else {
        this.$decrement.disabled = false;
      }
      if (value == 0 || value >= range.max) {
        this.$increment.disabled = true;
      } else {
        this.$increment.disabled = false;
      }
    }
  }]);
  return Quantity;
}();

function Slideshow(s, t) {
  if (t && t.slideshow == false && theme.isMobile) {
    return
  }
  if (t) {
    var section = s.closest('section');
  } else {
    var section = s.parentNode;
  }
  let sectionId = section.getAttribute('data-section-id');
  let isDown = false;
  let drag = 0;
  let startX;
  let startY;
  let scrollLeft;
  let scrollTop;
  let anchor;
  let anchorPad;
  let anchorClass;
  let touchID;
  let sections = s.getElementsByClassName('slide');
  let timeout;
  let autoPlay;
  s.classList.add('slider-loaded');
  s.classList.remove('slider-loading');
  var a = s.querySelectorAll('.keyed-link');
  var btns = section.querySelectorAll('.slider-button');
  if (s.getAttribute('data-slider-axis') == 'vertical' && !Layout.isBreakpoint('S')) {
    var axis = true;
    s.classList.add('vertical');
  } else {
    var axis = false;
    s.classList.remove('vertical');
  }
  s.ondragstart = function(e){
    e.preventDefault();
  }
  if (Layout.isBreakpoint('L')) {
    if (t) {
      if (t.slideshow_section && t.el.getAttribute('data-full-width') == 'false') {
        anchorPad = 20;
      } else {
        anchorPad = 0;
      }
    }
  } else {
    anchorPad = 0;
  }
  function heightSlide() {
    var id = s.querySelector('.active');
    let height = id.scrollHeight;
    s.style.setProperty('--max-height', height + 'px');
  }
  function Btn(b) {
    a.forEach(function (a) {
      a.setAttribute('tabindex','-1')
      a.setAttribute('aria-hidden','true')
    });
    var h = this.getAttribute('value');
    var i = this.getAttribute('data-index');
    var id = document.getElementById(h);
    s.querySelector('.active').classList.remove('active');
    id.classList.add('active');    
    var n = id.querySelectorAll('.keyed-link');
    n.forEach(function (n) {
      n.setAttribute('tabindex','0')
      n.setAttribute('aria-hidden','false')
    });    
    anchor = id.offsetLeft;
    anchorClass = i;
    if (theme.isMobile) {
      s.scroll({
        left: anchor - anchorPad
      });
    } else {
      s.scroll({
        left: anchor - anchorPad,
        behavior: 'smooth'
      });
      heightSlide();
    }
  }
  function autoSlide(btns) {
    let a = section.getAttribute('data-autoplay');
    function Next() {
      var next = s.querySelector('.active').querySelector('.next'),
          h = next.getAttribute('value'),
          i = next.getAttribute('data-index'),
          id = document.getElementById(h);
      anchor = id.offsetLeft;
      anchorClass = i;
      s.querySelector('.active').classList.remove('active');
      var nid = document.getElementById('slide-' + sectionId + '-' + anchorClass);
      nid.classList.add('active');
      if (theme.isMobile) {
        s.scroll({
          left: anchor - anchorPad
        });
      } else {
        s.scroll({
          left: anchor - anchorPad,
          behavior: 'smooth'
        });
        heightSlide();
      }
    }
    autoPlay = setInterval(Next, a);
    function clear() {
      clearInterval(autoPlay);
    }
    btns.forEach(function (b) {
      b.onclick = clear;
      b.ontouchstart = clear;
    });
    s.onclick = clear;
    s.ontouchmove = clear;
    if (Shopify.designMode) {
      s.addEventListener('shopify:block:select', function(e) {
        clear();
      });
      document.addEventListener('shopify:section:unload', function(e) {
        clear();
      });
    }
  }
  if (section.classList.contains('slideshow')) {
    if (t.autoPlay == 'true') {
      autoSlide(btns);
    }
    btns.forEach(function (b) {
      b.onclick = Btn;
    });
    heightSlide();
    if (theme.isMobile) {
      s.addEventListener('scroll', (e) => {
        clearTimeout(timeout);
        let pos = s.scrollLeft;
        for (let i = 0, l = sections.length; i < l; i++) {
          let relativePos = sections[i].offsetLeft - pos + (sections[i].offsetWidth / 2);
          if (relativePos >= 0 && relativePos < sections[i].offsetWidth) {
            touchID = sections[i].getAttribute('id');
            break;
          }
        }
        timeout = setTimeout(function () {
          var id = document.getElementById(touchID);
          let height = id.scrollHeight;
          s.style.setProperty('--max-height', height + 'px');
          var anchorClass = id.getAttribute('data-product-gallery-figure')
          if (t.settings) {
            t.settings.section.postMessage('slider:up', anchorClass);
          }
        }, 50);
      });
    }
    var prevWidth = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.width !== prevWidth ) {
        if (Layout.isBreakpoint('L')) {
          if (t) {
            if (t.slideshow_section && t.el.getAttribute('data-full-width') == 'false') {
              anchorPad = 20;
            } else {
              anchorPad = 0;
            }
          }
        } else {
          anchorPad = 0;
        }
        if (axis) {
          s.scroll({
            top: (s.querySelector('.active').offsetTop),
            behavior: 'smooth'
          })
        } else {
          s.scroll({
            top:0,
            left: (s.querySelector('.active').offsetLeft) - anchorPad,
            behavior: 'smooth'
          })
        }
        setTimeout(function() {
          heightSlide();
          var prevWidth = window.innerWidth;
        }, 250);
      };
    });
  }
  function slideDown(e) {
    if (theme.isMobile) return;
    isDown = true;
    drag = 0;
    this.classList.add('active');
    if (axis) {
      startY = e.pageY - this.offsetTop;
      scrollTop = this.scrollTop;
    } else {
      startX = e.pageX - this.offsetLeft;
      scrollLeft = this.scrollLeft;
    }
  }  
  s.onmousedown = slideDown;
  function slideMove(e) {
    if (theme.isMobile) return;
    if (this.classList.contains('no-drag')) return;
    if (!isDown) return;
    drag++;
    if (!theme.isMobile) {
      e.preventDefault();
    }
    if (drag > 5) {
      this.classList.add('sliding');
    } else {
      return
    }    
    if (axis) {
      const y = e.pageY - this.offsetTop;
      const walk = (y - startY) * 2;
      this.scrollTop = scrollTop - walk;
      if (section.classList.contains('slideshow')) {
        var slides = this.querySelectorAll('.slide');
        slides.forEach(function(s, i) {
          var t = s.offsetTop - (scrollTop - walk);
          if (t < 0) {
            var t = t * -1;
          }
          var w = s.offsetHeight / 2;        
          if (t <= w) {
            anchor = s.offsetTop * i;
            anchorClass = i + 1;
          }
        });
      }
    } else {
      if (!theme.isMobile) {
        const x = e.pageX - this.offsetLeft;
        const walk = (x - startX) * 2;
        this.scrollLeft = scrollLeft - walk;
        if (section.classList.contains('slideshow')) {
          var slides = this.querySelectorAll('.slide');
          slides.forEach(function(s, i) {
            var t = s.offsetLeft - (scrollLeft - walk);
            if (t < 0) {
              var t = t * -1;
            }
            var w = s.offsetWidth / 2;        
            if (t <= w) {
              anchor = s.offsetLeft - anchorPad;
              anchorClass = i + 1;
            }
          });
        }
      }
    }
  }
  s.onmousemove = slideMove;
  function slideUp(e) {
    if (theme.isMobile) return;
    var _this = this;
    isDown = false;
    if (section.classList.contains('slideshow')) {
      if (drag > 5) {
        if (t.settings) {
          t.settings.section.postMessage('slider:up', anchorClass - 1);
        } else {
          var c = s.querySelector('.active').classList.remove('active');   
          var id = document.getElementById('slide-' + sectionId + '-' + anchorClass);
          id.classList.add('active');       
          s.scroll({
            left: anchor,
            behavior: 'smooth'
          });
          heightSlide();
        }
      }     
    }
    this.classList.remove('active', 'sliding');
  }
  s.onmouseup = slideUp;  
};

function ScrollLock_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function ScrollLock_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function ScrollLock_createClass(Constructor, protoProps, staticProps) { if (protoProps) ScrollLock_defineProperties(Constructor.prototype, protoProps); if (staticProps) ScrollLock_defineProperties(Constructor, staticProps); return Constructor; }

var _document = document,
    body = _document.body,
    html = document.querySelector('html');

function _blockScroll(event) {
  if (event.target.closest('.allow-scroll-while-locked')) return;
  event.preventDefault();
  event.stopPropagation();
}

var ScrollLock = function () {
  function ScrollLock() {
    ScrollLock_classCallCheck(this, ScrollLock);
  }
  ScrollLock_createClass(ScrollLock, null, [{
    key: "lock",
    value: function lock(modal) {
      if (modal) {
        modal.classList.add('allow-scroll-while-locked');
      }
      html.classList.add('scroll-lock');
      body.style.top = -1 * window.pageYOffset;
      body.addEventListener('scroll', _blockScroll, false);
      body.addEventListener('touchmove', _blockScroll, {
        passive: false
      });
    }
  }, {
    key: "unlock",
    value: function unlock() {
      document.querySelectorAll('.allow-scroll-while-locked').forEach(function (modal) {
        return modal.classList.remove('allow-scroll-while-locked');
      });
      window.setTimeout(function() { 
        html.classList.remove('scroll-lock');
      }, 250);
      body.style.top = '';
      body.removeEventListener('scroll', _blockScroll, false);
      body.removeEventListener('touchmove', _blockScroll, {
        passive: false
      });
    }
  }]);
  return ScrollLock;
}();

function Map_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Map_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Map_createClass(Constructor, protoProps, staticProps) { if (protoProps) Map_defineProperties(Constructor.prototype, protoProps); if (staticProps) Map_defineProperties(Constructor, staticProps); return Constructor; }
var Map_Map = function () {
  function Map(el) {
    Map_classCallCheck(this, Map);
    this.el = el;
    this.map = null;
    this.center = null;
    this.container = this.el.querySelector('[data-map-container]');
    this.container.innerHTML = '';
    this.address = this.el.getAttribute('data-map-address');
    this.zoom = 11 + parseInt(this.el.getAttribute('data-map-zoom'), 10);
    if (isNaN(this.zoom)) this.zoom = 13;
    this.colors = {
      a: this.el.getAttribute('data-map-color-a'),
      b: this.el.getAttribute('data-map-color-b'),
      c: this.el.getAttribute('data-map-color-c'),
      d: this.el.getAttribute('data-map-color-d'),
      e: this.el.getAttribute('data-map-color-e'),
      f: this.el.getAttribute('data-map-color-f')
    };
    this.resize = this.resize.bind(this);
  }
  function Deferred() {
    let thens = []
    let catches = []
    let status
    let resolvedValue
    let rejectedError
    return {
      resolve: value => {
        status = 'resolved'
        resolvedValue = value
        thens.forEach(t => t(value))
        thens = []
      },
      reject: error => {
        status = 'rejected'
        rejectedError = error
        catches.forEach(c => c(error))
        catches = []
      },
      then: cb => {
        if (status === 'resolved') {
          cb(resolvedValue)
        } else {
          thens.unshift(cb)
        }
      },
      catch: cb => {
        if (status === 'rejected') {
          cb(rejectedError)
        } else {
          catches.unshift(cb)
        }
      },
    }
  }
  Map_createClass(Map, [{
    key: "createMap",
    value: function createMap() {
      var _this = this;
      var cPg = _this.el.closest('.page-contact-contactbar');
      return this.geolocate().then(function(results) {
        _this.map = new google.maps.Map(_this.container, {
          center: results[0].geometry.location,
          clickableIcons: false,
          disableDefaultUI: true,
          disableDoubleClickZoom: true,
          gestureHandling: 'none',
          keyboardShortcuts: false,
          maxZoom: _this.zoom,
          minZoom: _this.zoom,
          scrollWheel: false,
          styles: _this.getMapStyles(),
          zoom: _this.zoom,
          zoomControl: false
        });
        _this.center = _this.map.getCenter();
        var marker = new google.maps.Marker({
          clickable: false,
          map: _this.map,
          position: _this.center
        });
        window.addEventListener('resize', debounce(_this.resize, 250, true, true));
        if (cPg) {
          cPg.classList.add('visible');
        }
      })
      return this.geolocate().catch(function(status) {
        var usageLimits = 'https://developers.google.com/maps/faq#usagelimits';
        var errorMessage;
        switch (status) {
          case 'ZERO_RESULTS':
            errorMessage = "<p>Unable to find the address:</p> ".concat(_this.address);
            break;
          case 'OVER_QUERY_LIMIT':
            errorMessage = "\n<p>Unable to load Google Maps, you have reached your usage limit.</p>\n<p>\nPlease visit\n<a href=\"".concat(usageLimits, "\" target=\"_blank\">").concat(usageLimits, "</a>\nfor more details.\n              </p>\n            ");
            break;
          default:
            errorMessage = 'Unable to load Google Maps.';
            break;
        }
        _this.displayErrorInThemeEditor(errorMessage, status);
      });
    }
  }, {
    key: "geolocate",
    value: function geolocate() {
      var deferred = Deferred();
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        address: this.address
      }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          deferred.reject(status);
        } else {
          deferred.resolve(results);
        }
      });
      return deferred;
    }
  }, {
    key: "resize",
    value: function resize() {
      if (this.map) {
        google.maps.event.trigger(this.map, 'resize');
        this.map.setCenter(this.center);
      }
    }
  }, {
    key: "unload",
    value: function unload() {
      if (this.map) {
        google.maps.event.clearListeners(this.map, 'resize');
      }
    }
  }, {
    key: "getMapStyles",
    value: function getMapStyles() {
      return [{
        elementType: 'geometry',
        stylers: [{
          color: this.colors.e
        }]
      }, {
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        elementType: 'labels.text.fill',
        stylers: [{
          color: this.colors.a
        }]
      }, {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: this.colors.e
        }]
      }, {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.country',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.land_parcel',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.neighborhood',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'administrative.locality',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'poi',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{
          color: this.colors.d
        }]
      }, {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{
          color: this.colors.c
        }]
      }, {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          color: this.colors.b
        }]
      }, {
        featureType: 'road.highway.controlled_access',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{
          color: this.colors.b
        }]
      }, {
        featureType: 'road.local',
        elementType: 'labels.text.stroke',
        stylers: [{
          color: this.colors.e
        }]
      }, {
        featureType: 'transit',
        stylers: [{
          visibility: 'off'
        }]
      }, {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: this.colors.f
        }]
      }];
    }
  }, {
    key: "displayErrorInThemeEditor",
    value: function displayErrorInThemeEditor(errorMessage) {
      var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var isThemeEditor = window.Shopify && window.Shopify.designMode;
      if (!isThemeEditor) {
        return;
      }
      this.container.innerHTML = '<div class="map-error-message">'.concat(errorMessage, '</div>');
    }
  }]);
  return Map;
}();

function index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || index_es_unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

var deferred = {};

var AsyncView = function () {
  function AsyncView() {
    index_es_classCallCheck(this, AsyncView);
  }
  index_es_createClass(AsyncView, null, [{
    key: "load",
    value: function load(url) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (!('view' in query)) {
        return Promise.reject(new Error('\'view\' not found in \'query\' parameter'));
      }
      var querylessUrl = url.replace(/\?[^#]+/, '');
      var queryParamsString = new RegExp(/.+\?([^#]+)/).exec(url);
      var queryParams = query;
      if (queryParamsString && queryParamsString.length >= 2) {
        queryParamsString[1].split('&').forEach(function (param) {
          var _param$split = param.split('='),
              _param$split2 = _slicedToArray(_param$split, 2),
              key = _param$split2[0],
              value = _param$split2[1];
          queryParams[key] = value;
        });
      } 
      var cachebustingParams = _objectSpread2({}, queryParams, {
        _: new Date().getTime()
      });
      var hashUrl = querylessUrl.replace(/([^#]+)(.*)/, function (match, address, hash) {
        return "".concat(address, "?").concat(Object.keys(queryParams).sort().map(function (key) {
          return "".concat(key, "=").concat(encodeURIComponent(queryParams[key]));
        }).join('&')).concat(hash);
      });
      var requestUrl = querylessUrl.replace(/([^#]+)(.*)/, function (match, address, hash) {
        return "".concat(address, "?").concat(Object.keys(cachebustingParams).sort().map(function (key) {
          return "".concat(key, "=").concat(encodeURIComponent(cachebustingParams[key]));
        }).join('&')).concat(hash);
      });
      var promise = new Promise(function (resolve, reject) {
        var data;
        if (hashUrl in deferred) {
          resolve(deferred[hashUrl]);
          return;
        }
        deferred[hashUrl] = promise;
        if (options.hash) {
          data = sessionStorage.getItem(hashUrl);
          if (data) {
            var deserialized = JSON.parse(data);
            if (options.hash === deserialized.options.hash) {
              delete deferred[hashUrl];
              resolve(deserialized);
              return;
            }
          }
        }
        var xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl, true);
        xhr.onload = function () {
          var el = xhr.response;
          var newOptions = {};
          var optionsEl = el.querySelector('[data-options]');
          if (optionsEl && optionsEl.innerHTML) {
            newOptions = {
              'cart_shipping': el.querySelector('[data-options]').getAttribute('data-cart-shipping'),
              'item_count': el.querySelector('[data-options]').getAttribute('data-item-count'),
              'total_price': el.querySelector('[data-options]').getAttribute('data-total-price')
            };
          }
          var htmlEls = el.querySelectorAll('[data-html]');
          var newHtml = {};
          if (htmlEls.length === 1 && htmlEls[0].getAttribute('data-html') === '') {
            newHtml = htmlEls[0].innerHTML;
          } else {
            for (var i = 0; i < htmlEls.length; i++) {
              newHtml[htmlEls[i].getAttribute('data-html')] = htmlEls[i].innerHTML;
            }
          }
          var dataEls = el.querySelectorAll('[data-options]');
          var newData = {};
          if (dataEls.length === 1 && dataEls[0].getAttribute('data-options') === '') {
            newData = {
              'cart_shipping': el.querySelector('[data-options]').getAttribute('data-cart-shipping'),
              'item_count': el.querySelector('[data-options]').getAttribute('data-item-count'),
              'total_price': el.querySelector('[data-options]').getAttribute('data-total-price')
            };
          } else {
            for (var _i = 0; _i < dataEls.length; _i++) {
              newData[dataEls[_i].getAttribute('data-options')] = JSON.parse(dataEls[_i].innerHTML);
            }
          }
          if (options.hash) {
            try {
              sessionStorage.setItem(hashUrl, JSON.stringify({
                options: newOptions,
                data: newData,
                html: newHtml
              }));
            } catch (error) {
              console.error(error);
            }
          }
          delete deferred[hashUrl];
          resolve({
            data: newData,
            html: newHtml
          });
        };
        xhr.onerror = function () {
          delete deferred[hashUrl];
          reject();
        };
        xhr.responseType = 'document';
        xhr.send();
      });
      return promise;
    }
  }]);
  return AsyncView;
}();

var shopify_asyncview_dist_index_es = (AsyncView);

var DOCUMENT_FRAGMENT_NODE = 11;

function Sections_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Sections_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Sections_createClass(Constructor, protoProps, staticProps) { if (protoProps) Sections_defineProperties(Constructor.prototype, protoProps); if (staticProps) Sections_defineProperties(Constructor, staticProps); return Constructor; }
var Sections = function () {
  function Sections() {
    Sections_classCallCheck(this, Sections);
    this.handlers = {};
    this.instances = {};
    this._onSectionEvent = this._onSectionEvent.bind(this);
    document.addEventListener('shopify:section:load', this._onSectionEvent);
    document.addEventListener('shopify:section:unload', this._onSectionEvent);
    document.addEventListener('shopify:section:select', this._onSectionEvent);
    document.addEventListener('shopify:section:deselect', this._onSectionEvent);
    document.addEventListener('shopify:block:select', this._onSectionEvent);
    document.addEventListener('shopify:block:deselect', this._onSectionEvent);
  }
  Sections_createClass(Sections, [{
    key: "register",
    value: function register(type, handler) {
      if (this.handlers[type]) {
        console.warn("Sections: section handler already exists of type '".concat(type, "'."));
      }
      this.handlers[type] = handler;
      this._initSections(type);
    }
  }, {
    key: "_initSections",
    value: function _initSections(type) {
      var dataEls = document.querySelectorAll("[data-section-type=\"".concat(type, "\"]"));
      if (!dataEls) return;
      for (var i = 0; i < dataEls.length; i++) {
        var dataEl = dataEls[i];
        var el = dataEl.parentNode;
        var idEl = el.querySelector('[data-section-id]');
        if (!idEl) {
          console.warn("Sections: unable to find section id for '".concat(type, "'."), el);
          continue;
        }
        var sectionId = idEl.getAttribute('data-section-id');
        if (!sectionId) {
          console.warn("Sections: unable to find section id for '".concat(type, "'."), el);
          continue;
        }
        this._createInstance(sectionId, el);
      }
    }
  }, {
    key: "_onSectionEvent",
    value: function _onSectionEvent(event) {      
      var el = event.target;
      var sectionId = event.detail.sectionId;
      var blockId = event.detail.blockId;
      var instance = this.instances[sectionId];
      switch (event.type) {
        case 'shopify:section:load':
          this._createInstance(sectionId, el);          
          sectionObserver();
          break;
        case 'shopify:section:unload':
          this._triggerInstanceEvent(instance, 'onSectionUnload', {
            el: el,
            id: sectionId
          });
          delete this.instances[sectionId];
          break;
        case 'shopify:section:select':
          this._triggerInstanceEvent(instance, 'onSectionSelect', {
            el: el,
            id: sectionId
          });
          break;
        case 'shopify:section:deselect':
          this._triggerInstanceEvent(instance, 'onSectionDeselect', {
            el: el,
            id: sectionId
          });
          break;
        case 'shopify:block:select':
          this._triggerInstanceEvent(instance, 'onSectionBlockSelect', {
            el: el,
            id: blockId,
            sid: sectionId
          });
          break;
        case 'shopify:block:deselect':
          this._triggerInstanceEvent(instance, 'onSectionBlockDeselect', {
            el: el,
            id: sectionId,
            sid: sectionId
          });
          break;
      }
    }
  }, {
    key: "_triggerInstanceEvent",
    value: function _triggerInstanceEvent(instance, eventName) {
      if (instance && instance[eventName]) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        instance[eventName].apply(instance, args);
      }
    }
  }, {
    key: "_postMessage",
    value: function _postMessage(name, data) {
      for (var id in this.instances) {
        this._triggerInstanceEvent(this.instances[id], 'onSectionMessage', name, data);
      }
    }
  }, {
    key: "_createInstance",
    value: function _createInstance(id, el) {
      var typeEl = el.querySelector('[data-section-type]');
      if (!typeEl) return console.warn("Sections: unable to find section type for id '".concat(id, "'."));
      var type = typeEl.getAttribute('data-section-type');
      if (!type) return console.warn("Sections: unable to find section type for id '".concat(id, "'."));
      var handler = this.handlers[type];
      if (!handler) return console.warn("Sections: unable to find section handler for type '".concat(type, "'."));
      var data = this._loadData(el);
      var postMessage = this._postMessage.bind(this);
      this.instances[id] = handler({
        id: id,
        type: type,
        el: el,
        data: data,
        postMessage: postMessage
      });
    }
  }, {
    key: "_loadData",
    value: function _loadData(el) {
      var dataEl = el.querySelector('[data-section-data]');
      if (!dataEl) return {};
      var data = dataEl.getAttribute('data-section-data') || dataEl.innerHTML;
      try {
        return JSON.parse(data);
      } catch (error) {
        console.warn("Sections: invalid section data found. ".concat(error.message));
        return {};
      }
    }
  }]);
  return Sections;
}();

function unwrapExports (x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
  return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var EventHandler_1 = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;
  var EventHandler =
      function () {
        function EventHandler() {
          this.events = [];
        }
        EventHandler.prototype.register = function (el, event, listener) {
          if (!el || !event || !listener) return null;
          this.events.push({
            el: el,
            event: event,
            listener: listener
          });
          el.addEventListener(event, listener);
          return {
            el: el,
            event: event,
            listener: listener
          };
        };
        EventHandler.prototype.unregister = function (_a) {
          var el = _a.el,
              event = _a.event,
              listener = _a.listener;
          if (!el || !event || !listener) return null;
          this.events = this.events.filter(function (e) {
            return el !== e.el || event !== e.event || listener !== e.listener;
          });
          el.removeEventListener(event, listener);
          return {
            el: el,
            event: event,
            listener: listener
          };
        };
        EventHandler.prototype.unregisterAll = function () {
          this.events.forEach(function (_a) {
            var el = _a.el,
                event = _a.event,
                listener = _a.listener;
            return el.removeEventListener(event, listener);
          });
          this.events = [];
        };
        return EventHandler;
      }();
  exports["default"] = EventHandler;
});
var Events = unwrapExports(EventHandler_1);

function forceFocus(element, options) {
  options = options || {};
  var savedTabIndex = element.tabIndex;
  element.tabIndex = -1;
  element.dataset.tabIndex = savedTabIndex;
  element.focus();
  if (typeof options.className !== 'undefined') {
    element.classList.add(options.className);
  }
  element.addEventListener('blur', callback);
  function callback(event) {
    event.target.removeEventListener(event.type, callback);
    element.tabIndex = savedTabIndex;
    delete element.dataset.tabIndex;
    if (typeof options.className !== 'undefined') {
      element.classList.remove(options.className);
    }
  }
}

function focusable(container) {
  var elements = Array.prototype.slice.call(
    container.querySelectorAll(
      '[tabindex]:not([tabindex^='-']),' +
      '[draggable],' +
      'summary,'  +
      'a[href],' +
      'area,' +
      'button:enabled,' +
      'input:not([type=hidden]):enabled,' +
      'object,' +
      'select:enabled,' +
      'textarea:enabled,' +
      'object,' + 
      'iframe'
    )
  );
  return elements.filter(function(element) {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  });
}

const trapFocusHandlers = {};

function trapFocus(container, options) {  
  removeTrapFocus();  
  options = options || {};
  var elements = focusable(container);
  var elementToFocus = options.elementToFocus || container;
  var first = elements[0];
  var last = elements[elements.length - 1];
  trapFocusHandlers.focusin = function(event) {
    if (container !== event.target && !container.contains(event.target) || event.target.classList.contains('navmenu-item-parent')) {
      first.focus();
    }
    if (event.target !== container && event.target !== last && event.target !== first) return;
    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };
  trapFocusHandlers.focusout = function() {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };
  trapFocusHandlers.keydown = function(event) {
    if (event.keyCode !== 9) return;
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };
  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);
  forceFocus(elementToFocus, options);
}

function removeTrapFocus() {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);
}
                                                                       
function Wrap() {
  var el = document.querySelectorAll('#content iframe[src*="youtube.com"]:not(.no-container),#content iframe[src*="vimeo.com"]:not(.no-container)');
  el.forEach(function(e) {
    var wrapper = document.createElement('div');
    wrapper.className = 'youtube-container';
    e.classList.add('no-container');
    e.parentNode.insertBefore(wrapper, e);
    wrapper.appendChild(e);
  });
  var el = document.querySelectorAll('table');
  el.forEach(function(e) {
    var wrapper = document.createElement('div');
    wrapper.className = 'table-container scroll-bar-h';
    e.parentNode.insertBefore(wrapper, e);
    wrapper.appendChild(e);
    wrapper.parentNode.classList.add('table-scroll');
  }); 
};

function Quick() {
  const m = document.querySelector('.modal__content');
  var btns = document.querySelectorAll('[data-quick]');
  btns.forEach(function(b) {
    b.onclick = function(event){
      var id = b.getAttribute('data-quick-id'),
          url = b.getAttribute('data-quick-url');     
      try {
        var components_Modal = (new Modal());
        var header = '';
        var content = '';    
        components_Modal.open({
          product: true,
          header: header,
          content: content
        });
      } catch (e) {
        console.log("!: ", e);
      }
      fetch(url + '?view=quick')
      .then(response => response.text())
      .then(text => {
        m.insertAdjacentHTML('afterbegin', text);
        sectionObserver();
        if (Shopify.PaymentButton) {
          Shopify.PaymentButton.init(); 
        }
        trapFocus(m.closest('.modal'));
      }).catch(function(err) {
        console.error('!: ' + err)
      });
    };  
  });
};
Quick();

function ModalEscCloser_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function ModalEscCloser_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function ModalEscCloser_createClass(Constructor, protoProps, staticProps) { if (protoProps) ModalEscCloser_defineProperties(Constructor.prototype, protoProps); if (staticProps) ModalEscCloser_defineProperties(Constructor, staticProps); return Constructor; }
var ModalEscCloser = function () {
  function ModalEscCloser() {
    var _this = this;
    ModalEscCloser_classCallCheck(this, ModalEscCloser);
    this.stack = [];
    this.closeEsc = function (e) {
      if (e.key === 'Escape' && _this.stack.length) {
        _this.stack.pop().close();
      }
    };
    window.addEventListener('keydown', this.closeEsc);
  }
  ModalEscCloser_createClass(ModalEscCloser, [{
    key: "add",
    value: function add(modal) {
      this.stack.push(modal);
    }
  }, {
    key: "remove",
    value: function remove(modal) {
      this.stack = this.stack.filter(function (m) {
        return m !== modal;
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      window.removeEventListener('keydown', this.closeEsc);
    }
  }]);
  return ModalEscCloser;
}();
var utils_ModalEscCloser = (new ModalEscCloser());

function Modal_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Modal_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Modal_createClass(Constructor, protoProps, staticProps) { if (protoProps) Modal_defineProperties(Constructor.prototype, protoProps); if (staticProps) Modal_defineProperties(Constructor, staticProps); return Constructor; }
var Modal = function () {
  function Modal() {
    var _this = this;
    window.hasModal = true;
    Modal_classCallCheck(this, Modal);
    this.container = document.querySelector('[data-modal-container]');
    this.background = document.querySelector('[data-modal-background]');
    this.drawer = this.container.querySelector('[data-modal]');
    this.header = this.container.querySelector('[data-modal-header]');
    this.closeButton = this.container.querySelector('[data-modal-close]');
    this.content = this.container.querySelector('[data-modal-content]');
    this.trigger = null;
    this.events = new Events();
    this.events.register(this.closeButton, 'click', function () {
      return _this.close();
    });
    this.events.register(this.background, 'click', function (e) {
      if (e.target !== _this.background) return;
      _this.close();
    });
  }
  Modal_createClass(Modal, [{
    key: "open",
    value: function open(_ref) {
      var _this2 = this;
      var product = _ref.product,
          header = _ref.header,
          content = _ref.content;
      this.trigger = document.activeElement;
      utils_ModalEscCloser.add(this);
      ScrollLock.lock(this.drawer);
      this.header.innerHTML = header;
      this.content.innerHTML = content;
      if (product) {
        var height = '100vh';
      } else {
        var h = this.header.offsetHeight,
            c = this.content.offsetHeight,
            height = h + c + 70;
        trapFocus(_this2.container);
      }
      this.drawer.style.setProperty('--max-height', height + 'px');      
      this.container.setAttribute('data-modal-animation-state', 'open');
      return _this2.container;
    }
  }, {
    key: "close",
    value: function close() {
      var _this3 = this;
      utils_ModalEscCloser.remove(this);
      _this3.container.setAttribute('data-modal-animation-state', 'closed');                                
      removeTrapFocus(_this3.container);
      ScrollLock.unlock();
      if (_this3.trigger) {
        _this3.trigger.focus();
      }
    }
  }]);
  return Modal;
}();

var sections = new Sections();
sections.register('check', function (section) {
  return new Check(section);
});  
sections.register('header', function (section) {
  return new Header(section);
});  
sections.register('collection', function (section) {
  return new Collection(section);
});
sections.register('cart', function (section) {
  return new CartCart(section);
});
sections.register('search', function (section) {
  return new Collection(section);
});
document.addEventListener('DOMContentLoaded', function() {
  Wrap();
});