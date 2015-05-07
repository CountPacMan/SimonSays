simon.controller("GameCtrl", function($scope, $timeout) {

  $scope.btn1 = "btn1";
  $scope.btn2 = "btn2";
  $scope.btn3 = "btn3";
  $scope.btn4 = "btn4";
  $scope.tone = 500;

  var context = new AudioContext();
  var osc = context.createOscillator();
  var synth = {
    create: function() {
      osc = context.createOscillator();
      osc.type = 0;
      osc.frequency.value = $scope.tone;
      osc.connect(context.destination);
    },
    start: function() {
      osc.start();
    },
    stop: function() {
      osc.stop();
    }
};
  synth.create();

  var tones = {
    btn1: 300,
    btn2: 500,
    btn3: 750,
    btn4: 900
  };

  var user_pattern = [];
  var simon_pattern = [];
  $scope.fail = false;
  $scope.score = 0;
  $scope.starting = true;
  $scope.active = true;
  $scope.btnActive = "btn-active";
  $scope.selected = 7;
  $scope.highScore = 0;

  $scope.start = function() {
    $scope.highScore = ($scope.highScore > $scope.score) ? $scope.highScore : $scope.score; //set latest high score
    user_pattern = [];
    simon_pattern = [];
    $scope.fail = false;
    $scope.starting = false;
    $scope.score = 0;
    addSimon();
    flashSimon();
  };

  $scope.click = function(btn) {
    user_pattern.push(btn);
    $scope.tone = tones[btn];
    synth.create();
    synth.start();
    $timeout(function() {synth.stop()}, 300);
    // test if match good so far
    match();
  };

  function match() {
    var last = user_pattern.length - 1;

    if (user_pattern.length === simon_pattern.length &&
        user_pattern[last] === simon_pattern[last]) {
      addNew();
    } else if (user_pattern[last] != simon_pattern[last]) {
      fail();
    }
  }

  function addNew() {
    $scope.score++;
    user_pattern = [];
    addSimon();
    deactivateBtns();
    flashSimon();
    activateBtns();
  }

  function fail() {
    $scope.highScore = ($scope.highScore > $scope.score) ? $scope.highScore : $scope.score; //set latest high score
    user_pattern = [];
    simon_pattern = [];
    $scope.fail = true;
    $scope.starting = true;
  }

  function deactivateBtns() {
    $scope.active = false;
    // can add deactive button click css (xxx) later
    $scope.btnActive = "xxx";
  }

  function activateBtns() {
    (function() {
      $timeout(function() {
        $scope.active = true;
        $scope.btnActive = "btn-active";
      }, $scope.speed * 100 * (simon_pattern.length + 1));
    })();
  }

  function addSimon() {
    var btns = ["btn1", "btn2", "btn3", "btn4"];
    simon_pattern.push(btns[Math.floor(Math.random() * btns.length)]);
  }

  function flashSimon() {
    if (simon_pattern.length == 1) {
      console.log(simon_pattern.length);
      $scope.speed = 10;
    } else if ($scope.selected == 1) {
      $scope.speed = Math.floor(Math.random() * 7) + 1;
    } else {
      $scope.speed = $scope.selected;
    }

    (function() {
      $timeout(function() {
        for (var i in simon_pattern) {
          (function(i) {
            $timeout(function() {
              $scope.tone = tones[simon_pattern[i]];
              $scope[simon_pattern[i]] = simon_pattern[i] + "b";
              synth.create();
              synth.start();
            }, $scope.speed * 100 * i);
          })(i);

          (function(i) {
            $timeout(function() {
              $scope[simon_pattern[i]] = simon_pattern[i];
              synth.stop();
            }, $scope.speed * 10 * (i + 5));
          })(i);
        }
      }, $scope.speed * 100);
    })();
  }

});
