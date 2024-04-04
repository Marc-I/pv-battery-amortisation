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
  header('Content-Type: application/json');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
}
include_once('autoload.php');

// create request object
$REQUEST = new REQUEST();

try {
  switch ($REQUEST->ROOT_PARAM) {
    case 'batteries':
      Response::SUCCESS(Battery::GetBatteries());
      break;
    case 'energy':
      Response::SUCCESS(Energy::GetEntries($REQUEST->Get_Query('year'), $REQUEST->Get_Query('month')));
      break;
    case 'dayenergy':
      Response::SUCCESS(Energy::GetDayEntries($REQUEST->Get_Query('year'), $REQUEST->Get_Query('month')));
      break;
    case 'ping':
      RESPONSE::SUCCESS(["servertime" => microtime(true)]);
      break;
    default:
      RESPONSE::ERROR_404('API Endpoint not found');
  }
} catch (Exception $ex) {
  Log::Write('index.php - try-catch-error', $ex);
  RESPONSE::ERROR_500($ex->getMessage());
}
