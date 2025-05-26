var qr = document.querySelector('.giftcard-qrcode');
var string = { qrImageAlt: qr.dataset.alt };
document.addEventListener('DOMContentLoaded', function() {
  new QRCode(qr, {
    text: qr.dataset.qrcode,
    width: 120,
    height: 120,
    imageAltText: string.qrImageAlt
  });
});