<?php  
    $tab = array();  
    $nom = ""; 
    $niveau = 1;
    $motlenmax = 7;
    $motlenmin = 4;
    $motlower = "";
    $ind = 0; 
    $obj = ""; 
    $fichier = fopen('ficnom.txt', 'rb');

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
    while(!feof($fichier)){
        $nom = trim(fgets($fichier));                  
        if ( !strpos($nom, "-") && mb_strlen($nom) >= $motlenmin && mb_strlen($nom) <= $motlenmax ) {
            $tab[] = $nom;
        }
    }
    $ind = mt_rand(0, count($tab)); 
    $motlower = strtolower($tab[$ind]);
    echo $motlower;
?>    