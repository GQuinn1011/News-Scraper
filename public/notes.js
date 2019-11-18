$(document).on("click", ".post", function() {
    console.log("post");

    var thisId = $(this).attr("data-id");
    console.log(thisId);
    if ($("#new-title").val() != "" && $("#new-body").val() != "") {
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                username: $("#new-title").val(),
                text: $("#new-body").val()
            }
        })

        .then(function(data) {

            console.log(data);
            location.reload();

        });


        $("#new-title").val("");
        $("#new-body").val("");
    }
});

$(document).on("click", ".delete", function() {
    console.log("delete");
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "DELETE",
        url: "/note/delete/" + thisId
    })

    .then(function(data) {
        console.log(data);
        location.reload();

    });

});