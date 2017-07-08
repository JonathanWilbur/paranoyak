//TODO: Display a pinwheel while the page loads.
angular.module('loginapp', []).controller('loginform', function($scope, $http) {
  $http.get('/api/sessions/amILoggedIn').then( function (response) { window.location = '/chat.html'; });
  $scope.keepMeLoggedIn = false;
  //$scope.usernameRegex = '[a-zA-z0-9]{2,}[^\\\'\\"\\\\,\\{\\}\\[\\]/@<>|#$%^&*();+\\-=:\\. !?]';
  //$scope.passwordRegex = '[a-zA-z0-9!@#$%^&*_?\\.+]{8,}[^\\\'\\"\\\\,\\{\\}\\[\\]/<>|();\\-=: ]';
  $scope.login = function () {
    var credentials = {
      username: $scope.username,
      password: $scope.password,
      keepMeLoggedIn: $scope.keepMeLoggedIn
    }
    $http.post('/api/sessions/create', credentials).then(
      function (response) { window.location = '/chat'; },
      function (response) {
        switch (response.status) {
          case 403:
            alert("Invalid credentials!");
            $scope.username = '';
            $scope.password = '';
            break;
          case 429:
            alert("You have exceeded the number of allowable authentication attempts. Your IP address will be blocked for one hour.");
            break;
        }
      }
    );
  };
});
