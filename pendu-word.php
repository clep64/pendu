<?php  
//  Receive a language and a level for the game
//  search all words of the required language whose length matches length for the level
//  randomly select one
//  send a json object with the word and associated definitions
//  in the input file word and definitions are separated by ';'
//  
    $tab = array();  
    $nom = ""; 
    $item = "";
    $niveau = 1;
    $lang = "fr";
    $motlenmax = 7;
    $motlenmin = 4;
    $motlower = "";         // the sent word is in lowercase letters
    $ind = 0; 
    $tableitem = array();
    $tablewordok = array();
    $jsonobj = new stdClass();
    $lang = $_GET['lang'];
    switch ($lang) {
        case 'fr':
            $fichier = fopen('deffrancais.txt', 'rb');
            break;
        case 'en':
            $fichier = fopen('defenglish.txt', 'rb');
            break;
        default:
            $fichier = fopen('ficnom.txt', 'rb');
            break;
        }
    // according to level choose the length of the word
    $niveau = $_GET['niveau'];
    
    switch ($niveau) {
        case 1:
            $motlenmax = 6;
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
            $motlenmax = 6;
            $motlenmin = 4;
    }
    // put list of words in a table and get randomly one word in it
    // send the word all in lower case
    // send the result as json - the word and an array of definitions
    while(!feof($fichier)){
        $item = trim(fgets($fichier)); 
        $tableitem = explode( ";",$item);
        $nom = trim($tableitem[0]);        
        if ( mb_strlen($nom) >= $motlenmin && mb_strlen($nom) <= $motlenmax ) {
           $tablewordok[] = $item;
        }
    }
    $ind = mt_rand(0, count($tablewordok));         // 
    $tableitem = explode( ";",$tablewordok[$ind]);
    $jsonobj->word = strtolower(trim($tableitem[0]));    
    $jsonobj->definition = array_slice($tableitem,1);
    $myJSON = json_encode($jsonobj);
    echo $myJSON;
?>    