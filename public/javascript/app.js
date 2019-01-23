$(document).ready(function() {

    $(".save-article").on("click", saveArticle);
    $(".delete-article").on("click", deleteArticle);
    $(".add-note").on("click", addNote);


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

    function addNote(){
        var id = $(this).data("id");
        var note = $("#note-" + id).val();

        $.ajax({
            method: "POST",
            url: "/note",
            data: {
                id: id,
                note: note
            }
        })
        .then(function(data) {

            location.reload();
        });
    }














});