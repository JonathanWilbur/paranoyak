angular.module('mugshotapp', []).controller('mugform', function($scope, $http) {
  $scope.uploadMugshot = function () {
    var fd = new FormData();
    fd.append('mugshot', document.getElementById('mugshot').files[0]);
    $http.post('/api/users/mugshot', fd, {
      headers: { 'Content-Type': undefined }
    }).then(
      function (response) {
        window.location = '/chat.html';
      },
      function (response) {
        alert("Failed to update mugshot!");
      }
    )
  };
});

function updateMugshotPreview () {
  var mugshot = document.getElementById('mugshot');
  if (mugshot.files && mugshot.files[0]) {
    var fr = new FileReader();
    fr.onload = function (e) {
        document.getElementById('preview').src = e.target.result;
    }
    fr.readAsDataURL(mugshot.files[0]);
  }
}
