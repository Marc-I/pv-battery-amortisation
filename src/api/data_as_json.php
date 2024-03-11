<?php

if (in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1', 'localhost']) || strpos($_SERVER['REMOTE_ADDR'], 'localhost:') === 0) {
  header("Access-Control-Allow-Origin: *");
  header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
  header('Content-Type: application/json');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
}

// alle CSV auslesen
$files = glob('../assets/data/*.csv');

$data = [];

foreach ($files as $file) {
    $csv = file_get_contents($file);
    $array = array_map("str_getcsv", explode("\n", $csv));
    $array = array_map(function ($line) {
        return isset($line) && count($line) === 4 && substr($line[0], 0, 2) === '20' ? array(
            'Datum' => $line[0],
            'PVErtrag' => $line[1],
            'Netz' => $line[2],
            'Bezug' => !is_numeric($line[2]) || $line[2] < 0 ? 0 : $line[2],
            'Einspeisung' => !is_numeric($line[2]) || $line[2] > 0 ? 0 : -$line[2],
            'Verbrauch' => $line[3]
        ) : null;
    }, $array);
    $array = array_values(array_filter($array));
//    $json = json_encode($array);
    $data = array_merge($data, $array);
}

//echo array_sum(array_map(function ($a) { return $a['Verbrauch']; }, $array));

print_r(json_encode($data));
