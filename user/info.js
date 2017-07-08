var ang = angular.module('ang', []).run(function($rootScope, $http) {
  $rootScope.topics = [];
  $http.get('/api/info/topics').then(
    function (response) {
      $rootScope.topics = $rootScope.topics.concat(response.data);
    },
    function (response) {
      alert("Failed to get topics list!");
      $rootScope.topics = [];
      window.location = '/';
    }
  );
  $rootScope.getInfoAbout = function (topic) {
    $http.get('/api/info/about/' + topic).then(
      function (response) {
        document.getElementById('infotitle').innerText = response.data.title;
        document.getElementById('infobody').innerText = response.data.body;
      },
      function (response) {
        alert("Failed to get information on topic: " + topic);
      }
    );
  }
  $rootScope.goToChat = function () { window.location = '/chat'; };
  $rootScope.getInfoAbout("general");
});
