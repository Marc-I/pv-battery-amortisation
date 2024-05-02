<?php

class Energy
{
  private static $_data;

  private static function _getEntries()
  {
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
      $data = array_merge($data, $array);
    }

    self::$_data = $data;
  }

  public static function GetEntries($year, $month)
  {
    $year = isset($year) && $year >= 0 ? Date('Y', mktime(0, null, null, null, null, $year)) : Date('Y');
    $month = isset($month) && $month >= 0 ? Date('m', mktime(0, null, null, $month, null, $year)) : Date('m');

    self::_getEntries();
    return array_filter(self::$_data, function ($energy) use ($year, $month) {
      return substr($energy['Datum'], 0, 7) == $year . '-' . $month;
    });
  }

  public static function GetDayEntries($year, $month)
  {
    $year = isset($year) && $year >= 0 ? Date('Y', mktime(0, null, null, null, null, $year)) : Date('Y');
    $month = isset($month) && $month >= 0 ? Date('m', mktime(0, null, null, $month, null, $year)) : Date('m');

    self::_getEntries();
    $filteredEntries = array_filter(self::$_data, function ($energy) use ($year, $month) {
      return substr($energy['Datum'], 0, 7) == $year . '-' . $month;
    });

    $data = [];
    $BezugKumulativ = 0;
    $PVKumulativ = 0;
    $VerbrauchKumulativ = 0;
    $EinspeisungKumulativ = 0;
    $PVVerbrauchKumulativ = 0;
    foreach ($filteredEntries as $energy) {
      $key = substr($energy['Datum'], 0, 10);
      if (!array_key_exists($key, $data)) {
        $data[$key] = [
          'Datum' => $energy['Datum'],
          'NetzSumme' => 0,
          'PVSumme' => 0,
          'BezugSumme' => 0,
          'VerbrauchSumme' => 0,
          'PVVerbrauchSumme' => 0,
          'EinspeisungSumme' => 0,
          'BezugKumulativ' => $BezugKumulativ,
          'PVKumulativ' => $PVKumulativ,
          'VerbrauchKumulativ' => $VerbrauchKumulativ,
          'EinspeisungKumulativ' => $EinspeisungKumulativ,
          'PVVerbrauchKumulativ' => $PVVerbrauchKumulativ,
        ];
      }

      $BezugKumulativ += intval($energy['Bezug']);
      $PVKumulativ += intval($energy['PVErtrag']);
      $VerbrauchKumulativ += intval($energy['Verbrauch']);
      $EinspeisungKumulativ += intval($energy['Einspeisung']);
      $PVVerbrauchKumulativ += intval($energy['Verbrauch']) - intval($energy['Bezug']);

      $data[$key]['NetzSumme'] += intval($energy['Netz']);
      $data[$key]['PVSumme'] += intval($energy['PVErtrag']);
      $data[$key]['BezugSumme'] += intval($energy['Bezug']);
      $data[$key]['VerbrauchSumme'] += intval($energy['Verbrauch']);
      $data[$key]['PVVerbrauchSumme'] += intval($energy['Verbrauch']) - intval($energy['Bezug']);
      $data[$key]['EinspeisungSumme'] += intval($energy['Einspeisung']);
      $data[$key]['BezugKumulativ'] = $BezugKumulativ;
      $data[$key]['PVKumulativ'] = $PVKumulativ;
      $data[$key]['VerbrauchKumulativ'] = $VerbrauchKumulativ;
      $data[$key]['EinspeisungKumulativ'] = $EinspeisungKumulativ;
      $data[$key]['PVVerbrauchKumulativ'] = $PVVerbrauchKumulativ;
    }

    return array_values($data);
  }

}
