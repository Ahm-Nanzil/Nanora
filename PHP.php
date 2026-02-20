<?php
// Detect protocol
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443)
    ? "https://" : "http://";

// Current directory URL
$baseDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');

define('BASE_URL', $protocol . $_SERVER['HTTP_HOST'] . $baseDir . '/');
?>


<?php echo BASE_URL; ?>