$(function() {

  function getTextInsideParent($element) {
    return $element
      .clone()    // clone the element
      .children() // select all the children
      .remove()   // remove all the children
      .end()      // again go back to selected element
      .text();
  };

  // Show previous active page title within newly activated page title label.
  $('#pages').on('shown.bs.page', function (e) {

    var $newlyActivatedPage = $(e.target),
        $newlyActivatedPageTitle = $newlyActivatedPage.find('.panel-title'),
        $prevActivePage = $(e.relatedTarget),
        $prevActivePageTitle = $prevActivePage.find('.panel-title'),
        title = getTextInsideParent($prevActivePageTitle);
    
    $prevActivePageTitle
      .find('.label')
      .text('')
      .addClass('invisible');
    
    $newlyActivatedPageTitle
      .find('.label')
      .removeClass('invisible')
      .text('Previous active page: ' + title);
  });

});