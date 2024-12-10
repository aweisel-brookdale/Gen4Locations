var mons = [];
var activeMon = 0;

var app = angular.module('browseDataApp', []);

app.controller('browseDataCtrl', function ($scope, $http) {

    $scope.get_records = function () {
        $http({
            //Send request to the server
            method: 'get',
            url: dexURL + "/get-records"
        }).then(function (fred) {
            //Successfully connected to the server
            console.log("This is Fred" + JSON.stringify(fred));
            if (fred.data.msg === "SUCCESS") {
                mons = fred.data.mons;
                $scope.obj = mons[activeMon];
                $scope.showHide();
            } else {
                console.log(fred.data.msg);
            }
        }), function (error) {
            console.log(error);
        }
    }

    $scope.get_records();

    $scope.changeMon = function (direction) {
        activeMon += direction;
        $scope.obj = mons[activeMon];
        $scope.showHide();
    }

    $scope.showHide = function () {
        $scope.hidePrev = (activeMon == 0);
        $scope.hideNext = (activeMon == mons.length - 1);
    }
}); //End of controller