function ProductRecommendations_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function ProductRecommendations_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function ProductRecommendations_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductRecommendations_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductRecommendations_defineProperties(Constructor, staticProps); return Constructor; }
var ProductRecommendations = function () {
  function ProductRecommendations(section) {
    ProductRecommendations_classCallCheck(this, ProductRecommendations);
    var sectionId = section.dataset.sectionId;
    var productId = section.dataset.productId;
    var limit = section.dataset.limit;
    var type = section.dataset.type;
    var recommendationsEl = section.querySelector('.recommendations');
    this._loadRecommendations(section, recommendationsEl, sectionId, productId, limit, type);
  }
  ProductRecommendations_createClass(ProductRecommendations, [{
    key: "_loadRecommendations",
    value: function _loadRecommendations(section, container, sectionId, productId, limit, type) {
      var url = type;
      fetch(url)
      .then(function(response) {
        return response.text();
      })
      .then(function(_ref, force) {
        container.innerHTML = _ref;
        container.innerHTML = container.querySelector('[data-html]').innerHTML;
        var pC = section;
        var _pC = {
          $el: pC
        };
        Revealer('show', force, _pC);
        setTimeout(function () {
          section.classList.add('overflow');
          section.style.setProperty('--max-height', '100%');
        }, 500);
      }).catch(function (err) {
        section.remove();
        console.log('!: ' + err);
      });
    }
  }]);
  return ProductRecommendations;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'product-recommendations-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new ProductRecommendations(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'product-recommendations-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new ProductRecommendations(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})