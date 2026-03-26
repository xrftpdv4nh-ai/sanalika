<?php

include(__DIR__ . '/config.php');
include(__DIR__ . '/conn.php');

$mysqli = @new mysqli(
    $CONFIG['mysql_host'],
    $CONFIG['mysql_user'],
    $CONFIG['mysql_pass'],
    $CONFIG['mysql_db'],
    (int) $CONFIG['mysql_port']
);

if ($mysqli->connect_error) {
    die('Database connection failed.');
}

$mysqli->set_charset('utf8mb4');

function db()
{
    global $mysqli;
    return $mysqli;
}
