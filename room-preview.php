<?php
include(__DIR__ . '/includes/config.php');

$rooms = [
    1 => 'templates/rooms/room1.jpg',
    2 => 'templates/rooms/room2.jpg'
];

$roomId = isset($_GET['room']) ? (int) $_GET['room'] : 1;
$background = $rooms[$roomId] ?? $rooms[1];
?>
<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Room Preview</title>
  <style>
    body {
      margin: 0;
      background: #111;
      color: #fff;
      font-family: Arial, sans-serif;
      text-align: center;
    }

    .topbar {
      background: #1a1a1a;
      padding: 15px;
      border-bottom: 1px solid #333;
    }

    .topbar a {
      color: #7ec8ff;
      text-decoration: none;
      margin: 0 10px;
    }

    .room-wrap {
      padding: 20px;
    }

    .room-wrap img {
      max-width: 95%;
      height: auto;
      border-radius: 10px;
      border: 2px solid #333;
    }
  </style>
</head>
<body>
  <div class="topbar">
    <h2>Room Preview</h2>
    <a href="?room=1">Room 1</a>
    <a href="?room=2">Room 2</a>
    <a href="index.php">الرئيسية</a>
  </div>

  <div class="room-wrap">
    <img src="<?php echo htmlspecialchars($background); ?>" alt="room">
  </div>
</body>
</html>
