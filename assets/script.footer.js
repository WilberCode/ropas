function shopify_cross_border_dist_index_es_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function shopify_cross_border_dist_index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function shopify_cross_border_dist_index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) shopify_cross_border_dist_index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) shopify_cross_border_dist_index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}
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
var selectors = {
  disclosureList: '[data-disclosure-list]',
  disclosureToggle: '[data-disclosure-toggle]',
  disclosureInput: '[data-disclosure-input]',
  disclosureOptions: '[data-disclosure-option]'
};
var classes = {
  listVisible: 'disclosure-list--visible',
  alternateDrop: 'disclosure-list--alternate-drop'
};
var Disclosure = function () {
  function Disclosure(el) {
    shopify_cross_border_dist_index_es_classCallCheck(this, Disclosure);
    this.el = el;
    this.aB = document.getElementById('ajaxBusy');
    this.events = new Events();
    this.cache = {};
    this._cacheSelectors();
    this._connectOptions();
    this._connectToggle();
    this._onFocusOut();    
  }
  shopify_cross_border_dist_index_es_createClass(Disclosure, [{
    key: "_cacheSelectors",
    value: function _cacheSelectors() {
      this.cache = {
        disclosureList: this.el.querySelector(selectors.disclosureList),
        disclosureToggle: this.el.querySelector(selectors.disclosureToggle),
        disclosureInput: this.el.querySelector(selectors.disclosureInput),
        disclosureOptions: this.el.querySelectorAll(selectors.disclosureOptions)
      };
    }
  }, {
    key: "_connectToggle",
    value: function _connectToggle() {
      var _this = this;
      this.events.register(this.cache.disclosureToggle, 'click', function (e) {
        var ariaExpanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
        e.currentTarget.setAttribute('aria-expanded', !ariaExpanded);
        _this.cache.disclosureList.classList.remove(classes.alternateDrop);
        _this.cache.disclosureList.classList.toggle(classes.listVisible);
        window.requestAnimationFrame(function () {
          var _this$cache$disclosur = _this.cache.disclosureList.getBoundingClientRect(),
              left = _this$cache$disclosur.left,
              width = _this$cache$disclosur.width;
          var _window = window,
              innerWidth = _window.innerWidth;
          var gutter = 30;
          if (left + width + gutter > innerWidth) {
            _this.cache.disclosureList.classList.add(classes.alternateDrop);
          }
        });
      });
    }
  }, {
    key: "_connectOptions",
    value: function _connectOptions() {
      var _this2 = this;
      var options = this.cache.disclosureOptions;
      for (var i = 0; i < options.length; i++) {
        var option = options[i];
        this.events.register(option, 'click', function (e) {
          return _this2._submitForm(e.currentTarget.dataset.value);
        });
      }
    }
  }, {
    key: "_onFocusOut",
    value: function _onFocusOut() {
      var _this3 = this;
      this.events.register(this.cache.disclosureToggle, 'focusout', function (e) {
        var disclosureLostFocus = !_this3.el.contains(e.relatedTarget);
        if (disclosureLostFocus) {
          _this3._hideList();
        }
      });
      this.events.register(this.cache.disclosureList, 'focusout', function (e) {
        var childInFocus = e.currentTarget.contains(e.relatedTarget);
        var isVisible = _this3.cache.disclosureList.classList.contains(classes.listVisible);
        if (isVisible && !childInFocus) {
          _this3._hideList();
        }
      });
      this.events.register(this.el, 'keyup', function (e) {
        if (e.defaultPrevented) {
          return;
        }
        if (e.key !== 'Escape' || e.key !== 'Esc') return;
        _this3._hideList();
        _this3.cache.disclosureToggle.focus();
      });
      this.events.register(document.body, 'click', function (e) {
        var isOption = _this3.el.contains(e.target);
        var isVisible = _this3.cache.disclosureList.classList.contains(classes.listVisible);
        if (isVisible && !isOption) {
          _this3._hideList();
        }
      });
    }
  }, {
    key: "_submitForm",
    value: function _submitForm(value) {
      this.cache.disclosureInput.value = value;
      this.el.closest('form').submit();
      this.aB.style.display = 'block';
    }
  }, {
    key: "_hideList",
    value: function _hideList() {
      this.cache.disclosureList.classList.remove(classes.listVisible);
      this.cache.disclosureToggle.setAttribute('aria-expanded', false);
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.unregisterAll();
    }
  }]);
  return Disclosure;
}();
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function closest(s) {
    var el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
var shopify_cross_border_dist_index_es = (Disclosure);
function Footer_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Footer_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Footer_createClass(Constructor, protoProps, staticProps) { if (protoProps) Footer_defineProperties(Constructor.prototype, protoProps); if (staticProps) Footer_defineProperties(Constructor, staticProps); return Constructor; }
var Footer = function () {
  function Footer(section) {
    Footer_classCallCheck(this, Footer);
    var newsletterEl = section.el.querySelector('.newsletter-message');
    if (newsletterEl && window.hasModal === undefined) {
      var newsletterElTitle = newsletterEl.getAttribute('data-title');
      var newsletterElText = newsletterEl.textContent;
      var components_Modal = (new Modal());
      var header = '<h2>' + newsletterElTitle + '</h2>';
      var content = '<p>' + newsletterElText + '</p>';
      components_Modal.open({
        header: header,
        content: content
      });
    }
    var currencyDisclosureEl = section.el.querySelector('[data-disclosure-currency]');
    var localeDisclosureEl = section.el.querySelector('[data-disclosure-locale]');
    if (currencyDisclosureEl) {
      this.currencyDisclosure = new shopify_cross_border_dist_index_es(currencyDisclosureEl);
    }
    if (localeDisclosureEl) {
      this.localeDisclosure = new shopify_cross_border_dist_index_es(localeDisclosureEl);
    }
  }
  Footer_createClass(Footer, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.currencyDisclosure) {
        this.currencyDisclosure.unload();
      }
      if (this.localeDisclosure) {
        this.localeDisclosure.unload();
      }
    }
  }]);
  return Footer;
}();
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'footer' && !sectionContainer.classList.contains('ignore')){
    sections.register('footer', function (section) {
      return new Footer(section);
    });
    sectionContainer.classList.add('ignore');
  }
})