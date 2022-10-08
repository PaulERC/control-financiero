 //Se declaran variables globales
 var ingre=0;
 var egre=0;
 var etiquetas=[];
var valores=[];

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
    var categorias=[];
     var transaccionesRecientes="";
     var transacciones="";
     var contador=0;
     //console.log(objetoJS.table.rows.reverse());
     for(let mov of objetoJS.table.rows.reverse()){
         if (mov.c[5].v=="Ingreso"){
            //Se suman los ingresos 
            ingre+=mov.c[4].v;
         }else{
            //Se suman los egresos
            egre+=mov.c[4].v;
            //Se enlistan todas las categorías catalogadas como EGRESO
            categorias.push(mov.c[3].v);
         }
         if(contador<5){
            transaccionesRecientes+="<tr><td>"+mov.c[1].f+"</td><td>"+mov.c[2].v+"</td><td>"+mov.c[3].v+"</td><td>"+new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'MXN' }).format(mov.c[4].v)+"</td><td>"+mov.c[5].v+"</td><td>"+mov.c[6].v+"</td></tr>";
            contador++;
         } 
         transacciones+="<tr><td>"+mov.c[1].f+"</td><td>"+mov.c[2].v+"</td><td>"+mov.c[3].v+"</td><td>"+new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'MXN' }).format(mov.c[4].v)+"</td><td>"+mov.c[5].v+"</td><td>"+mov.c[6].v+"</td></tr>";
     }
     //Se le quitan los valores repetidos al arreglo
    categorias=new Set(categorias);
    var categorias = [...categorias];

    //Se comienza un ciclo para iterar entre todos los elementos de la lista de categorias
  for (let i = 0; i < categorias.length; i++) {
    //Se declara variable local para almacenar y sumar importe    
    var suma=0;
    for(let mov of objetoJS.table.rows){
        if(mov.c[5].v=="Egreso"){
            //Se suma el importe cada vez que se cumple una condición
            if(mov.c[3].v==categorias[i]){
                suma+=mov.c[4].v;
                }
            }
    }
    //Se reasigna el valor de una posición del arreglo, convirtiendo el arreglo de strings en un arreglo de objetos, agregandole el valor de la suma del importe
    categorias[i]={categoria:categorias[i],importe:suma};  
  }

  //Ordenar por importe más alto 
  var ordenados=categorias.sort((a,b) => {
    if(a.importe==b.importe){
        return 0;
    }
    if(a.importe > b.importe){
        return -1;
    }
    return 1;
});
  

 //Se declara arreglo vacio para rellenarlo en un bucle posterior
 var listaCat=[];
 var listaImpor=[];
 //se obtienen los primeros 5 elementos del arreglo ordenado por importe
 for (let i = 0; i < categorias.length; i++) {
     listaCat.push(categorias[i].categoria);
     listaImpor.push(categorias[i].importe);    
 }


//Se calcula el balance
var balan=ingre-egre;
//Se les da a los numeros un formato de moneda
ingre=new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'MXN' }).format(ingre);
egre=new Intl.NumberFormat('mx-MX', { style: 'currency', currency: 'MXN' }).format(egre);
balan=new Intl.NumberFormat('mx-MX',{ style: 'currency', currency: 'MXN'}).format(balan);
//Se asignan los valores a su Elemento Correspondiente
document.getElementById("ingresos").innerHTML=ingre;
document.getElementById("egresos").innerHTML=egre;
document.getElementById("balance").innerHTML=balan;
document.getElementById("numero-movimientos").innerHTML=objetoJS.table.rows.length;
document.getElementById("movimientos-recientes").innerHTML=transaccionesRecientes;
//Alternativa para formatear numeros a moneda
//console.log("Formato de Mexico ---- " + ingre.toLocaleString("es-MX"));



     // Chart Global Color
     Chart.defaults.color = "#6C7293";
     Chart.defaults.borderColor = "#000000";
     
    
     // Single Bar Chart Categorias
     var ctx4 = document.getElementById("analisis-categorias").getContext("2d");
     var myChart4 = new Chart(ctx4, {
         type: "bar",
         data: {
             labels: listaCat.slice(0,5),
             datasets: [{
                label: "Gastos", 
                backgroundColor: [
                     "rgba(235, 22, 22, .7)",
                     "rgba(235, 22, 22, .6)",
                     "rgba(235, 22, 22, .5)",
                     "rgba(235, 22, 22, .4)",
                     "rgba(235, 22, 22, .3)"
                 ],
                 data: listaImpor.slice(0,5)
             }]
         },
         options: {
             responsive: true
         }
     });


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


 


  // Single Line Chart Tiempo
  var ctx3 = document.getElementById("analisis-tiempo").getContext("2d");
  var myChart3 = new Chart(ctx3, {
      type: "line",
      data: {
          labels: ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul","Ago"],
          datasets: [{
            label: "Gastos",
            fill: true,
              backgroundColor: "rgba(235, 22, 22, .7)",
              data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15, 16]
          }]
      },
      options: {
          responsive: true
      }
  });


  // Single Bar Chart Categorias
 var ctx4 = document.getElementById("cuentas").getContext("2d");
 var myChart4 = new Chart(ctx4, {
     type: "bar",
     data: {
         labels: ["Efectivo", "Débito", "Crédito", "Cristóbal Colón"],
         datasets: [{
            label: "Cuentas", 
            backgroundColor: [
                 "rgba(235, 22, 22, .7)",
                 "rgba(235, 22, 22, .6)",
                 "rgba(235, 22, 22, .5)",
                 "rgba(235, 22, 22, .4)"
             ],
             data: [24, 44, 49, 55]
         }]
     },
     options: {
         responsive: true
     }
 });



 var ctx2 = document.getElementById("ahorros").getContext("2d");
 var myChart2 = new Chart(ctx2, {
     type: "line",
     data: {
        labels: ["Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul","Ago"],
        datasets: [{
                 label: "Reales",
                 data: [15, 30, 55, 45, 70, 65, 85],
                 backgroundColor: "rgba(235, 22, 22, .9)",
                 fill: true
             },
             {
                 label: "Proyectados",
                 data: [99, 135, 170, 130, 190, 180, 270],
                 backgroundColor: "rgba(235, 22, 22, .4)",
                 fill: true
             }
         ]
         },
     options: {
         responsive: true
     }
 });

})(jQuery);