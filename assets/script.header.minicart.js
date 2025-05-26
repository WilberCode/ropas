HeaderMiniCart = (function() {
  function HeaderMiniCart_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function HeaderMiniCart_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function HeaderMiniCart_createClass(Constructor, protoProps, staticProps) { if (protoProps) HeaderMiniCart_defineProperties(Constructor.prototype, protoProps); if (staticProps) HeaderMiniCart_defineProperties(Constructor, staticProps); return Constructor; }
  function HeaderMiniCart(section) {
    var _this = this;
    HeaderMiniCart_classCallCheck(this, HeaderMiniCart);    
    this.section = section;
    this.$el = section.el;
    this.el = section.el;
    this.$header = document.querySelector('.site-header');
    this.$drawer = this.$el.querySelector('[data-header-minicart-drawer]');
    this.$drawerItems = this.$el.querySelector('[data-cart-items]');
    this._toggleDrawer = this._toggleDrawer.bind(this);
    this.$title = this.$el.querySelector('[data-header-minicart-title]');
    this.titleText = this.$title.getAttribute('data-header-minicart-title');
    this.$cartButton = document.querySelector('[data-site-actions-cart]');
    if (!this.$cartButton) {
      return;
    }
    this.open = false;
    this.events = [
      this.$el.querySelector('[data-site-header-minicart-dismiss]').onclick = function(event){
        return _this._toggleDrawer('closed');
      },
      this.$drawer.ontouchmove = function(event){
        event.stopPropagation();
      },
      window.addEventListener('resize', (function () {
        return _this._setMaxDrawerHeight();
      })),
      this.$cartButton.onclick = function(event){
        theme.header_cart = _this.$cartButton;
        event.preventDefault();
        event.stopPropagation();
        _this._toggleDrawer('button');
      }
    ];
    Layout.onBreakpointChange(function () {
      return _this._toggleDrawer('closed');
    });
    Cart.addCart(section, section.postMessage);
  };
  HeaderMiniCart_createClass(HeaderMiniCart, [{
    key: "_calculateMaxHeight",
    value: function _calculateMaxHeight() {
      var _document$querySelect = document.querySelector('.site-header').getBoundingClientRect(),
          headerTop = _document$querySelect.top,
          headerHeight = _document$querySelect.height,
          drawerOffset = Math.max(headerHeight + headerTop, 0);
      return drawerOffset;
    }
  },{
    key: "_calculateMaxDrawerHeight",
    value: function _calculateMaxDrawerHeight() {
      return "calc(100vh - ".concat(this._calculateMaxHeight(), "px)");
    }
  },{
    key: "_calculateMaxItemsHeight",
    value: function _calculateMaxItemsHeight() {
      var h = this.$el.querySelector('.header-minicart-header').offsetHeight,
          f = this.$el.querySelector('.header-minicart-footer').offsetHeight;
      if (Layout.isBreakpoint('L')) {        
        var itemOffset = Math.max(this._calculateMaxHeight() + h + f + 20, 0);
        return "calc(100vh - ".concat(itemOffset, "px)");
      } else {
        var itemOffset = Math.max(window.innerHeight - h - f - 20, 0);
        return itemOffset + 'px';
      }
    }
  }, {
      key: "_setScrollLock",
      value: function _setScrollLock() {
        if (!this.open) {
          return;
        }
        if (!Layout.isBreakpoint('L')) {
          ScrollLock.lock(this.$drawer);
          return;
        }
        var _this$$drawer$ = this.$drawer,
            scrollHeight = _this$$drawer$.scrollHeight,
            clientHeight = _this$$drawer$.clientHeight;
        ScrollLock.lock(this.$drawer);
      }
    }, {
      key: "_setMaxDrawerHeight",
      value: function _setMaxDrawerHeight() {
        var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        if (!this.open && !force) {
          return;
        }
        if (Layout.isBreakpoint('L')) {
          this.$drawer.style.maxHeight = this._calculateMaxDrawerHeight();
          this.$drawerItems.style.maxHeight = this._calculateMaxItemsHeight();
        } else {
          this.$drawer.style.maxHeight = "".concat(window.innerHeight, "px");
          this.$drawerItems.style.maxHeight = this._calculateMaxItemsHeight();
        }        
      }
    }, {
      key: "_unsetMaxDrawerHeight",
      value: function _unsetMaxDrawerHeight() {
        this.$drawer.style.maxHeight = '0';
      }
    }, {
      key: "_refreshCart",
      value: function _refreshCart() {
        var _this3 = this;
        this.$drawer.classList.add('loading');
        Cart.update().then(function () {
          _this3._onMiniCartUpdate();
          _this3._setScrollLock();
        });
      }
    }, {
      key: "_openDrawer",
      value: function _openDrawer() {
        var _this4 = this;
        this.$cartButton.setAttribute('aria-expanded', true);
        this._setMaxDrawerHeight(true);
        this.$drawer.closest('.header-minicart').classList.add('open');
        this._addClickToCloseEvents();
        this.open = true;
        _this4._setScrollLock();
      }
    }, {
      key: "_toggleDrawer",
      value: function _toggleDrawer(requestedState) {
        var _this5 = this;
        if (requestedState === 'open' && this.open) {
          this._refreshCart();
          return;
        }
        if (requestedState === 'closed' && !this.open) {
          return;
        }
        if (this.open) {
          this.$cartButton.setAttribute('aria-expanded', false);
          this.$header.classList.remove('mini-open');
          _this5.section.postMessage('header-minicart:close');
          this.$drawer.closest('.header-minicart').classList.remove('open');
          this._unsetMaxDrawerHeight();
          ScrollLock.unlock();
          this.open = false;
          removeTrapFocus(_this5.$drawer);
          if (theme.header_cart) {
            theme.header_cart.focus();
          }
        } else {
          this.$cartButton.setAttribute('aria-expanded', true);
          this.$header.classList.add('mini-open');
          var waitingOnTransition = false;
          this.section.postMessage('header-minicart:open', function (transitionEnded) {
            waitingOnTransition = true;
            _this5._refreshCart();
            transitionEnded.done(function () {
              return _this5._openDrawer();
            });
          });
          if (!waitingOnTransition) {            
            if (requestedState !== 'button') {
              this._refreshCart();
            }
            this._openDrawer();
            trapFocus(_this5.$drawer);
          }
        }
      }
    }, {
      key: "_addClickToCloseEvents",
      value: function _addClickToCloseEvents() {
        var _this6 = this;
        window.onclick = function(event){
          return _this6._toggleDrawer('closed');
        };
        this.$drawer.onclick = function(event){
          return event.stopPropagation();
        };
      }
    }, {
      key: "_onMiniCartUpdate",
      value: function _onMiniCartUpdate() {
        this.$drawer.classList.remove('loading');
      }
    }, {
      key: "_updateMiniCartTotals",
      value: function _updateMiniCartTotals(cartData) {
        var _this = this;
        if (cartData.item_count == 0) {
          this.$drawer.classList.add('minicart-cart-empty');
          return;
        }
        this.$drawer.classList.remove('minicart-cart-empty');
        this.$title.textContent = "".concat(this.titleText, " (").concat(cartData.item_count, ")");
      }
    }, {
      key: "onSectionSelect",
      value: function onSectionSelect() {
        this.section.postMessage('header-minicart:toggle');        
      }
    }, {
      key: "onSectionDeselect",
      value: function onSectionSelect() {
        return this._toggleDrawer('closed');
      }
    }, {
      key: "onSectionUnload",
      value: function onSectionUnload() {
        Cart.unload();
      }
    }, {
      key: "onSectionMessage",
      value: function onSectionMessage(name, data) {
        if (name === 'cart:update') {
          this._updateMiniCartTotals(data);
        }
        if (name === 'header-minicart:refresh') {
          this._refreshCart();
        }
        if (name === 'header-minicart:toggle') {
          this._toggleDrawer(data);
        }
        if (name === 'header-minicart:set-open') {
          this._toggleDrawer('open');
        }
      }
    }]);
  return HeaderMiniCart;
})();
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'header_minicart' && !sectionContainer.classList.contains('ignore')){
    sections.register('header_minicart', function (section) {
      return new HeaderMiniCart(section);
    });
    sectionContainer.classList.add('ignore');
  }
})