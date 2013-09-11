/*
 * jquery-droper
 * https://github.com/gilbertsun/jquery-droper
 *
 * Copyright (c) 2013 GilbertSun
 * Licensed under the MIT license.
 */
//给jQuery的ajax添加progress事件
(function addXhrProgressEvent() {
  var originXhr = $.ajaxSettings.xhr;
  $.ajaxSetup({
    uploadProgress: function() {
      console.log('standard upload progress callback');
    },
    uploaded: function() {
      console.log('standard uploaded');
    },
    xhr: function() {
      var xhr = originXhr(),
          self = this;
      if(xhr && xhr.upload) {
        xhr.upload.addEventListener('progress', function(e) {
          e.fileIndex = self.fileIndex;
          self.uploadProgress(e);
        }, false);

        xhr.upload.addEventListener('load', function(e) {
          e.fileIndex = self.fileIndex;
          self.uploaded(e);
        }, false);
      }
      return xhr;
    }
  });
})(jQuery);

(function($) {

  $.event.props.push('dataTransfer');

  var Droper = function(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.droper.defaults, options);
    this.init();
  };

  Droper.prototype = {
    constructor: Droper,

    init: function() {
      var $droperElement = this.$element,
          options = this.options,
          self = this,
          fileIndex = 0;
      $droperElement.on('dragenter', function(e) {
        e.preventDefault();
        $(this).addClass(options.hoverClass);
        options.dragenter.call(this, e);
      });
      $droperElement.on('dragover', function(e) {
        e.preventDefault();
        options.dragover.call(this, e);
      });
      $droperElement.on('dragleave', function(e) {
        options.dragleave.call(this, e);
        $(this).removeClass(options.hoverClass);
      });
      $droperElement.on('drop', function(e) {
        var files = e.dataTransfer.files,
            i, length;
        e.preventDefault();
        $(this).removeClass(options.hoverClass);

        // 给每个文件加上唯一的Index
        for(i = 0, length = files.length; i < length; i++) {
          files[i].fileIndex = fileIndex++;  
        }

        options.drop.call(this, e);
        
        if(!options.url) {
          return;
        }
        self.upload(files);
      });
    },
    upload: function(files) {
      var options = this.options,
          formdata, i, length;   
      for(i=0, length=files.length; i<length; i++){
        formdata = new FormData();
        formdata.append(options.name, files[i]);
        $.ajax({
          url: options.url,
          type: 'post',
          data: formdata,
          processData: false,
          contentType: false,
          success: options.ajaxSuccess,
          uploadProgress: options.uploadProgress,
          uploaded: options.uploaded,
          fileIndex: files[i].fileIndex
        });
      }
    }
  };

  $.fn.droper = function(option) {
    return this.each(function() {
      var $this = $(this),
          data = $this.data('droper'),
          options = typeof option && option;
      
      if(!data) {
        $this.data('droper', new Droper(this, options));
      }
    });
  };

  function empty() {}
  $.fn.droper.defaults = {
    dragenter: empty,
    dragover: empty,
    dragleave:empty,
    drop: empty,
    beforeUpload: empty,
    uploadProgress: empty,
    uploaded: empty,
    ajaxSuccess: empty,
    url: '',
    name: 'droper',
    hoverClass: ''
  };
  
}(jQuery));
