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