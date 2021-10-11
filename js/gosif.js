(function() {
    'use strict';

  function get_if(){
  // url_str = "http://127.0.0.1:8000/biomedx/get_if?name=" + journal_name ;
    var journal_name = $('journal').val();
    $('#if').val(if_data[journal_name]);
    
  }

  function show_if(){
//展示影响因子
  // Your code here...
  $('#gs_res_ccl_mid .gs_or').each(function(){
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
                 if(journal_name){ 

                  var journal_name2 = journal_name.replace(/(\.|\-|\s|\_|\(|\)|,|;|amp)/ig, '').toUpperCase();
                  console.log(journal_name2);
                  if(if_data[journal_name2]){
                    var q = if_data[journal_name2][0];
                    var impact_factor = if_data[journal_name2][1];
                    self.append('<div class="gs_fl"><span>' + journal_name + '</span> - <span>' + q + '</span> - <span>' + impact_factor + '</span>');
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

var show_if_flag=true;
// 读取数据，第一个参数是指定要读取的key以及设置默认值
chrome.storage.sync.get({showif: true}, function(items) {
  if(items.showif){
    show_if();
  }
});



  // 显示badge
$('#show_if').click(() => {
  chrome.browserAction.setBadgeText({text: 'ON'});
  chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
  // 保存数据
  chrome.storage.sync.set({showif: true}, function() {
    console.log('保存成功！');
  });

  // popup主动发消息给content-script
$('#send_message_to_content_script').click(() => {
  sendMessageToContentScript('你好，我是popup！', (response) => {
    if(response) alert('收到来自content-script的回复：'+response);
  });
});

});

// 隐藏badge
$('#hide_if').click(() => {
  chrome.browserAction.setBadgeText({text: 'OFF'});
  chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
  chrome.storage.sync.set({showif: false}, function() {
    console.log('保存成功！');
  });
});



$('#get_if').click(function(){
  var journal_name = $('#journal').val();
  $('#if').val(if_data[journal_name]);

})


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



