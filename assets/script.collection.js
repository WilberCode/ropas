Collection = (function() {
  function Select_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function Select_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function Select_createClass(Constructor, protoProps, staticProps) { if (protoProps) Select_defineProperties(Constructor.prototype, protoProps); if (staticProps) Select_defineProperties(Constructor, staticProps); return Constructor; }
  var Select = function () {
    function Select(el) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _this = this;
      Select_classCallCheck(this, Select);
      this.callback = options.callback || false;
      this.label = el.querySelector('[data-select-label]');
      this.select = el.querySelector('[data-select]');
      this.onChange = this._onChange.bind(this);
      this.select.addEventListener('change', this.onChange);
      this.select.onkeyup = function (e) {
        switch (e.key) {
          case 'Tab':
            _this.select.parentNode.classList.add('focused');
        }
      };
      this.select.onfocus = function(s){
        _this.select.parentNode.classList.add('focused');        
      };
      this.select.onblur = function(s){
        _this.select.parentNode.classList.remove('focused');        
      };
    }
    Select_createClass(Select, [{
      key: "_onChange",
      value: function _onChange() {
      var text = this.select[this.select.selectedIndex].text;
        var value = this.select[this.select.selectedIndex].value;
        this.label.innerText = text;
        if (this.callback) {
          this.callback(value);
        }
      }
    }, {
      key: "unload",
      value: function unload() {
        this.select.removeEventListener('change', this.onChange);
      }
    }]);
    return Select;
  }();
  function Collection_createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = Collection_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
  function Collection_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Collection_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Collection_arrayLikeToArray(o, minLen); }
  function Collection_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function Collection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  function Collection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
  function Collection_createClass(Constructor, protoProps, staticProps) { if (protoProps) Collection_defineProperties(Constructor.prototype, protoProps); if (staticProps) Collection_defineProperties(Constructor, staticProps); return Constructor; }
  function Collection(section,force) {
    var _this = this;
    Collection_classCallCheck(this, Collection);
    window.localStorage.removeItem('refine');
    this.section = section;
    this.$el = section.el;
    this.el = section.el;
    var data = document.getElementById('collection')
    var sort_by = data.querySelector('[data-sticky-slideout-sortby]')
    var refine_by = data.querySelector('[data-sticky-slideout-refine]')
    this.data = section.data;
    this.data.collection_handle = data.getAttribute('data-collection-handle');
    this.data.sort_by = data.getAttribute('data-sort-by');
    this.data.pagination_method = data.getAttribute('data-pagination-method');
    this.data.products_per_page = JSON.parse(data.getAttribute('data-products-per-page'));
    this.data.total_products = JSON.parse(document.getElementById('pagination').getAttribute('data-total-products'));
    this.$clearButton = this.el.querySelector('[data-clear-tags]');
    this.onSortByChange = this._onSortByChange.bind(this);
    this._infiniteScrollHandler = this._infiniteScrollHandler.bind(this);
    this.filterSlider = section.el.querySelector('#filters .slider');
    this.buttonFilter = section.el.querySelector('[data-filter]');      
    this.filtersActive = section.el.querySelector('[data-filters-active]');
    this.buttonFilterSubmit = section.el.querySelector('[data-button-submit]');
    this.selectWrapperSortBy = section.el.querySelector('[data-select-wrapper-sortby]');
    if(this.filterSlider) {
      new Slideshow(this.filterSlider);
    }    
    if (this.buttonFilter) {
      this._filterButton();
    }
    if (this.buttonFilterSubmit) {
      this._onFilterChange();      
    }
    if (this.selectWrapperSortBy) {
      this.selectSortBy = new Select(this.selectWrapperSortBy, {
        callback: this.onSortByChange
      });
    }
    if (section.type == 'search') {
      this._searchLoad();
    }
    this.states = {
      default: {
        buttonsSelector: '[data-sticky-menu-buttons-default]',
        buttons: [{
          selector: '[data-sticky-menu-button-sortby]',
          callback: function callback() {
            _this.menu.changeState(_this.states.sortBy);
          }
        }, {
          selector: '[data-sticky-menu-button-refine]',
          callback: function callback() {
            _this.menu.changeState(_this.states.refine);
          }
        }]
      },
      sortBy: {
        $el: sort_by,
        slideoutSelector: '[data-sticky-slideout-sortby]',
        buttonsSelector: '[data-sticky-menu-buttons-sortby]',
        buttons: [{
          selector: '[data-sticky-menu-slideout-button-dismiss]',
          callback: function callback() {
            _this.menu.changeState(_this.states.default);
          }
        }, {
          selector: '[data-sticky-menu-button-cancel]',
          callback: function callback() {
            _this.menu.changeState(_this.states.default);
          }
        }, {
          selector: '[data-sticky-menu-button-apply]',
          callback: function callback() {
            let isSort = true;
            _this._applySortByAndRefine(isSort);
          }
        }],
        dismiss: function dismiss() {
          _this.menu.changeState(_this.states.default);
        }
      },
      refine: {
        $el: refine_by,
        slideoutSelector: '[data-sticky-slideout-refine]',
        buttonsSelector: '[data-sticky-menu-buttons-refine]',
        buttons: [{
          selector: '[data-sticky-menu-slideout-button-dismiss]',
          callback: function callback() {
            _this.menu.changeState(_this.states.default);
          }
        }, {
          selector: '[data-sticky-menu-button-cancel]',
          callback: function callback() {
            _this.menu.changeState(_this.states.default);
          }
        }, {
          selector: '[data-sticky-menu-button-apply]',
          callback: function callback() {
            _this._filterValues();
            let isSort = false;
            _this._applySortByAndRefine(isSort);
          }
        }],
        dismiss: function dismiss() {
          _this.menu.changeState(_this.states.default);
        }
      }
    };
    this.$collectionMenuContainer = this.el.querySelector('[data-sticky-menu-container]');
    if (this.$collectionMenuContainer) {
      this.menu = new Menu(this.$collectionMenuContainer, this.states, this.states.default);
    }
    this._infiniteScrollLoad();
    this._setSortByQueryParameters();
    this._bindEvents();
  };
  Collection_createClass(Collection, [{
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this2 = this;
      this.$filterOptions = this.el.querySelectorAll('[data-filter-option]');
      this.$sortByOptions = this.el.querySelectorAll('[data-sortby-option]');
      this.$infinite = this.el.querySelector('[data-infinite-scroll-button]');
      if (this.$filterOptions) {
        this.$filterOptions.forEach(function (f) {
          f.onclick = function(event) {
            event.preventDefault();
            var url = f.getAttribute('href');
            window.localStorage.setItem('refine', f.getAttribute('data-refine'));
            _this2.ajaxLoadPage(url);
          }
        });
      }
      function sort() {
        var $selectedSortByOption = event.currentTarget;
        Shopify.queryParams.sort_by = $selectedSortByOption.value;
        _this2.$sortByOptions.forEach(function (s) {
          s.parentNode.classList.remove('option-selected');
        });
        $selectedSortByOption.parentNode.classList.add('option-selected');
      }
      if (this.$sortByOptions) {
        this.$sortByOptions.forEach(function (s) {
          s.onclick = function(event) {
            sort();
          };
          s.onfocus = function(){
            s.parentNode.classList.add('focused');
          };
          s.onblur = function(){
            s.parentNode.classList.remove('focused');
          };
        });
      }
      if (this.enableInfiniteScroll && this.$infinite) {
        this.$infinite.addEventListener('click', this._infiniteScrollHandler);
      }
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      if (this.enableInfiniteScroll) {
        this.showMoreButton.removeEventListener('click', this._infiniteScrollHandler);
      }
    }
  }, {
    key: "ajaxLoadPage",
    value: function ajaxLoadPage(url,q,s,force) {
      var _this = this;
      var aB = document.getElementById('ajaxBusy');
      var sM = this.$el.querySelector('.sticky-menu-slideout') ;
      var f = document.getElementById('filters');
      var cG = document.getElementById('collection-grid');
      var i = document.getElementById('infinite');
      var p = document.getElementById('pagination');
      var m = document.getElementById('search-title');
      aB.style.display = 'block';
      if (sM) {
        sM.$el = sM;
        Revealer('hide', force, sM);
        _this.menu.changeState(_this.states.default);
      }
      if (s) {
        var c = this.$el.querySelector('.collection-filter-form')
        if (c) {
          c.$el = c;
          Revealer('hide', force, c);
        }
      } else if (!s && f) {
        let height = f.scrollHeight;
        f.style.setProperty('--max-height', height + 'px');
        f.$el = f;
        Revealer('hide', force, f);
      }
      fetch(url)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, 'text/html');
        var Nf = htmlDocument.documentElement.querySelector('#filters');
        var NfA = htmlDocument.documentElement.querySelector('#filters-active');
        var NcG = htmlDocument.documentElement.querySelector('#collection-grid');
        var Ni = htmlDocument.documentElement.querySelector('#infinite');
        var Np = htmlDocument.documentElement.querySelector('#pagination');
        var Nm = htmlDocument.documentElement.querySelector('#search-title');
        if (f) {
          f.replaceWith(Nf);
        }
        if (!s && NfA) {
          NfA.$el = NfA;
          NfA.classList.add('toggle');
          Revealer('show', force, NfA);
        }
        cG.replaceWith(NcG);
        if (i) {
          i.replaceWith(Ni);
        }
        if (p) {
          p.replaceWith(Np);
        }
        if (m) {
          m.replaceWith(Nm);
        }
        if (s && q) {       
          document.getElementById('collection').setAttribute('data-sort-by', q);
        }  
        if(this.filterSlider) {
          new Slideshow(Nf.querySelector('.slider'));
        }
        if (this.buttonFilter) {
          this._filterButton();
        }
        if (this.buttonFilterSubmit) {
          this._onFilterChange();
        }
        this.data.total_products = JSON.parse(document.getElementById('pagination').getAttribute('data-total-products'));
        var sP = document.getElementById('search-products'); 	
        if (sP && sP.classList.contains('visible')) {
          setTimeout(function () {
            let height = sP.scrollHeight;
            sP.style.setProperty('--max-height', height + 'px');
          }, 100);
        }
        this._infiniteScrollLoad();
        this._bindEvents();
        history.replaceState({
          page: url
        }, url, url);
        aB.style.display = 'none';
      }).catch(function (err) {
        console.log('!: ' + err);
      });
    }
  }, {
    key: "_setSortByQueryParameters",
    value: function _setSortByQueryParameters() {
      Shopify.queryParams = {};
      if (location.search.length) {
        for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('='); 
          if (aKeyValue.length > 1 && aKeyValue[0] != 'page') {
            Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          } else if (aKeyValue[0] === 'page') {
            this.currentPage = parseInt(aKeyValue[1]);
          }
        }
      }
    }
  }, {
    key: "_applySortByAndRefine",
    value: function _applySortByAndRefine(s, force) {
      var u = new URL(window.location);
      var params = u.searchParams;
      if (s && Shopify.queryParams.sort_by) {
        params.set('sort_by', Shopify.queryParams.sort_by);
        var q = Shopify.queryParams.sort_by;
        this.data.sort_by = q;
      } else {
        var q = this.data.sort_by;
      }
      if (window.localStorage.getItem('refine')) {
        var params = window.localStorage.getItem('refine') + '&sort_by=' + q;
      } else if (!s) {
        var params = '?sort_by=' + q;
      }
      u.search = params.toString();
      var url = u.toString();
      this.ajaxLoadPage(url,q,s);
    }
  }, {
    key: "_filterButton",
    value: function _filterButton(force) {
      var _this = this,
          data = document.getElementById('collection'),
          b = this.buttonFilter,
          c = data.querySelector('.collection-filter-form');
      c.$el = c;
      b.onclick = function(event){
        Revealer('toggle', force, c);
        if (c.hasAttribute('data-revealer-visible')) {          
          setTimeout(function () {
            _this.buttonFilterSubmit.focus();
          }, 250);
        }
      }
    }
  }, {
    key: "_filterValues",
    value: function _filterValues() {
      function createSearchParams(form) {
        const formData = new FormData(form);    
        return new URLSearchParams(formData).toString();
      }
      const cF = this.$el.querySelector('.collection-filters')    
      const check = cF.querySelectorAll('input[type=checkbox]');          
      const number = cF.querySelectorAll('input[type=number]');
      const check_empty = [...check].every((el) => {
        return !el.checked
      });
      const number_empty = [...number].every((el) => {
        return !el.value
      });
      if (this.data.collection_handle == null) {
        window.localStorage.setItem('refine', createSearchParams(document.getElementById('filters-form')));
      }  else if (check_empty && number_empty) {
        window.localStorage.removeItem('refine')
      } else {
        window.localStorage.setItem('refine', createSearchParams(document.getElementById('filters-form')));
      }     
    }
  }, {
    key: "_onFilterChange",
    value: function _onFilterChange(value) {
      var _this = this;
      this.$el.querySelector('[data-button-submit]').onclick = function(event){
        event.preventDefault();
        _this._filterValues();
        let isSort = false;
        _this._applySortByAndRefine(isSort);
      }
    }
  }, {
    key: "_onSortByChange",
    value: function _onSortByChange(value) {
      Shopify.queryParams.sort_by = value;
      let isSort = true;
      this._applySortByAndRefine(isSort);
    }
  }, {
    key: "_infiniteScrollLoad",
    value: function _infiniteScrollLoad() {
      var _this = this;
      if (this.data.pagination_method.indexOf('infinite_scroll') > -1 && this.data.products_per_page < this.data.total_products && window.location.search.indexOf('page') === -1) {
        this.loadMoreTarget = this.el.querySelector('[data-infinite-scroll-target]');
        this.showMoreButton = this.el.querySelector('[data-infinite-scroll-button]');
        if (this.showMoreButton) {
          this.showMoreButton.style.display = 'block'; 
        }
        this.currentPage = 1;
        this.fullCollectionLoaded = false;
        this.enableInfiniteScroll = true;
        if (this.data.pagination_method === 'infinite_scroll') {
          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.intersectionRatio > 0) {
                _this.scrollTargetVisible = true;
                _this._infiniteScroll();
              } else {
                _this.scrollTargetVisible = false;
              }
            });
          });
          observer.observe(this.loadMoreTarget);
        }
      }
    }
  }, {
    key: "_infiniteScrollHandler",
    value: function _infiniteScrollHandler() {
      this._infiniteScroll();
    }
  }, {
    key: "_infiniteScroll",
    value: function _infiniteScroll() {
      var _this3 = this;
      var autoScrollCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      if (this.fullCollectionLoaded || autoScrollCount > 2) {
        return;
      }
      var currentPage = "page=".concat(this.currentPage);
      this.currentPage++;
      var nextPage = "page=".concat(this.currentPage);
      var url = "".concat(window.location.pathname).concat(window.location.search);
      if (window.location.search.indexOf('page') > -1) {
        url = url.replace(currentPage, nextPage);
      } else if (window.location.search.indexOf('?') > -1) {
        url = "".concat(url, "&").concat(nextPage);
      } else {
        url = "".concat(url, "?").concat(nextPage);
      }
      this.showMoreButton.classList.add('loading');
      fetch(url)
      .then(response => response.text())
      .then(data => {   
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(data, 'text/html');
        var $products = htmlDocument.querySelectorAll('[data-collection-grid-item]');
        for (var i = 0; i < $products.length; i++) {
          var $productGridItem = $products[i]; 
          _this3.$el.querySelector('[data-collection-grid]').appendChild($productGridItem);
          $products[0].classList.add('skip');
        }
        var $allProducts = _this3.$el.querySelectorAll('[data-collection-grid-item]');
        if ($allProducts.length >= _this3.data.total_products) {
          _this3.fullCollectionLoaded = true;
          _this3.showMoreButton.style.display = 'none';
        }
        _this3.showMoreButton.classList.remove('loading');
        setTimeout(function () {
          if (_this3.scrollTargetVisible) {
            _this3._infiniteScroll(autoScrollCount + 1);
          }
        }, 200);        
      }).catch(function (err) {
        console.log('!: ' + err);
      });
    }
  }, {
    key: "_searchLoad",
    value: function _searchLoad() {
      var _this = this;
      this.$tabs = this.section.el.querySelectorAll('.search-results-tab');
      this.$groups = this.section.el.querySelectorAll('.search-results-group');
      this.$tabs.forEach(function(t) {
        t.onclick = function(event){
          _this._searchTab(event.currentTarget);
        }
      });
    }
  }, {
    key: "_searchTab",
    value: function _searchTab(el,force) {
      this.section.el.querySelector('.search-results-tab.search-results-tab-selected').parentNode.classList.remove('collection-sortby-option-selected');
      this.section.el.querySelector('.search-results-tab.search-results-tab-selected').classList.remove('search-results-tab-selected');
      el.parentNode.classList.add('collection-sortby-option-selected'); 
      el.classList.add('search-results-tab-selected'); 
      var o = this.section.el.querySelector('.search-results-group.search-results-group-selected');
      this.$groupsSelected = o;
      if (o.classList.contains('first-visible')) {
        let height = o.scrollHeight;
        o.style.setProperty('--max-height', height + 'px');
        o.classList.remove('first-visible');
      }
      o.$el = o;
      Revealer('hide', force, o);
      o.classList.remove('search-results-group-selected');
      var n = document.getElementById(el.getAttribute('data-id')); 
      var fS = document.getElementById('filter-sortby'); 
      var fF = document.getElementById('filters-form'); 
      if (fS) {
        fS.$el = fS;
        fF.$el = fF;
        if (el.getAttribute('data-id') == 'search-products') {
          Revealer('show', force, fS);          
          setTimeout(function () {
            fS.style.removeProperty('--max-height');
          }, 500);
        } else {
          let height = fS.scrollHeight;
          fS.style.setProperty('--max-height', height + 'px');
          Revealer('hide', force, fS);
        }
        Revealer('hide', force, fF);
      }
      n.$el = n;
      Revealer('show', force, n);
      n.classList.add('search-results-group-selected');
    }
  }, {
    key: "onSectionMessage",
    value: function onSectionMessage(name, data, force) {
      if (this.menu && name === 'header-minicart:open') {
        Revealer('hide', force, this.menu);
      }
      if (this.menu && name === 'header-minicart:close') {
        Revealer('show', force, this.menu);
      }
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this._unbindEvents();
      if (this.menu) {
        this.menu.unload();
      }
      if (this.selectFilter && this.selectSortBy) {
        this.selectFilter.unload();
        this.selectSortBy.unload();
      }
    }
  }]);
  return Collection;
})();