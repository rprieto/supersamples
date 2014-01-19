
(function() {

  $('.expanders a').click(function() {
    var collapsibleId = $(this).attr('href');
    $(collapsibleId).toggle();
    return false;
  });


})();
