for (var i = 0; i < langs.length; i++) {
  select_language.options[i] = new Option(langs[i][0], i);
}
select_language.selectedIndex = 0;
updateCountry();
select_dialect.selectedIndex = 0;
showInfo("info_start");

function updateCountry() {
  for (var i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (var i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? "hidden" : "visible";
}

var create_email = false;
var final_transcript = "";
//var final_textarea = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!("webkitSpeechRecognition" in window)) {
  upgrade();
} else {
  start_button.style.display = "inline-block";
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function () {
    recognizing = true;
    showInfo("info_speak_now");
    start_img.src = "../images/mic-animate.gif";
    loadingIndicator.style.display = "block";
  };

  recognition.onerror = function (event) {
    if (event.error == "no-speech") {
      start_img.src = "../images/mic.png";
      showInfo("info_no_speech");
      ignore_onend = true;
      loadingIndicator.style.display = "none";
    }
    if (event.error == "audio-capture") {
      start_img.src = "../images/mic.png";
      showInfo("info_no_microphone");
      ignore_onend = true;
      loadingIndicator.style.display = "none";
    }
    if (event.error == "not-allowed") {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo("info_blocked");
      } else {
        showInfo("info_denied");
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function () {
    recognizing = false;
    if (ignore_onend) {
      return;
    }

    start_img.src = "../images/mic.png";
    loadingIndicator.style.display = "none";
    if (!final_transcript) {
      showInfo("info_start");
      return;
    }
    showInfo("info_start");
    if (create_email) {
      create_email = false;
      createEmail();
    }
  };

  recognition.onresult = function (event) {
    var interim_transcript = "";
    if (typeof event.results == "undefined") {
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
      showButtons("inline-block");
    }
  };
}

function upgrade() {
  start_button.style.visibility = "hidden";
  alert("upgrade");
  showInfo("info_upgrade");
}

var two_line = /\n\n/g;
var one_line = /\n/g;

function linebreak(s) {
  return s.replace(two_line, "<p></p>").replace(one_line, "<br>");
}

var first_char = /\S/;

function capitalize(s) {
  return s.replace(first_char, function (m) {
    return m.toUpperCase();
  });
}

// for copy text
function copyButton() {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  return fieldtoclipboard.copyfield(event, final_span);
}

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    return;
  }
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  interim_span.innerHTML = "";
  start_img.src = "../images/mic-slash.png";
  showInfo("info_allow");
  showButtons("none");
  start_timestamp = event.timeStamp;
}

function showInfo(s) {
  if (s) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == s ? "inline" : "none";
      }
    }
    info.style.visibility = "visible";
  } else {
    info.style.visibility = "hidden";
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
  document.getElementById("final_span").innerHTML = "";
  //document.getElementById("data").focus();
  document.getElementById("charCountNoSpace").innerHTML = 0;
  document.getElementById("wordCount").innerHTML = 0;
  document.getElementById("totalChars").innerHTML = 0;
  document.getElementById("charCount").innerHTML = 0;
}
$("#reset_button").click(function () {
  $("#final_span").val("");
});

function counter() {
  var value = document.finaltextform.final_span.value;
  if (value.length == 0) {
    document.getElementById("wordCount").innerHTML = 0;
    document.getElementById("totalChars").innerHTML = 0;
    document.getElementById("charCount").innerHTML = 0;
    document.getElementById("charCountNoSpace").innerHTML = 0;
    return;
  }
  var regex = /\s+/gi;
  var wordCount = value.trim().replace(regex, " ").split(" ").length;
  var totalChars = value.length;
  var charCount = value.trim().length;
  var charCountNoSpace = value.replace(regex, "").length;
  document.getElementById("charCountNoSpace").innerHTML = charCountNoSpace;
  document.getElementById("wordCount").innerHTML = wordCount;
  document.getElementById("totalChars").innerHTML = totalChars;
  document.getElementById("charCount").innerHTML = charCount;
}

// For Print
function printTextArea() {
  var printtext = document.finaltextform.final_span.value;
  childWindow = window.open(
    "",
    "childWindow",
    "location=yes, menubar=yes, toolbar=yes"
  );
  childWindow.document.open();
  childWindow.document.write("<html><head></head><body>");
  childWindow.document.write(printtext);
  childWindow.document.write("</body></html>");
  childWindow.print();
  childWindow.document.close();
  childWindow.close();
}

// For Whatsapp
function whatsapp_share() {
  var whatsapp_content = document.getElementById("final_span").value;
  if (whatsapp_content !== "") {
    whatsapp_link = "";
    var url =
      "https://api.whatsapp.com/send?text=" + whatsapp_content + whatsapp_link;
    document.getElementById("whatsapp_link").setAttribute("href", url);
  }
}

// For Twitter
function twitter_share() {
  var twitter_content = document.getElementById("final_span").value;
  if (twitter_content !== "") {
    twitter_link = "";
    var url =
      "https://twitter.com/intent/tweet?&text=" +
      twitter_content +
      twitter_link;
    document.getElementById("twitter_link").setAttribute("href", url);
  }
}

// For save as txt file
function saveTextAsFile() {
  var textToSave = document.getElementById("final_span").value;
  var textToSaveAsBlob = new Blob([textToSave], { type: "text/plain" });
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
function saveDocAsFile() {
  var textToSave = document.getElementById("final_span").value;
  var textToSaveAsBlob = new Blob([textToSave], { type: "text/Doc" });
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

function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}

const tasks = [
  {
    nepali: "घर/जग्गा नामसारीको सिफारिस गरी पाऊँ",
    roman: "Ghar/Jagga Namasariko Sifaris Gari Paun",
  },
  {
    nepali: "मोही लगत कट्टाको सिफारीस पाउं",
    roman: "Mohi Lagat Kattako Sifaris Paun",
  },
  { nepali: "घर कायम सिफारीस पाउं", roman: "Ghar Kayam Sifaris Paun" },
  { nepali: "अशक्त सिफारिस", roman: "Ashakt Sifaris" },
  {
    nepali: "छात्रबृत्तिको लागि सिफारिस पाऊँ",
    roman: "Chhatrabrittako Lagi Sifaris Paun",
  },
  {
    nepali: "आदिवासी जनजाति प्रमाणित गरी पाऊँ",
    roman: "Adivasi Janajati Pramanit Gari Paun",
  },
  {
    nepali: "अस्थायी बसोबासको सिफारिस पाऊँ",
    roman: "Asthayi Basobasko Sifaris Paun",
  },
  {
    nepali: "स्थायी बसोबासको सिफारिस गरी पाऊँ",
    roman: "Sthayi Basobasko Sifaris Gari Paun",
  },
  {
    nepali: "आर्थिक अवस्था कमजोर सिफारिस पाऊँ",
    roman: "Arthik Avastha Kamjor Sifaris Paun",
  },
  {
    nepali: "नयाँ घरमा विद्युत जडान सिफारिस पाऊँ",
    roman: "Naya Gharma Vidyut Jadana Sifaris Paun",
  },
  {
    nepali: "धारा जडान सिफारिस पाऊँ",
    roman: "Dhara Jadana Sifaris Paun",
  },
  {
    nepali: "दुबै नाम गरेको ब्यक्ति एक्कै हो भन्ने सिफारिस पाऊँ",
    roman: "Dubai Naam Gareko Byakta Ekka Ho Bhane Sifaris Paun",
  },
  {
    nepali: "ब्यवसाय बन्द सिफारिस पाऊँ",
    roman: "Byabasaya Band Sifaris Paun",
  },
  {
    nepali: "व्यवसाय ठाउँसारी सिफारिस पाऊँ",
    roman: "Byabasaya Thaunsari Sifaris Paun",
  },
  {
    nepali: "कोर्ट–फिमिनाहा सिफारिस पाऊँ",
    roman: "Kort-Fimaniyaha Sifaris Paun",
  },
  { nepali: "नाबालक सिफारिस पाऊँ", roman: "Nabalak Sifaris Paun" },
  { nepali: "चौपाया सिफारिस पाऊँ", roman: "Chaupaya Sifaris Paun" },
  { nepali: "संस्था दर्ता गरी पाऊँ", roman: "Sanstha Darta Gari Paun" },
  {
    nepali: "विद्यालय ठाउँसारी सिफारिस पाऊँ",
    roman: "Bishwavidyalaya Thaunsari Sifaris Paun",
  },
  {
    nepali: "विद्यालय संचालन/कक्षा बृद्धिको सिफारिस पाऊँ",
    roman: "Bishwavidyalaya Sancharan/Kaksha Briddhi Sifaris Paun",
  },
  {
    nepali: "जग्गा दर्ता सिफारिस पाऊँ",
    roman: "Jagga Darta Sifaris Paun",
  },
  { nepali: "संरक्षक सिफारिस पाऊँ", roman: "Sanrakshak Sifaris Paun" },
  { nepali: "बाटो कायम सिफारिस पाऊँ", roman: "Bato Kayam Sifaris Paun" },
  {
    nepali: "जिवित नाता प्रमाणित गरी पाऊँ",
    roman: "Jiviti Nata Pramanit Gari Paun",
  },
  {
    nepali: "मृत्यु नाता प्रमाणित गरी पाऊँ",
    roman: "Mrityu Nata Pramanit Gari Paun",
  },
  {
    nepali: "निःशुल्क स्वास्थ्य उपचारको लागि सिफारिस पाऊँ",
    roman: "Nishulka Swasthya Upacharko Lagi Sifaris Paun",
  },
  {
    nepali: "संस्था दर्ता सिफारिस पाऊँ",
    roman: "Sanstha Darta Sifaris Paun",
  },
  {
    nepali: "घर बाटो प्रमाणित गरी पाऊँ",
    roman: "Ghar Bato Pramanit Gari Paun",
  },
  {
    nepali: "चारकिल्ला प्रमाणित गरि पाउ",
    roman: "Charakilla Pramanit Gari Paun",
  },
  {
    nepali: "जन्म मिति प्रमाणित गरि पाउ",
    roman: "Janma Miti Pramanit Gari Paun",
  },
  { nepali: "बिवाह प्रमाणित गरी पाऊँ", roman: "Bivaha Pramanit Gari Paun" },
  {
    nepali: "घर पाताल प्रमाणित गरी पाऊँ",
    roman: "Ghar Patal Pramanit Gari Paun",
  },
  {
    nepali: "हकदार प्रमाणित गरी पाऊँ",
    roman: "Hakdar Pramanit Gari Paun",
  },
  {
    nepali: "अबिवाहित प्रमाणित गरी पाऊँ",
    roman: "Abibahit Pramanit Gari Paun",
  },
  {
    nepali: "जग्गाधनी प्रमाण पूर्जा हराएको सिफारिस पाऊँ",
    roman: "Jaggaadhani Praman Purja Haraeko Sifaris Paun",
  },
  {
    nepali: "व्यवसाय दर्ता गरी पाऊँ",
    roman: "Byabasaya Darta Gari Paun",
  },
  {
    nepali: "मोही नामसारीको लागि सिफारिस गरी पाऊँ",
    roman: "Mohi Namasariko Lagi Sifaris Gari Paun",
  },
  { nepali: "मूल्याङ्कन गरी पाऊँ", roman: "Mulyankan Gari Paun" },
  {
    nepali: "तीन पुस्ते खोली सिफारिस गरी पाऊँ",
    roman: "Tin Puste Kholi Sifaris Gari Paun",
  },
  {
    nepali: "पुरानो घरमा विद्युत जडान सिफारिस पाऊँ",
    roman: "Purano Gharma Vidyut Jadana Sifaris Paun",
  },
  {
    nepali: "सामाजिक सुरक्षा भत्ता नाम दर्ता सम्बन्धमा",
    roman: "Samajik Suraksha Bhata Naam Darta Samb1``andhama",
  },
  { nepali: "बहाल समझौता", roman: "Bahal Samjhaauta" },
  { nepali: "कोठा खोली पाऊँ", roman: "Kotha Kholi Paun" },
  { nepali: "अपाङ्ग सिफारिस पाऊँ", roman: "Apang Sifaris Paun" },
  {
    nepali: "नापी नक्सामा बाटो नभएको फिल्डमा बाटो भएको सिफारिस",
    roman: "Napi Naxama Bato Nabhaeko Fieldma Bato Bhayeko Sifaris",
  },
  { nepali: "धारा नामसारी सिफारिस पाऊँ", roman: "Dhara Namasari Sifaris Paun" },
  {
    nepali: "विद्युत मिटर नामसारी सिफारिस",
    roman: "Vidyut Meter Namasari Sifaris",
  },
  {
    nepali: "फोटो टाँसको लागि तीन पुस्ते खोली सिफारिस पाऊ",
    roman: "Photo Taansko Lagi Tin Puste Kholi Sifaris Paun",
  },
  { nepali: "कोठा बन्द सिफारिस पाऊँ", roman: "Kotha Band Sifaris Paun" },
  {
    nepali: "अस्थाई टहराको सम्पत्ति कर तिर्न सिफारिस गरी पाऊँ",
    roman: "Asthai Taharko Sampatti Kar Tirna Sifaris Gari Paun",
  },
  {
    nepali: "औषधि उपचार बापत खर्च पाउँ भन्ने सम्वन्धमा",
    roman: "Aushadhi Upachar Baapata Kharch Paun Bhann Sambandhama",
  },
  {
    nepali: "नागरिकता र प्रतिलिपि सिफारिस",
    roman: "Nagarikata Ra Pratilipi Sifaris",
  },
  { nepali: "अंग्रेजीमा सिफारिस", roman: "Angrejima Sifaris" },
];

async function queryy(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/syubraj/sentence_similarity_nepali",
    {
      headers: {
        Authorization: "Bearer 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",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

function findMostSimilarTask(query) {
  // Step 1: Split the input query into words in Nepali.
  const queryWords = query.split(" ");
  const queryWordCount = queryWords.length;
  const queryWordSet = new Set(queryWords);

  // Step 2: Calculate similarity scores based on Nepali words.
  const taskScores = tasks.map((task) => {
    // Split the Nepali task description into words.
    const taskWords = task.nepali.split(" ");
    const taskWordCount = taskWords.length;
    const taskWordSet = new Set(taskWords);

    // Calculate the intersection of words between the query and task description.
    const intersection = new Set(
      [...queryWordSet].filter((x) => taskWordSet.has(x))
    );

    // Calculate the similarity score based on word overlap.
    const score = intersection.size / queryWordCount;
    console.log(score);
    return { task, score };
  });

  // Step 3: Sort the tasks by their similarity scores.
  const sortedTaskScores = taskScores.sort((a, b) => b.score - a.score);

  // Step 6: Return the task with the highest combined score as the most similar task.
  return sortedTaskScores[0].task;
}

function checkNow() {
  const query = document.getElementById("final_span").value;
  /* const mostSimilarTask = findMostSimilarTask(query);
  alert(query + " = " + mostSimilarTask.nepali); */

  queryy({
    inputs: {
      source_sentence: query,
      //tasks to array of nepali text from tasks
      sentences: tasks.map((task) => task.nepali),
    },
  }).then((response) => {
    let maxInd = 0;
    let maxval = response[0];
    response.forEach((res) => {
      if (res > maxval) {
        maxval = res;
        maxInd = response.indexOf(res);
      }
    });
    alert(query + " = " + tasks[maxInd].nepali);
  });
}
