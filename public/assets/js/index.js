$("#clear").click(function(event) {
    $.post("/clear", function (resorts) {
      console.log(resorts);
      location.reload();
    });
  });
$(".delete").click(function(event) {
    event.preventDefault();
    console.log(event);
    
    $.ajax({
        url: "/api/resorts/" + this.id,
        method: "DELETE"
     }).then(function(data){
         console.log(data);
         location.reload();
     }).catch(function(err){
         console.log(err);
     })
})