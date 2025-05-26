function Contact_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Contact_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function Contact_createClass(Constructor, protoProps, staticProps) { if (protoProps) Contact_defineProperties(Constructor.prototype, protoProps); if (staticProps) Contact_defineProperties(Constructor, staticProps); return Constructor; }
var Contact = function (force) {
  function Contact(section) {
    Contact_classCallCheck(this, Contact);
    var hny = document.getElementById('honeypot');
    if (hny) {
      var btn = hny.querySelector('.btn-replace');
      btn.disabled = false;
      btn.setAttribute('type', 'submit');
      btn.onclick = function(ev){
        if (document.getElementById('contactFormNumber').value.length > 0) {
          ev.preventDefault();
        }
      }
    }
  }
  return Contact;
}();
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  if(sectionType === 'contact_page' && !sectionContainer.classList.contains('ignore')){
    sections.register('contact_page', function (section) {
      return new Contact(section);
    });
    sectionContainer.classList.add('ignore');
  }
})