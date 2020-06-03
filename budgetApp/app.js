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
        4. Scope
        5. Insert data to the DOM

*/      
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                              BudgetController   
                
        This one is going to control the budget data
*/
/* -------------------------------------------------------------------------- */

var budgetController = (function ( /*aqui puede ir parametros*/ ) {

    //Aqui vamos a crear los constructores
    //Los constructores se crean con mayusculas para diferenciarlos
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    /*//We can do it like this pero es mejor guardarlo como un objeto
    var allExpenses=[];
    var allIncomes=[];
    var totalExpenses=0;
    */

    //es mejor guardar el data asi
    var data={//object
        allItems:{//object
            exp:[],//array
            inc:[]//array
        },
        totals:{//object
            exp:0,//array
            inc:0//array
        }
    } ;

    return{
        addItem:function(type, des, val){
            var newItem, ID;
            //create a new ID
            if(data.allItems[type].lenght>0){
            ID=data.allItems[type][data.allItems[type].lenght-1].id + 1;
            }else{
                ID=0;
            }
            //create new item based on inc or exp type
            if(type==='exp'){
            newItem = new Expense(ID, des, val);
            }else if(type==='inc'){
            newItem= new Income(ID, des,val);    
            }
            //Push into our data 
            data.allItems[type].push(newItem);
            return newItem;
        },

        testing: function(){
            console.log(data);
        }
    }

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
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
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
               type: document.querySelector(DOMstrings.inputType).value,
               description: document.querySelector(DOMstrings.inputDescription).value,
               value: document.querySelector(DOMstrings.inputValue).value
           }
        },

        addListItem: function(obj, type){
            //create HTML string with placeholder text
            var html, element;
            
            if(type==='inc')
            {
                element= DOMstrings.incomeContainer;
                //we going to use %simbols to identify the data that we going to change with real values
                html='<div class = "item clearfix" id = "income-%id%"><div class = "item__description">%description%</div>'+
                        '<div class = "right clearfix">'+
                        '<div class = "item__value">%value%</div>'+
                        '<div class = "item__delete">'+
                        '<button class = "item__delete--btn">'+
                        '<i class = "ion-ios-close-outline" ></i>'+
                        '</button>'+
                        '</div>'+
                        '</div>'+
                    '</div>';

            }else if(type==='exp')
            {
                element=DOMstrings.expensesContainer;
                html = '<div class = "item clearfix"id = "expense-%id% ">'+
                            '<div class = "item__description"> %description% </div>'+
                            '<div class = "right clearfix">'+
                            '<div class = "item__value"> %value% </div>'+

                            '<div class = "item__delete">'+
                            '<button class = "item__delete--btn"> <i class = "ion-ios-close-outline"> </i></button>'+
                            '</div>'+
                            '</div>'+
                        '</div>';
            }        
            //replace the placeholder text with some actual data
            console.log(html);
            var newHtml= html.replace('%id%', obj.id);
            newHtml= newHtml.replace('%description%', obj.description);
            newHtml= newHtml.replace('%value%', obj.value);

            //insert the HTML into the DOM(Data Object Manipulation)
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

            
        },

        //clearFields

        clearFields: function(){
            var fields, fieldsArray;
            fields=document.querySelectorAll(DOMstrings.inputDescription +','+ DOMstrings.inputValue);
            //QuerySelectorAll return a list not an array (they have different methods)
            //We going to convert a list into a array
            //llamamos al metodo general de un Arreglo
            fieldsArray=Array.prototype.slice.call(fields);
            //foreach method
            fieldsArray.forEach(function(current, index, array){
                current.value="";
            })
            fieldsArray[0].focus();
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
        var input, newItem;
        //1. Get the filed input data 
        input=UICtrl.getInput();
        //2. Add the items to the budget controller
        newItem=budgetCtrl.addItem(input.type,input.description,input.value);
        //3. Add the item to the UI
        UICtrl.addListItem(newItem,input.type);
        //4. Clear fields
        UICtrl.clearFields();
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

//Para que se ejecute cuando termina de cargarse la pagina
controller.init();