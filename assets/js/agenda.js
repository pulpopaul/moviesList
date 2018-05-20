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
	        $("#contactos-agenda tbody").append("<tr>"+
	        	" <td><img src='assets/img/edit.png' alt='Edit"+i+"' class='btnEdit'><img src='assets/img/delete.png' alt='Delete"+i+"' class='btnDelete'></td>" +
	            "  <td>"+con.nombre+"</td>" +
	            "  <td>"+con.telefono+"</td>" +
	            "  <td>"+con.email+"</td>" +
	            "</tr>");
	    }
			//Make table sortable
			$("#contactos-agenda tbody").sortable();
	}

	// Ingresar nuevo contacto
	$(".form-signin").bind("submit", function(){
		if (operation == "A")
			return Add();
		else
			return Edit();
	});

	List();

	// Botón editar
	$(".btnEdit").bind("click", function(){
		operation = "E";
        selected_index = parseInt($(this).attr("alt").replace("Edit", ""));

        var cli = JSON.parse(contactos[selected_index]);
        $("#nombre").val(cli.nombre).focus();
        $("#telefono").val(cli.telefono);
        $("#email").val(cli.email);

    });

	// Botón borrar
	$("#contactos-agenda").on("click", ".btnDelete", function(){
	    selected_index = parseInt($(this).attr("alt").replace("Delete", ""));
	    Delete();
	    List();
	});

})();
