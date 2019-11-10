function styleText(text, surroundingChar, style) {
	var previous = String.fromCharCode(surroundingChar.charCodeAt(0) - 1);
	var next = String.fromCharCode(surroundingChar.charCodeAt(0) + 1);
	var regex = new RegExp(`${surroundingChar}[\u0000-${previous},${next}-\uffff]+${surroundingChar}`,'g');
	var result = text.replace(regex,
			function styleIt(x){
				var text_without_start_and_end_tag = x.slice(1, -1);
				return `<span class="${style}">${text_without_start_and_end_tag}</span>`
			});
	return result;
}
		
var doGeneratePdf  = (function (document) {
	var template = document.getElementById('textInput').value.split('\n');
	//14 lines max
	var tokens = template.length;
		
	var div = document.getElementById('taskContent');
	div.innerHTML =''
	for (var i = 0; i < tokens; i++) {
		var tokenBold = styleText(template[i], '@', "writingtask-bold")
		console.log(tokenBold)
		var tokenBoldItalic = tokenBold.replace(/#[\u0000-\u001F]+|[\u0021-\uffff]+#/g, function italicIt(x){return `<span class="writingtask-italic">${x.replace('#','').replace('#','')}</span>`});
		console.log(tokenBoldItalic)
		var tokenBoldItalicUnderline = tokenBoldItalic.replace(/![\u0000-\u001F]+|[\u0021-\uffff]+!/g, function underlineIt(x){return `<span class="writingtask-underline">${x.replace('!','').replace('!','')}</span>`});
		console.log(tokenBoldItalicUnderline)
		div.innerHTML += `${tokenBoldItalicUnderline}<br>`
	}
})

var doGetPdf = (function (window) {
	var w=window.open();
	if (w != null) {
			w.document.write(`
		<html>
		<head>
			<link rel="stylesheet" type="text/css" href="css/schoolfonts.css">
			<link rel="stylesheet" type="text/css" href="css/preview.css">
			<meta charset="UTF-8">
		</head>
		<body>
				`)
			w.document.write($('#pdfContent').html());
			w.document.write(`
		</body>
				`);
	}
})