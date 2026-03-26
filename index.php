<?php
include(__DIR__ . '/includes/config.php');
?>
<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($CONFIG['site_name']); ?></title>
  <style>
    body{
      margin:0;
      background:#111;
      color:#fff;
      font-family:Arial,sans-serif;
      text-align:center;
    }
    .wrap{
      padding:40px 20px;
    }
    .box{
      max-width:700px;
      margin:70px auto;
      background:#1a1a1a;
      border:1px solid #333;
      border-radius:12px;
      padding:30px;
    }
    a{
      color:#7ec8ff;
      text-decoration:none;
      font-size:20px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="box">
      <h1><?php echo htmlspecialchars($CONFIG['site_name']); ?></h1>
      <p>تجربة أول جادة من السكربت القديم.</p>
      <p><a href="game.php">ادخل الجادة</a></p>
    </div>
  </div>
</body>
</html>
