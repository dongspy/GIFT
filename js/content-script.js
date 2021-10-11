BASEURL="http://127.0.0.1:8000";
console.log('pubmed.js');

//   function get_if(pmid) {
// 	var request =axios.get("http://127.0.0.1:8000/biomedx/get_if?name=Nature").then(function (response) {
// 	  var data = response.data
//       console.log(data)
// 	  return data
// 	}).catch(function(err){
// 	  console.log(err)
// 	});
// 	return request
//   }

  function get_if(journal_name){
	// url_str = "http://127.0.0.1:8000/biomedx/get_if?name=" + journal_name ;
	url_str = `${BASEURL}/biomedx/get_if?name=${journal_name}` ;
	$.get(url_str, function( data ) {
		console.log(data['impact_factor'])
		var impact_factor = data['impact_factor']
		return impact_factor
	  })
    
  }

  function isContains(str, substr) {
    return str.indexOf(substr) >= 0;
}

// 注意，必须设置了run_at=document_start 此段代码才会生效
// document.addEventListener('DOMContentLoaded', function()
$(document).ready(function(){
	// biomedx
	if (isContains(window.location.href, BASEURL)){
		if ($('#navbarDropdown')!=null) {
			username = $('#navbarDropdown').text().trim();
			chrome.storage.local.set({'username': username}, function(){
				console.log('chrome.storage.local.set username :' + username);
			});
		}        
	}

// 	$("<img>").attr("src", "test1image.jpg").on('load', function() {
// 		// do stuff with dimensions

// 		var imgWidth, imgHeight;
// 		var imageData; 
// 		// ... etc.

//  });
	// username
    // console.log(chrome.storage.local)
	// chrome.storage.local.get('username', function(result) {
	// 	// console.log(result);
	// 	// 退出登录后，username 为 ''
	// 	if (( typeof(result['username']) != "undefined") && (result['username'] != '')) {
	// 		// console.log('username:' + result);
	// 		// console.log('username currently is ' + result['username']);
    //           // pubmed
			$('.short-journal-citation').each(function(index){


				var journal_name = $(this).text().match(/[^.]+/gi)[0];
				// $(this).load(function())

				url_str = `${BASEURL}/biomedx/get_if?name=${journal_name}` ;
				$.ajax({
					url: url_str,  
					method: 'GET',
					success: function(data) {
						// console.log(data);
						var impact_factor = data['impact_factor']; 
						console.log(journal_name + ":" + impact_factor);
					}
				});
			}
			);
	// 	} else {
	// 		console.log('please login')
	// 	}
	// });
	

	

});