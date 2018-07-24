# SpecialCharacterBar
A Javascript user script, that adds a bar to type special characters from a multitude of languages.

This was inspired by Duolingo. It gives you a bar where you can type accented or special characters. It is much easier than memorizing keyboard shortcuts or using keyboard stickers and switching your keyboard language.

It was tested in GreaseMonkey on Firefox. It should work on other browers / userscript extensions however I havent tested it.

Right now I have support for 4 languages and 1 with currency characters. I have German, French, Spanish, and Portuguese. Adding support for the language you need is simple!

Add your language into the following arrays:

var useCase = [true, true, true, true, false];

var langCodes = ["DE", "FR", "ES", "PR", "CU"];

var langNames = ["Deutsch", "Français", "Español", "Português", "Currency"];

var langs = [
  [["ä", "Ä"], ["ö", "Ö"], ["ü", "Ü"], ["ß", "ß"]],
  
  [["à", "À"], ["â", "Â"], ["ä", "Ä"], ["æ", "Æ"], ["ç", "Ç"], ["è", "È"], ["é", "É"], ["ê", "Ê"], ["ë", "Ë"], ["î", "Î"], ["ï", "Ï"], ["ô", "Ô"], ["œ", "Œ"], ["ù", "Ù"], ["û", "Û"], ["ü", "Ü"]],
  
  [["á", "Á"], ["é", "É"], ["í", "Í"], ["ñ", "Ñ"], ["ó", "Ó"], ["ú", "Ú"], ["ü", "Ü"], ["¿", "¿"], ["¡", "¡"]],
  [["à", "À"], ["á", "Á"], ["â", "Â"], ["ã", "Ã"], ["é", "É"], ["ê", "Ê"], ["í", "Í"], ["ó", "Ó"], ["ô", "Ô"], ["õ", "Õ"], ["¡", "Ú"], ["ü", "Ü"], ["¿", "¿"], ["¡", "¡"]],
  
  [["$", "$"], ["€", "€"], ["£", "£"], ["¥", "¥"]]
  
];
