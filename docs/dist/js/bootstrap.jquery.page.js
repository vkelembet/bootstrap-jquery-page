/* ========================================================================
 * Bootstrap jQuery plugin for Pages conponent: bootstrap.jquery.page.js
 * v 1.0.0
 * ========================================================================
 * Copyright Volodymyr Kelembet.
 * Licensed under MIT.
 * ======================================================================== */


(function ($) {

  if (!$.fn.popover) throw new Error('Page plugin requires popover.js');

  // PAGE CLASS DEFINITION
  // ====================

  var Page = function ($element) {
    this.$element = $element;
  }

  Page.VERSION = '0.0.1';

  Page.TRANSITION_DURATION = 150;

  Page.prototype.show = function () {
    var $this = this.$element,
        $target = $this.hasClass('page-pane') ? $this : $($this.data('target'));

    if ($target.hasClass('active')) return;

    var $previous = $target.siblings('.active');
    
    var hideEvent = $.Event('hide.bs.page', {
      relatedTarget: $target[0]
    });

    var showEvent = $.Event('show.bs.page', {
      relatedTarget: $previous[0]
    });

    $previous.trigger(hideEvent);
    $target.trigger(showEvent);

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.page',
        relatedTarget: $target[0]
      });

      $target.trigger({
        type: 'shown.bs.page',
        relatedTarget: $previous[0]
      });
    })
  }

  Page.prototype.activate = function ($element, $container, callback) {
    var $active    = $container.find('> .active');
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!$container.find('> .fade').length);

    function next() {
      $active.removeClass('active').attr('aria-expanded', false);
      $element.addClass('active').attr('aria-expanded', true);

      if (transition) {
        $element[0].offsetWidth; // reflow for transition
        $element.addClass('in');
      } else {
        $element.removeClass('fade');
      }

      callback && callback();
    }

    if ($active.length && transition) {
      $active.one('bsTransitionEnd', next).emulateTransitionEnd(Page.TRANSITION_DURATION);
    } else {
      next();
    }

    $active.removeClass('in');
  }


  // PAGE PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data  = $this.data('bs.page');

      if (!data) {
        $this.data('bs.page', (data = new Page($this)));
      }

      if (typeof option == 'string') {
        data[option]();
      }
    });
  }

  var old = $.fn.page;

  $.fn.page = Plugin;
  $.fn.page.Constructor = Page;


  // PAGE NO CONFLICT
  // ===============

  $.fn.page.noConflict = function () {
    $.fn.page = old;
    return this;
  }


  // PAGE DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault();
    // Show selected page.
    Plugin.call($(this), 'show');
  }

  $(document).on('click.bs.page.data-api', '[data-toggle="page"]', clickHandler);


})(jQuery);