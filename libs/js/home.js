(function($) {
$('#navbar .nav-collapse a').click(function(e) {
  e.preventDefault();
  var $target = $(this.hash);
  $('html, body').animate({
    scrollTop: $target.offset().top - 50
  },300);
});

$('#drop-area').droper({
  url: './server/upload.php',
  hoverClass: 'drag-hover',
  drop: function(e) {
    var files = e.dataTransfer.files,
        i, length, freader;
    for (i=0,length=files.length; i<length; i++) {
      (function(i) {
        var $outer = $('<div />').addClass('app'),
            freader = new FileReader();
        freader.onload = function(e) {
          $('<img />').attr({src: this.result, 'class':'img-rounded'})
                      .appendTo($outer);
          $outer.appendTo('#project-droper .upload-container').
                 append('<div class="app-progress"><div class="bar"></div></div>').attr('data-fileIndex', files[i].fileIndex);
        }
        freader.readAsDataURL(files[i]);
      }(i))
    }
  },
  uploadProgress: function(e) {
    var fileIndex = e.fileIndex,
        $app = $('.app[data-fileIndex=' + fileIndex +']'),
        progress = 0;
    if (e.lengthComputable) {
      progress = Math.round(e.loaded/e.total*100) + '%';
      $app.find('.app-progress .bar').width(progress);
    }
  },
  uploaded: function(e) {
    var fileIndex = e.fileIndex,
        $app = $('.app[data-fileIndex=' + fileIndex +']');
    
    $app.find('.app-progress .bar').width('100%');
  }
})
}(jQuery));
