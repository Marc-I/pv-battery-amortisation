<?php
// Allow Origin for OPTIONS method
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
  header('Access-Control-Allow-Headers: token, Content-Type');
  header('Access-Control-Max-Age: 1728000');
  header('Content-Length: 0');
  header('Content-Type: text/plain');
  exit(403);
}
// Allow Origin only for localhost
if (in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1', 'localhost']) || strpos($_SERVER['REMOTE_ADDR'], 'localhost:') === 0) {
  header("Access-Control-Allow-Origin: *");
  header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
}
header('Content-Type: application/json');
include_once('autoload.php');

// create request object
$REQUEST = new REQUEST();

try {
  switch ($REQUEST->ROOT_PARAM) {
    case 'batteries':
      if (!isset($REQUEST->PARAMS[1]) || !$REQUEST->PARAMS[1]) {
        Response::SUCCESS(Battery::GetBatteries());
      } else {
        Response::SUCCESS(Battery::CalculateAmortisation($REQUEST->PARAMS[1], $REQUEST->PARAMS[2]));
      }
      break;
    case 'energy':
      if ($REQUEST->PARAMS[1] == 'overproduction') {
        Response::SUCCESS(Energy::GetOverproduction($REQUEST->PARAMS[2]));
      } else {
        Response::SUCCESS(Energy::GetEntries($REQUEST->PARAMS[1], $REQUEST->PARAMS[2]));
      }
      break;
    case 'dayenergy':
      Response::SUCCESS(Energy::GetDayEntries($REQUEST->PARAMS[1], $REQUEST->PARAMS[2]));
      break;
    case 'ping':
      Log::Write('index.php - ping', $REQUEST);
      RESPONSE::SUCCESS(["servertime" => microtime(true)]);
      break;
    default:
      Log::Write('index.php - 404', $REQUEST);
      RESPONSE::ERROR_404('API Endpoint "' . $REQUEST->ROOT_PARAM . '" not found');
  }
} catch (Exception $ex) {
  Log::Write('index.php - try-catch-error', $ex);
  RESPONSE::ERROR_500($ex->getMessage());
}
