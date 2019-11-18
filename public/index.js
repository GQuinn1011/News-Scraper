  $(document).on("click", ".scrape", function() {
      $.ajax({
              method: "GET",
              url: "/scrape"
          })
          // With that done
          .then(function(data) {
              // Log the response
              console.log(data);
              location.reload();
          });
  })


  $(document).on("click", ".delete", function() {
      console.log("delete");
      var thisId = $(this).attr("data-id");
      $.ajax({
              method: "DELETE",
              url: "/delete/" + thisId
          })
          // With that done
          .then(function(data) {
              // Log the response
              console.log(data);
              location.reload();
              // Empty the notes section
              //$("#notes").empty();
          });

  });