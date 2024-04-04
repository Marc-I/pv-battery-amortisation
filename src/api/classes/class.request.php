<?php
include_once('classes/class.request_method.php');
include_once('classes/class.response.php');

class REQUEST {
    /**
     * REQUEST URL
     * @var REQUEST_URL
     */
    public $URL;
    /**
     * REQUEST REFERER
     * @var REQUEST_REFERER
     */
    public $REFERER;
    /**
     * REQUEST METHOD
     * @var REQUEST_METHOD
     */
    public $METHOD;
    /**
     * REQUEST PARAMS
     * @var string[]
     */
    public $PARAMS;
    /**
     * REQUEST QUERY
     * @var string[]
     */
    public $QUERY;
    /**
     * REQUEST ROOT PARAM
     * (QUERY_PARAMS[0])
     * @var string[]
     */
    public $ROOT_PARAM;
    /**
     * REQUEST DATA
     * @var JSON Object
     */
    public $DATA;

    /**
     * creates request object
     * sets
     * - method
     * - path params
     * - query params
     * - data
     */
    function __construct() {
        // URL
        $this->URL = (empty($_SERVER['HTTPS']) ? 'http' : 'https') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

        // referer
        $this->REFERER = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : null;

        // method
        $this->METHOD = $_SERVER['REQUEST_METHOD'];

        // path params
        $path_info = '';
        if (!isset($_SERVER['PATH_INFO']) || !$_SERVER['PATH_INFO']) {
            if (isset($_SERVER['REDIRECT_ORIGINAL_PATH']) && $_SERVER['REDIRECT_ORIGINAL_PATH']) {
                $path_info = $_SERVER['REDIRECT_ORIGINAL_PATH'];
            }
        } else {
            $path_info = $_SERVER['PATH_INFO'];
        }

        $this->PARAMS = explode('/', trim($path_info, '/'));
        $this->ROOT_PARAM = $this->PARAMS[0];

        // query params
        if (isset($_SERVER['QUERY_STRING'])) {
            $parts = parse_url($_SERVER['QUERY_STRING']);
            parse_str($parts['path'], $query);
            $this->QUERY = $query;
        }

        // data
        $this->DATA = json_decode(file_get_contents('php://input'), true);
    }

    /**
     * returns query value or null if not existing
     * @param $query_name
     * @return mixed|null
     */
    public function Get_Query($query_name) {
        return isset($this->QUERY[$query_name]) ? $this->QUERY[$query_name] : null;
    }

    /**
     * returns if query param is existing
     * @param $query_name
     * @return mixed|null
     */
    public function Has_Query($query_name) {
        return isset($this->QUERY[$query_name]);
    }
}
