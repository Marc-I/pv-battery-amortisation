<?php

spl_autoload_register(function ($class_name) {
    // Definiere den Pfad, in dem deine Klassen gespeichert sind
    $class_path = 'classes/class.' . strtolower($class_name) . '.php';

    // Überprüfe, ob die Klassendatei existiert und lade sie
    if (file_exists($class_path)) {
        include_once $class_path;
    } else {
        // Hier könntest du eine Fehlermeldung ausgeben oder eine andere Aktion ausführen,
        // wenn die Klasse nicht gefunden wurde
        die('Die Klasse «' . $class_name . '» wurde nicht gefunden.');
    }
});
