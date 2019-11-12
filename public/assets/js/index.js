$("#clear").click(function(event) {
    $.post("/clear", function (resorts) {
      console.log(resorts);
      location.reload();
    });
  });
$("#favorite").click(function(event) {
    $.ajax({
      url:"/api/favorites/" + this.id,
      method: "GET"
    }).then
       function (resorts) {
      console.log(resorts);
      location.reload();
    });
  });
  // Delete button click
$(".delete").click(function(event) {
    event.preventDefault();
    console.log(event);
    
    $.ajax({
        url: "/api/resorts/" + this.id,
        method: "DELETE"
     }).then(function(data){
         location.reload();
     }).catch(function(err){
         console.log(err);
     })
})

$(".favorite").click(function(event){
  $.ajax({
    url: "/api/favorites" + this.id,
    method: "UPDATE"
  }).then(function(data){
    console.log(data);
    
  }).catch(function(err){
    console.log(err);
    
  })
})