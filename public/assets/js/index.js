var API = {
    renderResorts: function (resorts) {
        $.ajax({
            url: "/api/resorts",
            type: "GET"
        }).then(function () {
            console.log(resorts);
        });
    }
};
$("#clear").click(function(event) {
    $.post("/clear", function (resorts) {
      console.log(resorts);
      location.reload();
    });
  });