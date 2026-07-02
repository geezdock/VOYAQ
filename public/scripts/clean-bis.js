function cleanBis() {
  var all = document.querySelectorAll('[bis_skin_checked]');
  for (var i = 0; i < all.length; i++) {
    all[i].removeAttribute('bis_skin_checked');
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cleanBis);
} else {
  cleanBis();
}
