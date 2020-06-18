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

/* --------- variable que almacena el valor del key de localStorage --------- */

var localStorageKeyName = 'key';

var budgetController = (function ( /*aqui puede ir parametros*/ ) {

    //Aqui vamos a crear los constructores
    //Los constructores se crean con mayusculas para diferenciarlos
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
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

    var data = { //object
        allItems: { //object
            exp: [], //array
            inc: [] //array
        },
        totals: { //object
            exp: 0, //array
            inc: 0 //array
        },
        budget: 0,
        percentage: -1




    };


    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (curr) { //callback
            sum = sum + parseInt(curr.value);
        });
        data.totals[type] = sum;

    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            //create a new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //create new item based on inc or exp type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
                console.log(newItem);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //Push into our data 
            data.allItems[type].push(newItem);
            console.log("esto es el push");
            console.log(typeof (data.allItems[type]));
            console.log(data.allItems[type]);
            //Save into LocalStorage
            this.updateLocalStorage(data);

            return newItem;

        },

        deleteItem: function (type, id) {
            var ids, index;
            if (type === 'income') {
                type = 'inc';
            } else if (type === 'expense') {
                type = 'exp';
            }
            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4 6 8]
            //index = 3
            //console.log(type);
            //console.log(id);
            ids = data.allItems[type].map(function (current) {
                //console.log(current.id);
                return current.id;

            });
            console.log(ids.indexOf(id));
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            //actualiza LocaStorage
            this.updateLocalStorage(data);
        },

        calculateBudget: function () {
            //calculate total income and expensives
            calculateTotal('exp');
            calculateTotal('inc');
            //Calculate the budget: income - expensives
            data.budget = data.totals.inc - data.totals.exp;
            //Calculate the percentage Ej: 15%
            if (data.totals.exp > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },


        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
        },

        calcExpensePercentage: function (totalIncome, cur) {
            if (totalIncome > 0) {
                cur.percentage = Math.round((cur.value / totalIncome) * 100);
            } else {
                cur.percentage = -1;
            }
        },


        getExpensePercentage: function (cur) {
            console.log('Yo soy cur que viene de get');
            console.log(cur);
            return cur.percentage;
        },


        calculatePercentages: function () {

            /*
            a=20
            b=10
            c=40
            income = 100
            a=20/100=20%
            b=10/100=10%
            c=40/100=40%
            */
            data.allItems.exp.forEach(function (cur) {
                
                budgetController.calcExpensePercentage(data.totals.inc, cur);
            });
            
        },


        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                console.log('Yo soy cur');
                console.log(cur);
                return budgetController.getExpensePercentage(cur);
            });
            return allPerc;
        },



        /* ------ Guarda el obj data en localstorage ----- */
        updateLocalStorage: function (obj) {

            localStorage.setItem(localStorageKeyName, JSON.stringify(obj));
            //console.log(localStorage.getItem(localStorageKeyName));
            this.loadFromLocalStorage();
        },


        /* ------ Guarda la informacion obtenida de localStorage en el obj data ----- */

        loadFromLocalStorage: function () {

            var dataInLocalStorage = localStorage.getItem(localStorageKeyName);
            if (dataInLocalStorage !== null) {

                console.log("this is the old data")
                console.log(data);
                console.log("this is the new data")
                console.log(JSON.stringify(data));
                data = JSON.parse(dataInLocalStorage);
                
                return data;
            }
            
        },

        testing: function () {
            console.log(data);
            console.log('retrievedObject: ', JSON.parse(retrievedObject));
        }
    }

})( /*aqui se declara los parametros*/ );


/* -------------------------------------------------------------------------- */
/*                                UI CONTROLLER                               */
/* -------------------------------------------------------------------------- */

var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container', //Use to delete an item with Event Delegation(Concept) 
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',

    };


    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    return {
        getInput: function () {

            /*
            //En orden para pasar los tres valores tenemos que crear un objeto
            //obtenemos en valor de la clase add__type que puede ser inc or exp
            var type= document.querySelector('.add__type').value;
            var description=document.querySelector('.add_description').value;
            var value=document.querySelector('.add__value').value;
            */
            //creamos el objeto
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        addListItem: function (obj, type) {
            //create HTML string with placeholder text
            var html, element;


            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                //we going to use %simbols to identify the data that we going to change with real values
                html = '<div class = "item clearfix" id = "income-%id%"><div class = "item__description">%description%</div>' +
                    '<div class = "right clearfix">' +
                    '<div class = "item__value">%value%</div>' +
                    '<div class = "item__delete">' +
                    '<button class = "item__delete--btn">' +
                    '<span class="material-icons">close</span>' +
                    '</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class = "item clearfix" id = "expense-%id%">' +
                    '<div class = "item__description"> %description% </div>' +
                    '<div class = "right clearfix">' +
                    '<div class = "item__value"> %value% </div>' +
                    '<div class = "item__percentage"> %per% </div>' +
                    '<div class = "item__delete">' +
                    '<button class = "item__delete--btn"><span class="material-icons">close</span></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            //replace the placeholder text with some actual data
            var newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));
            if(type==='exp'){
                newHtml = newHtml.replace('%per%',obj.percentage+'%');
            }

            //insert the HTML into the DOM(Data Object Manipulation)
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);



        },

        //Delete item from the UI

        deleteListItem: function (selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        //clearFields

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            //QuerySelectorAll return a list not an array (they have different methods)
            //We going to convert a list into a array
            //llamamos al metodo general de un Arreglo
            fieldsArray = Array.prototype.slice.call(fields);
            //foreach method
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            })
            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {
            //operador ternario
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = '$  ' + formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;
            //var gradientPercentage=obj.percentage;
            //console.log('linear-gradient(128deg, white ' +gradientPercentage+ '%, white 51%, black 50%, black)');


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function (percentages) {

            //return a node List
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            //nodeList does not have a forEach method so we are going to create our own foreach method for nodes
            var nodeListForEach = function (list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i] /*Elemento*/ , i /*Index*/ );
                }
            };

            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },

        //exponemos los DOMstrings al publico
        getDOMstrings: function () {
            return DOMstrings;
        },

        displayDate: function () {
            var date, month, year
            
            date = new Date();
            month=date.getMonth();
            year=date.getFullYear();
            switch (month + 1) {
                case 1:
                    return 'January'+' '+year;
                    break;
                case 2:
                    return 'February'+' '+year;
                    break;
                case 3:
                    return 'March'+' '+year;
                    break;
                case 4:
                    return 'April'+' '+year;
                    break;
                case 5:
                    return 'May'+' '+year;
                    break;
                case 6:
                    return 'June'+' '+year;
                    break;
                case 7:
                    return 'July'+' '+year;
                    break;
                case 8:
                    return 'August'+' '+year;
                    break;
                case 9:
                    return 'September'+' '+year;
                    break;
                case 10:
                    return 'October'+' '+year;
                    break;
                case 11:
                    return 'November'+' '+year;
                    break;
                case 12:
                    return 'December'+' '+year;
                    break;
            }
        }
    }

})();


/* -------------------------------------------------------------------------- */
/*                              Global Controller                             
    Este modulo se va a comunicar con los otros dos.
    Va a servir de canal para comunicarse entre los otros dos.
*/
/* -------------------------------------------------------------------------- */

var controller = (function (budgetCtrl, UICtrl) {

    //private function no expose to the public
    var setupEventListener = function () {

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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    }

    //We create a new fuction to avoid RY
    //we going to use when we add & delete
    var updateBudget = function () {

        //1. Calculate the Budget
        budgetController.calculateBudget();
        //2. Return the Budget
        var budget = budgetCtrl.getBudget();
        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);

        var blue = 100 - budget.percentage;
        var red = budget.percentage;

        //display gradient background
        document.querySelector('.top').style.background = 'linear-gradient(128deg, rgb(0, 116, 179)' + blue + '%, rgb(229,9,20)' + blue + '%, rgb(229, 9, 20)' + red + '%)';
    }


    var updatePercentages = function () {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new percentages
        console.log('Yo soy percentages');
        console.log(percentages);
        UICtrl.displayPercentages(percentages);
    };


    //private function no expose to the public
    //creamos esta funcion para que no se repita codigo al presionar el btn y tmb al dar enter
    var ctrlAddIem = function () {
        var input, newItem;
        //1. Get the filed input data 
        input = UICtrl.getInput();

        //input descripcion culd not be empty and input value needs to be a number
        if (input.description !== " " && !isNaN(input.value) && input.value > 0) {

            //2. Add the items to the budget controller

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            //4. Clear fields
            UICtrl.clearFields();
            //5. Calculate and Update budget
            updateBudget();
            //6. Calculate & Update Percentage
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function (event /*use to know what the target elemment is*/ ) {
        var itemID, splitID, type, ID;

        /*Aqui utilizamos traversing to traverse throug the DOM;
        from :<i class="ion-ios-close-outline"></i>
        to: < div class = "item clearfix" id = "income-0" >
        in order to get the id income-0
        */
        console.log(event);
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        //tenemos que poner la informacion en un if por que el addeventlistener esta relacionado a la clase container
        //y se activa en cualquiera de sus hijos tenemos que validar que sea el icono eliminar
        //validamos por que es el unico q tiene un id
        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }
    }



    //creamos a public return function
    return {
        init: function () {
            console.log('Aplication has started...');
            console.log('Tengo dos soluciones cada vez que carge la pagina llamar a localSorage y ingresar como New expense y New income...');
            console.log("La otra es crear un metodo pararte que no este relacionado con el Prototipo del objeto Expense")
            /*UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            })*/

            setupEventListener();

            var date = UICtrl.displayDate();
            document.querySelector('.budget__title--month').textContent = date;


            var data = budgetCtrl.loadFromLocalStorage();
            updateBudget();
            var arrayInc = data.allItems.inc;
            arrayInc.forEach(function (current) {
                UICtrl.addListItem(current, 'inc');
            })
            var arrayExp = data.allItems.exp;
            arrayExp.forEach(function (current) {
                UICtrl.addListItem(current, 'exp');
            })
        }
    }

})(budgetController, UIController);

//Para que se ejecute cuando termina de cargarse la pagina
controller.init();