<?php

class Battery
{
  public $caption;
  public $capacity;
  public $max;
  public $price;
  public $savings;

  function __construct($caption, $max, $price)
  {
    $this->caption = $caption;
    $this->max = $max;
    $this->capacity = 0;
    $this->price = $price;
    $this->savings = 0;
  }

  public static function GetBatteries()
  {
    return array(
      new Battery('GreenCell PowerNest', 5000, 1569),
      new Battery('Bluetti EP500 Powerstation EU', 5100, 2830),
      new Battery('Hochvolt-Speichersystem ARK XH Kit', 5120, 3422),
      new Battery('V-TAC LiFePO4-Batterie', 6140, 3868),
      new Battery('Huawei LUNA2000', 9000, 6000),
      new Battery('Growatt APX', 10000, 5509),
      new Battery('BYD Battery-Box Premium', 11520, 9795),
      new Battery('VARTA element 12', 11700, 10500),
      new Battery('Tesla Powerwall 2', 12150, 10500),
      new Battery('LG', 15480, 6800),
      new Battery('Growatt Lithium Batterie Speicher 7 - 15', 15300, 7900),
      new Battery('Growatt Lithium Batterie Speicher 7 - 18', 17900, 9400),
      new Battery('Growatt Lithium Batterie Speicher 7 - 25', 25600, 14900),
      new Battery('10 kWh', 10000, 10000),
      new Battery('15 kWh', 15000, 15000),
      new Battery('20 kWh', 20000, 20000),
      new Battery('30 kWh', 30000, 30000),
      new Battery('50 kWh', 50000, 50000),
      new Battery('100 kWh', 100000, 50000),
      new Battery('400 kWh', 400000, 100000)
    );
  }
}
