<?php

$CONFIG['mysql_host'] = getenv('DB_HOST') ?: 'localhost';
$CONFIG['mysql_port'] = getenv('DB_PORT') ?: '3306';
$CONFIG['mysql_user'] = getenv('DB_USER') ?: 'root';
$CONFIG['mysql_pass'] = getenv('DB_PASS') ?: '';
$CONFIG['mysql_db']   = getenv('DB_NAME') ?: 'marhab';
