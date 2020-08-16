<!DOCTYPE html >
<html>
    <head> 
	    <title>jeu du pendu</title>
	    <meta http-equiv="Content-type" content="text/html; charset=UTF-8">
        <LINK rel="stylesheet" type="text/css" href="pendu.css">
        <link rel="shortcut icon" type="image/png" href="images/jeux.png"/>
		<script>		
			<?php
				$lang = $_GET['lang'];
				echo "var lang = '" . $lang ."';";
			?>
		</script>
	</head>
    <body onload="loadinit()">
        <div id="titrehtml">
            <img src="images/jeux.png" alt="logo du site" class="centerimagetitre">
            <h1> Jouons au Pendu </h1>
        </div>
		<div id="saisieniveau" > 
			<p id="pniveau" >choisissez votre niveau :</p>
			<p id="buttonniveau" >
				<button type="button" class="niveau"  onclick="checkniveau(1)">*</button>
				<button type="button" class="niveau"  onclick="checkniveau(2)">**</button>
				<button type="button" class="niveau"  onclick="checkniveau(3)">***</button>
			</p>
		</div> 
		<div id="main" class=center> 
			<p id="pimageerreur">
				<img id="imageerreur" src="images/pendu-err/p1.jpg" alt="image de pendu"  />
			</p>
			<div id="submain">
				<div id="mot" >
					<h2 id=affichmot></h2>
				</div>
				<div id="corpsjeu">
					
					<p id="saisielettre">
						<span>cliquer une lettre:</span>					
						<p id="clavier"></p>					
					</p> 
					<p id="infolettre"></p>
					<span id="nbessai"></span>    
					<span id="erreurrestant"></span>
				</div>
			</div>
			<div id="exit">
				<button id="newgame" class="button" type="button" onclick="newgame()">Nouvelle Partie</button>
			</div> 
		</div>
		<script src="pendu.js"></script>
    </body>
</html>