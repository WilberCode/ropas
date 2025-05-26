function VideoLoad_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function VideoLoad_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function VideoLoad_createClass(Constructor, protoProps, staticProps) { if (protoProps) VideoLoad_defineProperties(Constructor.prototype, protoProps); if (staticProps) VideoLoad_defineProperties(Constructor, staticProps); return Constructor; }
var VideoLoad = function () {
  function VideoLoad(el) {
    VideoLoad_classCallCheck(this, VideoLoad);
    this.el = el;
    this.placeholder = el.querySelector('[data-video-placeholder]');
    this.playButton = el.querySelector('[data-video-play-button]');
    this.onPlayClick = this._onPlayClick.bind(this);
    if (this.placeholder ) {
      if (this.playButton) {
        this.playButton.addEventListener('click', this.onPlayClick);
      }
    }
  }
  VideoLoad_createClass(VideoLoad, [{
    key: "_onPlayClick",
    value: function _onPlayClick() {
      var _this = this;
      var f = this.el.querySelector('.js-reframe');
      this.el.classList.add('video-loading');
      f.appendChild(f.querySelector('template').content.firstElementChild.cloneNode(true));
      f.focus();
      setTimeout(function () {
        _this.el.classList.add('video-transitioning');
        setTimeout(function () {
          _this.el.classList.remove('video-loading');
          _this.el.classList.remove('video-transitioning');
          _this.el.classList.add('video-playing');
          _this.playButton.classList.add('hidden');
        }, 500);
      }, 500);
    }
  }, {
    key: "unload",
    value: function unload() {      
      if (this.playButton) {
        this.playButton.removeEventListener('click', this.onPlayClick);
      }
      if (this.video) {
        this.video.unload();
      }      
    }
  }]);
  return VideoLoad;
}();
function Video_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Video_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Video_createClass(Constructor, protoProps, staticProps) { if (protoProps) Video_defineProperties(Constructor.prototype, protoProps); if (staticProps) Video_defineProperties(Constructor, staticProps); return Constructor; }
var Video = function () {
  function Video(section) {
    var sectionId = section.getAttribute('data-section-id');
    Video_classCallCheck(this, Video);
    var videoEl = section.querySelectorAll('[data-video]');
    if (videoEl) {
      videoEl.forEach(function (v) {
        this.video = new VideoLoad(v);
      });
    }
  }
  Video_createClass(Video, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {      
      if (this.video) {
        this.video.unload();
      }
    }
  }]);
  return Video;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'video-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Video(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'video-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Video(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})