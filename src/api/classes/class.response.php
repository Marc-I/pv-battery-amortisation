<?php

class RESPONSE {

    /**
     * writes standardized success response
     * @param $data
     * @return void
     */
    static function SUCCESS($data) {
        global $REQUEST;
        Log::Write('RESPONSE SUCCESS', $data, true);

        $response['response'] = $data;
        if ($REQUEST->Has_Query('debug')) {
            $response['servertime'] = microtime(true);
            $response['request'] = $REQUEST;
        }
        echo json_encode($response);
    }

    /**
     * generic error message
     * @param $error_code
     * @param $error_text
     * @param $msg
     * @return void
     */
    static function ERROR($error_code, $error_text, $msg = null) {
        global $REQUEST;
        Log::Write($error_code . ' ' . $error_text . ' - ' . $msg, $REQUEST);
        echo self::create_error_page($error_code, $error_text, $msg);
        header(implode(' ', array_filter([
            $_SERVER['SERVER_PROTOCOL'],
            $error_code,
            $error_text,
            (isset($msg) && $msg ? '-' : null),
            $msg
        ])));
        http_response_code($error_code);
        exit();
    }

    /**
     * Bad Request Error
     * @param $msg
     * @return void
     */
    static function ERROR_400($msg = null) {
        self::ERROR(400, 'Bad Request', $msg);
    }

    /**
     * Access Forbidden Error
     * @param $msg
     * @return void
     */
    static function ERROR_403($msg = null) {
        self::ERROR(403, 'Access Forbidden', $msg);
    }

    /**
     * Page not Found Error
     * @param $msg
     * @return void
     */
    static function ERROR_404($msg = null) {
        self::ERROR(404, 'Page not Found', $msg);
    }

    /**
     * Server Error Error
     * @param $msg
     * @return void
     */
    static function ERROR_500($msg = null) {
        self::ERROR(500, 'Server Error', $msg);
    }

    /**
     * create html website for error
     * @param $error_code
     * @param $error_text
     * @param $error_msg
     * @return string
     */
    private static function create_error_page($error_code, $error_text, $error_msg) {
        return '<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>' . $error_text . '</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        span {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: .5em;
            aspect-ratio: 1;
            font-size: 3rem;
            border-radius: 50%;
            background-color: crimson;
            color: #fff;
        }
        p {
            margin: 0;
            padding: 0;
            font-family: Verdana, Arial, sans-serif;
        }
        .text {
            padding: .5em 0;
            font-weight: 600;
        }
    </style>
</head>
<body>
<span>' . $error_code . '</span>
<p class="text">' . $error_text . '</p>
<p>' . $error_msg . '</p>
</body>
</html>';
    }
}
