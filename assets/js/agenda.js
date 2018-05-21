(function(){
	// Variables globales
	var operation = "A";
	var selected_index = -1;
    var contactos = localStorage.getItem("contactos");
    contactos = JSON.parse(contactos); //Converts string to object
    if(contactos == null)
        contactos = [];

	// Agregar contactos
	function Add(){

		var contacto = JSON.stringify({
			nombre: $("#nombre").val(),
			telefono: $("#telefono").val(),
			email: $("#email").val()
		//	file: $(files)
		});
		contactos.push(contacto);
		localStorage.setItem("contactos", JSON.stringify(contactos));
		alert("Datos guardados");
		return true;
	}

    // Editar contacot
    function Edit(){
        contactos[selected_index] = JSON.stringify({
            nombre: $("#nombre").val(),
            telefono: $("#telefono").val(),
            email: $("#email").val()
        });
        localStorage.setItem("contactos", JSON.stringify(contactos));
        alert("Dato editado");
        operation = "A";
        return true;
    }

	// Borrar contacto
	function Delete(){
	    contactos.splice(selected_index, 1);
	    localStorage.setItem("contactos", JSON.stringify(contactos));
	    alert("Contacto borrado");
	}

	// Mostrar lista de contactos
	function List(){
		$("#contactos-agenda tbody").find("tr").remove();
	    for(var i in contactos){
	        var con = JSON.parse(contactos[i]);
	        $("#contactos-agenda tbody").append("<tr id='" + i + "'>"+
	        	" <td><img src='assets/img/edit.png' alt='Edit"+i+"' class='btnEdit'><img src='assets/img/delete.png' alt='Delete"+i+"' class='btnDelete'></td>" +
	            "  <td >" +con.nombre+"</td>" +
	            "  <td>"+con.telefono+"</td>" +
	            "  <td>"+con.email+"</td>" +
	            "</tr>");
	    }
			//Make table sortable
			$("#contactos-agenda tbody").sortable();
	}

	function countItems(){
		var storedData = contactos;
		var items = storedData.length;

		$("#counter").find("h2").remove();
		$("#counter").append(
			"<h2>You have <span class='badge'>" + items + "</span> movies in your list</h2>"
		);
		return items;
	}

	// Ingresar nuevo contacto
	$(".form-signin").on("submit", function(){
		if (operation == "A")
			return Add();
		else
			return Edit();
	});

	// Boton editar
	$("#contactos-agenda").on("click", ".btnEdit", function(){
		operation = "E";
        selected_index = parseInt($(this).attr("alt").replace("Edit", ""));

        var cli = JSON.parse(contactos[selected_index]);
        $("#nombre").val(cli.nombre).focus();
        $("#telefono").val(cli.telefono);
        $("#email").val(cli.email);

    });

	// Boton borrar
	$("#contactos-agenda").on("click", ".btnDelete", function(){
	    selected_index = parseInt($(this).attr("alt").replace("Delete", ""));
	    Delete();
	    List();
			countItems();
	});

	//Store new list order when dropping a list item.
	//https://stackoverflow.com/questions/5320194/get-order-of-list-items-in-a-jquery-sortable-list-after-resort/5320313
	$("#contactos-agenda tbody").sortable({
		stop: function(event, ui) {
			//order is an array. Contains the ids of the rows in the new order.
			var order = $("#contactos-agenda tbody").sortable("toArray");
			//declare a new array and populate with the same elements in the new order.
			var newData = [];
			for (var i = 0; i < order.length; i++) {
					newData[i] = contactos[order[i]];
					}
			//console.log(contactos);
			//console.log(newData);
			localStorage.setItem("contactos", JSON.stringify(newData));
	}});

	List();
	countItems();


})();
