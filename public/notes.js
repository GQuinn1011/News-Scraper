$(document).on("click", ".post", function() {
        console.log("post");

        var thisId = $(this).attr("data-id");
        console.log(thisId);
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                username: $("#new-username").val(),
                text: $("#new-text").val()
            }
        })

        .then(function(data) {

            console.log(data);
            location.reload();

        });


        $("#new-username").val("");
        $("#new-text").val("");

    })
    // });

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