 //Se obtienen los valores en formaro JSON
 $.ajax({
     url: 'https://docs.google.com/spreadsheets/d/1ZsuvudiSyj2WM3sS5glW5ixhZJKWXxIpt_Z6OS_MQL0/gviz/tq?tqx=out:json&gid=0',
     dataType: "text",
     contentType: "charset=utf-8",        
 }).done(prepararDatos);
 //Se parsea de JSON a Objeto para poder trabajar con los datos
 function prepararDatos(data){
     //Quitar el 1 para poder mostrar datos reales
     subdata=data.slice(47,-2);
     //Se declaran las variables para obtener la suma de los campos
     var objetoJS = JSON.parse(subdata);
     //Se declara variable para obtener todos los registros
     var transacciones="";
     var ingresos="";
     var egresos="";
     //Totales
     var totalTransacciones=0;
     var totalIngresos=0;
     var totalEgresos=0;
     var ordenados=objetoJS.table.rows.reverse();
     for(let mov of ordenados)
     { 
        if(mov.c[5].v=="Ingreso"){
            totalIngresos+=mov.c[4].v;
            ingresos+="<tr><td>"+mov.c[1].f+"</td><td>"+mov.c[2].v+"</td><td>"+mov.c[3].v+"</td><td>"+mov.c[5].v+"</td><td>"+mov.c[6].v+"</td><td>"+new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'MXN' }).format(mov.c[4].v)+"</td></tr>";
        }else{
            totalEgresos+=mov.c[4].v;
            egresos+="<tr><td>"+mov.c[1].f+"</td><td>"+mov.c[2].v+"</td><td>"+mov.c[3].v+"</td><td>"+mov.c[5].v+"</td><td>"+mov.c[6].v+"</td><td>"+new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'MXN' }).format(mov.c[4].v)+"</td></tr>";
        }
        transacciones+="<tr><td>"+mov.c[1].f+"</td><td>"+mov.c[2].v+"</td><td>"+mov.c[3].v+"</td><td>"+mov.c[5].v+"</td><td>"+mov.c[6].v+"</td><td>"+new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'MXN' }).format(mov.c[4].v)+"</td></tr>";
     }
     totalTransacciones=totalIngresos-totalEgresos;
     //Se asignan los valores a su Elemento Correspondiente : en este caso... Tbody´s
     document.getElementById("ingresos").innerHTML=ingresos;
     document.getElementById("egresos").innerHTML=egresos;
     document.getElementById("movimientos").innerHTML=transacciones;
     document.getElementById("total-ingresos").innerHTML=new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'MXN' }).format(totalIngresos);
     document.getElementById("total-egresos").innerHTML=new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'MXN' }).format(totalEgresos);
     document.getElementById("total-todo").innerHTML=new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'MXN' }).format(totalTransacciones);
     //Alternativa para formatear numeros a moneda
     //console.log("Formato de Mexico ---- " + ingre.toLocaleString("es-MX"));
     
 }



(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    

    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


})(jQuery);