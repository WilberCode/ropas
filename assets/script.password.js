function Password_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Password_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Password_createClass(Constructor, protoProps, staticProps) { if (protoProps) Password_defineProperties(Constructor.prototype, protoProps); if (staticProps) Password_defineProperties(Constructor, staticProps); return Constructor; }
var Password = function (force) {
  function Password(section) {
    Password_classCallCheck(this, Password);
    let _this = document.getElementById('password');
    var passwordLinks = _this.querySelectorAll('.password-toggle');
    _this.$password = _this.querySelector('.password-slide');
    if (_this.$password) {
      _this.$password.$el = _this.$password;
    }
    _this.$newsletter = _this.querySelector('.newsletter-slide');
    if (_this.$newsletter) {
      _this.$newsletter.$el = _this.$newsletter;
    }
    passwordLinks.forEach(function(p){      
      p.onclick = function(event) {
        let height = _this.$newsletter.scrollHeight;
        _this.$newsletter.style.setProperty('--max-height', height + 'px');
        Revealer('toggle', force, _this.$newsletter);
        Revealer('toggle', force, _this.$password);
        setTimeout(function() {
          _this.querySelector('.visible input:not([type=hidden])').focus();
        }, 250);
        event.preventDefault();
      };
    });
  }
  return Password;
}();
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'password_page' && !sectionContainer.classList.contains('ignore')){
    sections.register('password_page', function (section) {
      return new Password(section);
    });
    sectionContainer.classList.add('ignore');
  }
})