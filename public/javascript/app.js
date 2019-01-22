$(document).ready(function() {

    $("#save-article").on("click", saveArticle);
    $("#delete-article").on("click", deleteArticle);

    function saveArticle(){

    }
    function deleteArticle(){
        console.log("1")
        var id = $(this).data("id");
        $.ajax({
            method: "DELETE",
            url: "/article",
            data: {
                id: id
            }
        })
        // With that done
        .then(function(data) {
            console.log("2")

            // Log the response
            console.log(data);
            // Empty the notes 
            location.reload();
        });
    }
















});