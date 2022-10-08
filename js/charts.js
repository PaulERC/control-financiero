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


 //Recorremos el objeto para hacer modificaciones a cada iteracion
for(let mov of objetoJS.table.rows)
  { 
    if(mov.c[5].v=="Egreso"){
      //Se enlistan todas las categorías catalogadas como EGRESO
      categorias.push(mov.c[3].v);
      }
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



  

         //Todito
         // Chart Global Color
         Chart.defaults.color = "#6C7293";
         Chart.defaults.borderColor = "#000000";
         // Single Bar Chart Categorias
         var ctx4 = document.getElementById("grafica-categoria").getContext("2d");
         var myChart4 = new Chart(ctx4, {
             type: "bar",
             data: {
                 labels: listaCat,
                 datasets: [{
                    label: "Gastos", 
                    backgroundColor: [
                         "rgba(235, 22, 22, .7)"
                     ],
                     data: listaImpor
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

})(jQuery);