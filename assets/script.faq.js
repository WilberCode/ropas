function FAQ_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function FAQ_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function FAQ_createClass(Constructor, protoProps, staticProps) { if (protoProps) FAQ_defineProperties(Constructor.prototype, protoProps); if (staticProps) FAQ_defineProperties(Constructor, staticProps); return Constructor; }
var FAQ = function () {
  function FAQ(section) {    
    var _this = this;
    FAQ_classCallCheck(this, FAQ);
    this.$faqs = section.querySelectorAll('[data-faq]');
    this.$faqs.forEach(function (f) {
      const d = {
        $el: f.querySelector('[data-faq-text]')
      };
      f.onclick = function(force){
        Revealer('toggle', force, d);
        f.classList.toggle('active');
      };
    });
  }
  FAQ_createClass(FAQ, [{
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(event,force) {
      const f = event.el.querySelector('[data-faq-text]');
      const d = {
        $el: f
      };      
      Revealer('show', force, d);
      f.classList.add('active');
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect(event,force) {
      const f = event.el.querySelector('[data-faq-text]');
      const d = {
        $el: f
      };      
      Revealer('hide', force, d);
      f.classList.remove('active');
    }
  }]);
  return FAQ;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'faq-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new FAQ(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'faq-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new FAQ(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})