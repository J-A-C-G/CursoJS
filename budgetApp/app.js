/* -------------------------------------------------------------------------- */
/*      1. Vamos a implementar el patron de diseño Module-Patter en JS       
        
        Descripcion del Proyecto

        El proyecto es una applicacion para gestionar tu presupuesto,
        controla los ingresos y gastos de una persona y muestra el
        el total.

        ¿Que vamos a aprender?

        1. Encapsulation
        2. IFI -> Data privacy creating a new scope
        3. Anonimus Fuctions
        4.Scope
*/      
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                              BudgetController   
                
        This one is going to control the budget data
*/
/* -------------------------------------------------------------------------- */

var budgetController = (function ( /*aqui puede ir parametros*/ ) {

    var x=23; // variable
    //Private function
    var add=function(a){
        return x+a;
    }

    return {
        /*
        budgetController solo puede acceder a este metodo
        Esto trabaja gracias a Closures
        closures a inner fuction has always access to a variables
        and parametors of its outter fuction even it this one has return
        public fuction
        */
        publicTest: function(b){
            return add(b);
        }
    }

})(/*aqui se declara los parametros*/);

/* -------------------------------------------------------------------------- */
/*                                UI CONTROLLER                               */
/* -------------------------------------------------------------------------- */

var UIController= (function(){
    //some code
})();


/* -------------------------------------------------------------------------- */
/*                              Global Controller                             
    Este modulo se va a comunicar con los otros dos.
    Va a servir de canal para comunicarse entre los otros dos.
*/
/* -------------------------------------------------------------------------- */

var controller=(function(budgetCtrl, UICtrl){

    var z = budgetController.publicTest(5);
    //This is the only way to get access from outside
    return{
        anotherPublic:function(){
            console.log(z);
            console.log("fin");
        }
    }
})(budgetController,UIController);