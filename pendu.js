//  init variables
var level = 0;
var mot = "";
var motsansaccent = "";
var motarray = [];     // in utf8 string.length gives nb bytes not nb char so split in array to get the right length
var motaffiche2 ="";   // display word with question marks and found letters

var nbtry = 0;
var nberror = 0;
var nberrormax = 8;

var indice = "";
var alphabet = "abcdefghijklmnopqrstuvwxyz";  // to display virtual keyboard
var imgsrcarray = [
  "images/pendu-err/p1.jpg",
  "images/pendu-err/p2.jpg",
  "images/pendu-err/p3.jpg",
  "images/pendu-err/p4.jpg",
  "images/pendu-err/p5.jpg",
  "images/pendu-err/p6.jpg",
  "images/pendu-err/p7.jpg",
  "images/pendu-err/p8.jpg",
  "images/pendu-err/p9.jpg",
  ];
  var imgarray = [];
  var dict;
//====================================================================================
function loadinit() {
//  just after page load initialize input areas 
//  hide the rest of the page but the input of level
//
  document.getElementById("main").style.display = "none";
  document.getElementById('infolettre').innerHTML = "";
  document.getElementById("infolettre").style.fontSize = "1em";
  document.getElementById('nbessai').innerHTML = "";
  document.getElementById("saisielettre").style.display = "block";  
}
//====================================================================================
function checkniveau(niv) { 
//   get the level of game 
//   send a server request to get a new word depending on the level
//   start loading images of the hangman
//   create the keyboard  
//   
  level = niv;
  document.getElementById("buttonniveau").style.display = "none";
  console.log (langLevelInfo+level);
  document.getElementById('pniveau').innerHTML = langLevelInfo+level;  

  getword(level);

  // for each picture create an image object and load the picture
  // when loaded add the image object in an array 
  // a new property (indx) is created to store the object in the array in the right order
  var i = 0;
  for ( i = 0; i < imgsrcarray.length; i++){
    var img = new Image();
    img.indx = i;
    
    img.onload = function() {
      imgarray[this.indx] = this;    
      }

    img.src = imgsrcarray[i];    
  }
   
  // create the virtual keybord as buttons
  for (x of alphabet) {
    var textnode = document.createTextNode(x);
    var keyclavier = document.createElement("button");
    keyclavier.appendChild(textnode);
    keyclavier.setAttribute("type","button");
    keyclavier.classList.add("buttonclavier");
    keyclavier.addEventListener("click", letterclicked);
    clavier.appendChild(keyclavier); 
  } 
  return true;  
}
//====================================================================================  
function letterclicked(event){
//  a letter has been clicked
//  at low level indicate the letters already keyed in switching the button to black
//  search all potential occurences of the letter in the word
//    
  var lettre = event.target.innerHTML ;
  if (level == 1) {
    event.target.style.backgroundColor = "black";
  }  
  document.getElementById('infolettre').innerHTML = "";
  nbtry++;  
  var lettreinmot = false;
  var x = lettre.toLowerCase();  
  var indexlettre = 0 

  // as long as letters found in the word
  // edit the displayed word with the found letters
  // tell the user he found a letter 
  //
  while (motsansaccent.indexOf(x, indexlettre) >= 0) {
    lettreinmot = true;
    indexlettre = motsansaccent.indexOf(x, indexlettre);
    var motaffiche = document.getElementById("affichmot").innerHTML ;      
    motaffiche2 = motaffiche.substr(0,indexlettre) + mot.charAt(indexlettre) + motaffiche.substr(indexlettre+1,motaffiche.length);      
    document.getElementById("affichmot").innerHTML = motaffiche2; 
    document.getElementById('infolettre').innerHTML = langLetterFound1+x+langLetterFound2;
    document.getElementById('infolettre').style.color = "green";

    indexlettre++;
  }
  // if the letter not found in the word
  // tell the user 
  // and beyond a number of errors depending on the language give an indication (definition of the word)
  // if google api was not successfull do not display indication
  //
  if (!lettreinmot){      
    document.getElementById('infolettre').innerHTML = langLetterNotFound1+x+langLetterNotFound2;
    document.getElementById('infolettre').style.color = "red"; 
    nberror++;      
    document.getElementById("imageerreur").src = imgarray[nberror].src; 
    if (indice != "") {
      if (lang == "fr" && nberror > 6 ) {
        document.getElementById('indice').innerHTML = "indication : " + indice;
      }
      if (lang == "en" && nberror > 1 ) {
        document.getElementById('indice').innerHTML = "indication : " + indice;
      }

    } else {
      document.getElementById('indice').innerHTML = "";
    }
  }

  // be the letter in the word or not -> display nb try and nb errors
  //
  document.getElementById("nbessai").innerHTML = langTryAndErrors1+nbtry+ langTryAndErrors2+nberror+langTryAndErrors3;
  var reste = nberrormax-nberror;
  document.getElementById("erreurrestant").innerHTML = langRemainingErrors1 +reste+ langRemainingErrors2;
  ;

  // if no '?' all letters have been found
  // tell the user
  // and whipe the other information out
  //
  if (!motaffiche2.includes("?")){
    document.getElementById('infolettre').innerHTML =langWin1 +nbtry+ langWin2;
    document.getElementById("infolettre").style.fontSize = "1.5em";
    document.getElementById('infolettre').style.color = "green";
    
    document.getElementById("saisielettre").style.display = "none";
    document.getElementById('nbessai').innerHTML = "";
    document.getElementById("erreurrestant").innerHTML = ""; 
  } 

  // if nb max errors  game over 
  // 
  if (nberror >= nberrormax) {
    document.getElementById('infolettre').innerHTML =langlost;
    document.getElementById("infolettre").style.fontSize = "1.5em";
    document.getElementById('infolettre').style.color = "red";
    document.getElementById("affichmot").innerHTML = mot;
    
    document.getElementById("saisielettre").style.display = "none";
    document.getElementById("clavier").style.display = "none";
    document.getElementById('nbessai').innerHTML = "";
    document.getElementById("erreurrestant").innerHTML = "";
  }
}
//====================================================================================  
function getword(glevel){
//  get a word matching the chosen level from the server 
//  when the ser has answered
//  for french: change accented letters to letters with no accent
//  split the word in an array to get the right length (due to utf8)
//  display the word substituting question marks to letters
//  if dash in the word display them at the right place
//  finally get the definition of the word from the google api 
  mot = "";
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      mot = myObj.word;
      indice = myObj.definition[0]; 
      console.log(mot);
      motsansaccent = no_accent(mot);       
      document.getElementById("main").style.display = "block";
      motarray = motsansaccent.split(""); 
      motaffiche2 = "?".repeat(motarray.length); 
      var i = motarray.indexOf("-", 0);       
      while (i >= 0) {         
        motaffiche2 = motaffiche2.substr(0,i) + "-" + motaffiche2.substr(i+1,motarray.length);
        i = motarray.indexOf("-", ++i);         
      }
      document.getElementById('affichmot').innerHTML = motaffiche2;  
 //!!     getdef(mot);     
    }
  };
  
  xhttp.open("GET", "pendu-word.php?niveau="+glevel+"&lang="+lang, true);
  xhttp.send();  

}
//====================================================================================  
function getdef(mot){
//  Get the definition of the word from the google dictionnary api
//  no longer used because it is too restrictive and deprecated
//  has been replaced by json object received in the getword function
//  
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {      
      dict = this.response;      
      var tt = Object.keys(dict[0].meaning)[0];
      indice = dict[0].meaning[tt][0].definition;
      console.log("indice: "+indice);
    } else {
      console.log("status : "+this.status);
      console.log("readystate : "+this.readyState);
    }
  }
  
  xhttp.open("GET", "https://api.dictionaryapi.dev/api/v1/entries/"+lang+"/"+mot, true);
  xhttp.responseType = 'json';
  xhttp.send();  

}
//====================================================================================  
function newgame(){
  window.location.reload();
}
//====================================================================================  
function backtohome(){
  window.location.href='index.html';
}
//====================================================================================  
function disptime(){
// not used for the time being
  datejour = new Date();
  var months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Sptembre", "Octobre", "Novembre", "Décembre"];
  var weekdays = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  annee = datejour.getFullYear();
  mois = months[datejour.getMonth()];
  joursemaine = weekdays[datejour.getDay()];
  jour = String(datejour.getDate());
  date = joursemaine + " " + jour + "-" + mois + "-" + annee;
  heure = String(datejour.getHours());
  minute = String(datejour.getMinutes());
  time = heure + "h " + minute;
  alert("date : " + date + "\n heure : " + time);
    
}
//====================================================================================
function no_accent(my_string)
//  take a word with accent and return a word without accent
//
{
    var newstring ="";
		var pattern_accent = new Array(/À/g, /Á/g, /Â/g, /Ã/g, /Ä/g, /Å/g, /Æ/g, /Ç/g, /È/g, /É/g, /Ê/g, /Ë/g,
		/Ì/g, /Í/g, /Î/g, /Ï/g, /Ð/g, /Ñ/g, /Ò/g, /Ó/g, /Ô/g, /Õ/g, /Ö/g, /Ø/g, /Ù/g, /Ú/g, /Û/g, /Ü/g, /Ý/g,
		/Þ/g, /ß/g, /à/g, /á/g, /â/g, /ã/g, /ä/g, /å/g, /æ/g, /ç/g, /è/g, /é/g, /ê/g, /ë/g, /ì/g, /í/g, /î/g,
		/ï/g, /ð/g, /ñ/g, /ò/g, /ó/g, /ô/g, /õ/g, /ö/g, /ø/g, /ù/g, /ú/g, /û/g, /ü/g, /ý/g, /ý/g, /þ/g, /ÿ/g);
 
		var pattern_replace_accent = new Array("A","A","A","A","A","A","A","C","E","E","E","E",
		"I","I","I","I","D","N","O","O","O","O","O","O","U","U","U","U","Y",
		"b","s","a","a","a","a","a","a","a","c","e","e","e","e","i","i","i",
		"i","d","n","o","o","o","o","o","o","u","u","u","u","y","y","b","y");
 
		//for each accented letter replace with unaccented letter
		for(var i=0;i<pattern_accent.length;i++)
		{
			my_string = my_string.replace(pattern_accent[i],pattern_replace_accent[i]);
    }
		my_string = my_string.replace(/[^a-zA-Z\-]/g,"");
    
		return my_string;
}

