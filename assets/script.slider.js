function Slider_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Slider_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Slider_createClass(Constructor, protoProps, staticProps) { if (protoProps) Slider_defineProperties(Constructor.prototype, protoProps); if (staticProps) Slider_defineProperties(Constructor, staticProps); return Constructor; }
var Slider = function () {
  function Slider(section) {
    Slider_classCallCheck(this, Slider);
    this.el = section;
    this.slider = this.el.querySelector('.slider');
    this.useSlider = this.el.getAttribute('data-slider-use');
    this.useBreakpoint = this.el.getAttribute('data-slider-breakpoint');
    this.autoPlay = this.el.getAttribute('data-should-autoplay');    
    if (section.classList.contains('slideshow')) {
      this.slideshow = true;
      this.slideshow_section = true;
      this._initSlider();
    } else {
      this.slideshow = false;
      this.update = this.update.bind(this);
      Layout.onBreakpointChange(this.update);
      this.update();
    }
  }
  Slider_createClass(Slider, [{
    key: "unload",
    value: function unload() {
      Layout.offBreakpointChange(this.update);
    }
  }, {
    key: "update",
    value: function update() {
      var sliderSmall = Layout.isBreakpoint('S') && this.useSlider || Layout.isBreakpoint('M') && this.useSlider;
      var sliderLarge = this.useSlider && this.useBreakpoint == 'large';
      if (sliderSmall || sliderLarge) {
        this._initSlider();
      } else {
        this._destroySlider();        
      }
    }
  }, {
    key: "_initSlider",
    value: function _initSlider() {
      new Slideshow(this.slider, this);
    }
  }, {
    key: "_destroySlider",
    value: function _destroySlider() {
      this.slider.classList.remove('slider-loaded', 'active', 'sliding');
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload(event) {
      this.el.setAttribute('data-should-autoplay', false);
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(event) {
      const s = event.el;
      if (Layout.isBreakpoint('L')) {
        var anchorPad = 20;
      } else {
        var anchorPad = 0;
      }
      s.closest('.slider').scroll({
        left: s.offsetLeft - anchorPad,
        behavior: 'smooth'
      })
      let height = s.scrollHeight;
      s.closest('.slider').style.setProperty('--max-height', height + 'px');
      s.style.setProperty('--max-height', height + 'px');
    }
  }]);
  return Slider;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'slider-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Slider(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'slider-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Slider(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})