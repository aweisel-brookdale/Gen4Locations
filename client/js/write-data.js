//Create a listener that waits for user to enter submit button
//Submit Library books
$('#data-submit').click(function() {
    alert("Submit Button Pushed");


});

$('#data-clear').click(function() {
    $('#dexNumber').val("");
    $('#name').val("");
    $('#type').val("");
    $('#availability').val("");
    $('#obtain').val("");

});
