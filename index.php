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
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #111;
      color: #fff;
      text-align: center;
    }

    .wrap {
      padding: 40px 20px;
    }

    a {
      color: #7ec8ff;
      text-decoration: none;
      font-size: 18px;
    }

    .box {
      max-width: 800px;
      margin: 60px auto;
      background: #1b1b1b;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 30px;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="box">
      <h1><?php echo htmlspecialchars($CONFIG['site_name']); ?></h1>
      <p>أول تشغيل للمشروع شغال.</p>
      <p><a href="room-preview.php">افتح Preview الغرف</a></p>
    </div>
  </div>
</body>
</html>
