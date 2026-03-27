<?php
include(__DIR__ . '/includes/config.php');
?>
<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($CONFIG['site_name']); ?> - Game</title>
  <link rel="stylesheet" href="css/game.css">
</head>
<body>
  <div class="topbar">
    <div class="title">جادة 1 - تجربة أولية</div>
    <a class="back-link" href="index.php">رجوع</a>
  </div>

  <div id="game-wrap">
    <div id="game-world">
      <img id="room-bg" src="assets/room-cadde01.jpg" alt="room">

      <div id="player-shadow"></div>

      <div id="player" data-dir="down">
        <img id="player-sprite" src="assets/avatar.png" alt="player">
      </div>
    </div>
  </div>

  <script src="js/game.js"></script>
</body>
</html>
