//Create a listener that waits for user to enter submit button
//Submit dex entries
$('#data-submit').click(function() {
    //alert("Submit Button Pushed");
    var dexNumber = $('#dexNumber').val();
    var name = $('#name').val();
    var type = $('#type').val();
    var availability = $('#availability').val();
    var obtain = $('#obtain').val();

    var jsonString = {
        dexNumber:dexNumber, 
        name:name, 
        type:type, 
        availability:availability, 
        obtain:obtain
    }

    $.ajax({
        url: dexURL + "/write-record",
        type: "post",
        data: jsonString,
        success: function(response) {
            var data = JSON.parse(response);
            if(data.msg = "SUCCESS") {
                alert("Data Saved");
            } else {
                console.log(data.msg);
            }
        },
        error: function(err) {
            console.log(err);
        }
    });

 });


$('#data-clear').click(function() {
    $('#dexNumber').val("");
    $('#name').val("");
    $('#type').val("");
    $('#availability').val("");
    $('#obtain').val("");

});
