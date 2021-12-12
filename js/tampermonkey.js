// ==UserScript==
// @name         GIFT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://scholar.google.com/scholar?*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://raw.githubusercontent.com/lipidong/GIFT/main/js/impact_factor_2021.js
// @grant        none
// ==/UserScript==

/* global $ */

// if_data.js 引入全部journal impact factor


var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

loadAndExecute("https://libs.baidu.com/jquery/2.0.0/jquery.min.js", function() {
   // $(".gs_fl").hide();
    console.log("abcd");
   // <input type="checkbox" name="vehicle1" value="Bike" style="display:inline">
$('.gs_ri').each(function () {
      var self = $(this);
      self.prepend('<input type="checkbox" name="vehicle1" value="Bike" style="display:inline">');
      self.find('h3').first().css({'display': 'inline'})
})

});
