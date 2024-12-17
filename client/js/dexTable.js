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
                $scope.types = getTypes(response.data.mons);
                $scope.selectedType = $scope.types[0];
            } else {
                console.log(response.data.msg);
            }
        }), function (error) {
            console.log(error);
        }
    }; //End of get records

    $scope.get_records();

    $scope.redrawTable = function() {
        var type = $scope.selectedType.value;

        $http({
            method: 'get',
            url: dexURL + "/get-monsByType",
            params: {type: type}
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
        $scope.obtain = $scope.mons[monNumber].obtain;
        $scope.monID = $scope.mons[monNumber]['_id'];

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
            ID: $scope.monID,
            dexNumber: $scope.dexNumber,
            name: $scope.name,
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
                console.log("In update response");
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

    $scope.deleteMon = function(id) {
        console.log(id);

        $http({
            method: 'delete',
            url: dexURL + "/delete-record",
            params: {monID: id}
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

function getTypes(dexTableData) {
    var typeExists;

    typesArray = [{ value: "", display: "ALL" }];

    for (var i = 0; i < dexTableData.length; i++) {
        typeExists = typesArray.find(function(element) {
            return element.value === dexTableData[i].type;
        });

        if (typeExists) {
            continue;
        } else {
            typesArray.push({ value: dexTableData[i].type, display: dexTableData[i].type.toUpperCase() });
        }
    }

    return typesArray;
}