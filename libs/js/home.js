$('#navbar .nav-collapse a').click(function(e) {
  console.log('szb');
  e.preventDefault();
  var $target = $(this.hash);
  $('html, body').animate({
    scrollTop: $target.offset().top - 50
  },300);
});
