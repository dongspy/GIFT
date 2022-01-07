// if_data.js 引入全部journal impact factor

(function () {
  'use strict';

  // var journal_name;
  window['journal_name'] = ''
  var impact_factor;
  var term_articles = {};


  function proc_journal_name(journal_name) {
    var journal_name2 = journal_name.replace(/(\.|\-|\s|\_|\(|\)|,|;|amp)/ig, '').toUpperCase();
    return journal_name2
  }


  function get_if() {
    // url_str = "http://127.0.0.1:8000/biomedx/get_if?name=" + journal_name ;
    var journal_name = $('#journal').val().trim();
    var journal_name2 = proc_journal_name(journal_name);
    console.log(journal_name2);
    $('#if').text('Impact Factor: ' + if_data[journal_name2]);

  }

  function contains(string, substr, isIgnoreCase) {
    if (isIgnoreCase) {
      string = string.toLowerCase();
      substr = substr.toLowerCase();
    }

    var startChar = substr.substring(0, 1);
    var strLen = substr.length;

    for (var j = 0; j < string.length - strLen + 1; j++) {
      if (string.charAt(j) == startChar)  //如果匹配起始字符,开始查找
      {
        if (string.substring(j, j + strLen) == substr)  //如果从j开始的字符与str匹配，那ok
        {
          return true;
        }
      }
    }
    return false;
  }

  $('#get_if').click(function () {
    get_if();

  })

  function get_first(_list) {
    if (_list == null) {
      return ''
    } else {
      return _list[0]
    }
  }



  function show_google_scholar_if() {
    //展示影响因子
    var article_info_dict = {}
    $('#gs_res_ccl_mid .gs_or').each(function () {
      var self = $(this);

    // var checkout_ele = self.find('div.gs_ri');
    // checkout_ele.prepend('<input type="checkbox" class="checkout" name="vehicle1" value="Bike" style="display:inline">');
    // checkout_ele.find('h3').first().css({ 'display': 'inline' });

      // 提取文章标题
      var article_title = self.find('h3.gs_rt a').first().text();
      // console.log(article_title);

      // 引用次数
      var cite_pattern = /(?<=Cited by\s).+(?=\sRelated articles)/i;
      // console.log(self.find('div.gs_ri').first().find('.gs_fl').first().text());
      var cite_count = get_first(cite_pattern.exec(self.find('div.gs_ri').first().find('.gs_fl').first().text()));
      // console.log(cite_count);

      // 发表年份
      var year_pattern = /(?<=[,|-]\s)\d+(?=\s-)/i;
      // console.log(self.children("div.gs_ri").first().children('div.gs_a').first().text());
      var publish_year = get_first(year_pattern.exec(self.children("div.gs_ri").first().children('div.gs_a').first().text()));
      // console.log(article_title, cite_count, publish_year);

      // 提取杂志名称
      // var pattern = /(?<=[-|,|\.]\s).+(?=,)/i;
      var pattern = /(?<=[-]\s).+(?=,)/i;
      // console.log(self.children("div.gs_ri").first().children('div.gs_a').first().text());
      var journal_str = get_first(pattern.exec(self.children("div.gs_ri").first().children('div.gs_a').first().text()));

      var data_id = $(this).attr('data-cid');
      // article_info_dict[data_id] = [article_title, cite_count, publish_year]




      var checkbox_str = '<div class="gs_fl"><input class="ckb" type="checkbox" class="checkout" style="display:inline" ';

      var article_info = [article_title, cite_count, publish_year]
      checkbox_str += 'article_title="' + article_title + '" '
      checkbox_str += 'cite_count="' + cite_count + '" '
      checkbox_str += 'publish_year="' + publish_year + '" '
      checkbox_str += 'id="' + data_id + '" '
      // checkbox_str += 'impact_factor="' + article_info[4] + '" '
      checkbox_str += 'data_id="' + data_id + '" '

      checkbox_str += '/></div>'

      self.append(checkbox_str);

      var ckb_ele = self.find('input#' + data_id).first()
      ckb_ele.hide()

      //确定 checkbox 状态
      chrome.storage.sync.get({ 'term_articles': {} }, function (items) {
        // if (items.showif) {
        //   show_google_scholar_if();
        // }
        var term = $('#gs_hdr_tsi').val().trim();
        var term_articles = items.term_articles
        if (term in term_articles) {
          if (data_id in term_articles[term]) {
            ckb_ele.prop("checked", true)
          }
        }
      })

      // 如果杂志名称中出现 ..., 说明杂志名称显示不完整需要依赖 cite 内容进行判断
      if (contains(journal_str, '…', true)) {
        // var data_id = $(this).attr('data-cid');
        var url = "https://scholar.google.com/scholar?q=info:" + data_id + ":scholar.google.com/&output=cite&scirp=2&hl=en";
        $.ajax({
          url: url,
          // dataType: "json",
          type: "GET",
          async: true, // 程序是异步，所以没有执行的先后顺序
          success: function (xhr) {
            // r_text=data;
            journal_name = $(xhr).find('tr').first().find('div.gs_citr').find('i').html();

            // if (journal_name) {

            var journal_name2 = proc_journal_name(journal_name);
            if (if_data[journal_name2]) {
              impact_factor = if_data[journal_name2];


            } else {
              // self.append('<div class="gs_fl"><span>' + journal_name + ' - na </span></div>');
              impact_factor = 'na'
            }

            // ckb_ele = self.find('input#' + data_id).first()
            ckb_ele.attr({ 'journal_name': journal_name, 'impact_factor': impact_factor })
            ckb_ele.after(journal_name + ' - ' + impact_factor)
            ckb_ele.show()

            // //   article_info_dict[data_id].push(journal_name);
            // // article_info_dict[data_id].push(impact_factor);
            // }

            // console.log(journal_name);
            // console.log(if_data[journal_name]);

          },
          error: function (xhr, exception) {

            console.log(exception);

          }
        });
      } else {
        journal_name = journal_str;
        var journal_name2 = proc_journal_name(journal_name);

        if (if_data[journal_name2]) {
          impact_factor = if_data[journal_name2];

        } else {
          // self.append('<div class="gs_fl"><span>' + journal_name + ' - na </span></div>');
          impact_factor = 'na'
        }
        ckb_ele.attr({ 'journal_name': journal_name, 'impact_factor': impact_factor })
        // ckb_ele.val(journal_name +  ' - ' + impact_factor)
        ckb_ele.after(journal_name + ' - ' + impact_factor)
        ckb_ele.show()

      }



      // term_articles[term] = {}
      // 处理复选框
      $(".ckb").click(function (e) {
        var term = $('#gs_hdr_tsi').val().trim();
        console.log(term);
        self = $(this)
        // 选中，将数据写入 chrome storage
        if ($(this).prop('checked') == true) {
          console.log('checked');
          console.log($(this));
          console.log(e);
          // term_articles[term]
          var data_id = $(this).attr('data_id');
          var article_title = $(this).attr('article_title');
          var cite_count = $(this).attr('cite_count');
          var publish_year = $(this).attr('publish_year');
          var journal_name = $(this).attr('journal_name');
          var impact_factor = $(this).attr('impact_factor');
          // console.log([article_title, cite_count, publish_year, journal_name, impact_factor])

          chrome.storage.sync.get({ 'term_articles': {} }, function (items) {
            // if (items.showif) {
            //   show_google_scholar_if();
            // }
            term_articles = items.term_articles
            if (!(term in term_articles)) {
              term_articles[term] = {}
            }
            term_articles[term][data_id] = [article_title, cite_count, publish_year, journal_name, impact_factor]

            chrome.storage.sync.set({ 'term_articles': term_articles }, function (items) {
              console.log('保存成功', term_articles);
            });

          });

          // 移除，将数据移出 chrome storage
        } else {
          console.log('unchecked');

          chrome.storage.sync.get({ 'term_articles': {} }, function (items) {

            term_articles = items.term_articles

            var data_id = self.attr('data_id');
            if (data_id in term_articles[term]) {
              delete term_articles[term][data_id]
            } else {
              console.log(data_id + 'not exist in ' + term)
            }
            chrome.storage.sync.set({ 'term_articles': term_articles }, function (items) {
              console.log('保存成功', term_articles);
            });

          });


        }

      })


    })

  }



  function show_pubmed_if() {
    //展示影响因子
    // #search-results > section > div.search-results-chunks > div > article:nth-child(6) > div.docsum-wrap > div.docsum-content > div.docsum-citation.full-citation > span.docsum-journal-citation.full-journal-citation
    $('span.docsum-journal-citation.full-journal-citation').each(function () {
      var self = $(this);
      var journal_name = $(this).text().split('.')[0];
      if (journal_name) {
        var journal_name2 = proc_journal_name(journal_name);
        if (if_data[journal_name2]) {
          var impact_factor = if_data[journal_name2];
          self.append('<div><span>[Impact Factor] ' + impact_factor + '</span></div>');
        }
      }
    })

  }

  // google scholar
  var show_if_flag = true;
  // 读取数据，第一个参数是指定要读取的key以及设置默认值
  chrome.storage.sync.get({ showif: true }, function (items) {
    if (items.showif) {
      show_google_scholar_if();
    }
  });

  // 显示badge
  $('#show_if').click(() => {
    chrome.browserAction.setBadgeText({ text: 'ON' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    // 保存数据
    chrome.storage.sync.set({ showif: true }, function () {
      console.log('保存成功！');
    });

    // popup主动发消息给content-script
    $('#send_message_to_content_script').click(() => {
      sendMessageToContentScript('你好，我是popup！', (response) => {
        if (response) alert('收到来自content-script的回复：' + response);
      });
    });

  });

  // 隐藏badge
  $('#hide_if').click(() => {
    chrome.browserAction.setBadgeText({ text: 'OFF' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    chrome.storage.sync.set({ showif: false }, function () {
      console.log('保存成功！');
    });
  });

  // pubmed
  show_pubmed_if();

  function popup_article_info(){
    chrome.storage.sync.get({ 'term_articles': {} }, function (items) {

      var term_articles = items.term_articles
      // var term = $('#gs_hdr_tsi').val().trim();

      var table_html = '<table class="table" id="article_table"><thead><tr><th>Term</th><th>Article</th>' + 
        '<th>Publish Date</th> <th>Cite</th> <th>Journal</th> <th>Impact Factor</th></tr></thead>'

      for (var term in term_articles) {
        var tr_html = '<tr>'
        for (var data_id in term_articles[term]){
          var article_info = term_articles[term][data_id]
          // [article_title, cite_count, publish_year, journal_name, impact_factor]
          tr_html += '<td>' + term + '</td>'
          tr_html += '<td>' + article_info[0] + '</td>'
          tr_html += '<td>' + article_info[2] + '</td>'
          tr_html += '<td>' + article_info[1] + '</td>'
          tr_html += '<td>' + article_info[3] + '</td>'
          tr_html += '<td>' + article_info[4] + '</td>'
          tr_html += '</tr>'
        }
        table_html += tr_html
        table_html += '</table>'
        $('div#article_info').append('<div>' + table_html + '</div>');   
      }
    });

    $('#export').on('click',function(){
      $('#article_table').tableToCsv({
        outputheaders:true,
        extension:'tsv',
        fileName: 'Article_Information',
        seperator:'\t',



      });
    })

    $('#clear_storage').on('click',function(){
      // $('#clear_storage').tableToCsv();
      chrome.storage.sync.set({ 'term_articles': {} })
    })
  }

  popup_article_info()

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



