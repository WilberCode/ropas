function Newsletter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var Newsletter = function () {
  function Newsletter(section) {
    var sectionId = section.getAttribute('data-section-id');
    var newsletterEl = section.querySelector('.newsletter-message');
    if (newsletterEl && window.hasModal === undefined) {
      var newsletterElTitle = newsletterEl.getAttribute('data-title');
      var newsletterElText = newsletterEl.textContent;
      var components_Modal = (new Modal());
      var header = '<h2>' + newsletterElTitle + '</h2>';
      var content = '<p>' + newsletterElText + '</p>';
      components_Modal.open({
        header: header,
        content: content
      });
    }   
  }
  return Newsletter;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'newsletter-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new Newsletter(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'newsletter-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new Newsletter(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})