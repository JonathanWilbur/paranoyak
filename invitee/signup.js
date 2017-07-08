//TODO: Display a pinwheel while the page loads.
var signapp = angular.module('signupapp', []);
signapp.controller('signupform', function($scope, $http) {
  //$scope.usernameRegex = '[a-zA-z0-9]{2,}[^\\\'\\"\\\\,\\{\\}\\[\\]/@<>|#$%^&*();+\\-=:\\. !?]';
  //$scope.passwordRegex = '[a-zA-z0-9!@#$%^&*_?\\.+]{8,}[^\\\'\\"\\\\,\\{\\}\\[\\]/<>|();\\-=: ]';
  $scope.signup = function () {
    var signup = {
      username: $scope.username,
      password: $scope.password1,
      email: $scope.email,
      bitcoin: $scope.bitcoin,
      location: $scope.location,
      bio: $scope.bio
    };
    $http.post('/api/users/create', signup).then(
      function (response) {
        window.location = '/mugshot.html';
      },
      function (response) {
        if (response.status == 400 && response.data.reason && response.data.reason == "weak") {
          alert("Password must be at least 12 characters, and may not contain quotes, spaces, backslashes, consecutive numbers, or other obvious or weak password characteristics.");
        } else {
          alert("Something went wrong! HTTP Code: " + response.status);
        }
        $scope.username = '';
        $scope.password1 = '';
      }
    );
  };

});
