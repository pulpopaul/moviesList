(function(){
	// Global variables
	var operation = "A";
	var selected_index = -1;
    var data = localStorage.getItem("data");
    data = JSON.parse(data); //Converts string to object
    if(data == null)
        data = [];

	// Add data
	function Add(){

		//the last image selected is already in local storage.
		//It was recorded when picked.	We duplicate it.
		var poster = localStorage.getItem('imageStore');

		var newRecord = JSON.stringify({
			name: $("#name").val(),
			review: $("#review").val(),
			poster: poster
		});
		data.push(newRecord);
		localStorage.setItem("data", JSON.stringify(data));
		//notify
		$("#message").find("h4").remove();
		$("#message").append(
			"<h4>Record added</h4>"
		);
		return true;
	}

    // Edit record
    function Edit(){
			var poster = localStorage.getItem('imageStore');

        data[selected_index] = JSON.stringify({
            name: $("#name").val(),
            review: $("#review").val(),
            poster: poster
        });
        localStorage.setItem("data", JSON.stringify(data));
				//notify
				$("#message").find("h4").remove();
				$("#message").append(
					"<h4>Record edited successfully</h4>"
				);
        operation = "A";
        return true;
    }

	function Delete(){
	    data.splice(selected_index, 1);
	    localStorage.setItem("data", JSON.stringify(data));
			$("#message").find("h4").remove();
			$("#message").append(
				"<h4>Record deleted</h4>"
			);
	}

	// Show list of records
	function List(){
		$("#list tbody").find("tr").remove();
	    for(var i in data){
	        var con = JSON.parse(data[i]);
	        $("#list tbody").append("<tr id='" + i + "'>"+
	        	" <td><img src='assets/img/edit.png' alt='Edit"+i+"' class='btnEdit'><img src='assets/img/delete.png' alt='Delete"+i+"' class='btnDelete'></td>" +
	            "  <td >" + con.name + "</td>" +
	            "  <td>" + con.review + "</td>" +
	            "  <td><img src=" + con.poster + " height='80' width='80' /></td>" +
	            "</tr>");
	    }
			//Make table sortable (drag & drop)
			$("#list tbody").sortable();
	}

	function countItems(){
		var storedData = data;
		var items = storedData.length;

		$("#counter").find("h3").remove();
		$("#counter").append(
			"<h3>You have " + items + " movies in your list</h3>"
		);
		return items;
	}

	// Bind add operation to submit
	$(".form-signin").on("submit", function(){
		if (operation == "A")
			return Add();
		else
			return Edit();
	});

	// Bind edit operation to edit button
	$("#list").on("click", ".btnEdit", function(){
		operation = "E";
        selected_index = parseInt($(this).attr("alt").replace("Edit", ""));
				//var poster = localStorage.getItem('imageStore');
        var cli = JSON.parse(data[selected_index]);
        $("#name").val(cli.name).focus();
        $("#review").val(cli.review);
        //$("#poster").val(poster);

    });

	// Bind delete operation to delete button
	$("#list").on("click", ".btnDelete", function(){
	    selected_index = parseInt($(this).attr("alt").replace("Delete", ""));
	    Delete();
	    List();
			countItems();
	});

	//Store new list order when dropping a list item.
	//https://stackoverflow.com/questions/5320194/get-order-of-list-items-in-a-jquery-sortable-list-after-resort/5320313
	$("#list tbody").sortable({
		stop: function(event, ui) {
			//order is an array. Contains the ids of the rows in the new order.
			var order = $("#list tbody").sortable("toArray");
			//declare a new array and populate with the same elements in the new order.
			var newData = [];
			for (var i = 0; i < order.length; i++) {
					newData[i] = data[order[i]];
					}
			//console.log(data);
			//console.log(newData);
			localStorage.setItem("data", JSON.stringify(newData));
	}});

	//Store an image previously uploaded.
	//This function redraws the uploaded img in an invisible canvas.
	//It's the best way to convert an image in an string to save it.
	function storeTheImage() {
	    var imgCanvas = document.getElementById('canvas-element'),
	        imgContext = imgCanvas.getContext("2d");

	    var img = document.getElementById('image-preview');
	    // Make sure canvas is as big as the picture BUT make it half size to the file size is small enough
	    imgCanvas.width = (img.width/4);
	    imgCanvas.height = (img.height/4);

	    // Draw image into canvas element
	    imgContext.drawImage(img, 0, 0, (img.width/4), (img.height/4));

	    // Get canvas contents as a data URL
	    var imgAsDataURL = imgCanvas.toDataURL("image/png");

	    // Save image into localStorage
	    try {
	        window.localStorage.setItem("imageStore", imgAsDataURL);
	        //$('.localstorage-output').html( window.localStorage.getItem('imageStore') );
	    }
	    catch (e) {
	        console.log("Storage failed: " + e);
	    }
	}

	//Upload image from user's drive and show preview.
	function readURL(input) {
	    if (input.files && input.files[0]) {
	        var reader = new FileReader();

	        reader.onload = function (e) {
	            $('#image-preview').attr('src', e.target.result);
	            storeTheImage();
	        }
	        reader.readAsDataURL(input.files[0]);
	    }
	}

	$('.file-input').on('change', function() {
	    readURL(this);
	});

	List();
	countItems();

})();
