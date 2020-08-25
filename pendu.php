<?php
// get language, set a cookie and include the text from the corresponding language file
	$lang = $_GET['lang'];
	setcookie('lang',"$lang" , 0, "/");	
	if ($lang == "fr"){
		include 'libel-fr.php';
	} else {
		include 'libel-en.php';
	}
?>
<!DOCTYPE html >
<html>
    <head> 
		<?php 
		echo "<title>$langTitre1</title>";
		?>
	    <meta http-equiv="Content-type" content="text/html; charset=UTF-8">
        <LINK rel="stylesheet" type="text/css" href="pendu.css">
        <link rel="shortcut icon" type="image/png" href="images/jeux.png"/>
		<script>		
			<?php
				echo "var lang = '" . $lang ."';";

			?>
		</script>
	</head>
    <body onload="loadinit()">
        <div id="titrehtml">
            <img src="images/jeux.png" alt="logo du site" class="centerimagetitre">
			<?php
				echo "<h1>$langTitre2</h1>";				
			?>			
        </div>
		<div id="saisieniveau" > 
			<?php
				echo "<p id='pniveau' >$langNiveau1</p>";				
			?>			
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
					<?php
						echo "<span>$langClickLetter</span>";				
					?>											
						<p id="clavier"></p>					
					</p> 
					<p id="infolettre"></p>
					<span id="nbessai"></span>    
					<span id="erreurrestant"></span>
					<p id="indice"></p>
				</div>
			</div>
			<div id="exit">
				<?php
				echo '<button id="newgame" class="button" type="button" onclick="newgame()">'.$langNewGame.'</button>';
				echo '<button id="retourmenu" class="button" type="button" onclick="window.location.href=\'index.html\'">'.$langBack.'</button>';
				?>
			</div> 
		</div>
		<?php
			echo '<script src="libel-'.$lang.'.js"></script>';				
		?>		
		<script src="pendu.js"></script>
    </body>
</html>