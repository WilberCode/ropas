Customer = (function() {
  let _this = document.getElementById('customer');
  let s = _this.querySelector('.account-top').getBoundingClientRect().top + window.pageYOffset;
  function addressTemplate($customerAddresses, force) {
    var $addressForm = _this.querySelector('.account-address-forms');
    var $addressEditLinks = _this.querySelectorAll('[data-edit-address]');
    if ($addressEditLinks.length) {      
      $addressEditLinks.forEach(function(a){      
        a.onclick = function(event) {
          var itemId = this.getAttribute('data-edit-address');
          _this.$options = _this.querySelector('.account-options-slide.visible');
          _this.$options.$el = _this.$options;
          _this.$recovery = _this.querySelector("[data-address-id=\"".concat(itemId, "\"]"));
          _this.$recovery.$el = _this.$recovery;
          let height = _this.$options.scrollHeight;
          _this.$options.style.setProperty('--max-height', height + 'px');
          Revealer('toggle', force, _this.$options);
          Revealer('toggle', force, _this.$recovery);
          setTimeout(function() {
            $addressForm.querySelector('.visible input[type=text]:first-of-type').focus();
          }, 250);     
          window.setTimeout(function() { 
            window.scrollTo({top:s-document.selectors.sht}); 
          },500);     
        };
      });
    }
    var $addressDeleteLinks = _this.querySelectorAll('[data-delete-address]');
    if ($addressDeleteLinks.length) {
      $addressDeleteLinks.forEach(function(a){      
        a.onclick = function(event) {
          var aB = document.getElementById('ajaxBusy'),
              t = a.getAttribute('data-delete-address'),
              m = a.getAttribute('data-confirm');
          if (a.classList.contains('edit_address_confirm')) {
            Shopify.postLink(t, {
              parameters: { _method: 'delete' }
            });
            aB.style.display = 'block';
          } else {
            a.textContent = m;
            a.classList.add('edit_address_confirm','error-text');
          }
        };
      });
    }
    $customerAddresses.forEach(function provincePopulator(c) {
      var id = c.getAttribute('data-address-id');
      new Shopify.CountryProvinceSelector("customer-addr-".concat(id, "-country"), "customer-addr-".concat(id, "-province"), {
        hideElement: "address-province-container-".concat(id)
      });
    });
  }
  function accountTemplates(force) {
    var $formWrapper = _this.querySelector('[data-login-forms]');    
    if ($formWrapper) {
      var $formWrapperLinks = $formWrapper.querySelectorAll('.account-recovery-toggle');
      if ($formWrapperLinks.length) {
        $formWrapper.$options = $formWrapper.querySelector('.account-options-slide');
        $formWrapper.$options.$el = $formWrapper.$options;
        $formWrapper.$recovery = $formWrapper.querySelector('.account-recovery-slide');
        $formWrapper.$recovery.$el = $formWrapper.$recovery;
        $formWrapperLinks.forEach(function(f){
          f.onclick = function(event) {
            let height = f.closest('[data-height]').scrollHeight;
            f.closest('[data-height]').style.setProperty('--max-height', height + 'px');
            Revealer('toggle', force, $formWrapper.$options);
            Revealer('toggle', force, $formWrapper.$recovery);            
            setTimeout(function () {
              $formWrapper.querySelector('.visible input[type=email]:first-of-type').focus();
            }, 250);    
            window.setTimeout(function() { 
              window.scrollTo({top:s-document.selectors.sht}); 
            },500); 
          };
        });
      }
    }
    var $customerAddresses = _this.querySelectorAll('[data-address-id]');    
    if ($customerAddresses) {
      addressTemplate($customerAddresses);
    }
  }
  var templates_accountTemplates = (accountTemplates);
  templates_accountTemplates();  
})();