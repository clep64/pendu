<?php  
    $tab = array();  
    $nom = ""; 
    $niveau = 1;
    $lang = "fr";
    $motlenmax = 7;
    $motlenmin = 4;
    $motlower = "";
    $ind = 0; 
    $obj = ""; 
    $lang = $_GET['lang'];
    switch ($lang) {
        case 'fr':
            $fichier = fopen('ficnom.txt', 'rb');
            break;
        case 'en':
            $fichier = fopen('english.txt', 'rb');
            break;
        default:
            $fichier = fopen('ficnom.txt', 'rb');
            break;
        }
    // according to level choose the length of the word
    $niveau = $_GET['niveau'];
    
    switch ($niveau) {
        case 1:
            $motlenmax = 7;
            $motlenmin = 4;
            break;
        case 2:
            $motlenmax = 10;
            $motlenmin = 7;
            break;
        case 3:
            $motlenmax = 25;
            $motlenmin = 9;
            break;
        default:
            $motlenmax = 7;
            $motlenmin = 4;
    }
    // put list of words in a table and get randomly one word in it
    // send the word all in lower case
    while(!feof($fichier)){
        $nom = trim(fgets($fichier));                  
        if ( mb_strlen($nom) >= $motlenmin && mb_strlen($nom) <= $motlenmax ) {
            $tab[] = $nom;
        }
    }
    $ind = mt_rand(0, count($tab)); 
    $motlower = strtolower($tab[$ind]);
    echo $motlower;
?>    