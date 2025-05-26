const hdr = document.querySelector('.site-header');
var Header_Height = function () {
  if (hdr) {
    var stky = hdr.querySelector('header').getAttribute('data-sticky');  
    if (stky == 'true') {
      document.selectors = {
        sht: hdr.offsetHeight
      };
      document.querySelector('body').style.scrollPaddingTop = document.selectors.sht + 'px';
    } else {
      document.selectors = {
        sht: 0
      };
    };    
  } else {
    document.selectors = {
      sht: 0
    };
  }
};
var Check_Header = function (d) {
  if (d) {
    theme.mobileMenu = d;
  } else if (hdr) {
    theme.mobileMenu = hdr.querySelector('header').getAttribute('data-mobile');
  } else {
    theme.mobileMenu = '';
  }
  const isHover = () => {      
    return (window.matchMedia('(hover: hover) and (pointer: fine)').matches || (navigator.maxTouchPoints < 1));
  };
  if(isHover()) {
    body.classList.add('isDesktop');
    body.classList.remove('isMobile', 'isMobileMenu');
    theme.isMobile = false;
    theme.mobile = false;
    if(theme.mobileMenu == 'mobile') {
      body.classList.add('isMobileMenu');
    }
    if(Layout.isBreakpoint('S')) {      
      body.classList.add('isMobile', 'isMobileMenu');
      body.classList.remove('isDesktop');
      theme.mobile = true;
    }
  } else {
    body.classList.add('isMobile', 'isMobileMenu', 'isTrueMobile');
    body.classList.remove('isDesktop');
    theme.isMobile = true; 
  }; 
  document.documentElement.className=document.documentElement.className.replace(/\bno-js\b/,'js');
  Header_Height();
  if(window.Shopify&&window.Shopify.designMode)document.documentElement.className+=' in-theme-editor';
};
Check = (function() {
  function Check(section) {
    Check_Header();
  };
  return Check;
})();
var tO;
window.addEventListener('resize', function () {
  clearTimeout(tO);
  tO = setTimeout(Header_Height, 500);
});