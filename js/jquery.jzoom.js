(function ($) {
  // Class jZoomClass
  var jZoomClass = function (options) {
    this.defaults = {
      largeImg: '',
      viewArea: [150, 150],
      coordinates: [
        /*
         * Cách khai báo: Là một mảng gồm nhiều phần tử, mỗi phần tử có cấu trúc:
         * {
         *   'position': [x1,y1,x2,y2],
         *   'title': '',
         *   'description': ''
         * }
         * @TODO: Có thể viết riêng ra thành một đối tượng quản lý các tọa độ này.
         */
      ]
    }
    options && $.extend(this.defaults, options);
  }
  
  jZoomClass.prototype.init = function (element) {
    var o = this.defaults, self = this, $element = $(element);
    // Make sure image has been load
    $element.load(function () {
      var originWidth = $element.width(), originHeight = $element.height();
      $element.wrap('<div class="jz-relative" />');
      var $wrap = $element.parent(),
      $modal = $('<div class="jz-large" />').appendTo($wrap),
      $relative = $('<div class="jz-relative" />').appendTo($modal),
      $largeImg = $('<img />').attr('src', o.largeImg).appendTo($relative);
      $wrap.width(originWidth).height(originHeight);
      // Make sure largeImage loaded
      $largeImg.load(function () {
        var largeWidth = $largeImg.width(), largeHeight = $largeImg.height(),
        zoomRatio = Math.round(largeWidth / originWidth);
        if(zoomRatio > 1) {
          $relative.width(largeWidth).height(largeHeight);
          // Mark all position
          $.each(o.coordinates, function (index, item) {
            // create div
            var $divDescription = $('<div class="jz-description" />').width(item.position[2] - item.position[0]).height(item.position[3] - item.position[1]).appendTo($relative).css({
              'top': item.position[1] + 'px',
              'left': item.position[0] + 'px'
            });
            // append overlay
            $divDescription.hover(function (e) {
              //$divDescription.addClass('jz-description-hover');
              $divDescTitle.html(item.title);
              $divDescContent.html(item.description);
              $divDescOverlay.css({
                'left': e.clientX + 'px',
                'top': e.clientY + 'px'
              }).show();
            }, function () {
              //$divDescription.removeClass('jz-description-hover');
              $divDescOverlay.hide();
            });
          });
          var $divDescOverlay = $('<div class="jz-description-overlay" />').appendTo($wrap),
          $divDescTitle = $('<div class="jz-desc-title" />').appendTo($divDescOverlay),
          $divDescContent = $('<div class="jz-desc-content" />').appendTo($divDescOverlay);
          
          // Create behaivor
          $modal.width(o.viewArea[0]).height(o.viewArea[1]);
          $element.bind('mousemove', function (e) {
            $modal.css({
              'left': e.clientX - 5 + 'px',
              'top': e.clientY - 5 + 'px'
            }).scrollLeft(e.clientX * zoomRatio).scrollTop(e.clientY * zoomRatio).show();
          }).bind('mouseout', function () {$modal.hide()});
          // modal
          $modal.bind('mouseenter', function () {
            $modal.show();
          })
          /*$modal.width(o.viewArea[0]).height(o.viewArea[1]);
          $(document).bind('mousemove', function (e) {
            // if e = image
            if($(e.target) === $element) {
              console.log('Image');
            } else if($(e.target) === $modal) {
              console.log('Modal');
            }
            $modal.css({
              'left': e.clientX - 5 + 'px',
              'top': e.clientY - 5 + 'px'
            }).show();
          }).bind('mouseout', function () {
            $modal.hide();
          });*/
        }
      });
    });
  }
  
  // attact plugin to $.fn
  $.extend($.fn, {
    jzoom: function (options) {
      var jzoom = new jZoomClass(options);
      return this.each(function () {
        jzoom.init(this);
      });
    }
  });
})(jQuery);
