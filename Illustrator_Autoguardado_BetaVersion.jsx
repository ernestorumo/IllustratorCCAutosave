//Autor : Ernesto Ruiz Moya - ernestorumo@gmail.com

// Script de autosalvado para Illustrator CC, parecido al de 3dMax. 
//Salva un número determinado de archivos (copias del original) con un intervalo de tiempo entre guardados.
//Las copias de seguridad se guardan en la misma hubicación que el documento de trabajo.

// ----- Requiere Bridge como "listener" 
//_________________________________________________________________________________

#target bridge
#targetengine "MainEngine"

var bt = new BridgeTalk;
var il = new BridgeTalk;
var cuantos = 0; 
var maximoarchivos = 5; //número de archivos de autoback.
var idtask1 = 0;
var idtask2 = 0;
var intervalo = 10000; //intervalo de tiempo entre salvadas.

bt.target = "illustrator-17";
il.target = "illustrator-17";

primeraComprobacion();

function primeraComprobacion(){
    il.body = "var doc = app.activeDocument;if(!doc.saved){Window.alert('Salve un primera vez');var filename = doc.fullName; var thisFile = new File(filename);var saveFile = thisFile.saveDlg();if(saveFile){alert('clicked ok');doc.saveAs(saveFile);}else{alert('Autoguardado no se activara');}}";
    il.send();
    idtask1 = app.scheduleTask('tarea1();',10000,true);
}

function tarea1(){
    bt.body = "app.activeDocument.saved";
    bt.send();
    bt.onResult = function(resObj) {

         var myResult = resObj.body;
            $.writeln('se ejecuta tarea1 y se salva primera vez = ' + myResult);
            if(!myResult){
                app.cancelTask(idtask1);
                $.writeln(' No se ejecuta el salvado');
            }
            if(myResult){ 
               app.cancelTask(idtask1);
               idtask2 = app.scheduleTask('tarea2();',intervalo,true);
                }
    }
}

function tarea2(){
        bt.body = "app.documents.length";
        bt.send();
        bt.onResult = function(resObj) {

         var myResult = resObj.body;
            $.writeln( "Documentos abiertos = " + myResult );
        comprobacion(myResult);
    }
}

function comprobacion(numero){
   if(numero < 1){
       cancelar();
       }else{
            salvado();
           }
    }

function cancelar(){
         il.body = "Window.alert('Se ha desactivado el salvado automatico. Noy hay documentos abiertos que salvar.');";
         il.send();
         app.cancelTask(idtask2); //para la tarea (timer) que se estaba ejecutando
    }

function salvado(){   
   $.writeln('Salvando');
  il.body = "var doc = app.activeDocument; if(!doc.saved){doc.save();var filedocname = new File(doc.path + '/' + doc.name);var fn = doc.name.lastIndexOf('.'); var fname = doc.name.substr(0,fn); var filebackname = new File(doc.path + '/' + fname + '_autoback_" + cuantos + ".ai');filedocname.copy(filebackname);alert('Documento salvado en ' + filebackname );}";
  il.send();
    if(cuantos >=maximoarchivos){
        cuantos = 0;
        }else{
                cuantos++;
            }
    }
