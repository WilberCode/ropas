Product = (function() {
  function ProductOptions_toConsumableArray(arr) { return ProductOptions_arrayWithoutHoles(arr) || ProductOptions_iterableToArray(arr) || ProductOptions_unsupportedIterableToArray(arr) || ProductOptions_nonIterableSpread(); }
  function ProductOptions_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
  function ProductOptions_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ProductOptions_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ProductOptions_arrayLikeToArray(o, minLen); }
  function ProductOptions_iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }
  function ProductOptions_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return ProductOptions_arrayLikeToArray(arr); }
  function ProductOptions_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function ProductOptions_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductOptions_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductOptions_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductOptions_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductOptions_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductOptions = function () {
    function ProductOptions(product) {
      ProductOptions_classCallCheck(this, ProductOptions);
      this.productHandle = product.handle;
      this.optionsCount = product.options.length;
      this.variants = product.variants;
    }
    ProductOptions_createClass(ProductOptions, [{
      key: "getVariantFromOptions",
      value: function getVariantFromOptions(options) {
        var variant = null;
        this.variants.forEach(function (potentialVariant) {
          var found = true;
          for (var i = 0; i < potentialVariant.options.length; i++) {
            if (options[i] !== potentialVariant.options[i]) {
              found = false;
            }
          }
          if (found) {
            variant = potentialVariant;
          }
        });
        return variant || false;
      }
    }, {
      key: "getClosestVariantFromOptions",
      value: function getClosestVariantFromOptions(options) {
        var closestVariant = null;
        var matchingValues = 0;
        this.variants.forEach(function (variant) {
          var tempMatchingValues = 0;
          for (var i = 0; i < variant.options.length; i++) {
            if (variant.available && options[i] === variant.options[i]) {
              tempMatchingValues++;
            } else {
              break;
            }
          }
          if (tempMatchingValues >= matchingValues) {
            closestVariant = variant;
            matchingValues = tempMatchingValues;
          }
        });
        return closestVariant ? closestVariant : false;
      }
    }, {
      key: "getVariantOrClosestFromOptions",
      value: function getVariantOrClosestFromOptions(options) {        
        return this.getVariantFromOptions(options) || this.getClosestVariantFromOptions(options);
      }
    }]);
    return ProductOptions;
  }();
  function VariantHelper_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function VariantHelper_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function VariantHelper_createClass(Constructor, protoProps, staticProps) { if (protoProps) VariantHelper_defineProperties(Constructor.prototype, protoProps); if (staticProps) VariantHelper_defineProperties(Constructor, staticProps); return Constructor; }
  var VariantHelper = function () {
    function VariantHelper(product, $variants, $options, $form) {
      VariantHelper_classCallCheck(this, VariantHelper);
      var _this = this;
      this.product = product;
      this.optionsCount = this.product.options.length;
      this.$variants = $variants;
      this.$options = $options;
      this.$form = $form;
      this.productOptions = new ProductOptions(this.product);
      this.optionsTypes = {
        select: 'select-one',
        radio: 'radio'
      };
      this._bindEvents();
      if (this.$options.length) {
        if (this.$options[0].type === this.optionsTypes.select) {
          this.optionsType = this.optionsTypes.select;
        } else if (this.$options[0].type === this.optionsTypes.radio) {
          this.optionsType = this.optionsTypes.radio;
        } else {
          this._unbindEvents();
        }
      } else {
        this.optionsType = null;
      }
      this._switchVariant(true);
    }
    VariantHelper_createClass(VariantHelper, [{
      key: "_bindEvents",
      value: function _bindEvents() {
        var _this = this;
        this.$options.forEach(function (o) {
          o.onchange = function(){
            var f = o;
            return _this._switchVariant(f);
          };
        });
      }
    }, {
      key: "_switchVariant",
      value: function _switchVariant(f, force) {
        var _this = this;
        var firstLoad = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var options = [];
        var product = this.product;
        var variant = null;
        if (this.optionsType === this.optionsTypes.select) {
          this.$options.forEach(function (i, option) {
            options.push(i.value);
          });
        } else if (this.optionsType === this.optionsTypes.radio) {
          this.$options.forEach(function (option) {
            if (option.checked) {
              options.push(option.value);
            }
          });
        } else {
          return;
        }
        variant = this.productOptions.getVariantOrClosestFromOptions(options);
        if (this.optionsType === this.optionsTypes.select) {
          this._switchVariantSelect(variant);
        } else if (this.optionsType === this.optionsTypes.radio) {
          this._switchVariantRadio(variant,f);
        } else {
          return;
        }
        this.$variants.value = variant.id;
        var isProduct = function isProduct(compareProduct) {
          return compareProduct === product;
        };
        let event = new CustomEvent('product-variant-switch', {
          detail: {
            product: product,
            variant: variant,
            firstLoad: firstLoad,
            isProduct: isProduct
          }
        });
        window.dispatchEvent(event);
      }
    }, {
      key: "_switchVariantSelect",
      value: function _switchVariantSelect(variant) {
        var _this2 = this;
        let availableOptions = this.productOptions.variants;
        var $optionEls = this.$form.querySelectorAll('[data-product-options] .option option');
        $optionEls.forEach(function (o) {
          o.disabled = true;
        });
        for (var i = 0; i < this.product.options.length; i++) {
          for (const v of _this2.product.options[i].values) {
            let s = _this2.$form.querySelector('.option-' + [i+1] + ' option[value="' + v.replace(/["\\]/g, '\\$&') + '"]');
            if (v === variant.options[i]) {
              s.disabled = false;
              s.selected = true;
            }
            for (const o of availableOptions) {
              if (o.options[0] == v && o.available) {
                s.disabled = false;
              }
              if (o.options[1] && v === variant.options[0] && v === o.options[0] && o.available) {
                let sO = _this2.$form.querySelector('.option-2 option[value="' + o.options[1].replace(/["\\]/g, '\\$&') + '"]');
                if (sO) {
                  sO.disabled = false;
                } 
              }
              if (o.options[2] && variant.options[0] === o.options[0] && v === variant.options[1] && v === o.options[1] && o.available) {
                let sO = _this2.$form.querySelector('.option-3 option[value="' + o.options[2].replace(/["\\]/g, '\\$&') + '"]');
                if (sO) {
                  sO.disabled = false;
                } 
              }              
            }            
          }
        }
      }
    }, {
      key: "_switchVariantRadio",
      value: function _switchVariantRadio(variant,f) {
        var _this3 = this;
        let availableOptions = this.productOptions.variants;
        this.$options.forEach(function (o) {
          o.disabled = true;
          o.checked = false;
          o.parentNode.classList.add('option-soldout');
          o.parentNode.classList.remove('option-selected','focused','swatch');
          o.parentNode.classList.add('option-disabled');
          o.onkeyup = function (e) {
            switch (e.key) {
              case 'Tab':
                o.parentNode.classList.add('focused','swatch');
                break;
              case 'ArrowUp':
                o.parentNode.classList.add('focused','swatch');
                break;
              case 'ArrowDown':
                o.parentNode.classList.add('focused','swatch');
                break;
              case 'ArrowLeft':
                o.parentNode.classList.add('focused','swatch');
                break;
              case 'ArrowRight':
                o.parentNode.classList.add('focused','swatch');
            }
          };
          o.onblur = function(s){
            o.parentNode.classList.remove('focused','swatch');        
          };
        });
        for (var i = 0; i < this.product.options.length; i++) {
          for (const v of _this3.product.options[i].values) {
            let s = _this3.$form.querySelector('.option-' + [i+1] + ' input[value="' + v.replace(/["\\]/g, '\\$&') + '"]');
            if (v === variant.options[i]) {
              s.checked = true;
              s.parentNode.classList.add('option-selected');
            }
            for (const o of availableOptions) {
              if (o.options[0] == v && o.available) {
                s.removeAttribute('disabled');
                s.parentNode.classList.remove('option-soldout');
                s.parentNode.classList.remove('option-disabled');
              }
              if (o.options[1] && v === variant.options[0] && v === o.options[0] && o.available) {
                let sO = _this3.$form.querySelector('.option-2 input[value="' + o.options[1].replace(/["\\]/g, '\\$&') + '"]');
                sO.removeAttribute('disabled');
                sO.parentNode.classList.remove('option-soldout');
                sO.parentNode.classList.remove('option-disabled');
              }
              if (o.options[2] && variant.options[0] === o.options[0] && v === variant.options[1] && v === o.options[1] && o.available) {
                let sO = _this3.$form.querySelector('.option-3 input[value="' + o.options[2].replace(/["\\]/g, '\\$&') + '"]');
                sO.removeAttribute('disabled');
                sO.parentNode.classList.remove('option-soldout');
                sO.parentNode.classList.remove('option-disabled');
              }
            }
          }
        }
        if (f != true) {
          f.focus();
        }
      }
    }, {
      key: "isDefault",
      value: function isDefault() {
        if (this.product.variants[0].title === 'Default Title' && this.product.variants[0].option1 === 'Default Title') {
          return true;
        }
        return false;
      }
    }, {
      key: "getSelectedVariant",
      value: function getSelectedVariant() {
        if (this.isDefault()) {
          return this.product.variants[0];
        }
        var options = [];
        if (this.optionsType === this.optionsTypes.select) {
          this.$options.forEach(function (i, option) {
            options.push(i.value);
          });
        } else if (this.optionsType === this.optionsTypes.radio) {
          this.$options.forEach(function (option) {
            if (option.checked) {
              options.push(option.value);
            }
          });
        } else {
          return null;
        }
        return this.productOptions.getVariantFromOptions(options);
      }
    }]);
    return VariantHelper;
  }();
  function ProductForm_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductForm_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductForm_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductForm_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductForm_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductForm = function () {
    function ProductForm(el) {
      var _this = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      ProductForm_classCallCheck(this, ProductForm);
      this.$el = options.container || el;
      this.$form = options.form || el;
      this.options = options;
      this.product = options.product;
      this.product.options = options.productVariants;
      this.postMessage = this.options.postMessage;
      this.isThemeEditor = window.Shopify && window.Shopify.designMode;
      this.useHistory = options.useHistory && !this.isThemeEditor && window.history && history.replaceState;
      this.events = [];
      this.$atc = this.$el.querySelector('[data-product-atc]');
      if (this.$atc) {
        this.events.push(
          this.$atc.onclick = function(event){
            if (_this.options.enableCartRedirection || !document.querySelector('header')) {
              _this.$form.submit();
              return;
            }
            event.preventDefault();
            _this._addToCart();
          },
          window.addEventListener('product-variant-switch', function(event, data) {
            var data = event.detail;
            _this._changeVariant(data);
            
          })
        )
      }      
      this.$options = this.$el.querySelectorAll('[data-product-option]');
      this.$variants = this.$el.querySelector('[data-variants]');
      this.variantHelper = new VariantHelper(this.options.product, this.$variants, this.$options, this.$form);
      if (this.$el.querySelector('[data-quantity]')) {
        this.quantity = new Quantity(this.$el.querySelector('[data-quantity]'));
        this.events.push(
          this.quantity.input.onchange = function(event){
            if (_this.options.onQuantityChange) {
              _this.options.onQuantityChange(_this.variantHelper.getSelectedVariant(), _this.quantity.value);
            }
          }
        );
      } else {
        this.quantity = this.$el.querySelector('[data-quantity-hidden]'); 
      }
    }
    ProductForm_createClass(ProductForm, [{
      key: "unload",
      value: function unload() {      
      }
    }, {
      key: "_changeVariant",
      value: function _changeVariant(data) {
        if (data.firstLoad == true || this.product !== data.product) {
          return;
        }        
        document.dispatchEvent(new CustomEvent('_changeVariant', {
          bubbles: true
        }));    
        var variant = data.variant;
        this._changeUrl(variant);
        if (this.options.onVariantChange) {
          this.options.onVariantChange(variant);
        }
      }
    }, {
      key: "_changeUrl",
      value: function _changeUrl(variant) {
        if (!this.useHistory) {
          return;
        }
        p = {
          variant: variant.id
        }
        params = Object.keys(p).map(function(k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(p[k])
        }).join('&');
        var url = "".concat(this.options.product.handle, "?").concat(params);
        history.replaceState({}, 'variant', url);
      }
    }, {
      key: "_addToCart",
      value: function _addToCart() {
        var _this3 = this;
        if (this.options.onAddToCart) {
          this.options.onAddToCart();
        }
        const formData = new FormData(this.$form);
        fetch(window.theme.routes.cart_add_url + '.js', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: formData
        }).then(function(r) {        
          return r.json();        
        }).then(function(j) {
          if (j.status) {
            if (_this3.options.onError) {
              var responseText = {};
              try {
                responseText = j;
              } catch (error) {
                responseText.description = window.theme.cartAddError;
              }
              var error = responseText.description;
              _this3.options.onError(j, error);
            }
            return;
          }
          _this3._updateCart();
          if (_this3.options.onSuccess) {
            _this3.options.onSuccess(j, _this3.quantity.value);
          }
        }).catch(function(err) {
          console.error('!: ' + err)
        });
      }
    }, {
      key: "_updateCart",
      value: function _updateCart() {
        var _this4 = this;
        fetch(window.theme.routes.cart_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(function(r) {        
          return r.json();        
        }).then(function(j) { 
          _this4.postMessage('product:add-to-cart', {
            response: j
          });
          if (!document.querySelector('[data-header-minicart]')) {
            document.querySelector('[data-cart-item-count] ').textContent = "".concat(j.item_count);
          }
        }).catch(function(err) {
          console.error('!: ' + err)
        });
      }
    }]);
    return ProductForm;
  }();
  function ProductMenu_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductMenu_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductMenu_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductMenu_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductMenu_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductMenu = function () {
    function ProductMenu(_ref) {
      var _this = this;
      var el = _ref.el,
          section = _ref.section,
          productEl = _ref.productEl,
          data = _ref.data,
          postMessage = _ref.postMessage
      ProductMenu_classCallCheck(this, ProductMenu);
      this.el = el;
      this.data = data;
      this.postMessage = postMessage;
      this.minimized = false;
      this.states = {
        selectOptions: 'selectoptions',
        addToCart: 'addtocart',
        addToCartSuccess: 'addtocart-success'
      };
      this.dismissButton = this.el.querySelector('[data-product-menu-slideout-dismiss]');
      this.selectOptionsButton = this.el.querySelector('[data-product-menu-button="selectoptions"]');
      this.addToCartButton = this.el.querySelector('[data-product-menu-button="addtocart"]');
      this.slideout = this.el.querySelector('[data-product-menu-slideout]');
      this.$el = this.slideout;
      this.$slideout = this.slideout;
      this.defaultDesktopState = this.el.getAttribute('data-product-menu-desktop-default-state');
      this.defaultMobileState = this.el.getAttribute('data-product-menu-mobile-default-state');
      this.currentState = Layout.isBreakpoint('M') ? this.defaultDesktopState : this.defaultMobileState;
      this.form = new ProductForm(this.el, {
        product: this.data.product,
        productVariants: this.data.product_variants,
        form: _ref.productEl.querySelector('[data-product-form-inline]'),
        productEl: productEl,
        moneyFormat: window.theme.moneyFormat,
        postMessage: postMessage,
        useHistory: this.data.use_history,
        enableCartRedirection: this.data.enable_cart_redirection,
        onSuccess: function onSuccess(response, quantity) {
          return _this._onAtcSuccess(response, quantity);
        },
        onError: function onError(response, error) {
          return _this._onAtcError(response, error);
        },
        onVariantChange: function onVariantChange(variant) {
          return _this._onVariantChange(variant);
        },
        onQuantityChange: function onQuantityChange(variant, quantity) {
          return _this._onQuantityChange(variant, quantity);
        },
        onAddToCart: function onAddToCart() {
          return _this._onAddToCart();
        }
      });
      this.$productMenuButtonAddToCartPrice = this.el.querySelector('[data-product-menu-button-addtocart-price]');
      this.$productAtcFailureMessage = {
        msg: this.el.querySelector('[data-product-menu-addtocart-failure-message]'),
        $el: this.el.querySelector('[data-product-menu-addtocart-failure-message]')
      }
      this.revertToDefaultState = function () {
        return _this._revertToDefaultState();
      };
      this.changeToAddToCartState = function () {
        return _this._changeState(_this.states.addToCart);
      };
      this._setMaxHeight = this._setMaxHeight.bind(this);
      this._setScrollLock = this._setScrollLock.bind(this);
      this._allowTouchMove = function (event) {
        return event.stopPropagation();
      };
      this._submitCheckoutForm = function (e) {
        var currentTarget = e.currentTarget.cloneNode();
        var form = document.createElement('form');
        form.action = currentTarget.dataset.action;
        form.method = 'POST';
        form.style.display = 'None';
        currentTarget.type = 'submit';
        form.appendChild(currentTarget);
        document.body.appendChild(form);
        currentTarget.click();
      };
      this._onVariantChange(this.form.variantHelper.getSelectedVariant());
      let event = new CustomEvent('product-variant-switch', {
        detail: {
          variant: this.form.variantHelper.getSelectedVariant(),
          product: this.data.product
        }
      });
      Layout.onBreakpointChange(this.revertToDefaultState);
      this.dismissButton.addEventListener('click', this.revertToDefaultState);
      this.selectOptionsButton.addEventListener('click', this.changeToAddToCartState);
      this.el.addEventListener('touchmove', this._allowTouchMove);
      this._setMaxHeight();
      window.addEventListener('resize', this._setMaxHeight);
      Cart.addCart(_ref, this.postMessage);
    }
    ProductMenu_createClass(ProductMenu, [{
      key: "_setScrollLock",
      value: function _setScrollLock() {
        if (this.el.clientHeight >= window.innerHeight) {
          ScrollLock.lock(this.el);
        } else {
          ScrollLock.unlock();
        }
      }
    }, {
      key: "_touchstop",
      value: function _touchstop(event) {
        event.stopPropagation();
      }
    }, {
      key: "_changeState",
      value: function _changeState(state, force) {
        var _this2 = this;
        var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        this.el.removeEventListener('touchstart', _this2._touchstop);
        this.el.removeEventListener('touchend', _this2._touchstop);
        var isDesktop = Layout.isBreakpoint('M');
        if (animate) {
          Revealer('hide', force, this);
          removeTrapFocus(this.$el);          
          _this2.currentState = state;
          _this2.el.setAttribute('data-product-menu-state', state);
          if (state == 'addtocart') {
            _this2.el.classList.remove('product-menu-success');
            _this2.el.classList.add('product-menu-add');
          } else if (state =='addtocart-success') {
            this.postMessage('header-minicart:refresh');
            this.postMessage('header-minicart:set-open');
            return
          } else {
            setTimeout(function () {
              _this2.el.classList.remove('product-menu-add','product-menu-success')
            }, 500);
          }          
          var slideoutContent = _this2.el.querySelector("[data-product-menu-slideout-state=\"".concat(state, "\"]"));
          if (!slideoutContent) {
            _this2._setScrollLock();
            return;
          }          
          var shouldShowSlideout = !isDesktop && !slideoutContent.hasAttribute('data-product-menu-mobile-slideout-hidden') || isDesktop && !slideoutContent.hasAttribute('data-product-menu-desktop-slideout-hidden');
          if (shouldShowSlideout) {
            Revealer('show', force, this);
            trapFocus(this.$el);
            _this2.$slideout.classList.add('product-menu-slideout-visible');
            complete: _this2._setScrollLock
          } else {
            _this2._setScrollLock();
          }
        } else {
          this.currentState = state;
          this.el.setAttribute('data-product-menu-state', state);
          window.requestAnimationFrame(this._setScrollLock);
        }
        this.el.addEventListener('touchstart', _this2._touchstop);
        this.el.addEventListener('touchend', _this2._touchstop);
      }
    }, {
      key: "_setMaxHeight",
      value: function _setMaxHeight() {
        this.el.style.maxHeight = "".concat(this.minimized ? 0 : window.innerHeight, "px");
      }
    }, {
      key: "_revertToDefaultState",
      value: function _revertToDefaultState() {
        var this_1 = this;
        setTimeout(function () {
          this_1.$slideout.classList.remove('product-menu-slideout-visible');
        }, 500);
        this._changeState(Layout.isBreakpoint('M') ? this.defaultDesktopState : this.defaultMobileState);
      }
    }, {
      key: "minimizeMenu",
      value: function minimizeMenu() {
        this._revertToDefaultState();
        this.el.classList.add('menu-minimized');
        this.minimized = true;
        this._setMaxHeight();
      }
    }, {
      key: "maximizeMenu",
      value: function maximizeMenu() {
        this.minimized = false;
        this.el.classList.remove('menu-minimized');
        this._setMaxHeight();
      }
    }, {
      key: "_onVariantChange",
      value: function _onVariantChange(variant) {
        var _this3 = this;
        this.el.querySelector('[data-product-menu-button-addtocart]').disabled = !variant.available;
        this.el.querySelector('[data-product-menu-button-addtocart-text]').textContent = variant.available ? this.data.text.product_available : this.data.text.product_unavailable;
        var availableOptions = null;
        var $options = [];
        $options.forEach(function (option, i) {
          var $option = option;
          if (variant.options[i] === $option.value) {
            $option.checked = true;
            $option.parentNode.classList.add('option-selected');
          }
          if (availableOptions[i][$option.value]) {
            $option.removeAttribute('disabled');
            $option.parentNode.classList.remove('option-disabled');
            if (!availableOptions[i][$option.value].available) {
              $option.setAttribute('disabled', true);
              $option.setAttribute('data-soldout', true);
              $option.parentNode.classList.add('option-disabled');
              $option.parentNode.classList.add('option-soldout');
            }
          }
        });
        this._onQuantityChange(variant, this.form.quantity.value);
      }
    }, {
      key: "_onQuantityChange",
      value: function _onQuantityChange(variant, quantity) {
        var price = Shopify.formatMoney(variant.price * quantity, window.theme.moneyFormat);
        this.$productMenuButtonAddToCartPrice.textContent = price;
      }
    }, {
      key: "_onAddToCart",
      value: function _onAddToCart() {
        this.addToCartButton.classList.add('loading');
      }
    }, {
      key: "_onAtcSuccess",
      value: function _onAtcSuccess() {
        var _this3 = this;
        Cart.update().then(function (force) {
          Revealer('hide', force, _this3);
          setTimeout(function () {
            _this3._changeState(_this3.states.addToCartSuccess);
          }, 500);
        }).finally(function () {
          return _this3.addToCartButton.classList.remove('loading');
        });
      }
    }, {
      key: "_onAtcError",
      value: function _onAtcError(response, error, force) {
        var _this4 = this;        
        if (typeof response.description === 'object') {
          var $message_text = response.message;
        } else {
          var $message_text = response.description;
        }        
        this.addToCartButton.classList.remove('loading');
        this.$productAtcFailureMessage.msg.innerHTML = '<p>' + $message_text + '</p>';
        if (this.form.variantHelper.isDefault()) {
          Revealer('show', force, this.$productAtcFailureMessage);
        } else {
          Revealer('show', force, this.$productAtcFailureMessage);
        }     
        this.errorMessageTimeout = setTimeout(function () {
          if (_this4.form.variantHelper.isDefault()) {
            Revealer('hide', force, _this4.$productAtcFailureMessage);
          } else {
            Revealer('hide', force, _this4.$productAtcFailureMessage);
          }   
        }, 5000);
      }
    }, {
      key: "_updateMiniCartTotals",
      value: function _updateMiniCartTotals(cartData) {
        if (cartData.item_count === 0) {
          this._changeState('selectoptions');
          return;
        }
      }
    }, {
      key: "onSectionMessage",
      value: function onSectionMessage(name, data) {  
        if (name === 'cart:update') {
          this._updateMiniCartTotals(data);
        }
        if (name === 'header-minicart:open') {          
          this.minimizeMenu();
        }
        if (name === 'header-minicart:close') {          
          this.maximizeMenu();
        }
      }
    }, {
      key: "unload",
      value: function unload() {
        var _this2 = this;
        this.el.removeEventListener('touchstart', _this2._touchstop);
        this.el.removeEventListener('touchend', _this2._touchstop);
        Layout.offBreakpointChange(this.revertToDefaultState);
        this.dismissButton.removeEventListener('click', this.revertToDefaultState);
        this.selectOptionsButton.removeEventListener('click', this.changeToAddToCartState);
        this.el.removeEventListener('touchmove', this._allowTouchMove);
        window.removeEventListener('resize', this._setMaxHeight);
        this.form.unload();
      }
    }]);
    return ProductMenu;
  }();
  function ProductZoom_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductZoom_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductZoom_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductZoom_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductZoom_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductZoom = function () {
    function ProductZoom(el) {
      var _this = this;
      ProductZoom_classCallCheck(this, ProductZoom);
      this.el = el;
      this.$el = el;
      this.$img = this.$el.querySelector('img');
      this.scale = this.$img.getAttribute('width') / this.$el.getBoundingClientRect().width;
      this.zoomable = this.scale >= 1.25;
      this.framerate = 60;
      this.zoomed = false;
      this.layoutHandler = this._layoutHandler.bind(this);
      this.resetZoom = this._resetZoom.bind(this);
      this._init();
      this.$img.addEventListener('img:load', _this._init());
    }
    ProductZoom_createClass(ProductZoom, [{
      key: "_init",
      value: function _init() {
        this.disableZoom();
        this.scale = this.$img.getAttribute('width') / this.$el.getBoundingClientRect().width;
        this.zoomable = this.scale >= 1.25;
        if (!theme.isMobile && this.zoomable) {
          this.enableZoom();
          this._bindLayoutEvent();
        }
      }
    }, {
      key: "enableZoom",
      value: function enableZoom() {
        this.$el.classList.add('product-image-zoomable');
        this._bindEvents();
      }
    }, {
      key: "disableZoom",
      value: function disableZoom() {
        this.$el.classList.remove('product-image-zoomable');
        this._resetZoom();
      }
    }, {
      key: "_bindEvents",
      value: function _bindEvents() {
        var _this2 = this;
        this.$el.onclick = function(event){
          _this2._toggleZoom(event.clientX, event.clientY);
        };
        window.onresize = function(event){
          this.resetZoom
        };
      }
    }, {
      key: "_bindLayoutEvent",
      value: function _bindLayoutEvent() {
        Layout.onBreakpointChange(this.layoutHandler);
      }
    }, {
      key: "_layoutHandler",
      value: function _layoutHandler() {
        if (!theme.isMobile) {
          this.enableZoom();
        } else {
          this.disableZoom();
        }
      }
    }, {
      key: "_toggleZoom",
      value: function _toggleZoom(clientX, clientY) {
        var _this3 = this;
        if (!this.zoomed) {
          this.$el.onmouseout = function(){
            _this3._resetZoom();
            return
          };
          this.$el.onmousemove = debounce(function (event) {
            _this3._positionZoom(event.clientX, event.clientY);
          }, 100 / this.framerate, true, true);
          this.$el.classList.add('product-image-zoomed');          
          this.$img.style.transform = 'scale(' + this.scale + ')';
          this._positionZoom(clientX, clientY);
          this.zoomed = true;
        } else {
          this._resetZoom();
        }
      }
    }, {
      key: "_resetZoom",
      value: function _resetZoom() {
        this.$el.onmousemove = null;
        this.$el.onmouseout = null;
        this.$el.classList.remove('product-image-zoomed');
        this.$img.style.removeProperty('transform');
        this.zoomed = false;
      }
    }, {
      key: "_positionZoom",
      value: function _positionZoom(clientX, clientY) {
        if (!this.zoomed) {
          return;
        }
        var figRect = this.$el.getBoundingClientRect();
        var imgRect = this.$img.getBoundingClientRect();
        var figHalfWidth = figRect.width / 2;
        var figHalfHeight = figRect.height / 2;
        var centerX = figRect.left + figHalfWidth;
        var centerY = figRect.top + figHalfHeight;
        var widthDiff = imgRect.width / 2 - figHalfWidth;
        var heightDiff = imgRect.height / 2 - figHalfHeight;
        var translateX = (centerX - clientX) / figHalfWidth * widthDiff / this.scale;
        var translateY = (centerY - clientY) / figHalfHeight * heightDiff / this.scale;
        this.$img.style.transform = "scale(" .concat(this.scale, ") translate(").concat(translateX, "px, ").concat(translateY, "px)");
      }
    }]);
    return ProductZoom;
  }();
  function ProductGallery_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductGallery_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductGallery_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductGallery_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductGallery_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductGallery = function () {
    function ProductGallery(el) {      
      var _this = this;
      var sectionId = el.getAttribute('data-section-id');
      var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      ProductGallery_classCallCheck(this, ProductGallery);
      this.el = el;      
      this.settings = settings;
      this.layout = this.el.dataset.productGalleryLayout;
      this.viewport = this.el.querySelector('[data-product-gallery-viewport]');
      this.navigation = this.el.querySelector('[data-product-gallery-navigation]');
      this.figures = this.viewport.querySelectorAll('[data-product-gallery-figure]');
      this.selected = {
        figure: this.viewport.querySelector('[data-product-gallery-selected="true"]'),
        thumbnail: null
      };
      this.media = {
        images: [],
        models: [],
        videos: []
      };
      this.events = new Events();
      if (this.navigation) {
        this.selected.thumbnail = this.navigation.querySelector('[data-product-gallery-selected="true"]');
        this.featured = document.getElementById(sectionId + '-featured-images');
        this.thumbs = document.getElementById(sectionId + '-thumb-images');
        this.slideshow = true;
        this.slideshow_section = false;
        this.thumbnails = this.el.querySelectorAll('[data-product-gallery-thumbnail]');
        if (this.layout == 'list') {
          if(Layout.isBreakpoint('S')) {
            new Slideshow(_this.featured,_this);
            new Slideshow(this.thumbs);
          }
        } else {
          new Slideshow(_this.featured,_this);
          new Slideshow(this.thumbs);
        }
        var variantImages = {};
        var thumbnails;
        var variant;
        var variantImage;
        var opt_key;
        var opt_val;
        var loop_index;
        var vars = settings.section.data.product.variants;
        var opts = settings.section.data.product.options;
        var options = settings.section.el.querySelectorAll('[data-product-option]');
        var optionsTypes = {
          select: 'select',
          radio: 'radio'
        };
        vars.forEach(function(v) {
          variant = v;
          if ( typeof variant.featured_image !== 'undefined' && variant.featured_image !== null ) {
            variantImage =  variant.featured_image.src.split('?')[0].replace(/http(s)?:/,'');
            variantImages[variantImage] = variantImages[variantImage] || {};
            var opts = v.options
            opts.forEach(function(o,i) {
              opt_key = 'option-'+i;
              opt_val = o;
              if (typeof variantImages[variantImage][opt_key] === 'undefined') {
                variantImages[variantImage][opt_key] = opt_val;
              }
              else {
                var oldValue = variantImages[variantImage][opt_key];
                if ( oldValue !== null && oldValue !== opt_val )  {
                  variantImages[variantImage][opt_key] = null;
                }
              }
            });
          }
        });
        this.onThumbnailClick = function (e) {
          setTimeout(function () {
            _this.featured.querySelector('[data-product-gallery-figure="' + e.target.getAttribute('data-product-gallery-thumbnail') + '"]').focus();
          }, 350);
          _this._selectMediaByIndex(e.target.getAttribute('data-product-gallery-thumbnail'));
          var thumb = this.querySelector('img[src]'),
              thumbParent = _this.viewport.querySelector('[data-product-gallery-thumbnail-placeholder]'),
              image = thumb.getAttribute('src').split('?')[0].replace(/(_1x)/,'');
          if (thumbParent) {
            thumbParent.remove();
          }          
          if (typeof variantImages[image] !== 'undefined') {
            opts.forEach(function(o,i) {
              loop_index = 'option-' + i;
              if (variantImages[image][loop_index] !== null) {
                var index = i;
                if (settings.section.data.option_type === optionsTypes.select) {
                  var sos = document.querySelector('[name="' + settings.section.id + '-' + settings.section.data.product.id + '-option' + index + '"]');
                  sos.value = variantImages[image][loop_index];
                  sos.dispatchEvent(new Event('change'));
                } else {
                  options.forEach(function (o) {
                    if (o.value == variantImages[image][loop_index]) {
                      o.checked = true;
                      o.dispatchEvent(new Event('change'));
                    }
                    return
                  });
                }
              }
            });
          }
        };
        this.thumbnails.forEach(function (thumbnail) {
          return _this.events.register(thumbnail, 'click', _this.onThumbnailClick);
        });
        this.onLayoutChange = function () {          
          if (_this.layout == 'list') {
            if(Layout.isBreakpoint('S')) {
              new Slideshow(_this.featured,_this);
              _this.featured.classList.add('slideshow', 'slider');
              new Slideshow(_this.thumbs);
            } else {
              _this.featured.classList.remove('slideshow', 'slider', 'slider-loaded', 'active', 'sliding');
            }
          } else {
            new Slideshow(_this.featured,_this);
            new Slideshow(_this.thumbs);
          }
        };
        Layout.onBreakpointChange(this.onLayoutChange);
        _this.featured.classList.remove('loading');
      }
      var features = [];
      if (this.layout === 'list') {
        var imageEls = this.viewport.querySelectorAll('[data-media-type="image"][data-product-gallery-image-zoom]');
        for (var i = 0; i < imageEls.length; i++) {
          this._initZoom(imageEls[i]);
        }
      } else if (this.selected.figure.dataset.mediaType === 'image') {
        this._initZoom(this.selected.figure);
      }
      if (this.el.querySelector('[data-media-type="model"]')) {
        this.events.register(this.viewport, 'click', function (e) {
          if ('shopifyXr' in e.target.dataset) {
            _this._onViewInYourSpaceClick(e.target);
          }
        });
        features.push({
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: this._onModelLibraryLoad.bind(this)
        });
        features.push({
          name: 'shopify-xr',
          version: '1.0'
        });
      }
      if (this.el.querySelector('[data-media-type="video"]')) {
        Promise.all([new Promise(function (resolve) {
          if (!document.querySelector('#plyr-stylesheet')) {
            var link = document.createElement('link');
            link.setAttribute('id', 'plyr-stylesheet');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', 'https://cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.css');
            link.onload = resolve;
            document.body.appendChild(link);
          } else {
            resolve();
          }
        }), new Promise(function (resolve) {
          features.push({
            name: 'video-ui',
            version: '1.0',
            onLoad: resolve
          });
        })]).then(this._onVideoLibraryLoad.bind(this));
      }
      if (features.length) {
        Shopify.loadFeatures(features);
      }
    }
    ProductGallery_createClass(ProductGallery, [{
      key: "selectMediaByVariant",
      value: function selectMediaByVariant(variant) {
        if (variant.featured_media) {
          var figure = this.viewport.querySelector("[data-media=\"".concat(variant.featured_media.id, "\"]"));
        } else {
          var figure = this.viewport.querySelector("[data-product-gallery-figure='0']");
        }
        if (!figure) return;
        this._selectMediaByIndex(figure.dataset.productGalleryFigure);          
      }
    }, {
      key: "pauseVideos",
      value: function pauseVideos() {
        this.el.querySelectorAll('.js-youtube').forEach((video) => {
          video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
        });
        this.el.querySelectorAll('.js-vimeo').forEach((video) => {
          video.contentWindow.postMessage('{"method":"pause"}', '*');
        });
        var excludeVideo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.media.videos.forEach(function (v) {
          if (v !== excludeVideo) {
            v.pause();
          }
        });
      }
    }, {
      key: "pauseModels",
      value: function pauseModels() {
        var excludeModel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.media.models.forEach(function (m) {
          if (m !== excludeModel && m.ui.interacting) {
            m.ui.pause();
          }
        });
      }
    }, {
      key: "unload",
      value: function unload() {
        this.events.unregisterAll();
        this.media.videos.forEach(function (v) {
          return v.unload();
        });
        this.media.images.forEach(function (i) {
          return i.unload();
        });
      }
    }, {
      key: "_onModelLibraryLoad",
      value: function _onModelLibraryLoad() {
        var _this2 = this;
        var controls = ['zoom-in', 'zoom-out'];
        if (document.fullscreenEnabled) controls.push('fullscreen');
        this.viewport.querySelectorAll('[data-media-type="model"]').forEach(function (modelFigure) {
          var modelEl = modelFigure.querySelector('model-viewer');
          _this2.media.models.push({
            ui: new Shopify.ModelViewerUI(modelEl, {
              controls: controls
            }),
            el: modelEl,
            figure: modelFigure
          });
          modelEl.addEventListener('shopify_model_viewer_ui_toggle_play', function(evt) {
            _this2.viewport.querySelector('.slider').classList.add('no-drag');
          }.bind(this));

          modelEl.addEventListener('shopify_model_viewer_ui_toggle_pause', function(evt) {
            _this2.viewport.querySelector('.slider').classList.remove('no-drag');
          }.bind(this));
        });
      }
    }, {
      key: "_onViewInYourSpaceClick",
      value: function _onViewInYourSpaceClick(target) {
        if (target.dataset.shopifyModel3dId === this.selected.figure.dataset.media) return;
        var figure = this.viewport.querySelector("[data-media=\"".concat(target.dataset.shopifyModel3dId, "\"]"));
        this._selectMediaByEl(figure);
      }
    }, {
      key: "_selectMediaByEl",
      value: function _selectMediaByEl(el) {
        this._selectMediaByIndex(parseInt(el.dataset.productGalleryFigure, 10));
      }
    }, {
      key: "_onVideoLibraryLoad",
      value: function _onVideoLibraryLoad() {
        var _this3 = this;
        var videoFigures = this.viewport.querySelectorAll('[data-media-type="video"]');
        var _loop = function _loop(i) {
          var videoFigure = videoFigures[i];
          var videoEl = videoFigure.querySelector('video');
          var player = new Shopify.Plyr(videoEl, {
            loop: {
              active: _this3.settings.enable_video_looping
            }
          });
          var video = {
            figure: videoFigure,
            el: videoEl,
            player: player,
            restart: function restart() {
              player.restart();
              player.play();
            },
            pause: function pause() {
              return player.pause();
            },
            play: function play() {
              return player.play();
            },
            unload: function unload() {
              return player.destroy();
            }
          };
          _this3.events.register(videoFigure, 'play', function () {
            return _this3.pauseVideos(video);
          });
          _this3.media.videos.push(video);
        };
        for (var i = 0; i < videoFigures.length; i++) {
          _loop(i);
        }
      }
    }, {
      key: "_onVideoSelect",
      value: function _onVideoSelect(video) {
        if (this.settings.enable_video_autoplay && this.layout !== 'list' && !theme.isMobile) {
          video.play();
        }
      }
    }, {
      key: "_onMediaSelect",
      value: function _onMediaSelect(index) {
        var _this8 = this;
        var focus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var figure = this.figures[index];
        this.selected.figure.dataset.productGallerySelected = false;
        if (this.layout !== 'list') {
          this.selected.figure.setAttribute('tabindex', '-1');
          this.selected.figure.setAttribute('aria-hidden', true);
        }
        this.selected.figure = figure;
        this.selected.figure.dataset.productGallerySelected = true;
        if (this.layout !== 'list') {
          this.selected.figure.setAttribute('tabindex', '0');
          this.selected.figure.setAttribute('aria-hidden', false);
        }
        var viewInYourSpaceEls = this.el.querySelectorAll('[data-shopify-xr]');
        var setViewInYourSpaceID = function setViewInYourSpaceID(id) {
          for (var i = 0; i < viewInYourSpaceEls.length; i++) {
            viewInYourSpaceEls[i].dataset.shopifyModel3dId = id;            
          }
        };
        if (viewInYourSpaceEls.length) {
          setViewInYourSpaceID(viewInYourSpaceEls[0].dataset.defaultModelId);
        }
        this.pauseVideos();
        this.pauseModels();
        if (focus) {
          this.media.videos.forEach(function (v) {
            if (v.figure === _this8.selected.figure) {
              v.el.focus();
            }
          });
          this.media.models.forEach(function (m) {
            if (m.figure === _this8.selected.figure) {
              if (!theme.isMobile) {
              	m.ui.play();
              }
              m.el.focus();
            }
          });
        }
        switch (this.selected.figure.dataset.mediaType) {
          case 'external_video':
            let f = this.selected.figure;
            if (this.layout !== 'list' && !f.getAttribute('loaded') && f.querySelector('template')) {
              f.querySelector('.youtube-container').appendChild(f.querySelector('template').content.firstElementChild.cloneNode(true));
              f.setAttribute('loaded', true);
            }
            f.focus();
            break;
          case 'video':
            this._onVideoSelect(this.media.videos.filter(function (v) {
              return v.figure === _this8.selected.figure;
            })[0]);
            break;
          case 'model':
            setViewInYourSpaceID(this.selected.figure.dataset.media);
            break;
          case 'image':
            this._initZoom(this.selected.figure);
            break;
          default:
            break;
        }
      }
    }, {
      key: "_selectMediaByIndex",
      value: function _selectMediaByIndex(index) {
        var _this = this,
            focus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false,
            s = this.navigation;        
        if (s) {
          this.featured.querySelector('.active').classList.remove('active');
          var f = this.featured.querySelector('figure[data-product-gallery-figure="' + index + '"]');
          if (s.getAttribute('data-slider-axis') == 'vertical' && !Layout.isBreakpoint('S')) {
            var t = s.querySelector('button[data-product-gallery-thumbnail="' + index + '"]');
            var tAnchor = t.offsetTop;
            s.scroll({
              top: tAnchor,
              behavior: 'smooth'
            })
            f.classList.add('active');
            let height = f.scrollHeight;
            this.featured.style.setProperty('--max-height', height + 'px');
            var fAnchor = f.offsetTop;
            this.featured.scroll({
              top: fAnchor,
              behavior: 'smooth'
            })
          } else {
            var t = s.querySelector('button[data-product-gallery-thumbnail="' + index + '"]');
            var tAnchor = t.offsetLeft;
            s.scroll({
              left: tAnchor,
              behavior: 'smooth'
            })
            f.classList.add('active');
            let height = f.scrollHeight;
            this.featured.style.setProperty('--max-height', height + 'px');
            var fAnchor = f.offsetLeft;
            this.featured.scroll({
              left: fAnchor,
              behavior: 'smooth'
            })
          }
        }
        if (this.navigation) {
          var thumbnail = this.thumbnails[index];
          this.selected.thumbnail.dataset.productGallerySelected = false;
          this.selected.thumbnail = thumbnail;
          this.selected.thumbnail.dataset.productGallerySelected = true;
        }
        _this._onMediaSelect(index, focus);
      }
    }, {
      key: "_initZoom",
      value: function _initZoom(figure) {
        var exists = this.media.images.filter(function (image) {
          return image.el.dataset.media === figure.dataset.media;
        });
        if (this.media.images.length === 0 || exists.length === 0) {
          this.media.images.push(new ProductZoom(figure));
        }
      }
    },{
      key: "onSectionMessage",
      value: function onSectionMessage(name, data) {  
        if (name === 'slider:up') {
          this._selectMediaByIndex(data);
        }
      }
    }]);
    return ProductGallery;
  }();
  var calculateDistance = function calculateDistance(latitude1, longitude1, latitude2, longitude2, unitSystem) {
    var dtor = Math.PI / 180;
    var radius = unitSystem === 'metric' ? 6378.14 : 3959;
    var rlat1 = latitude1 * dtor;
    var rlong1 = longitude1 * dtor;
    var rlat2 = latitude2 * dtor;
    var rlong2 = longitude2 * dtor;
    var dlon = rlong1 - rlong2;
    var dlat = rlat1 - rlat2;
    var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.pow(Math.sin(dlon / 2), 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return radius * c;
  };
  var getGeoLocation = function getGeoLocation() {
    return new Promise(function (resolve, reject) {
      var options = {
        maximumAge: 3600000,
        timeout: 5000
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (_ref) {
          var coords = _ref.coords;
          return resolve(coords);
        }, reject, options);
      } else {
        reject();
      }
    });
  };
  var index_es_location = null;
  var setLocation = function setLocation(_ref2) {
    var latitude = _ref2.latitude,
        longitude = _ref2.longitude;
    return new Promise(function (resolve) {
      var cachedLocation = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      var newData = {
        latitude: latitude,
        longitude: longitude,
        timestamp: Date.now()
      };
      index_es_location = newData;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
      if (cachedLocation !== null && cachedLocation.latitude === latitude && cachedLocation.longitude === longitude // Valid for 1 hour - per Debut's example
          && isNotExpired(cachedLocation.timestamp)) {
        resolve({
          latitude: latitude,
          longitude: longitude
        });
        return;
      }
      fetch('/localization.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude
        })
      }).then(function () {
        return resolve({
          latitude: latitude,
          longitude: longitude
        });
      });
    });
  };
  var getLocation = function getLocation() {
    return new Promise(function (resolve) {
      if (index_es_location && isNotExpired(index_es_location.timestamp)) {
        resolve(index_es_location);
        return;
      }
      resolve(getGeoLocation().then(setLocation));
    });
  };
  function index_es_ownKeys(object, enumerableOnly) {
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
  function index_es_objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        index_es_ownKeys(Object(source), true).forEach(function (key) {
          index_es_defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        index_es_ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  var LOCAL_STORAGE_KEY = 'shopify-surface-pick-up';
  var loadingClass = 'surface-pick-up--loading';
  var isNotExpired = function isNotExpired(timestamp) {
    return timestamp + 1000 * 60 * 60 <= Date.now();
  };
  var removeTrailingSlash = function removeTrailingSlash(s) {
    return s.replace(/(.*)\/$/, '$1');
  };
  function dist_index_es_classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function dist_index_es_defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function dist_index_es_createClass(Constructor, protoProps, staticProps) {
    if (protoProps) dist_index_es_defineProperties(Constructor.prototype, protoProps);
    if (staticProps) dist_index_es_defineProperties(Constructor, staticProps);
    return Constructor;
  }
  var SurfacePickUp = function () {
    function SurfacePickUp(el, options) {
      dist_index_es_classCallCheck(this, SurfacePickUp);
      this.el = el;
      this.root_url = this.el.getAttribute('data-base-url');
      this.callbacks = [];
      this.onBtnPress = null;
      this.latestVariantId = null;
      this.pickUpEnabled = localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
    }
    dist_index_es_createClass(SurfacePickUp, [{
      key: "load",
      value: function load(variantId) {
        var _this = this;
        this.latestVariantId = variantId;
        this.el.classList.add(loadingClass);
        return _this._getData(variantId).then(function (data) {
          return _this._injectData(data);
        });
      }
    }, {
      key: "onModalRequest",
      value: function onModalRequest(callback) {
        if (this.callbacks.indexOf(callback) >= 0) return;
        this.callbacks.push(callback);
      }
    }, {
      key: "unload",
      value: function unload() {
        this.callbacks = [];
        this.el.innerHTML = '';
      }
    }, {
      key: "_getData",
      value: function _getData(variantId) {
        var _this2 = this;
        return new Promise(function (resolve) {
          var xhr = new XMLHttpRequest();
          var requestUrl = "".concat(_this2.root_url, "/variants/").concat(variantId, "/?section_id=surface-pick-up");
          xhr.open('GET', requestUrl, true);
          xhr.onload = function () {
            var el = xhr.response;
            var embed = el.querySelector('[data-html="surface-pick-up-embed"]');
            var itemsContainer = el.querySelector('[data-html="surface-pick-up-items"]');
            var items = itemsContainer.content.querySelectorAll('[data-surface-pick-up-item]');
            resolve({
              embed: embed,
              itemsContainer: itemsContainer,
              items: items,
              variantId: variantId
            });
          };
          xhr.onerror = function () {
            resolve({
              embed: {
                innerHTML: ''
              },
              itemsContainer: {
                innerHTML: ''
              },
              items: [],
              variantId: variantId
            });
          };
          xhr.responseType = 'document';
          xhr.send();
        });
      }
    }, {
      key: "_injectData",
      value: function _injectData(_ref3, force) {
        var _this3 = this;
        var embed = _ref3.embed,
            itemsContainer = _ref3.itemsContainer,
            items = _ref3.items,
            variantId = _ref3.variantId;
        _this3.$el = this.el;
        if (variantId !== this.latestVariantId || items.length === 0) {
          Revealer('hide', force, _this3);
          setTimeout(function () {
            _this3.$el.innerHTML = '';
            _this3.$el.classList.remove(loadingClass);
          }, 500);
          return;
        }
        this.el.innerHTML = embed.innerHTML;
        this.el.classList.remove(loadingClass);
        Revealer('show', force, _this3);
        var processedDistances = false;
        var processDistances = function processDistances() {
          if (processedDistances) return;
          processedDistances = true;
          return getLocation().then(function (coords) {
            items.forEach(function (item) {
              var distanceEl = item.querySelector('[data-distance]');
              var distanceUnitEl = item.querySelector('[data-distance-unit]');
              var unitSystem = distanceUnitEl.dataset.distanceUnit;
              var itemLatitude = parseFloat(distanceEl.dataset.latitude);
              var itemLongitude = parseFloat(distanceEl.dataset.longitude);
              if (coords && isFinite(itemLatitude) && isFinite(itemLongitude)) {
                var distance = calculateDistance(coords.latitude, coords.longitude, itemLatitude, itemLongitude, unitSystem);
                distanceEl.innerHTML = distance.toFixed(1);
                distanceUnitEl.innerHTML = distanceUnitEl.getAttribute('data-unit');
              } else {
                distanceEl.remove();
                distanceUnitEl.remove();
              }
            })
          })
          ["catch"](function () {
            items.forEach(function (item) {
              var distanceEl = item.querySelector('[data-distance]');
              var distanceUnitEl = item.querySelector('[data-distance-unit]');
              distanceEl.remove();
              distanceUnitEl.remove();
            });
          })["finally"](function () {
            processedDistances = true;
            _this3.callbacks.forEach(function (callback) {
              return callback(itemsContainer.innerHTML);
            });
          });
        };
        this.el.querySelector('[data-surface-pick-up-embed-modal-btn]').addEventListener('click', function () {
          if (JSON.parse(_this3.el.getAttribute('data-geo'))) {
            processDistances();
          }
          _this3.callbacks.forEach(function (callback) {
            return callback(itemsContainer.innerHTML);
          });
        });
        return this.el;
      }
    }]);
    return SurfacePickUp;
  }();
  var shopify_surface_pick_up_dist_index_es = (SurfacePickUp);
  function SurfacePickUp_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function SurfacePickUp_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function SurfacePickUp_createClass(Constructor, protoProps, staticProps) { if (protoProps) SurfacePickUp_defineProperties(Constructor.prototype, protoProps); if (staticProps) SurfacePickUp_defineProperties(Constructor, staticProps); return Constructor; }
  var SurfacePickUp_SurfacePickUp = function () {
    function SurfacePickUp(_ref) {
      var _this = this;
      var el = _ref.el,
          product = _ref.product,
          initialVariantId = _ref.initialVariantId,
          hasOnlyDefaultVariant = _ref.hasOnlyDefaultVariant;
      SurfacePickUp_classCallCheck(this, SurfacePickUp);
      this.el = el;
      this.product = product;
      this.selectedVariant = product.variants.find(function (_ref2) {
        var id = _ref2.id;
        return id === initialVariantId;
      });
      var surfacePickUpEl = this.el.querySelector('[data-surface-pick-up]');
      var surfacePickUpElMobile = this.el.querySelector('[data-surface-pick-up-mobile]');
      this.surfacePickUps = [new shopify_surface_pick_up_dist_index_es(surfacePickUpEl)];
      if (surfacePickUpElMobile) {
        this.surfacePickUps.push(new shopify_surface_pick_up_dist_index_es(surfacePickUpElMobile));
      }
      var components_Modal = (new Modal());
      var onModalRequest = function onModalRequest(content) {
        var variantTitle = hasOnlyDefaultVariant ? '' : "<h6 class=\"modal-header__surface-pick-up-variant\">".concat(_this.selectedVariant.title, "</h6>");
        var header = "\n          <h2 class=\"modal-header__surface-pick-up-title\">".concat(product.title, "</h2>\n          ").concat(variantTitle, "\n        ");
        components_Modal.open({
          header: header,
          content: content
        });
      };
      this.surfacePickUps.forEach(function (surfacePickUp) {
        surfacePickUp.load(_this.selectedVariant.id);
        surfacePickUp.onModalRequest(onModalRequest);
      });
      this.handleVariantChange = function (event) {
        var data = event.detail;
        return _this.onVariantChange(data);
      };
      window.addEventListener('product-variant-switch', this.handleVariantChange);
    }
    SurfacePickUp_createClass(SurfacePickUp, [{
      key: "onVariantChange",
      value: function onVariantChange(_ref3) {
        var _this2 = this;
        var variant = _ref3.variant,
            isProduct = _ref3.isProduct;
        if (isProduct && !isProduct(this.product)) {
          return;
        }
        this.selectedVariant = variant;
        this.surfacePickUps.forEach(function (surfacePickUp) {
          return surfacePickUp.load(_this2.selectedVariant.id);
        });
      }
    }, {
      key: "unload",
      value: function unload() {
        window.removeEventListener('product-variant-switch', this.handleVariantChange);
        this.surfacePickUps.forEach(function (surfacePickUp) {
          return surfacePickUp.unload();
        });
      }
    }]);
    return SurfacePickUp;
  }();
  function ProductDetails_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function ProductDetails_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function ProductDetails_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductDetails_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductDetails_defineProperties(Constructor, staticProps); return Constructor; }
  var ProductDetails = function () {
    function ProductDetails(_ref, force) {
      var _this = this;
      var $el = _ref.$el,
          section = _ref.section;
      ProductDetails_classCallCheck(this, ProductDetails);
      this.el = $el;
      this.section = section;
      this.data = section.data;
      this.onboarding = this.data.onboarding;
      this.postMessage = section.postMessage;
      this.type = section.type;
      this.$el = $el;
      this.$window = window;
      this.$sticky = $el.querySelectorAll('.product-details-sticky');
      this.$productCollapse = $el.querySelectorAll('.product-slide');
      this.$productInfo = $el.querySelector('[data-product-info]');
      this.$atc = $el.querySelector('[data-product-atc]');
      this.$atcl = $el.querySelector('[data-product-atcl]');
      this.$variantDetails = this.$el.querySelector('[data-variants]');
      this._handleVariantChange = this._handleVariantChange.bind(this);
      this.$alert = $el.querySelector('.product-alert');
      if (this.$alert) {
        this.$alert.$el = this.$alert;
      }
      if (this.$sticky && document.selectors.sht > 0 && this.data.template != 'quick') {
        this.$sticky.forEach(function(s) {
          s.style.top = document.selectors.sht + 'px';
        });
      }
      if (this.el.querySelector('[data-product-gallery]')) {
        this.productGallery = new ProductGallery(this.el.querySelector('[data-product-gallery]'), {
          enable_video_autoplay: this.data.gallery_video_autoplay,
          enable_video_looping: this.data.gallery_video_looping,
          section: section
        });
      }      
      this.listeningForVariantChange = false;
      this.listenForVariantChange();      
      if (!this.onboarding && this.data.form_is_inline) {
        this.form = new ProductForm(this.$el.querySelector('[data-product-details]'), {
          form: this.$el.querySelector('[data-product-form-inline]'),
          productEl: this.$el,
          product: this.data.product,
          productVariants: this.data.product_variants,
          type: this.type,
          moneyFormat: window.theme.moneyFormat,
          postMessage: section.postMessage,
          useHistory: this.data.use_history,
          enableCartRedirection: this.data.enable_cart_redirection,
          onAddToCart: function onAddToCart() {
            return _this._onATC();
          },
          onSuccess: function onSuccess(response, quantity) {
            return _this._onAtcSuccess(response, quantity);
          },
          onError: function onError(response, error) {
            return _this._onAtcError(response, error);
          }
        });
        let event = new CustomEvent('product-variant-switch', {
          detail: {
            variant: this.form.variantHelper.getSelectedVariant()
          }
        });
      }
      this.$productCollapse.forEach(function(p) {
        var _this = p;
        var a = p.querySelector('.product-slide-btn');
        var r = p.querySelector('.product-slide-content');
        p.$el = r;
        if (r && a) {
          a.onclick = function(event){
            if (r.hasAttribute('data-revealer-visible')) {
              a.classList.remove('active');
              Revealer('hide', force, _this);
            } else {
              a.classList.add('active');
              Revealer('show', force, _this);
            }
          }
        }
      });
      if ($el.querySelector('.surface-pick-up')) {
        this.SurfacePickUp = new SurfacePickUp_SurfacePickUp({
          el: this.el,
          product: this.data.product,
          initialVariantId: parseInt(this.data.initial_variant_id, 10),
          hasOnlyDefaultVariant: this.data.has_only_default_variant
        });
      }
      if (this.$alert) {
        this.events = [
          this.$alert.querySelector('.product-alert-dismiss').onclick = function(event){
            return _this._hideAlert();
          }
        ];
      }
    }
    ProductDetails_createClass(ProductDetails, [{
      key: "listenForVariantChange",
      value: function listenForVariantChange() {
        if (!this.listeningForVariantChange) {
          window.addEventListener('product-variant-switch', this._handleVariantChange);
          this.listeningForVariantChange = true;
        }
      }
    }, {
      key: "stopListeningForVariantChange",
      value: function stopListeningForVariantChange() {
        if (this.listeningForVariantChange) {
          window.removeEventListener('product-variant-switch', this._handleVariantChange);
          this.listeningForVariantChange = false;
        }
      }
    },{
      key: "unload",
      value: function unload() {
        this._hideAlert();
        this.stopListeningForVariantChange();
        if (this.SurfacePickUp) {
          this.SurfacePickUp.unload();
        }
      }
    }, {
      key: "_onATC",
      value: function _onATC() {
        this._hideAlert();
        this.$atc.classList.add('loading');
      }
    }, {
      key: "_onAtcSuccess",
      value: function _onAtcSuccess(force) {
        this.$atc.classList.remove('loading');
        theme.header_cart = this.$atc
        if (this.data.template === 'quick') {
          this.postMessage('header-minicart:refresh');
          this.$atcl.$el =  this.$atcl;
          Revealer('show', force, this.$atcl);
        } else {
          this.postMessage('header-minicart:set-open');          
        }  
        this.postMessage('cart:refresh');         
      }
    }, {
      key: "_onAtcError",
      value: function _onAtcError(response, error) {
        this.$atc.classList.remove('loading');
        this._showAlert(response, 'error');
      }
    }, {
      key: "_handleVariantChange",
      value: function _handleVariantChange(event) {
        var data = event.detail;
        this._onVariantChange(data);
      }
    }, {
      key: "_onVariantChange",
      value: function _onVariantChange(_ref2, force) {
        var _this = this;
        var variant = _ref2.variant,
            firstLoad = _ref2.firstLoad,
            isProduct = _ref2.isProduct;
        if (isProduct && !isProduct(this.data.product)) {
          return;
        }
        if (this.productGallery) {
          this.productGallery.selectMediaByVariant(variant);
        }
        if (this.$el.querySelector('.product-form-inline-atc-button')) {
          this.$el.querySelector('.product-form-inline-atc-button').disabled = !variant.available;
          this.$el.querySelector('[data-product-inline-atc-text]').textContent = variant.available ? this.data.text.product_available : this.data.text.product_unavailable;
        }
        if (this.$el.querySelector('[data-quantity]')) {
          var vD = _this.$variantDetails,
              dQI = this.$el.querySelector('[data-quantity-input]'),
              max = parseInt(vD.options[vD.selectedIndex].getAttribute('data-max')),
              min = parseInt(vD.options[vD.selectedIndex].getAttribute('data-min'));
          dQI.setAttribute('min', min);
          this.$el.querySelector('[data-quantity-decrement]').disabled = true;
          if (min == 0) {
            dQI.value = 0;
            this.$el.querySelector('[data-quantity-increment]').disabled = true;
          } else {
            dQI.value = 1;
            this.$el.querySelector('[data-quantity-increment]').disabled = false;            
          }
          if (max) {
            dQI.setAttribute('max', max);
            if (max == 1) {
              this.$el.querySelector('[data-quantity-increment]').disabled = true;
            }
          } else {
            dQI.removeAttribute('max');
          }
        }
        if (this.$el.querySelector('.product-details-price')) {
          var $unitPrice = this.$productInfo.querySelector('[data-unit-price]'),
              $unitPriceAmount = $unitPrice.querySelector('[data-unit-price-amount]'),
              $unitPriceMeasure = $unitPrice.querySelector('[data-unit-price-measure]'),
              $compareAtPrice = this.$productInfo.querySelector('[data-variant-compare-at-price]'),
              $price = this.$productInfo.querySelector('[data-variant-price]'),
              $taxLine = this.$productInfo.querySelector('[data-tax-line]');
          $price.textContent = Shopify.formatMoney(variant.price, window.theme.moneyFormat);
          if (variant.compare_at_price && variant.compare_at_price !== variant.price) {
            $compareAtPrice.classList.remove('money-compare-at-hidden');
            $compareAtPrice.textContent = Shopify.formatMoney(variant.compare_at_price, window.theme.moneyFormat);
          } else {
            $compareAtPrice.classList.add('money-compare-at-hidden');
          }
          if ($taxLine) {
            this.$taxLine = $taxLine;
            this.$taxLine.$el = $taxLine;
            if (variant.taxable) {
              $taxLine.classList.remove('hidden');
              Revealer('show', force, this.$taxLine);
            } else {
              Revealer('hide', force, this.$taxLine);
              setTimeout(function () {
                $taxLine.classList.add('hidden');
              }, 500);
            }
          }
          if (variant.unit_price) {
            $unitPrice.classList.remove('hidden');
            if ($unitPriceAmount) {
              $unitPriceAmount.textContent = Shopify.formatMoney(variant.unit_price, window.theme.moneyFormat);
            }
            if ($unitPriceMeasure) {
              if (variant.unit_price_measurement.reference_value !== 1) {
                $unitPriceMeasure.textContent = "".concat(variant.unit_price_measurement.reference_value).concat(variant.unit_price_measurement.reference_unit);
              } else {
                $unitPriceMeasure.textContent = variant.unit_price_measurement.reference_unit;
              }
            }
          } else {
            $unitPrice.classList.add('hidden');
          }
        }
        var sku = this.$el.querySelector('.product-sku');        
        if (sku) {          
          this.$sku = this.$productInfo.querySelector('[data-variant-sku]');
          this.$sku.$el = this.$sku;
          this.$skuInclude = this.$sku.getAttribute('data-sku-include');
          this.$skuText = this.$sku.getAttribute('data-sku-text');
          this.$barcodeInclude = this.$sku.getAttribute('data-barcode-include');
          this.$barcodeText = this.$sku.getAttribute('data-barcode-text');
          if (variant.sku && this.$skuInclude == 'true' || variant.barcode && this.$barcodeInclude == 'true') {
            if (variant.sku && this.$skuInclude == 'true' && variant.barcode && this.$barcodeInclude == 'true') {            
              this.$sku.innerHTML = '<span class="product-block"><span><span>' + this.$skuText + '</span>' + variant.sku + '</span><span><span>' + this.$barcodeText + '</span>' + variant.barcode + '</span></span>';
            } else if (variant.sku && this.$skuInclude == 'true') {            
              this.$sku.innerHTML = '<span class="product-block"><span><span>' + this.$skuText + '</span>' + variant.sku + '</span></span>';
            } else if (variant.barcode && this.$barcodeInclude == 'true') {            
              this.$sku.innerHTML = '<span class="product-block"><span><span>' + this.$barcodeText + '</span>' + variant.barcode + '</span></span>';
            }
            Revealer('show', force, this.$sku);
          } else {
            this.$sku.innerHTML = '<span class="product-block">&nbsp</span>';
            Revealer('hide', force, this.$sku);
          }
        }
        var vMF = this.$el.querySelectorAll('.variant_metafields');
        if (vMF.length > 0) {
          fetch(this.$productInfo.dataset.href + '?variant=' + variant.id + '&section_id=' + this.section.id)
          .then(function(r) {
            return r.text();
          }).then(function(j) {
            const htmlDocument = new DOMParser().parseFromString(j, 'text/html');
            vMF.forEach(function(v) {
              var nV = v.getAttribute('id'),
                  section = htmlDocument.querySelector('#' + nV);
              if (!section) {
                return;
              }
              v.innerHTML = section.innerHTML;
            });        
          }).catch(function(err) {
            console.error('!: ' + err)
          });
        };
      }
    }, {
      key: "_showAlert",
      value: function _showAlert(message, force) {
        var _this2 = this;
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        this._hideAlert();
        if (type) {
          this.alertClassName = "product-alert-".concat(type);
          this.$alert.classList.add(this.alertClassName);
        }
        var $message = this.$alert.querySelector('.product-alert-message');        
        if (typeof message.description === 'object') {
          var $message_text = message.message;
        } else {
          var $message_text = message.description;
        }        
        $message.innerHTML = $message_text;
        Revealer('show', force, this.$alert);
        this._positionAlert();
        window.onscroll = function(event){
          return _this2._positionAlert();
        };
        this.alertTimeout = setTimeout(function () {
          _this2._hideAlert();
        }, 5000);
      }
    }, {
      key: "_hideAlert",
      value: function _hideAlert(force) {
        clearTimeout(this.alertTimeout);
        if (this.$alert) {
          this.$alert.classList.remove(this.alertClassName);
          this.alertClassName = null;
          var $message = this.$alert.querySelector('.product-alert-message');
          $message.innerHTML = '';
          Revealer('hide', force, this.$alert);
        }
      }
    }, {
      key: "_positionAlert",
      value: function _positionAlert() {
        this.$alert.style.top = window.pageYOffset;
        this.$alert.classList.add('product-alert-fixed');
      }
    }]);
    return ProductDetails;
  }();
  function Product_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function Product_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function Product_createClass(Constructor, protoProps, staticProps) { if (protoProps) Product_defineProperties(Constructor.prototype, protoProps); if (staticProps) Product_defineProperties(Constructor, staticProps); return Constructor; }
  function Product(section) {
    Product_classCallCheck(this, Product);  
    this.$el = section.el;
    this.section = section;
    if (this.section.data.product === null) {
      return;
    }
    var onboarding = section.data.onboarding;
    this.productDetails = new ProductDetails({
      $el: this.$el,
      section: section
    });
    if (!onboarding && !this.section.data.form_is_inline && this.section.data.form_is_inline != null) {
      this.productMenu = new ProductMenu({
        el: this.section.el.querySelector('[data-product-menu]'),
        section: section,
        productEl: this.section.el,
        data: this.section.data,
        postMessage: this.section.postMessage
      });
    }
  }
  Product_createClass(Product, [{
    key: "onSectionMessage",
    value: function onSectionMessage(name, data) {        
      if (this.productMenu) {
        this.productMenu.onSectionMessage(name, data);
      }
      if (this.productDetails.productGallery) {
        this.productDetails.productGallery.onSectionMessage(name, data);
      }
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.productMenu) this.productMenu.unload();
      if (this.productDetails) this.productDetails.unload();
    }
  }]);
  return Product;
})();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'product-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Product(section);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'product-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Product(section);
    });
    sectionContainer.classList.add('ignore');
  }
})