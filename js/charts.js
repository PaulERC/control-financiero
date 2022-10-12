//Se obtienen los valores en formaro JSON
$.ajax({
    //En el campo de URL debe de poner la url del documento de Google Speadsheets donde están sus datos, de la siguiente forma
    //https://docs.google.com/spreadsheets/d/ID_DOCUMENT/gviz/tq?tqx=out:json&gid=ID_HOJA_TRABAJO
    //ID_DOCUMENT es el identificador unico del documento de Google SpreadSheets
    //ID_HOJA_TRABAJO es el identificador de la hoja del documento en donde se encuentra la información que se va a importar en el JSON
  url: 'https://docs.google.com/spreadsheets/d/15S5FSUtPj_S8mW_m5HIJ7k1dcGn5qaj4Y3F6ErBWzGU/gviz/tq?tqx=out:json&gid=0',
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
  var meses=[];
  var cuentas=[];


 //Recorremos el objeto para hacer modificaciones a cada iteracion
for(let mov of objetoJS.table.rows)
  { 
    if(mov.c[5].v=="Egreso"){
      //Se enlistan todas las categorías catalogadas como EGRESO
      categorias.push(mov.c[3].v);
      //Se obtiene el valor de la fecha, y se separa por "/" para poder obtener cada valor por separado
      let mes=mov.c[1].f.split("/");
      //Se enlista cada mes
      meses.push(mes[1]);
      //Se enlistan las cuentas
      cuentas.push(mov.c[6].v);
      }
  }
  //Se le quitan los valores repetidos a los arreglos
  categorias=new Set(categorias);
  var categorias = [...categorias];
  meses=new Set(meses);
  var meses = [...meses];
  cuentas = new Set(cuentas);
    var cuentas = [...cuentas]; 

  //Chart Categorias
  
  //Se comienza un ciclo para iterar entre todos los elementos de la lista de categorias
  for (let i = 0; i < categorias.length; i++) {
  //Se declara variable local para almacenar y sumar importe    
  let suma=0;
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
  categorias.sort((a,b) => {
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



  //Chart Tiempo

  //Se comienza un ciclo para iterar entre todos los elementos de la lista de meses
  for (let i = 0; i < meses.length; i++) {
    //Se declara variable local para almacenar y sumar importe    
    let sumaMeses=0;
    for(let mov of objetoJS.table.rows){
        if(mov.c[5].v=="Egreso"){
            //Se suma el importe cada vez que se cumple una condición
            let mes = mov.c[1].f.split("/");
            if(mes[1]==meses[i]){
                sumaMeses+=mov.c[4].v;
                }
            }
    }
    //Se reasigna el valor de una posición del arreglo, convirtiendo el arreglo de strings en un arreglo de objetos, agregandole el valor de la suma del importe
    meses[i]={mes:convertirMes(meses[i]),importe:sumaMeses};  
  }


  //Ordenar por fecha 
  meses.sort((a,b) => {
    if(a.mes==b.mes){
        return 0;
    }
    if(a.mes > b.mes){
        return -1;
    }
    return 1;
});

//Funcion para convertir numero de mes en nombre de mes
function convertirMes(numero){
    //let nombreMeses = ["","Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let nombreMeses = ["","Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul","Ago", "Sep", "Oct", "Nov", "Dic"];
        let nombreMes="";
        for (let index = 1; index < nombreMeses.length; index++) {
            if(numero==index){
                nombreMes=nombreMeses[index];
            }         
        }
        return nombreMes;
    }



  //Se declara arreglo vacio para rellenarlo en un bucle posterior
  var listaMeses=[];
  var listaImporMeses=[];
  //se obtienen los primeros 5 elementos del arreglo ordenado por importe
  for (let i = 0; i < meses.length; i++) {
      listaMeses.push(meses[i].mes);
      listaImporMeses.push(meses[i].importe);    
  }


  
 // Single Line Chart Tiempo
 var ctx3 = document.getElementById("analisis-tiempo").getContext("2d");
 var myChart3 = new Chart(ctx3, {
     type: "line",
     data: {
         labels: listaMeses,
         datasets: [{
           label: "Gastos",
           fill: true,
             backgroundColor: "rgba(235, 22, 22, .7)",
             data: listaImporMeses
         }]
     },
     options: {
         responsive: true
     }
 });



//Chart Cuentas

    //Se comienza un ciclo para iterar entre todos los elementos de la lista de cuentas
    for (let i = 0; i < cuentas.length; i++) {
        //Se declara variable local para almacenar y sumar importe    
        let suma=0;
        for(let mov of objetoJS.table.rows){
            if(mov.c[5].v=="Egreso"){
                //Se suma el importe cada vez que se cumple una condición
                if(mov.c[6].v==cuentas[i]){
                    suma+=mov.c[4].v;
                    }
                }
        }
        //Se reasigna el valor de una posición del arreglo, convirtiendo el arreglo de strings en un arreglo de objetos, agregandole el valor de la suma del importe
        cuentas[i]={cuenta:cuentas[i],importe:suma};  
      }

    
     //Se declara arreglo vacio para rellenarlo en un bucle posterior
     var listaCuenta=[];
     var listaImporCuenta=[];
     //se obtienen los primeros 5 elementos del arreglo ordenado por importe
     for (let i = 0; i < cuentas.length; i++) {
         listaCuenta.push(cuentas[i].cuenta);
         listaImporCuenta.push(cuentas[i].importe);    
     }
    
    
     // Chart Global Color
     Chart.defaults.color = "#6C7293";
     Chart.defaults.borderColor = "#000000";
     
    
        
    // Doughnut Chart
    var ctx6 = document.getElementById("analisis-cuentas").getContext("2d");
    var myChart6 = new Chart(ctx6, {
        type: "doughnut",
        data: {
            labels: listaCuenta,
            datasets: [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)"
                ],
                data: listaImporCuenta
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