$('#navbar .nav-collapse a').click(function(e) {
  e.preventDefault();
  var $target = $(this.hash);
  $('html, body').animate({
    scrollTop: $target.offset().top - 50
  },300);
});

$('#drop-area').droper({
  hoverClass: 'drag-hover',
  drop: function(e) {
    var files = e.dataTransfer.files,
        i, length, freader;
    for(i=0,length=files.length; i<length; i++) {
      freader = new FileReader();
      freader.onload = function(e) {
        $('<img />').attr({src: this.result, 'className':'image-radius'})
                    .css({'marginRight':'10px', 'width':100, 'height':100})
                    .appendTo($('#project-droper .upload-container'));
      }
      freader.readAsDataURL(files[i]);
    }
  }
})
