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

    //some code

})(/*aqui se declara los parametros*/);

/* -------------------------------------------------------------------------- */
/*                                UI CONTROLLER                               */
/* -------------------------------------------------------------------------- */

var UIController= (function(){

    var DOMstrings={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    };

    return {
        getInput: function(){

            /*
            //En orden para pasar los tres valores tenemos que crear un objeto
            //obtenemos en valor de la clase add__type que puede ser inc or exp
            var type= document.querySelector('.add__type').value;
            var description=document.querySelector('.add_description').value;
            var value=document.querySelector('.add__value').value;
            */
           //creamos el objeto
           return{
               type:document.querySelector(DOMstrings.inputType).value,
               description: document.querySelector(DOMstrings.inputDescription).value,
               value: document.querySelector(DOMstrings.inputValue).value
           }
        },

        //exponemos los DOMstrings al publico
        getDOMstrings: function(){
            return DOMstrings;
        }
    }

})();


/* -------------------------------------------------------------------------- */
/*                              Global Controller                             
    Este modulo se va a comunicar con los otros dos.
    Va a servir de canal para comunicarse entre los otros dos.
*/
/* -------------------------------------------------------------------------- */

var controller=(function(budgetCtrl, UICtrl){

    //private function no expose to the public
    var setupEventListener=function () {

        var DOM = UICtrl.getDOMstrings();
        /* Vamos a crear el event Listener 
        1. Necesitamos el elemento al que vamos a añadir el evento lo obtenemos por medio de su clase
        */
         document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddIem);

         //vamos a validar que con este eveto se pueda agregar el ingreso o gasto al dar enter 

         document.addEventListener('keypress', function (event) {
             if (event.keyCode === 13 || event.which === 13) {

                 ctrlAddIem();

             }
         });
    }

    //private function no expose to the public
    //creamos esta funcion para que no se repita codigo al presionar el btn y tmb al dar enter
    var ctrlAddIem= function(){
        //1. Get the filed input data 
        var input=UICtrl.getInput();
        //2. Add the items to the budget controller
        //3. Add the item to the UI
        //4. Calculate the budget
        //5. Display de budget total

    };

    //creamos a public return function
    return {
        init:function () {
            console.log('Aplication has started.');
            setupEventListener();
        } 
    }

})(budgetController,UIController);

controller.init();