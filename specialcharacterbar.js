// ==UserScript==
// @name     Special Character Bar
// @version  1
// @grant    none
// ==/UserScript==

//By Ben Faerber in Feb, 2018 at 15yo
//Got tips, improvments, or comments?
//Send them my way, I always want to improve!

//Preferences:
//Set your default language here: (0 = de, 1 = fr, 2 = es, 3 = pr, 4 = cu (Currency))
var lang = 0;
//Is the script active?
var isActive = false;
//0 = default, 1 = dark
var theme = 0;
//What languages do you use?
var useLangs = ["DE", "FR", "ES", "PR", "CU"];
//Do you want controls to change the language?
var switchControls = true;

var useCase = [true, true, true, true, false];
var langCodes = ["DE", "FR", "ES", "PR", "CU"];
var langNames = ["Deutsch", "Français", "Español", "Português", "Currency"];
//A 3D array that holds alphabet data
//Langs[The language][The index of letter][0 for lower, 1 for upper]
var langs = [
  [["ä", "Ä"], ["ö", "Ö"], ["ü", "Ü"], ["ß", "ß"]],
  [["à", "À"], ["â", "Â"], ["ä", "Ä"], ["æ", "Æ"], ["ç", "Ç"], ["è", "È"], ["é", "É"], ["ê", "Ê"], ["ë", "Ë"], ["î", "Î"], ["ï", "Ï"], ["ô", "Ô"], ["œ", "Œ"], ["ù", "Ù"], ["û", "Û"], ["ü", "Ü"]],
  [["á", "Á"], ["é", "É"], ["í", "Í"], ["ñ", "Ñ"], ["ó", "Ó"], ["ú", "Ú"], ["ü", "Ü"], ["¿", "¿"], ["¡", "¡"]],
  [["à", "À"], ["á", "Á"], ["â", "Â"], ["ã", "Ã"], ["é", "É"], ["ê", "Ê"], ["í", "Í"], ["ó", "Ó"], ["ô", "Ô"], ["õ", "Õ"], ["¡", "Ú"], ["ü", "Ü"], ["¿", "¿"], ["¡", "¡"]],
  [["$", "$"], ["€", "€"], ["£", "£"], ["¥", "¥"]]
];

var upper = 1;
var focused;
//Unicode arrows for the case toggle
var arrow = ["🡹", "🡻"];

//This is CSS that remains constant regardless of theme
//It is for functionality and not looks
var defStyle = `
.inputBoxClass
{
z-index: 10000;
display: inline-block;
position: absolute;
left: 0px;
top: 0px;
}
`;

var themes = [
`
/* Default Theme id=0*/
button + button {
    margin-left: 10px;
    margin-top: 5px;
}

#inputBoxExt
{
background-color: #ffffff;
color: #000000;
border: 1px solid #000000;
border-radius: 5px;
padding: 5px;
font-family: Helvetica;
}

.ButtonExt {
background-color: #bbbbbb;
color: #000000;
border: none;
width: 25px;
text-decoration: none;
border-radius: 2px;
font-size: 16px;
}

.caseButtonExt {
color: #013802;
}

.charButtonExt {
color: #000000;
}

.hideButtonExt {
color: #c60703;
}

.nextButtonExt {
color: #013802;
}

.langLabel {
font-size: 0.9em;
}
`,
`
/* Dark Theme id=1*/
button + button {
    margin-left: 10px;
    margin-top: 5px;
}

#inputBoxExt
{
background-color: #000000;
color: #ffffff;
border: 1px solid #ffffff;
border-radius: 5px;
padding: 5px;
font-family: Helvetica;
}

.ButtonExt {
background-color: #000000;
color: #ffffff;
border: 1px solid #ffffff;
width: 25px;
text-decoration: none;
border-radius: 2px;
font-size: 16px;
}

.caseButtonExt {
color: #1ee510;
}

.charButtonExt {
color: #ffffff;
}

.hideButtonExt {
color: #fc1a16;
}

.nextButtonExt {
color: #1ee510;
}

.langLabel {
font-size: 0.9em;
}
`
];

setInterval(update, 50);
createBox();
addStyle();
hide();

function update()
{
  //Runs on a loop, controls moving the input panel
  if ((document.activeElement.localName == "input" && (document.activeElement.type == "text" || document.activeElement.type == "email" || document.activeElement.type == "password")) || document.activeElement.localName == "textarea")
  {
    var rect = document.activeElement.getBoundingClientRect();
    focused = document.activeElement;
    //Put the box above textareas and below inputs
    if (rect.left-200 > 20)
    {
    	setInputPos(rect.left-200, rect.top); 
    }
    else
    {
    	setInputPos(rect.left, rect.top+35); 
    }
  }
}

function createButton(id, title, ex, lass, div)
{
  	//Creates a button and appends it to the input panel
    var button = document.createElement("button");
    button.className = "ButtonExt";
  	button.className += " " + lass;
    button.id = id;
    button.innerHTML = title;
    button.onclick = ex;
    div.appendChild(button);
}

function createBox()
{
  //Generates an input box
  var div = document.createElement("div");
  div.id = "inputBoxExt";
  div.className = "inputBoxClass";
	
  if (useCase[lang])
  {
    createButton("case", arrow[0], toggleCase, "caseButtonExt", div);
  }
  //Interates through all letters in a certain langauge and gens buttons
  var b = 1;
  for (var i = 0; i < langs[lang].length; i++)
  {
    createButton("key" + i.toString(), langs[lang][i][0], typeLetter, "charButtonExt", div);
    
    b++;
    if (b == 5)
    {
      var line = document.createElement("br");
      div.appendChild(line);
      b = 0;
    }
  }
  
	if (b > 1 && switchControls)
  {
    var line = document.createElement("br");
    div.appendChild(line);
  }
  else if (b == 4 && !switchControls)
  {
    var line = document.createElement("br");
    div.appendChild(line);
  }
  
  createButton("hideExt", "✕", hide, "hideButtonExt", div);
  if (switchControls)
  {
    createButton("nextExt", "🡸", prevLang, "nextButtonExt", div);
    createButton("nextLabelExt", langCodes[lang], tellLang, "langLabel", div);
    createButton("nextExt", "🡺", nextLang, "nextButtonExt", div);
  }
  
  document.body.appendChild(div);
}

function removeBox()
{
	document.getElementById("inputBoxExt").remove(); 
}  

function refreshBox()
{
  //Some code is only run in createBox, so to change settings it must be regenereated
	removeBox();
  createBox();
}

function addStyle()
{
  //Injects custom styles into the head
  var style = document.createElement("style");
  style.innerHTML = defStyle + themes[theme];
  document.head.appendChild(style);
}

function toggleCase()
{
  //Switches the keys from upper to lower case
  for (var i = 0; i < langs[lang].length; i++)
  {
    
    document.getElementById("key" + i.toString()).innerHTML = langs[lang][i][upper];
  }
  document.getElementById("case").innerHTML = arrow[upper];
  upper = (upper == 1) ? 0 : 1;
}

function typeLetter()
{
  focused.value += this.innerHTML;

  if (upper == 0)
  {
    toggleCase();
  }
}

//Shows or hides the box
function show(s)
{
  if (s && isActive)
  {
    document.getElementById("inputBoxExt").style.display = "inline-block";
  }
  else
  {
    document.getElementById("inputBoxExt").style.display = "none";
  }
}

function hide()
{
  show(false);
}

function nextLang()
{
	lang++;

  if (lang > langs.length-1)
  {
		lang = 0;
  }
  
  if (!useLangs.includes(langCodes[lang]))
  {
  	nextLang(); 
  }
  
  refreshBox();
}

function prevLang()
{
	lang--;

  if (lang < 0)
  {
		lang = langs.length-1;
  }
  
  if (!useLangs.includes(langCodes[lang]))
  {
  	prevLang(); 
  }
  
  refreshBox();
}

function tellLang()
{
  var message = "Language: " + langNames[lang] + "\n";
  message += "Language Code: " + langCodes[lang] + "\n";
  message += "Special Letters: " + langs[lang].length + "\n";
  if (useCase[lang])
  {
    message += "Supports Case";
  }
  else
  {
    message += "Does not support Case"; 
  }
	alert(message);
}

function setInputPos(l, t)
{
  //Moves the input box
  var div = document.getElementById("inputBoxExt");
  div.style.left = l.toString() + "px";
  div.style.top  = t.toString() + "px";
  show(true);
}