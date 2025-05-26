CartCart = (function() {
  function CartCart_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function CartCart_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function CartCart_createClass(Constructor, protoProps, staticProps) { if (protoProps) CartCart_defineProperties(Constructor.prototype, protoProps); if (staticProps) CartCart_defineProperties(Constructor, staticProps); return Constructor; }
  function CartCart(section, force) {
    var _this = this;
    CartCart_classCallCheck(this, CartCart);
    this.$el = section.el;
    var ship_calc = this.$el.querySelector('[data-sticky-menu-slideout]')
    this.data = section.data;
    this.events = []; 
    this.$shippingCalc = this.$el.querySelector('section').getAttribute('data-calc');
    this.$shippingToggle = this.$el.querySelector('[data-shipping-calculator-toggle]');
    this.$shippingContent = this.$el.querySelector('.sticky-menu-slideout-content');
    this.$shippingFieldsInline = this.$el.querySelector('.shipping-calculator-inline .shipping-calculator-fields');
    if (this.$shippingFieldsInline) {
      this.$shippingFieldsInline.$el = this.$shippingFieldsInline;
    }
    if(this.$shippingCalc == 'true') {
      if (Shopify) {
        new Shopify.CountryProvinceSelector(
          'address_country',
          'address_province',
          {
            hideElement: 'address_province_container'
          }
        );
      }
      if (this.$shippingToggle) {
        this.$shippingToggle.$el = this.$shippingToggle;
        this.events.push(
          this.$shippingToggle.onclick = function(event){
            _this._toggleInlineShippingCalculator();
          }
        )
      }
      this.events.push(
        this.$el.querySelector('[data-shipping-calculator-submit]').onclick = function(event){
          var responseMsg = document.getElementById('wrapper-response');
          responseMsg.$el = responseMsg;
          if (responseMsg.hasAttribute('data-revealer-visible')) {
            Revealer('toggle', force, responseMsg);
            setTimeout(function () {            
              _this._calculateShipping();
            }, 500);
          } else {
            _this._calculateShipping();
          }

        }
      )
      this.events.push(
        this.$el.querySelector('#address_zip').onkeydown = function(event) {          
          if (event.keyCode === 13) {
            event.preventDefault();
            _this._calculateShipping()
          } else {
            return;
          }
        }
      )
    };
    this.states = {
      default: {
        buttonsSelector: '[data-sticky-menu-buttons-default]',
        buttons: [{
          selector: '[data-sticky-menu-button-calculate-shipping]',
          callback: function callback() {
            _this.menu.changeState(_this.states.shippingCalculator);
          }
        }]
      },
      shippingCalculator: {
        $el: ship_calc,
        slideoutSelector: '[data-sticky-menu-slideout]',
        buttonsSelector: '[data-sticky-menu-buttons-shipping-calculator]',
        buttons: [{
          selector: '[data-sticky-menu-slideout-button-dismiss]',
          callback: function callback() {
            _this.menu.changeState(_this.states.default);
          }
        }, {
          selector: '[data-sticky-menu-button-cancel-shipping]',
          callback: function callback() {
            _this.menu.changeState(_this.states.default);
          }
        }],
        dismiss: function dismiss() {
          _this.menu.changeState(_this.states.default);
        }
      }
    };
    this.$cartMenuContainer = this.$el.querySelector('[data-sticky-menu-container]');
    if (this.$cartMenuContainer) {
      this.menu = new Menu(this.$cartMenuContainer, this.states, this.states.default);
    }
    Cart.addCart(section, section.postMessage);
  };
  CartCart_createClass(CartCart, [{
    key: "_calculateShipping",
    value: function _calculateShipping(e, force) {
      var _this2 = this;
      var shippingAddress = {};
      shippingAddress.zip = this.$el.querySelector('#address_zip').value || '';
      shippingAddress.country = this.$el.querySelector('#address_country').value || '';
      shippingAddress.province = this.$el.querySelector('#address_province').value || '';
      var shippingBtn = this.$el.querySelector('[data-shipping-calculator-submit]');
      var responseMsg = document.getElementById('wrapper-response');
      responseMsg.$el = responseMsg;
      if (shippingAddress.zip.length > 0) {
        shippingBtn.classList.add('loading');
        var url = "".concat(window.theme.routes.cart_url, "/shipping_rates.json?shipping_address%5Bzip%5D=").concat(shippingAddress.zip, "&shipping_address%5Bcountry%5D=").concat(shippingAddress.country, "&shipping_address%5Bprovince%5D=").concat(shippingAddress.province);
        fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }).then(function(r) {
          return r.json();
        }).then(function(d) {
          if (d.zip && d.zip.length > 0) {
            shippingBtn.classList.remove('loading');
            return _this2._handleErrors(d);
          } else {
            var rates = d.shipping_rates;
            var address = "".concat(shippingAddress.zip, ", ").concat(shippingAddress.province, ", ").concat(shippingAddress.country);
            if (!shippingAddress.province.length) {
              address = "".concat(shippingAddress.zip, ", ").concat(shippingAddress.country);
            }
            if (!shippingAddress.zip.length) {
              address = "".concat(shippingAddress.province, ", ").concat(shippingAddress.country);
            }
            if (!shippingAddress.province.length || !shippingAddress.zip.length) {
              address = shippingAddress.country;
            }
            responseMsg.innerHTML = ''
            responseMsg.innerHTML = '<div class="shipping-calculator-response"><p class="shipping-rates-feedback" id="shipping-rates-feedback"></p><ul class="shipping-rates"></ul></div>'
            var ratesFeedback = _this2.$el.querySelector('.shipping-rates-feedback');
            if (rates && rates.length > 1) {
              var firstRate = Shopify.formatMoney(rates[0].price, window.theme.moneyFormat);
              var multipleShippingRates = window.theme.shippingCalcMultiRates.replace('--address--', address).replace('--number_of_rates--', rates.length).replace('--rate--', "<span class='money'>".concat(firstRate, "</span>"));
              ratesFeedback.innerHTML = multipleShippingRates;
            } else if (rates && rates.length === 1) {
              var oneShippingRate = window.theme.shippingCalcOneRate.replace('--address--', address);
              ratesFeedback.innerHTML = oneShippingRate;
            } else {
              ratesFeedback.innerHTML = window.theme.shippingCalcNoRates;
            }
            var $cartShippingRates = _this2.$el.querySelector('.shipping-rates');
            for (var i = 0; i < rates.length; i++) {
              var rate = rates[i];
              var price = Shopify.formatMoney(rate.price, window.theme.moneyFormat);
              if (rate.delivery_date == null) {                
                if (!rate.delivery_days.length) {
                  var rateValues = window.theme.shippingCalcLocDev.replace('--rate_title--', '<span>'.concat(rate.name, '</span>')).replace('--rate--', '<span class="money">'.concat(price, '</span>'));            
                } else {
                  var date = rate.delivery_days.toString().replace(/,/g, '-'),
                      rateValues = window.theme.shippingCalcBusDays.replace('--rate_title--', '<span>'.concat(rate.name, '</span>')).replace('--rate--', '<span class="money">'.concat(price, '</span>')).replace('--rate_delivery--', '<span>'.concat(date, '</span>'));            
                }
              } else {
                var event = new Date(rate.delivery_date),
                    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
                    date = event.toLocaleDateString(window.theme.language, options),
                    rateValues = window.theme.shippingCalcRateValues.replace('--rate_title--', '<span>'.concat(rate.name, '</span>')).replace('--rate--', '<span class="money">'.concat(price, '</span>')).replace('--rate_delivery--', '<span>'.concat(date, '</span>'));
              }
              var li = document.createElement('li');
              li.innerHTML = rateValues;
              $cartShippingRates.appendChild(li);
            }
            shippingBtn.classList.remove('loading');
            Revealer('show', force, responseMsg);
            if (_this2.$shippingContent) {
              _this2._shippingScroll();
            }
          }
        });
      } else {
        return _this2._handleErrors();
      }
    }
  }, {
    key: "_handleErrors",
    value: function _handleErrors(errors, force) {
      if (errors) {
        var zipMessage = window.theme.shippingCalcErrorMessage.replace('--error_message--', errors.zip);
      } else {
        var zipMessage = window.theme.shippingCalcErrorMessageZip;
      }
      this.$el.querySelector('.shipping-calculator-response').innerHTML = '';
      this.$el.querySelector('.shipping-calculator-response').innerHTML = "<p class=\"shipping-rates-feedback\" id=\"shipping-rates-feedback\">".concat(zipMessage, "</p>");
      var responseMsg = document.getElementById('wrapper-response');
      responseMsg.$el = responseMsg;
      Revealer('show', force, responseMsg);
      if (this.$shippingContent) {
        this._shippingScroll();
      }
    }
  }, {
    key: "_shippingScroll",
    value: function _shippingScroll() {
      var _this = this;
      setTimeout(function () {
        _this.$shippingContent.scroll({
          top: _this.$el.querySelector('.shipping-calculator-response').offsetTop - _this.$el.querySelector('.sticky-menu-slideout-header').offsetHeight - 20,
          behavior: 'smooth'
        });
      }, 500);
    }
  }, {
    key: "_toggleInlineShippingCalculator",
    value: function _toggleInlineShippingCalculator(force) {
      var e = this.$shippingFieldsInline;
      if(this.$shippingToggle.querySelector('.link-text').textContent == this.$shippingToggle.getAttribute('data-shipping-calculator-title')) {
        Revealer('show', force, this.$shippingFieldsInline);
      }else{
        Revealer('hide', force, this.$shippingFieldsInline);
      }
      var text = this.$shippingToggle.getAttribute('data-toggle-text');
      this.$shippingToggle.setAttribute('data-toggle-text', this.$shippingToggle.querySelector('.link-text').textContent);
      this.$shippingToggle.querySelector('.link-text').textContent = text;
    }
  }, {
      key: "onSectionMessage",
      value: function onSectionMessage(name, data) {
        if (name === 'cart:refresh') {
          Cart.update();
        }
      }
    }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.events = [];
    }
  }]);
  return CartCart;
})();