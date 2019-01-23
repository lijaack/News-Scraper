$(document).ready(function() {

    $("#save-article").on("click", saveArticle);
    $("#delete-article").on("click", deleteArticle);

    function saveArticle(){
        console.log("1")
        var id = $(this).data("id");
        $.ajax({
            method: "POST",
            url: "/saved",
            data: {
                id: id
            }
        })
        .then(function(data) {
            console.log("2")

            location.reload();
        });
    }
    function deleteArticle(){
        var id = $(this).data("id");
        $.ajax({
            method: "DELETE",
            url: "/article",
            data: {
                id: id
            }
        })
        .then(function(data) {

            location.reload();
        });
    }
















});