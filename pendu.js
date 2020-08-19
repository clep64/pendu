var level = 0;
var mot = "";
var nbtry = 0;
var nberror = 0;
var motsansaccent = no_accent(mot);
var motaffiche2 ="";
var nberrormax = 8;
var motarray = [];
var indice = "";
var alphabet = "abcdefghijklmnopqrstuvwxyz";
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
//  init variables
//  just after page load initialize input areas 
//  and give focus to the first input
//  hide the rest of the page but the input of level
//
  nbtry = 0;    
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
  document.getElementById('pniveau').innerHTML = "vous êtes au niveau: "+level;  

  getword(level);

  var i = 0;
  for ( i = 0; i < imgsrcarray.length; i++){
    var img = new Image();
    img.indx = i;
    
    img.onload = function() {
      imgarray[this.indx] = this;    
      }

    img.src = imgsrcarray[i];    
  }
    
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
  var lettre = event.target.innerHTML ;
  if (level == 1) {
    event.target.style.backgroundColor = "black";
  }  
  document.getElementById('infolettre').innerHTML = "";
  nbtry++;  
  var lettreinmot = false;
  var x = lettre.toLowerCase();  
  var indexlettre = 0 

  // tant que la lettre est dans le mot car plusieurs occurences possibles   
  while (motsansaccent.indexOf(x, indexlettre) >= 0) {
    lettreinmot = true;
    indexlettre = motsansaccent.indexOf(x, indexlettre);
    var motaffiche = document.getElementById("affichmot").innerHTML ;      
    motaffiche2 = motaffiche.substr(0,indexlettre) + mot.charAt(indexlettre) + motaffiche.substr(indexlettre+1,motaffiche.length);      
    document.getElementById("affichmot").innerHTML = motaffiche2; 
    document.getElementById('infolettre').innerHTML = "!!! la lettre "+x+" est bien dans le mot !!!";
    document.getElementById('infolettre').style.color = "green";

    indexlettre++;
  }
  // si lettre pas dans le mot
  if (!lettreinmot){      
    document.getElementById('infolettre').innerHTML = "!!! la lettre "+x+" n'est pas dans le mot !!!";
    document.getElementById('infolettre').style.color = "red"; 
    nberror++;      
    document.getElementById("imageerreur").src = imgarray[nberror].src; 
    if (nberror > 2) {
      document.getElementById('indice').innerHTML = "indication : " + indice;
    }
  }

  // be the letter in the word or not -> display nb try and nb errors
  document.getElementById("nbessai").innerHTML = "vous avez fait "+nbtry+ " essais dont "+nberror+" erreurs";
  var reste = nberrormax-nberror;
  document.getElementById("erreurrestant").innerHTML = "<br>il vous reste "+reste+ " erreurs";

  // if no '?' the word has been found
  if (!motaffiche2.includes("?")){
    document.getElementById('infolettre').innerHTML ="!!! vous avez trouvé en "+nbtry+" essais !!!";
    document.getElementById("infolettre").style.fontSize = "1.5em";
    document.getElementById('infolettre').style.color = "green";
    
    document.getElementById("saisielettre").style.display = "none";
    document.getElementById('nbessai').innerHTML = "";
    document.getElementById("erreurrestant").innerHTML = ""; 
  } 

  // if nb max errors  game over  
  if (nberror >= nberrormax) {
    document.getElementById('infolettre').innerHTML ="!!! vous avez perdu !!!";
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
  mot = "";
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      mot = this.responseText; 
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
      getdef(mot);     
    }
  };
  
  xhttp.open("GET", "pendu-word.php?niveau="+glevel+"&lang="+lang, true);
  xhttp.send();  

}
//====================================================================================  
function getdef(mot){
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      do {
        dict = this.response;
      } while (!dict);
      var tt = Object.keys(dict[0].meaning)[0];
      indice = dict[0].meaning[tt][0].definition;
      console.log("indice: "+indice);
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
  window.location.href='/index.html';
}
//====================================================================================  
function disptime(){
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
{
// tableau accents
    var newstring ="";
		var pattern_accent = new Array(/À/g, /Á/g, /Â/g, /Ã/g, /Ä/g, /Å/g, /Æ/g, /Ç/g, /È/g, /É/g, /Ê/g, /Ë/g,
		/Ì/g, /Í/g, /Î/g, /Ï/g, /Ð/g, /Ñ/g, /Ò/g, /Ó/g, /Ô/g, /Õ/g, /Ö/g, /Ø/g, /Ù/g, /Ú/g, /Û/g, /Ü/g, /Ý/g,
		/Þ/g, /ß/g, /à/g, /á/g, /â/g, /ã/g, /ä/g, /å/g, /æ/g, /ç/g, /è/g, /é/g, /ê/g, /ë/g, /ì/g, /í/g, /î/g,
		/ï/g, /ð/g, /ñ/g, /ò/g, /ó/g, /ô/g, /õ/g, /ö/g, /ø/g, /ù/g, /ú/g, /û/g, /ü/g, /ý/g, /ý/g, /þ/g, /ÿ/g);
 
		// tableau sans accents
		var pattern_replace_accent = new Array("A","A","A","A","A","A","A","C","E","E","E","E",
		"I","I","I","I","D","N","O","O","O","O","O","O","U","U","U","U","Y",
		"b","s","a","a","a","a","a","a","a","c","e","e","e","e","i","i","i",
		"i","d","n","o","o","o","o","o","o","u","u","u","u","y","y","b","y");
 
		//pour chaque caractere si accentué le remplacer par un non accentué
		for(var i=0;i<pattern_accent.length;i++)
		{
			my_string = my_string.replace(pattern_accent[i],pattern_replace_accent[i]);
    }
		my_string = my_string.replace(/[^a-zA-Z\-]/g,"");
    
		return my_string;
}

