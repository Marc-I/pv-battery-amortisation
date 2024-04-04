<?php

class Log {
    /**
     * write line in logfile (one file per day)
     * @param $msg
     * @param $data
     * @param $debug
     * @return void
     */
    static function Write($msg, $data = null, $debug = false) {
        global $REQUEST;
        if ($debug && !$REQUEST->Has_Query('debug')) {
            return;
        }

        $log[] = date('H:i:s');
        $log[] = $msg;
        if (isset($data) && $data) {
            $log[] = json_encode($data, JSON_PRETTY_PRINT);
        }
        $log[] = '#################################################################';
        $log[] = '';

        file_put_contents(
            'log/' . date('Ymd') . ($debug ? '.debug' : '') . '.txt',
            implode("\n", $log),
            FILE_APPEND
        );
    }
}
