var sectionEvents = [];
Header = (function() {
  function NavTrigger_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function NavTrigger_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function NavTrigger_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavTrigger_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavTrigger_defineProperties(Constructor, staticProps); return Constructor; }
  var NavTrigger = function () {
    function NavTrigger() {
      var _this = this;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      NavTrigger_classCallCheck(this, NavTrigger);
      this.$el = options.el;
      this.namespace = options.namespace;
      this.trigger = options.trigger;
      this.postMessage = options.postMessage;      
      this.onShow = options.onShow;
      this.onHide = options.onHide;
      this.$overlay = document.querySelector('.site-navigation-overlay');
      this.isHovering = false;
      this.isTouching = false;
      this.isLocked = false;
      if(theme.mobileMenu != 'mobile') {
        this.selectorPath = document.querySelector('.site-navigation .navmenu-depth-1 .navmenu-item-parent.navmenu-id-'.concat(this.trigger));
        this.selectorPathA = this.selectorPath.querySelector('.navmenu-link-parent');
        this.selectorDiv = document.querySelector('.site-navigation #menu-item-'.concat(this.trigger));
        this.selector = document.querySelector('.site-navigation .navmenu-depth-1 .navmenu-item-parent.navmenu-id-'.concat(this.trigger));
        function selectorShow(){
          _this.show();
        }      
        function selectorHide(){
          _this.hide();
        }
        this.selectorPathA.addEventListener('keydown', function(ev) {
          _this.selectorPath.classList.add('tab-focused');
        });
        this.selectorPathA.onblur = function(ev){
          _this.selectorPath.classList.remove('tab-focused');
        }
        this.selectorPathA.onclick = function(ev){
          if (_this.selectorPath.classList.contains('tab-focused')) {
            ev.preventDefault();
          }
          _this.toggle();
          _this.selectorPath.classList.add('tab-focused');
        };
        this.selectorPath.onmouseenter = function(event){
          selectorShow();
        };
        this.selectorPath.onmouseleave = function(event){
          selectorHide();
        };
        this.selectorDiv.onmouseenter = function(event){
          _this.isHovering = !_this.isTouching;
          _this.isTouching = false;
        };
        this.selectorDiv.onmouseleave = function(event){
          _this.isHovering = false;
        };
        this.selectorDiv.ontouchstart = function(event){
          _this.isTouching = true;
        };
        this.selectorPath.ontouchend = function(event){
          event.preventDefault();
          _this.toggle();
        };
        this.addTrigger();
      }      
    }
    NavTrigger_createClass(NavTrigger, [{
      key: "unload",
      value: function unload() {
        var _this2 = this;
        this.isHovering = false;
        this.isLocked = false;
        this.hide();
        this.removeTriggers();
      }
    }, {
      key: "lock",
      value: function lock() {
        this.isLocked = true;
        this.show(true);        
      }
    }, {
      key: "unlock",
      value: function unlock() {
        this.isLocked = false;
        this.hide();
      }
    }, {
      key: "toggle",
      value: function toggle(force) {
        var _this = this;
        if (_this.$el.hasAttribute('data-revealer-visible')) {
          _this.selectorPathA.setAttribute('aria-expanded', false);
          _this.hide();
          removeTrapFocus(_this.selectorPath);
        } else {
          _this.selectorPathA.setAttribute('aria-expanded', true);
          _this.show();
          trapFocus(_this.selectorPath);
        }
      }
    }, {
      key: "show",
      value: function show(force) {
        var _this = this;
        this.postMessage('header-minicart:toggle', 'closed');
        this.selector.setAttribute('aria-expanded', true);
        Revealer('show', force, _this);
        if (_this.onShow) _this.onShow();
      }
    }, {
      key: "hide",
      value: function hide(force) {        
        var _this = this;
        if (this.isLocked) {
          return;
        }
        this.hideOverlay();
        if (_this.isHovering) return;
        _this.$el.closest('li').setAttribute('aria-expanded', false);
        Revealer('hide', force, _this);
        if (_this.onHide) _this.onHide();
        removeTrapFocus(_this.selectorPath);
      }
    }, {
      key: "showOverlay",
      value: function showOverlay() {
        this.$overlay.style.display = 'block';
      }
    }, {
      key: "hideOverlay",
      value: function hideOverlay() {  
        this.$overlay.style.display = 'none';
      }
    }, {
      key: "addTrigger",
      value: function addTrigger() {
        var $trigger = this.selector;
        if (!$trigger) return;
        $trigger.setAttribute('data-navmenu-trigger', this.namespace);
        $trigger.setAttribute('data-navmenu-ignore', true);
      }
    }, {
      key: "removeTriggers",
      value: function removeTriggers() {
        this.$menuNavTriggers = document.querySelectorAll("[data-navmenu-trigger=\"".concat(this.namespace, "\"]"));
        this.$menuNavTriggers.forEach(function (el) {
          var $trigger = el;
          $trigger.setAttribute('data-navmenu-trigger', this.namespace);
          $trigger.setAttribute('data-navmenu-ignore', true);
        });
      }
    }]);
    return NavTrigger;
  }();
  function ContactbarStaticSection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ContactbarStaticSection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ContactbarStaticSection_createClass(Constructor, protoProps, staticProps) { if (protoProps) ContactbarStaticSection_defineProperties(Constructor.prototype, protoProps); if (staticProps) ContactbarStaticSection_defineProperties(Constructor, staticProps); return Constructor; }
  var ContactbarStaticSection = function () {
    function ContactbarStaticSection(section, postMessage) {
      var _this = this;
      ContactbarStaticSection_classCallCheck(this, ContactbarStaticSection);
      this.$section = section;
      this.$map = section.querySelector('[data-map]');
      this.hasMap = !!this.$map;
      this.$contact = document.querySelector('section[data-section-type="contact_page"]');
      this.$mobile = document.querySelector('.mobilenav-contactbar');
      this.$el = this.$mobile.querySelector('.contactbar-info');
      this.$infoTrigger = this.$mobile.querySelector('[data-contactbar-info-trigger]');
      this.$infoClose = this.$mobile.querySelector('[data-contactbar-info-close]');
      this.postMessage = postMessage;
      if (this.hasMap) {
        this.trigger = this.$map.getAttribute('data-map-trigger');
        this.apiKey = this.$map.getAttribute('data-map-api-key');
        this.maps = [];
        this.clones = [];
        if (theme.mobileMenu != 'mobile') {
          _this.mapRelocation();
        }
        this.maps.push(new Map_Map(this.$map));
        if (this.$contact) {
          if (theme.mobileMenu == 'mobile' || Layout.isBreakpoint('S')) {
            var $source = document.querySelector('#site-mobilenav [data-contactbar-clone-source]');      
          } else {
            var $source = document.querySelector('header [data-contactbar-clone-source]');
          }
          if (!$source) {
            return;      
          }
          var $source1 = $source.querySelector('.contactbar-map');
          var $source2 = $source.querySelector('.contactbar-items');
          var $pageTarget = document.querySelector('[data-contactbar-page-target]');
          if ($source1) {
            var $clone1 = $source1.cloneNode(true);
            $pageTarget.appendChild($clone1);
            this.maps.push(new Map_Map($pageTarget.querySelector('[data-map]')));
          }
          if ($source2) {
            var $clone2 = $source2.cloneNode(true);
            $pageTarget.appendChild($clone2);
          }
        }
        if (this.apiKey) {
          if (window.googleMaps === undefined) {
            window.googleMaps = true;
            function onScriptLoad() {
              _this.maps.forEach(function (map) {
                return map.createMap();
              });
            }
            getScript("https://maps.googleapis.com/maps/api/js?key=".concat(this.apiKey), onScriptLoad);
          } else {
            this.maps.forEach(function (map) {
              return map.createMap();
            });
          }
        } else {
          var javascriptApi = 'https://developers.google.com/maps/documentation/javascript/get-api-key';
          var geocodingApi = 'https://developers.google.com/maps/documentation/geocoding/get-api-key';
          var errorMessage = "\n<p>\nTo activate your map:\n<ol>\n<li>\nGenerate both <a href=\"".concat(javascriptApi, "\" target=\"_blank\">JavaScript</a>\nand <a href=\"").concat(geocodingApi, "\" target=\"_blank\">Geocoding</a> API keys.\n</li>\n<li>Copy and paste one of them into the theme editor.</li>\n<li>Save your changes to verify the new API key.</li>\n</ol>\n</p>\n");
          this.maps.forEach(function (map) {
            return map.displayErrorInThemeEditor(errorMessage);
          });
        }
        this.navTrigger = new NavTrigger({
          el: section.el,
          namespace: 'contactbar',
          trigger: this.trigger,
          postMessage: this.postMessage,
          onShow: function onShow() {
            _this.maps.forEach(function (map) {
              return map.resize();
            });
            _this.postMessage('nav:close-all', {});
            _this.postMessage('nav:close-triggers', {
              source: _this.$section
            });
            _this.postMessage('nav:show-overlay', {
              source: _this.$section
            });
          }
        });
      }
      if (this.$infoTrigger) {
        this.events = [
          this.$infoTrigger.onclick = function(event, force){
            event.preventDefault;
            Revealer('toggle', force, _this);
          },
          this.$infoClose.onclick = function(event, force){
            event.preventDefault;
            Revealer('hide', force, _this);
          }
        ]; 
      }
      this.layoutHandler = this.onBreakpointChange.bind(this);
      Layout.onBreakpointChange(this.layoutHandler);
    }
    ContactbarStaticSection_createClass(ContactbarStaticSection, [{
      key: "mapRelocation",
      value: function mapRelocation() {        
        if (!Layout.isBreakpoint('S')) {
          if(theme.mobile) {
            this.container = this.$mobile.querySelector('.contactbar-map');
          } else {
            this.container = this.$section.querySelector('.contactbar-map');
          }
        } else {
          this.container = this.$mobile.querySelector('.contactbar-map');
        }
        this.container.appendChild(this.$map);
      }
    }, {
      key: "onBreakpointChange",
      value: function onBreakpointChange(t) {        
        if (this.hasMap) {
          this.mapRelocation();
        }
        if (!this.isEditing) return;
        if (!Layout.isBreakpoint('S')) {
          this.navTrigger.lock();
          this.postMessage('mobilenav:close');
        } else {
          this.navTrigger.unlock();
          this.postMessage('mobilenav:open');
        }
      }
    }]);
    return ContactbarStaticSection;
  }();
  function NavMobile_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function NavMobile_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function NavMobile_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavMobile_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavMobile_defineProperties(Constructor, staticProps); return Constructor; }
  var MobileNav = function () {
    function MobileNav(el) {
      var _this = this;
      NavMobile_classCallCheck(this, MobileNav);
      this.$html = document.querySelector('html');
      this.$el = el;
      this.$panel = this.$el.querySelector('.mobilenav-panel');
      this.$overlay = this.$el.querySelector('.mobilenav-overlay');
      this.$button = this.$el.querySelector('.mobilenav-overlay-close');      
      this.$content = this.$el.querySelector('.mobilenav-panel-content');
      this.$animators = this.$el.querySelectorAll('[data-mobilenav-animator]');
      this.$searchInput = this.$el.querySelector('.mobilenav-search-input');
      this.$contact = this.$el.querySelector('.mobilenav-contactbar');
      this.$menuNavParents = this.$el.querySelectorAll('.navmenu-link-parent');
      this.$menuNavParents.forEach(function (m) {
        m.onclick = function(event){
          _this.toggleItem(event.currentTarget);
        };
        var a = m.querySelector('.navmenu-arrow-toggle');
        if (a) {
          a.onclick = function(event){
            event.preventDefault();
            event.stopPropagation();
            _this.arrowToggle(event.currentTarget);
          }
        }
      });
      this.$megaNavTriggers = this.$el.querySelectorAll('[data-meganav-trigger]');
      this.$megaNavs = this.$el.querySelectorAll('[data-meganav]');
      this.megaNavs = [];
      this.$megaNavTriggers.forEach(function (key, megaNavTrigger) {
        var $megaNav = key;
        _this.megaNavs.push(new MeganavMenu($megaNav));
      });
    }
    NavMobile_createClass(MobileNav, [{
      key: "unload",
      value: function unload() {
        this.close();
      }
    }, {
      key: "open",
      value: function open(force) {
        var _this = this;
        document.querySelector('.mobilenav-toggle-link').setAttribute('aria-expanded', true);
        this.$html.classList.add('scroll-lock');
        Revealer('show', force, _this);
        this.$overlay.onclick = function(event){
          _this.close();
        };
        this.$button.onclick = function(event){
          _this.close();
        };
        this.$overlay.ontouchmove = function(event){
          return event.preventDefault();
        };
        trapFocus(_this.$panel);
      }
    }, {
      key: "close",
      value: function close(force) {
        var _this = this;
        document.querySelector('.mobilenav-toggle-link').setAttribute('aria-expanded', false);
        this.$html.classList.remove('scroll-lock');
        Revealer('hide', force, _this);
        removeTrapFocus(_this.$panel);
        document.querySelector('[data-mobilenav-toggle]').focus();
      }
    }, {
      key: "toggleItem",
      value: function toggleItem(el, force) {
        var $el = el;
        if ($el.classList.contains('navmenu-selected') || $el.classList.contains('navmenu-contact')) {
          return true;
        } else {
          event.preventDefault();
          $el.classList.toggle('navmenu-selected');
          if ($el.getAttribute('aria-expanded') === 'false') {
            $el.setAttribute('aria-expanded', 'true')
          } else {
            $el.setAttribute('aria-expanded', 'false')
          }
          $el.parentNode.classList.toggle('navmenu-active');
          var _this = {
            $el: $el.parentNode.querySelector('[data-mobile-trigger ]')
          };
          Revealer('show', force, _this);
        }
      }
    }, {
      key: "arrowToggle",
      value: function arrowToggle(el, force) {
        var $el = el.parentNode;
        $el.classList.toggle('navmenu-selected');
        if ($el.getAttribute('aria-expanded') === 'false') {
          $el.setAttribute('aria-expanded', 'true')
        } else {
          $el.setAttribute('aria-expanded', 'false')
        }
        $el.parentNode.classList.toggle('navmenu-active');
        var $list = $el.parentNode.querySelector('[data-mobile-trigger]');
        var _this = {
          $el: $list
        };
        if ($list.hasAttribute('data-revealer-visible')) {
          Revealer('hide', force, _this);
        } else {
          Revealer('show', force, _this);
        }
      }
    }]);
    return MobileNav;
  }();
  function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = NavDesktop_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
  function NavDesktop_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return NavDesktop_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return NavDesktop_arrayLikeToArray(o, minLen); }
  function NavDesktop_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function NavDesktop_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function NavDesktop_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function NavDesktop_createClass(Constructor, protoProps, staticProps) { if (protoProps) NavDesktop_defineProperties(Constructor.prototype, protoProps); if (staticProps) NavDesktop_defineProperties(Constructor, staticProps); return Constructor; }
  var NavDesktop = function () {
    function NavDesktop(el, postMessage) {
      var _this = this;
      NavDesktop_classCallCheck(this, NavDesktop);
      this.$el = el;
      this.el = this.$el[0];
      this.$overlay = document.querySelector('.site-navigation-overlay');
      this.$menuNavParents = this.$el.querySelectorAll('.navmenu-drop');
      this.$menuNavParentsLinks = this.$el.querySelectorAll('.navmenu-drop > .navmenu-link-parent-1');
      this.postMessage = postMessage;
      this.events = [
        this.$menuNavParents.forEach(function (m) {
          m.onmouseenter = function(event){
            _this.openItem(event.currentTarget);
            var menuNav3 = el.querySelectorAll('.tabbing');
            menuNav3.forEach(function (m) {
              m.classList.remove('visible','tabbing');
            });
          }
          m.onmouseleave = function(event){
            _this.closeItem(event.currentTarget);
          }
        }),
        this.$menuNavParentsLinks.forEach(function (m) {        
          m.addEventListener('keydown', function(ev) {
            m.closest('li').classList.add('tab-focused');
          });
          m.onblur = function(ev){
            m.closest('li').classList.remove('tab-focused');
          }
          m.onclick = function(ev){
            if (m.closest('li').classList.contains('tab-focused')) {
              ev.preventDefault();
            }
            _this.toggleItem(ev.currentTarget.closest('li'));
            m.closest('li').classList.add('tab-focused');
            m.closest('li').classList.toggle('navmenu-adjust-right-keyed', m.closest('li').getBoundingClientRect().right + m.closest('li').querySelector('.navmenu').clientWidth > window.innerWidth);
          };
          m.ontouchend = function(event){
            event.preventDefault();
            event.stopPropagation();
            _this.toggleItem(event.currentTarget.parentNode);
          }
        }),
        this.$el.querySelector('.navmenu-depth-1 > .navmenu-item:not([data-navmenu-ignore]) .navmenu-link').onfocus = function(event){
          _this.closeAll(event.currentTarget);
        },
        document.body.onfocusin = function(event){
          if (event.currentTarget instanceof Node && _this.el.contains(event.target)) return;
          _this.closeAll(_this.el);
        },
        this.$overlay.onclick = function(event){
          _this.postMessage('nav:close-triggers', {
            source: el
          });
          _this.closeAll();
          _this.hideOverlay();
        }
      ];
    }
    NavDesktop_createClass(NavDesktop, [{
      key: "showOverlay",
      value: function showOverlay() {
        this.$overlay.style.display = 'block';
      }
    }, {
      key: "hideOverlay",
      value: function hideOverlay() {
        this.$overlay.style.display = 'none';
      }
    }, {
      key: "openItem",
      value: function openItem(el,force) {
        this.postMessage('header-minicart:toggle', 'closed');
        var $el = el;
        var _this = {
          $el: $el.querySelector('ul')
        };
        this.closeAll(el);
        $el.querySelector('a').setAttribute('aria-expanded', true);
        this.postMessage('nav:close-triggers', {
          source: el
        });
        Revealer('show', force, _this);
        $el.classList.toggle('navmenu-adjust-right', _this.$el.getBoundingClientRect().right + el.querySelector('.navmenu').clientWidth > window.innerWidth);
        this.showOverlay();
      }
    }, {
      key: "closeAll",
      value: function closeAll(target) {
        var _this2 = this;
        this.$el.querySelectorAll('.navmenu-depth-1 > .navmenu-item-parent').forEach(function (el) {
          el.querySelectorAll('.navmenu-item-parent').forEach(function (submenu) {
            if (submenu !== target && submenu.contains(target)) return true;
            _this2.closeItem(submenu);
          });
          if (el !== target && el.contains(target)) return true;
          _this2.closeItem(el);
        });
        this.hideOverlay();
      }
    }, {
      key: "closeItem",
      value: function closeItem(el,force) {
        var _this = {
          $el: el.querySelector('.navmenu-submenu')
        };
        if (_this.$el != null) {        
          el.querySelector('a').setAttribute('aria-expanded', false);
          Revealer('hide', force, _this);
          this.hideOverlay();
        };
        if (this.isFirstLevel(el)) {
          this.hideOverlay();
        }
      }
    }, {
      key: "toggleItem",
      value: function toggleItem(el, force) {
        var $el = el;
        var _this = {
          $el: $el.querySelector('ul')
        };
        var menuNav3 = el.querySelectorAll('.navmenu-depth-3');        
        if (_this.$el.hasAttribute('data-revealer-visible')) {
          $el.querySelector('a').setAttribute('aria-expanded', false);
          Revealer('hide', force, _this);          
          removeTrapFocus($el);          
          setTimeout(function() {
            _this.$el.classList.remove('tabbing');
            menuNav3.forEach(function (m) {
              m.classList.remove('visible','tabbing');
            });
          }, 250);
        } else {
          _this.$el.classList.add('tabbing');
          menuNav3.forEach(function (m) {
            m.classList.add('visible','tabbing');
          });
          $el.querySelector('a').setAttribute('aria-expanded', true);
          Revealer('show', force, _this);
          trapFocus(el);
        }
      }
    }, {
      key: "isFirstLevel",
      value: function isFirstLevel(el) {
        var $el = el;
        return $el === '.navmenu-item' && $el.parentNode === '.navmenu-depth-1' || $el === '.navmenu-link' && $el.parentNode.parentNode === '.navmenu-depth-1';
      }
    }]);
    return NavDesktop;
  }();
  function Meganav_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function Meganav_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function Meganav_createClass(Constructor, protoProps, staticProps) { if (protoProps) Meganav_defineProperties(Constructor.prototype, protoProps); if (staticProps) Meganav_defineProperties(Constructor, staticProps); return Constructor; }
  var Meganav = function () {
    function Meganav(el, postMessage, trigger) {
      var _this = this;
      Meganav_classCallCheck(this, Meganav);
      this.$el = el;
      this.slider = this.$el.querySelector('[data-meganav="' + trigger + '"] .meganav-menu-panel').getAttribute('data-slider');
      this.$window = window;
      this.namespace = 'mega-nav-'.concat(trigger);
      this.trigger = trigger;
      this.postMessage = postMessage;
      this.navTrigger = new NavTrigger({
        el: el,
        namespace: this.namespace,
        trigger: this.trigger,
        postMessage: postMessage,
        onShow: function onShow() {
          _this.postMessage('nav:close-all', {});
          _this.postMessage('nav:close-triggers', {
            source: _this.$el
          });
          _this.postMessage('nav:show-overlay', {
            source: _this.$el
          });
        }
      });
      if (this.slider == 'true') {
        new Slideshow(this.$el.querySelector('[data-meganav="' + trigger + '"] .meganav-menu-panel'));
      }      
    }
    Meganav_createClass(Meganav, [{
      key: "onSectionUnload",
      value: function onSectionUnload() {
        this.navTrigger.unload();
        Layout.offBreakpointChange(this.layoutHandler);
      }
    }, {
      key: "onSectionMessage",
      value: function onSectionMessage(name, data) {
        if (name === 'nav:close-triggers' && data.source !== this.$el) {
          this.navTrigger.hide();
        }
        if (name === 'nav:show-overlay') {
          this.navTrigger.showOverlay();
        }
      }
    }]);
    return Meganav;
  }();
  function Header_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function Header_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function Header_createClass(Constructor, protoProps, staticProps) { if (protoProps) Header_defineProperties(Constructor.prototype, protoProps); if (staticProps) Header_defineProperties(Constructor, staticProps); return Constructor; }
  function Header(section) {
    var _this = this;
    Header_classCallCheck(this, Header);
    this.section = section;
    this.$el = section.el;
    if (document.selectors.sht > 0) {
      const observer = new IntersectionObserver( 
        ([e]) => e.target.classList.toggle('stuck', e.intersectionRatio < 1),
        { threshold: [1] }
      );      
      observer.observe(this.$el);
    }
    this.$mobileNavToggle = this.$el.querySelector('[data-mobilenav-toggle]');
    if (this.$mobileNavToggle) {
      this.mobileNav = new MobileNav(document.querySelector('.mobilenav'));
      this.events = [
        this.$mobileNavToggle.addEventListener('click', function(event) {
          _this.mobileNav.open();
        }),
      ];
      if (theme.mobileMenu != 'mobile' && !theme.edit) {
        this.nav = new NavDesktop(this.$el.querySelector('.site-navigation'), section.postMessage);
      }
    }
    if (this.$el.querySelector('.site-navigation .contact[data-meganav]')) {
      this.$contactbar = this.$el.querySelector('.site-navigation .contact[data-meganav]');
    } else {
      this.$contactbar = this.$el.querySelector('.mobilenav-contactbar[data-contactbar-mobile-target]');
    }
    if (!!this.$contactbar) {
      this.$contact = new ContactbarStaticSection(this.$contactbar, section.postMessage);
    }
    this.$search = this.$el.querySelector('[header-search-form-link]');
    this.$searchForm = this.$el.querySelector('[header-search-form]');
    if (this.$search) {
      var i = this.$searchForm.querySelector('input');
      this.$search.onclick = function(event){
        event.preventDefault();
        if (_this.$searchForm.classList.contains('engaged')) {
          _this.$search.focus();
          i.setAttribute('aria-hidden', 'true');
          i.setAttribute('tab-index', '-1');
        } else {
          setTimeout(function() {
            i.focus();
          }, 500);
          i.setAttribute('aria-hidden', 'false');
          i.setAttribute('tab-index', '0');
        }
        _this.$searchForm.classList.toggle('engaged');
      }
    }
    if(this.$el.querySelector('header').getAttribute('data-search') == 'true'){
      this.$predictive_search = new Predictive_Search(this.$searchForm, section.postMessage);
    }
    this.$megaNavTriggers = this.$el.querySelectorAll('.site-navigation [data-meganav-trigger]');
    this.$megaNavs = this.$el.querySelectorAll('.site-navigation [data-meganav]');
    this.megaNavs = [];
    this.$megaNavTriggers.forEach(function (key, megaNavTrigger) {
      var trigger = key.dataset.meganavTrigger;
      const mN = Array.from(_this.$megaNavs);
      const $megaNav = mN.find(obj => obj.dataset.meganav === trigger);
      _this.megaNavs.push(new Meganav($megaNav, _this.section.postMessage, trigger));
    });
    this.layoutHandler = this.onBreakpointChange.bind(this);
    Layout.onBreakpointChange(this.layoutHandler);
  };
  Header_createClass(Header, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.mobileNav) {
        this.mobileNav.unload();
      }
      Layout.offBreakpointChange(this.layoutHandler);
      this.megaNavs.forEach(function (megaNav) {
        return megaNav.onSectionUnload();
      });
    }
  }, {
    key: "onSectionMessage",
    value: function onSectionMessage(name, data) {
      if (name === 'mobilenav:open') this.mobileNav.open();
      if (name === 'mobilenav:close') this.mobileNav.close();
      if (name === 'cart:update') {
        this.$el.querySelector('[data-cart-item-count]').textContent = data.item_count;
      }
      if (name === 'nav:close-all') this.nav.closeAll();
      this.megaNavs.forEach(function (megaNav) {
        return megaNav.onSectionMessage(name, data);
      });
    }
  }, {
    key: "onBreakpointChange",
    value: function onBreakpointChange() {
      if (!Layout.isBreakpoint('S')) {        
        if (this.mobileNav) {
          this.mobileNav.close();
        }
        body.classList.add('isDesktop');
        body.classList.remove('isMobile');      
        if(theme.mobileMenu != 'mobile') {
          body.classList.remove('isMobileMenu');
        }
      } else {
        body.classList.add('isMobile');
        if(theme.mobileMenu != 'mobile') {
          body.classList.add('isMobileMenu');
        }
        body.classList.remove('isDesktop');
      }
    }
  }, {
    key: "onSectionSelect",
    value: function onSectionSelect(name, data) {
      var d = name.el.querySelector('header').getAttribute('data-mobile');
      theme.edit = true;
      Check_Header(d);
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(event,force) {
      event.$el = event.el;
      Revealer('show', force, event);
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect(event,force) {
      event.$el = event.el;
      Revealer('hide', force, event);
    }
  }]);
  return Header;
})();
function MeganavMenu_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function MeganavMenu_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function MeganavMenu_createClass(Constructor, protoProps, staticProps) { if (protoProps) MeganavMenu_defineProperties(Constructor.prototype, protoProps); if (staticProps) MeganavMenu_defineProperties(Constructor, staticProps); return Constructor; }
var MeganavMenu = function () {
  function MeganavMenu(el) {
    var _this = this;
    MeganavMenu_classCallCheck(this, MeganavMenu);
    this.$el = el;
    this.$megaNavHeaders = this.$el.querySelectorAll('.meganav-menu-header');
    this.$megaNavHeaders.forEach(function (m) {
      m.onclick = function(event){
        var $header = event.currentTarget;
        if (!$header.classList.contains('meganav-menu-empty') && !$header.classList.contains('navmenu-link-meganav')) {
          _this.toggleList($header, event);
        }
      }
      var a = m.querySelector('.navmenu-arrow-toggle');
      if (a) {
        a.onclick = function(event){
          event.preventDefault();
          event.stopPropagation();
          var $header = event.currentTarget;
          _this.arrowToggle($header);
        }
      }
    });
  }
  MeganavMenu_createClass(MeganavMenu, [{
    key: "toggleList",
    value: function toggleList($header, state, force) {
      var $group = $header.closest('.meganav-menu-group');
      if ($group.classList.contains('meganav-menu-active')) {
        return true;
      } else {
        state.preventDefault();
        var $list = $group.querySelector('.meganav-menu-items');
        $group.classList.toggle('meganav-menu-active', state);
        var _this = {
          $el: $list
        };
        Revealer('show', force, _this);
      }
    }
  }, {
    key: "arrowToggle",
    value: function arrowToggle($header, force) {
      var $group = $header.closest('.meganav-menu-group');
      var $list = $group.querySelector('.meganav-menu-items');
      $group.classList.toggle('meganav-menu-active');
      var _this = {
        $el: $list
      };
      if ($list.hasAttribute('data-revealer-visible')) {
        Revealer('hide', force, _this);
      } else {
        Revealer('show', force, _this);
      }
    }
  }]);
  return MeganavMenu;
}();
function PredSear_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function PredSear_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function PredSear_createClass(Constructor, protoProps, staticProps) { if (protoProps) PredSear_defineProperties(Constructor.prototype, protoProps); if (staticProps) PredSear_defineProperties(Constructor, staticProps); return Constructor; }
var Predictive_Search = function () {
  function Predictive_Search(el) {
    var _this = this;
    PredSear_classCallCheck(this, Predictive_Search);
    var pS = JSON.parse(document.getElementById('shopify-features').textContent);
    function debounce(fn, wait) {
      let t;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
      };
    }
    class PredictiveSearch extends HTMLElement {
      constructor() {
        super();
        this.cachedResults = {};
        this.input = this.querySelector('input[type="text"]');
        this.predictiveSearchResults = this.querySelector('[data-predictive-search]');
        this.predictiveSearchResultsTop = this.getBoundingClientRect().top;
        this.isOpen = false;
        this.setupEventListeners();
      }
      setupEventListeners() {
        const form = this.querySelector('form.search');
        const btn = this.querySelector('[data-predictive-search-dismiss]');
        const ps = this;    
        form.addEventListener('submit', this.onFormSubmit.bind(this));
        this.input.addEventListener('input', debounce((event) => {
          this.onChange(event);
        }, 300).bind(this));
        this.input.addEventListener('focus', this.onFocus.bind(this));
        this.addEventListener('focusout', this.onFocusOut.bind(this));
        btn.addEventListener('click', function(ev) {
          ps.close();
          ev.preventDefault();
        }, false);
      }
      getQuery() {
        return this.input.value.trim();
      }
      onChange() {
        const searchTerm = this.getQuery();
        if (!searchTerm.length) {
          this.close(true);
          return;
        }
        this.getSearchResults(searchTerm);
      }
      onFormSubmit(event) {
        if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
      }
      onFocus() {
        const searchTerm = this.getQuery();
        if (!searchTerm.length) return;
        if (this.getAttribute('results') === 'true') {
          this.open();
        } else {
          this.getSearchResults(searchTerm);
        }
      }
      onFocusOut() {
        setTimeout(() => {if (!this.contains(document.activeElement)) this.close();})
      }
      selectOption() {
        const selectedProduct = this.querySelector('[aria-selected="true"] a, [aria-selected="true"] button');
        if (selectedProduct) selectedProduct.click();
      }
      getSearchResults(searchTerm) {
        const queryKey = searchTerm.replace(" ", "-").toLowerCase();
        if (this.cachedResults[queryKey]) {
          this.renderSearchResults(this.cachedResults[queryKey]);
          return;
        }
        const search_limit = this.predictiveSearchResults.getAttribute('data-search-limit');
        const search_fields = this.predictiveSearchResults.getAttribute('data-search-fields');
        if (pS.predictiveSearch == true) {
          var URL = window.theme.routes.predictive_search_url + '?&q=' + encodeURIComponent(searchTerm) + '&section_id=predictive-search&' + encodeURIComponent('resources[fields]') + '=' + search_fields + '&' + encodeURIComponent('resources[limit]') + '=' + search_limit;
          } else {
          var URL = window.theme.routes.search_url + '?&q=' + encodeURIComponent(searchTerm) + '&section_id=predictive-search&options[prefix]=last';
        }
        fetch(URL)
        .then((response) => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
            throw error;
          }
          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
          this.cachedResults[queryKey] = resultsMarkup;
          this.renderSearchResults(resultsMarkup);
        })
        .catch((error) => {
          this.close();
          throw error;
        });
      }
      renderSearchResults(resultsMarkup) {
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.setAttribute('results', true);
        this.setLiveRegionResults();
        this.open();
      }
      setLiveRegionResults() {
        this.removeAttribute('loading');
      }
      getResultsMaxHeight() {
        this.resultsMaxHeight = window.innerHeight - this.getBoundingClientRect().top - 80;          
        return this.resultsMaxHeight;
      }
      open() {
        this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`;
        this.querySelector('[data-predictive-search-list]').style.maxHeight = `${this.getResultsMaxHeight()}px`;
        this.setAttribute('open', true);
        this.input.setAttribute('aria-expanded', true);
        this.isOpen = true;
        this.querySelector('form.search').classList.add('active');
      }
      close(clearSearchTerm = false) {
        if (clearSearchTerm) {
          this.input.value = '';
          this.removeAttribute('results');      
        }    
        this.querySelector('form.search').classList.remove('open');
        const selected = this.querySelector('[aria-selected="true"]');
        if (selected) selected.setAttribute('aria-selected', false);
        this.input.setAttribute('aria-activedescendant', '');
        this.removeAttribute('open');
        this.input.setAttribute('aria-expanded', false);
        this.resultsMaxHeight = false;
        this.querySelector('form.search').classList.remove('active', 'visible');
        this.predictiveSearchResults.removeAttribute('style');
        this.isOpen = false;
      }
    }
    if (!customElements.get('predictive-search')) { 
      customElements.define('predictive-search', PredictiveSearch); 
    }
  };
  return Predictive_Search;
}();