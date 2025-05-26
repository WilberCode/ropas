function MobCollDynamicSection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function MobCollDynamicSection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function MobCollDynamicSection_createClass(Constructor, protoProps, staticProps) { if (protoProps) MobCollDynamicSection_defineProperties(Constructor.prototype, protoProps); if (staticProps) MobCollDynamicSection_defineProperties(Constructor, staticProps); return Constructor; }
var MobColl = function () {
  function MobColl(section) {
    var sectionId = section.getAttribute('data-section-id');
    MobCollDynamicSection_classCallCheck(this, MobColl);
    this.$el = section;
    this.menu = new MeganavMenu(this.$el);    
  }
  MobCollDynamicSection_createClass(MobColl, [{
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(event,force) {      
      const f = event.el.querySelector('.meganav-menu-items');
      const d = {
        $el: f
      };      
      Revealer('show', force, d);
      event.el.classList.add('meganav-menu-active');
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect(event,force) {
      const f = event.el.querySelector('.meganav-menu-items');
      const d = {
        $el: f
      };      
      Revealer('hide', force, d);
      event.el.classList.remove('meganav-menu-active');
    }
  }]);

  return MobColl;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'mobile-collection-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new MobColl(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'mobile-collection-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new MobColl(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})