function getDecimalDegrees() {
  var firstComponent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var secondComponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var thirdComponent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var fourthComponent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var directions = {
    N: 1,
    E: 1,
    S: -1,
    W: -1
  };
  var decimalDegrees = 0.0;
  var components = [firstComponent, secondComponent, thirdComponent, fourthComponent];
  for (var i = 0; i < components.length; i++) {
    var component = components[i];
    if (component) {
      if (Number.isNaN(parseFloat(component))) {
        decimalDegrees *= directions[component];
      } else {
        decimalDegrees += parseFloat(component) / Math.pow(60, i);
      }
    }
  }
  return decimalDegrees;
}
function getLatitudeLongitude(address) {
  var latLongDegreesMinutesSeconds = /^([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2})(?:'[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:"[ ]?| )?(N|E|S|W) ?([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2})(?:'[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:"[ ]?| )?(N|E|S|W)$/g; // Degrees and Decimal Minutes: DDD° MM.MMM'
  var latLongDegreesMinutes = /^([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:'[ ]?| )?(N|E|S|W) ?([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:'[ ]?| )?(N|E|S|W)$/g; // Decimal Degrees: DDD.DDDDD°
  var latLongDegrees = /^([-|+]?[0-9]{1,3}(?:\.[0-9]+)?)(?:°[ ]?| )?(N|E|S|W)?,? ?([-|+]?[0-9]{1,3}(?:\.[0-9]+)?)(?:°[ ]?| )?(N|E|S|W)?$/g;
  var latLongFormats = [latLongDegreesMinutesSeconds, latLongDegreesMinutes, latLongDegrees];
  var latLongMatches = latLongFormats.map(function (latLongFormat) {
    return address.match(latLongFormat);
  });
  var latLongMatch = latLongMatches.reduce(function (accumulator, value, index) {
    if (!accumulator && value) {
      var latLongResult = latLongFormats[index].exec(address);
      var lat = latLongResult.slice(1, latLongResult.length / 2 + 1);
      var lng = latLongResult.slice(latLongResult.length / 2 + 1, latLongResult.length);
      return {
        lat: lat,
        lng: lng
      };
    }
    return accumulator;
  }, null);
  return new Promise(function (resolve, reject) {
    if (latLongMatch) {
      var latDecimalDegrees = getDecimalDegrees.apply(void 0, _toConsumableArray(latLongMatch.lat));
      var longDecimalDegrees = getDecimalDegrees.apply(void 0, _toConsumableArray(latLongMatch.lng));
      resolve({
        lat: latDecimalDegrees,
        lng: longDecimalDegrees
      });
    } else {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        address: address
      }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK || !results[0]) {
          reject(status);
        } else {
          resolve(results[0].geometry.location);
        }
      });
    }
  });
}
function getMapStyles(colors) {
  if (!colors) {
    return [];
  }
  return [{
    elementType: 'geometry',
    stylers: [{
      color: colors.e
    }]
  }, {
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    elementType: 'labels.text.fill',
    stylers: [{
      color: colors.a
    }]
  }, {
    elementType: 'labels.text.stroke',
    stylers: [{
      color: colors.e
    }]
  }, {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.country',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.land_parcel',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.neighborhood',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.locality',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'poi',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{
      color: colors.d
    }]
  }, {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{
      color: colors.c
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{
      color: colors.b
    }]
  }, {
    featureType: 'road.highway.controlled_access',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{
      color: colors.b
    }]
  }, {
    featureType: 'road.local',
    elementType: 'labels.text.stroke',
    stylers: [{
      color: colors.e
    }]
  }, {
    featureType: 'transit',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{
      color: colors.f
    }]
  }];
}
function createMap(options) {
  var container = options.container,
      address = options.address,
      zoom = options.zoom,
      colors = options.colors;
  return getLatitudeLongitude(address).then(function (latLong) {
    var map = new google.maps.Map(container, {
      center: latLong,
      clickableIcons: false,
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      gestureHandling: 'none',
      keyboardShortcuts: false,
      maxZoom: zoom,
      minZoom: zoom,
      scrollWheel: false,
      styles: getMapStyles(colors),
      zoom: zoom,
      zoomControl: false
    });
    new google.maps.Marker({
      clickable: false,
      map: map,
      position: map.getCenter()
    });
    map.panBy(0, 0);
  })["catch"](function (status) {
    var usageLimits = 'https://developers.google.com/maps/faq#usagelimits';
    var errorMessage;
    switch (status) {
      case 'ZERO_RESULTS':
        errorMessage = "Unable to find the address: ".concat(address);
        break;
      case 'OVER_QUERY_LIMIT':
        errorMessage = 'Unable to load Google Maps, you have reached your usage limit.  Please visit usageLimits for more details.';
        break;
      default:
        errorMessage = 'Unable to load Google Maps.';
        break;
    }
    throw errorMessage;
  });
}
function displayErrorInThemeEditor(container, errorMessage) {
  var isThemeEditor = window.Shopify && window.Shopify.designMode;
  if (!isThemeEditor) {
    return;
  }
  console.log(errorMessage);
}
function Map_classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}
var gMap = function Map(section) {
  function Map(section) {
    var sectionId = section.getAttribute('data-section-id');
    Map_classCallCheck(this, Map);
    this.map = null;
    this.apiKey = section.getAttribute('data-api-key');  
    this.colors = {
      a: section.getAttribute('data-map-color-a'),
      b: section.getAttribute('data-map-color-b'),
      c: section.getAttribute('data-map-color-c'),
      d: section.getAttribute('data-map-color-d'),
      e: section.getAttribute('data-map-color-e'),
      f: section.getAttribute('data-map-color-f'),
    };
    var _this = this,
        container = section.querySelector('[data-map-container]'),
        address = section.getAttribute('data-address'),
        colors = this.colors,
        apiKey = section.getAttribute('data-api-key'),
        zoom = section.getAttribute('data-zoom'); 
    var zoom = Number.isNaN(zoom) ? 13 : 11 + parseInt(zoom, 10);    
    if (apiKey) {
      if (window.googleMaps === undefined) {        
        getScript("https://maps.googleapis.com/maps/api/js?key=".concat(apiKey), function (error) {
          window.googleMaps = true;
          createMap({
            container: container,
            address: address,
            zoom: zoom,
            colors: colors
          }).then(function (map) {
            _this.map = map;      
            section.querySelector('.section-layout-wrapper').classList.remove('insta');            
          })["catch"](function (error) {            
            return displayErrorInThemeEditor(container, error);
          });
        });
      } else {
        createMap({
          container: container,
          address: address,
          zoom: zoom,
          colors: colors
        }).then(function (map) {
          _this.map = map;      
          section.querySelector('.section-layout-wrapper').classList.remove('insta');
        })["catch"](function (error) {
          return displayErrorInThemeEditor(container, error);
        });
      }      
    }
  };
  return Map;
}();
document.addEventListener('Section:Loaded', function(myFunction){
  let sectionContainer = event.detail;
  let sectionType = sectionContainer.dataset.sectionType;
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'map-' + sectionId;
  if(sectionType === section){
    sections.register(section, function (section) {
      return new gMap(sectionContainer);
    });
  }
})
sectionEvents.forEach(function(sectionEvent){  
  let sectionContainer = sectionEvent.detail;
  let sectionType = sectionContainer.dataset.sectionType;  
  let sectionId = sectionContainer.dataset.sectionId;  
  let section = 'map-' + sectionId;
  if(sectionType === section && !sectionContainer.classList.contains('ignore')){
    sections.register(section, function (section) {
      return new gMap(sectionContainer);
    });
    sectionContainer.classList.add('ignore');
  }
})