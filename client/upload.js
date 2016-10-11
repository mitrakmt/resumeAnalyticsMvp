//inject angular file upload directives and services.
var app = angular.module('fileUpload', ['ngFileUpload']);

app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', '$http', function ($scope, Upload, $timeout, $http) {
    $scope.signin = function () {

    }
    $scope.fileUploaded = false;
    $scope.userLoggedIn = false;

    $scope.userLoggedIn = function () {
      if (userLoggedIn) {
        $scope.userLoggedIn = false;
      } else {
        $scope.userLoggedIn = true;
      }
    }

    console.log('http = ', $http)
    $scope.uploadFiles = function(file, errFiles) {
        $('.file-card').addClass('show');
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: "https://angular-file-upload-cors-srv.appspot.com/upload",
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
              console.log('$http = ', $http);
              $http.get("/api/fileUpload")
                .then(function(data) {
                  console.log(data)
                  $scope.totalScore = Math.round(data.data.body.totalScore);
                  $scope.sentiment = data.data.body.sentimentHelp;
                  $scope.readability = data.data.body.readabilityHelp;
                  $scope.lengthScore = data.data.body.lengthScoreHelp;
                  $scope.languageScore = data.data.body.languageScoreHelp;
                  $scope.keywords = data.data.body.keywordsHelp;
                });
              });
            };
            // $rootScope.$apply
    }
}]);
