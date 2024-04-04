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
    $BezugKummulativ = 0;
    $PVKummulativ = 0;
    $VerbrauchKummulativ = 0;
    $EinspeisungKummulativ = 0;
    $PVVerbrauchKummulativ = 0;
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
          'BezugKummulativ' => $BezugKummulativ,
          'PVKummulativ' => $PVKummulativ,
          'VerbrauchKummulativ' => $VerbrauchKummulativ,
          'EinspeisungKummulativ' => $EinspeisungKummulativ,
          'PVVerbrauchKummulativ' => $PVVerbrauchKummulativ,
        ];
      }

      $BezugKummulativ += $energy['Bezug'];
      $PVKummulativ += $energy['PVErtrag'];
      $VerbrauchKummulativ += $energy['Verbrauch'];
      $EinspeisungKummulativ += $energy['Einspeisung'];
      $PVVerbrauchKummulativ += $energy['Verbrauch'] - $energy['Bezug'];

      $data[$key]['NetzSumme'] += $energy['Netz'];
      $data[$key]['PVSumme'] += $energy['PVErtrag'];
      $data[$key]['BezugSumme'] += $energy['Bezug'];
      $data[$key]['VerbrauchSumme'] += $energy['Verbrauch'];
      $data[$key]['PVVerbrauchSumme'] += $energy['Verbrauch'] - $energy['Bezug'];
      $data[$key]['EinspeisungSumme'] += $energy['Einspeisung'];
      $data[$key]['BezugKummulativ'] = $BezugKummulativ;
      $data[$key]['PVKummulativ'] = $PVKummulativ;
      $data[$key]['VerbrauchKummulativ'] = $VerbrauchKummulativ;
      $data[$key]['EinspeisungKummulativ'] = $EinspeisungKummulativ;
      $data[$key]['PVVerbrauchKummulativ'] = $PVVerbrauchKummulativ;
    }

    return array_values($data);
  }

}
