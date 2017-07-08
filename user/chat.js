angular.module('ang', ['ngSanitize']).config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.youtube.com']);
}).run(function($rootScope, $http, $interval) {
  $rootScope.users = [];
  $rootScope.focus = true;
  window.addEventListener('focus', function () {
    $rootScope.focus = true;
    document.title = "ParanoYak";
  });
  window.addEventListener('blur', function () {
    $rootScope.focus = false;
  });
  document.getElementById('loading').style.display = 'none'; //For some reason, you have to set this to none to get the toggle to work...
}).controller('sidebar', function($scope, $interval, $http) {
  $scope.logout = function () {
    toggleLoading(true, "Logging out...");
    $http.post('/api/sessions/destroy', { timeout: 10000 }).then(
      function () { window.location = '/'; },
      function () { alert("Logging out was unsuccessful!"); window.location = '/'; }
    );
  };
  $scope.goToInfoPage = function () { window.open('/info'); };
  $scope.goToUsersPage = function () { window.open('/users'); };
}).controller('me', function($scope, $http) {
  $scope.myname = "";
  $scope.mymugshot = "";
  $http.get('/api/sessions/me').then(
    function (response) {
      $scope.myname = response.data.user;
      $scope.mymugshot = response.data.mugshot;
    },
    function (response) {
      $scope.myname = "ERROR";
    }
  );
}).controller('userlist', function($rootScope, $scope, $interval, $http) {
  $scope.selected = undefined;
  $scope.getUserList = function () {
    if ($rootScope.focus) {
      $http.get('/api/users/list').then(
        function (response) {
          $rootScope.users = [];
          $rootScope.users = $scope.users.concat(response.data);
        },
        function (response) {
          $rootScope.users = [];
          window.location = '/';
        }
      );
    }
  };

  $scope.userInfo = function (name) {
    for (var i = 0; i < $rootScope.users.length; i++) {
      if ($rootScope.users[i].name == name) {
        $scope.selected = $rootScope.users[i];
      }
    }
  }

  $scope.closeUserInfo = function () {
    $scope.selected = undefined;
  }

  $scope.getUserList();
  $interval(function() { $scope.getUserList(); }, 9000);

}).controller('chat', function($rootScope, $scope, $interval, $http, $sanitize, $sce) {

  $scope.trustAsHtml = $sce.trustAsHtml;
  $scope.messages = [];
  $scope.terminalField = '';
  $scope.messagesUnseen = 0;

  $scope.getRecentMessages = function (numberOfMessages) {
    $http.get('/api/messages/recent').then(
      function (response) {
        $scope.messages = $scope.messages.concat(response.data);
      }
    );
  }

  $scope.updateMessages = function () {
    $http.get('/api/messages/update').then(
      function (response) {
        $scope.messages = $scope.messages.concat(response.data);
        if (!$rootScope.focus && response.data.length > 0) {
          $scope.messagesUnseen = $scope.messagesUnseen + response.data.length;
          document.title = "ParanoYak (" + $scope.messagesUnseen + ")";
        }
      },
      function (response) {
        $scope.messages = [];
        window.location = '/';
      }
    );
  }

  $scope.postMessage = function () {
    if ($scope.terminalField != '') {
      var data = {
        body: $scope.terminalField
      };
      $http.post('/api/messages/new', data).then(
        function (response) {
          var originalHeight = document.getElementById('history').scrollHeight;
          $scope.messages = $scope.messages.concat(response.data);
          var scroller = $interval(function () {
            if (originalHeight != document.getElementById('history').scrollHeight) {
              document.getElementById('history').scrollTop = document.getElementById('history').scrollHeight;
              $interval.cancel(scroller);
            }
          }, 100);
          $scope.terminalField = ''; // Is this necessary?
          document.getElementById('terminalField').focus();
        },
        function (response) {
          alert("Failed to submit new message!");
        }
      );
    }
  }

  $scope.deleteOldMessages = function () {
    if ($scope.messages.length > 100) $scope.messages = $scope.messages.slice(-100);
  }

  $scope.getRecentMessages(20);
  $interval($scope.updateMessages, 10000);
  $interval($scope.deleteOldMessages, 60000);

});

function toggleLoading(show, message) {
  if (show) {
    document.getElementById('loading').innerText = message;
    document.getElementById('loading').style.display = 'block';
  } else {
    document.getElementById('loading').style.display = 'none';
  }
}
