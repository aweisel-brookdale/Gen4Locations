var tempData = JSON.parse('[{"ID":"dex387","dexNumber":"387","name":"Turtwig","type":"Grass","availability":"Diamond/Pearl/Platinum","obtain":"DPPt: Starter"},{"ID":"dex390","dexNumber":"390","name":"Chimchar","type":"Fire","availability":"Diamond/Pearl/Platinum","obtain":"DPPt: Starter"},{"ID":"dex393","dexNumber":"393","name":"Piplup","type":"Water","availability":"Diamond/Pearl/Platinum","obtain":"DPPt: Starter"},{"ID":"dex133","dexNumber":"133","name":"Eevee","type":"Normal","availability":"All games and Pok&eacute;Walker","obtain":"DPPt: Gift from Bebe (postgame in DP), Trophy Garden (postgame); HGSS: Gift from Bill, Celadon Game Corner; Pok&eacute;walker: Sightseeing (Wi-Fi download)"},{"ID":"dex328","dexNumber":"328","name":"Trapinch","type":"Ground","availability":"Diamond/Pearl, HeartGold/SoulSilver","obtain":"DP: Route 228 (Pok&eacute; Radar); HGSS: Safari Zone (Desert, 49 Peak points)"}]');

// retrieveData();  //Get inital load

createDexTable(tempData);

function retrieveData() {
    //Retrieve the library data and populate on page load
    $.ajax({
        url: dexURL + "/read-records",
        type:"get",
        success: function(response){
        // console.log(response);
        var data = JSON.parse(response);
        createDexTable(data);
        },
        error: function(err){
        alert(err);
        }
    });
}

function createDexTable(dexData) {
    // console.log(dexData);

    var tableHTML = "";
    for(var i=0; i<dexData.length; i++) {
        tableHTML += "<tr>";
        tableHTML += "<td>" + dexData[i].dexNumber + "</td>";
        tableHTML += "<td>" + dexData[i].name + "</td>";
        tableHTML += "<td>" + dexData[i].type + "</td>";
        tableHTML += "<td>" + dexData[i].availability + "</td>";
        tableHTML += "<td>" + dexData[i].obtain + "</td>";
        // tableHTML += "<td>" 
        //             +"<button class='btn btn-sm edit_btn delete-button' "
        //             + "data-id='" + dexData[i].ID 
        //             + "'>DELETE</button>"
        //             + "</td>";
        tableHTML += "</tr>";
    }

    $("#dexTable").html(tableHTML);
    // activateDelete();
}

function activateDelete() {
    $('.delete-button').click(function() {
        var deleteID = this.getAttribute("data-id");
        
        $.ajax({
        url: dexURL + "/delete-record",
        type:"delete",
        data: {deleteID: deleteID},
        success: function(response){
            if(response = "SUCCESS") {
                retrieveData();  //Repaint table
            } else {
                alert(response);
            }
        },
        error: function(err){
            alert(err);
        }
        });

    });
}