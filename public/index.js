  $(document).on("click", ".scrape", function() {
      $.ajax({
              method: "GET",
              url: "/scrape"
          })
          .then(function(data) {
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
          .then(function(data) {
              console.log(data);
              location.reload();

          });

  });