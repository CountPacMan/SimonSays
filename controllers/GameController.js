simon.controller("GameCtrl", function($scope, $timeout) {

  $scope.btn1 = "btn1";
  $scope.btn2 = "btn2";
  $scope.btn3 = "btn3";
  $scope.btn4 = "btn4";
  $scope.tone = 500;


  $scope.buttons = [$scope.btn1, $scope.btn2, $scope.btn3, $scope.btn4];

  var context = new AudioContext();
  var osc = context.createOscillator();
  var synth = {
    create: function() {
      osc = context.createOscillator();
      osc.type = 0;
      osc.frequency.value = $scope.tone;
      gainNode = context.createGain();
      osc.connect(gainNode);
      gainNode.connect(context.destination)
      gainNode.gain.value = 0.0;
      osc.start();
    },
    start: function() {
      var now = context.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      $timeout(function() {gainNode.gain.linearRampToValueAtTime(1.0, now + 0.04)}, 0.021);
    },
    stop: function() {
      var now = audioContext.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(0.0, now + 0.02);
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
  $scope.display = true;

  $scope.start = function() {
    $scope.highScore = ($scope.highScore > $scope.score) ? $scope.highScore : $scope.score; //set latest high score
    user_pattern = [];
    simon_pattern = [];
    $scope.fail = false;
    $scope.starting = false;
    $scope.display = true;
    $scope.score = 0;
    addSimon();
    flashSimon();
  };

  $scope.click = function(btn) {
    synth.stop();
    user_pattern.push(btn);
    $scope.tone = tones[btn];
    synth.create();
    synth.start();

    $timeout(function() {
      synth.stop();
    }, 250);
    // test if match good so far
    match();
  };

  function match() {
    var last = user_pattern.length - 1;

    if (user_pattern.length === simon_pattern.length &&
        user_pattern[last] === simon_pattern[last]) {
      $timeout(function() {addNew()}, 100);
    } else if (user_pattern[last] != simon_pattern[last]) {
      fail();
    }
  }

  function addNew() {
    $scope.score++;
    user_pattern = [];
    addSimon();
    deactivateBtns();
    if ($scope.selected == 1) {
      $scope.display = false;
      $scope.$apply();
      scramble();
      $timeout(function() {$scope.display = true}, 150);
    }
    flashSimon();
    activateBtns();
  }

function scramble() {
    for (var i = $scope.buttons.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = $scope.buttons[i];
        $scope.buttons[i] = $scope.buttons[j];
        $scope.buttons[j] = temp;
    }
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
      $scope.speed = 10;
    } else if ($scope.selected == 1) {
      $scope.speed = Math.floor(Math.random() * 8) + 2;
    } else {
      $scope.speed = $scope.selected;
    }

    (function() {
      $timeout(function() {
        for (var i in simon_pattern) {
          (function(i) {
            $timeout(function() {
              var position = $scope.buttons.indexOf(simon_pattern[i]);
              $scope.tone = tones[simon_pattern[i]];
              $scope.buttons[position] = simon_pattern[i] + "b";
              synth.create();
              synth.start();
            }, $scope.speed * 100 * i);
          })(i);

          (function(i) {
            $timeout(function() {
              var position = $scope.buttons.indexOf(simon_pattern[i] + "b");
              $scope.buttons[position] = simon_pattern[i];
              synth.stop();
            }, $scope.speed * 10 * (i + 5));
          })(i);
        }
      }, $scope.speed * 100);
    })();
  }

});
