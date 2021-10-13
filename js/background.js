// background.js

chrome.contextMenus.create({
    title: '查询影响因子：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
    onclick: function (params) {
        // 注意不能使用location.href，因为location是属于background的window对象
        // chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
        var journal_name = encodeURI(params.selectionText);
        var journal_name2 = proc_journal_name(journal_name);
        alert(journal_name2);
        console.log(journal_name2);
        alert(if_data[journal_name2]);
    }
});