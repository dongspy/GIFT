// if_data.js 引入全部journal impact factor

(function () {
  'use strict';
  

  function proc_journal_name(journal_name){
    var journal_name2 = journal_name.replace(/(\.|\-|\s|\_|\(|\)|,|;|amp)/ig, '').toUpperCase();
    return journal_name2
  }


  function get_if() {
    // url_str = "http://127.0.0.1:8000/biomedx/get_if?name=" + journal_name ;
    var journal_name = $('#journal').val();
    var journal_name2 = proc_journal_name(journal_name);
    console.log(journal_name2);
    $('#if').text('Impact Factor: ' + if_data[journal_name2]);

  }

  $('#if').text('Impact Factor: ');
  $('#get_if').click(function () {
    get_if();

  })

  

  function show_google_scholar_if() {
    //展示影响因子
    $('#gs_res_ccl_mid .gs_or').each(function () {
      var self = $(this);
      var data_id = $(this).attr('data-cid');
      var url = "https://scholar.google.com/scholar?q=info:" + data_id + ":scholar.google.com/&output=cite&scirp=2&hl=en";
      $.ajax({
        url: url,
        // dataType: "json",
        type: "GET",
        async: true,
        success: function (xhr) {
          // r_text=data;
          var journal_name = $(xhr).find('tr').first().find('div.gs_citr').find('i').html();
          if (journal_name) {

            var journal_name2 = proc_journal_name(journal_name);
            if (if_data[journal_name2]) {
              var impact_factor = if_data[journal_name2];
              self.append('<div class="gs_fl"><span>' + journal_name + ' - ' + impact_factor + '</span></div>');
            }
          }
          // console.log(journal_name);
          // console.log(if_data[journal_name]);

        },
        error: function (xhr, exception) {

          console.log(exception);

        }
      });
    })
  }

  function show_pubmed_if() {
    //展示影响因子
    // #search-results > section > div.search-results-chunks > div > article:nth-child(6) > div.docsum-wrap > div.docsum-content > div.docsum-citation.full-citation > span.docsum-journal-citation.full-journal-citation
    $('span.docsum-journal-citation.full-journal-citation').each(function(){
      var self = $(this);
      var journal_name = $(this).text().split('.')[0];
      if(journal_name){
        var journal_name2 = proc_journal_name(journal_name);
            if (if_data[journal_name2]) {
              var impact_factor = if_data[journal_name2];
              self.append('<div><span>[Impact Factor] ' + impact_factor + '</span></div>');
            }
      }
    })
  
  }







  // $('#google_scholar').click(function(){
  //       $('#gs_res_ccl_mid .gs_or').each(function(){
  //     var data_id = $(this).attr('data-cid');
  //     var url = "https://scholar.google.com/scholar?q=info:" + data_id + ":scholar.google.com/&output=cite&scirp=2&hl=en";
  //       $.ajax({
  //               url: url,
  //               // dataType: "json",
  //               type: "GET",
  //               async: false,
  //               success: function (xhr) {
  //                  // r_text=data;
  //                  var journal_name = $(xhr).find('tr').first().find('div.gs_citr').find('i').html();
  //                  console.log(journal_name);
  //                  console.log(if_data[journal_name]);
  //               },
  //               error: function (xhr, exception) {

  //                   console.log(exception);

  //               }
  //       });

  //   })

  // })




})();



