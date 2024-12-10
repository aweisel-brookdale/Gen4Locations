var app = angular.module("tableApp", []);

app.controller("tableCtrl", function ($scope, $http) {
    $scope.mons = [];

    $scope.get_records = function () {
        $http({
            method: 'get',
            url: dexURL + "/get-records"
        }).then(function (response) {
            if (response.data.msg === "SUCCESS") {
                $scope.mons = response.data.mons;
                $scope.names = getTypes(response.data.mons);
                $scope.selectedName = $scope.names[0];
            } else {
                console.log(response.data.msg);
            }
        }), function (error) {
            console.log(error);
        }
    }; //End of get records

    $scope.get_records();

    $scope.redrawTable = function() {
        var type = $scope.selectedName.value;

        $http({
            method: 'get',
            url: dexURL + "/get-monsByName",
            params: {name: name}
        }).then(function (response) {
            if (response.data.msg === "SUCCESS") {
                $scope.mons = response.data.mons;
            } else {
                console.log(response.data.msg);
            }
        }), function (error) {
            console.log(error);
        }

    }

    $scope.editMon = function (monNumber) {
        $scope.dexNumber = $scope.mons[monNumber].dexNumber;
        $scope.name = $scope.mons[monNumber].name;
        $scope.type = $scope.mons[monNumber].type;
        $scope.availability = $scope.mons[monNumber].availability;
        $scope.obtain = $scope.mons[monNumber].obtain
        $scope.id = $scope.mons[monNumber].id;

        $scope.hideTable = true;
        $scope.hideForm = false;
    }

    $scope.cancelUpdate = function () {
        $scope.hideTable = false;
        $scope.hideForm = true;
    }

    $scope.updateMon = function () {
        if ($scope.dexNumber === "" || $scope.name === "" || $scope.type === "") {
            $scope.addResults = "Pok&eacute;dex number, Pok&eacute;mon name, and type are required.";
            return;
        }
        var jsonData = {
            id: $scope.id,
            dexNumber: $scope.dexNumber,
            name: $scope.name.toLowerCase(),
            type: $scope.type,
            availability: $scope.availability,
            obtain: $scope.obtain
        };

        console.log(jsonData)
        $http({
            method: 'put',
            url: dexURL + "/update-mon",
            data: jsonData
        }).then(function (response) {
            if (response.data.msg === "SUCCESS") {
                $scope.cancelUpdate();
                $scope.redrawTable();

                $scope.dexNumber = "";
                $scope.name = "";
                $scope.type = "";
                $scope.availability = "";
                $scope.obtain = "";
            } else {
                $scope.addResults = response.data.msg;
            }
        }), function (error) {
            console.log(error);
        }
    }

    $scope.deleteMon = function(dexNumber) {
        console.log(dexNumber);

        $http({
            method: 'delete',
            url: dexURL + "/delete-record",
            params: {name: dexNumber}
        }).then(function (response) {
            if (response.data.msg === "SUCCESS") {
                $scope.redrawTable();
            } else {
                console.log(response.data.msg);
            }
        }), function (error) {
            console.log(error);
        }
    }

}); //End of controler

function getNames(dexTableData) {
    var nameExists;

    namesArray = [{ value: "", display: "ALL" }];

    for (var i = 0; i < dexTableData.length; i++) {
        nameExists = namesArray.find(function(element) {
            return element.value === dexTableData[i].name;
        });

        if (nameExists) {
            continue;
        } else {
            namesArray.push({ value: dexTableData[i].name, display: dexTableData[i].name.toUpperCase() });
        }
    }

    return namesArray;
}