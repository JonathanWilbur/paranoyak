angular.module('usersapp', []).run(function ($rootScope, $http) {
  $rootScope.selected = undefined;
  $rootScope.users = [];
  $http.get('/api/users/list').then(
    function (response) { $rootScope.users = $rootScope.users.concat(response.data); },
    function (response) { alert("Something went wrong! HTTP Code: " + response.status); }
  );
  $rootScope.getUserInfo = function (name) {
    for (var i = 0; i < $rootScope.users.length; i++) {
      if ($rootScope.users[i].name == name) {
        $rootScope.selected = $rootScope.users[i];
      }
    }
  }
  $rootScope.goToChat = function () { window.location = '/chat'; }
});
