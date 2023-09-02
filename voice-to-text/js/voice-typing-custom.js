for (var i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 0;
updateCountry();
select_dialect.selectedIndex = 0;
showInfo('info_start');

function updateCountry() {
    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    var list = langs[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

var create_email = false;
var final_transcript = '';
//var final_textarea = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;


    recognition.onstart = function() {
        recognizing = true;
        showInfo('info_speak_now');
        start_img.src = '../images/mic-animate.gif';
		loadingIndicator.style.display = 'block';
    };

    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            start_img.src = '../images/mic.png';
            showInfo('info_no_speech');
            ignore_onend = true;
			loadingIndicator.style.display = 'none';
        }
        if (event.error == 'audio-capture') {
            start_img.src = '../images/mic.png';
            showInfo('info_no_microphone');
            ignore_onend = true;
			loadingIndicator.style.display = 'none';
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                showInfo('info_blocked');
            } else {
                showInfo('info_denied');
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }

        start_img.src = '../images/mic.png';
		loadingIndicator.style.display = 'none';
        if (!final_transcript) {
            showInfo('info_start');
            return;
        }
        showInfo('info_start');
        if (create_email) {
            create_email = false;
            createEmail();
        }
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        if (typeof(event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            upgrade();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript = event.results[i][0].transcript;
                addtext(final_transcript);
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_span.innerHTML = linebreak(final_transcript);
        interim_span.innerHTML = linebreak(interim_transcript);
        if (final_transcript || interim_transcript) {
            showButtons('inline-block');
        }
    };
}

function upgrade() {
    start_button.style.visibility = 'hidden';
    alert("upgrade");
    showInfo('info_upgrade');
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;

function capitalize(s) {
    return s.replace(first_char, function(m) {
        return m.toUpperCase();
    });
}

// for copy text 
function copyButton() {
    if (recognizing) {
        recognizing = false;
        recognition.stop();
    }
    return fieldtoclipboard.copyfield(event, final_span)
}

function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    recognition.lang = select_dialect.value;
    recognition.start();
    ignore_onend = false;
    interim_span.innerHTML = '';
    start_img.src = '../images/mic-slash.png';
    showInfo('info_allow');
    showButtons('none');
    start_timestamp = event.timeStamp;
}

function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'inline' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}

var current_style;
function showButtons(style) {
    if (style == current_style) {
        return;
    }
    counter();
}

// send to krutidev
function toKrutidev() {
    if (recognizing) {
        recognizing = false;
        recognition.stop();
    }
    hindiword = document.finaltextform.final_span.value;
    $("#hindiword").val(hindiword);
    $("#krutiform").submit();
}

function myFunction() {
    if (recognizing) {
        recognizing = false;
        recognition.stop();
    }
    data = document.finaltextform.final_span.value;
    $("#data").val(data);
    $("#my-form").submit();
}

function myFunction6() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  document.getElementById("final_span").innerHTML = '';
  //document.getElementById("data").focus();
  document.getElementById('charCountNoSpace').innerHTML = 0;
  document.getElementById('wordCount').innerHTML = 0;
  document.getElementById('totalChars').innerHTML = 0;
  document.getElementById('charCount').innerHTML = 0;
}
$('#reset_button').click ( function(){
  $('#final_span').val('');
});


function counter() {
    var value = document.finaltextform.final_span.value;
    if (value.length == 0) {
        document.getElementById('wordCount').innerHTML = 0;
        document.getElementById('totalChars').innerHTML = 0;
        document.getElementById('charCount').innerHTML = 0;
        document.getElementById('charCountNoSpace').innerHTML = 0;
        return;
    }
    var regex = /\s+/gi;
    var wordCount = value.trim().replace(regex, ' ').split(' ').length;
    var totalChars = value.length;
    var charCount = value.trim().length;
    var charCountNoSpace = value.replace(regex, '').length;
    document.getElementById('charCountNoSpace').innerHTML = charCountNoSpace;
    document.getElementById('wordCount').innerHTML = wordCount;
    document.getElementById('totalChars').innerHTML = totalChars;
    document.getElementById('charCount').innerHTML = charCount;
}

// For Print
function printTextArea() {
    var printtext = document.finaltextform.final_span.value;
    childWindow = window.open('', 'childWindow', 'location=yes, menubar=yes, toolbar=yes');
    childWindow.document.open();
    childWindow.document.write('<html><head></head><body>');
    childWindow.document.write(printtext);
    childWindow.document.write('</body></html>');
    childWindow.print();
    childWindow.document.close();
    childWindow.close();
}

// For Whatsapp	
function whatsapp_share(){
	var whatsapp_content = document.getElementById("final_span").value;
	if(whatsapp_content!==''){
		whatsapp_link = '';
		var url = "https://api.whatsapp.com/send?text="+ whatsapp_content + whatsapp_link;
		document.getElementById('whatsapp_link').setAttribute("href",url);
	}
}

// For Twitter	
function twitter_share(){
	var twitter_content = document.getElementById("final_span").value;
	if(twitter_content!==''){
		twitter_link = '';
		var url = "https://twitter.com/intent/tweet?&text="+ twitter_content + twitter_link;
		document.getElementById('twitter_link').setAttribute("href",url);
	}
}

// For save as txt file
function saveTextAsFile(){
    var textToSave = document.getElementById("final_span").value;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
	var fileNameToSaveAs = "typingguru.txt";
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}

// For save as doc file
function saveDocAsFile(){
    var textToSave = document.getElementById("final_span").value;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/Doc"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = "typingguru.doc";
	 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}

function destroyClickedElement(event){
    document.body.removeChild(event.target);
}