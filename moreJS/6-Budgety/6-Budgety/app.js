

let budgetController = (function(){

  let Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function(type){
    let sum = 0;

    data.allItems[type].forEach(function(cur){
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItems:{
        exp:[],
        inc:[]
    },
    totals: {
        exp:0,
        inc:0
    },
    budget: 0,
    percentage: -1
  };

  return{
    addItem: function(type,des,val){
      let newItem, ID;



      //create new ID
      if(data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length -1].id + 1;
      }
      else{
        ID = 0;
      }




      //create new item depending on type
      if(type === "exp"){
        newItem = new Expense(ID,des,val);
      }
      else if(type === "inc"){
          newItem = new Income(ID,des,val);
      }


      //push it into the new datastructure
      data.allItems[type].push(newItem);
      //return the new element
      return newItem;

    },

    deleteItem: function(type, id){
      let ids, index;

      ids = data.allItems[type].map(function(current){
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1){
        data.allItems[type].splice(index,1);
      }

    },

    calculateBudget: function(){

      // calculate total income and expenses

      calculateTotal("exp");
      calculateTotal("inc");

      //calculate the budget: income - expenses

      data.budget = data.totals.inc - data.totals.exp;

      //calulate the precentage of income that we spent

      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }
      else{
        data.percentage = -1;
      }
    },
    getBudget: function(){
      return{
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function(){
      console.log(data);
    }
  };

})();


// UI
let UIController = (function(){

  let DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container"
  };

  return {
    getInput: function(){
      return{
        // type will be either inc or exp
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj,type){
      let html,newHtml,element;
      // Create html sting with placeholder text

      if(type === "inc"){
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      else if(type === "exp"){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      //Repalce the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    clearFields: function(){
      let fields, fieldsArr;

      // querySelectorAll returns a list and not an array
      fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

      //converts the list to an array
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current,index,array){
        current.value = "";
      });
      // set focus back to the input description
      fieldsArr[0].focus();
    },

    displayBudget: function(obj){

      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

      if(obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
      }
      else{
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    getDOMstrings: function(){
      return DOMstrings;
    }

  };

})();



// Global App Controller
let controller = (function(budgetCtrl,UICtrl){

  let setupEventListeners = function(){

    let DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click",ctrlAddItem);

    document.addEventListener("keypress", function(event){

      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem);

  };

  let updateBudget = function(){
    //1. Calculate the budget
    budgetCtrl.calculateBudget();
    //2. Return the budget
    let budget = budgetCtrl.getBudget();
    //3. Display the budget on the UI'
    UICtrl.displayBudget(budget);
  };

  let ctrlAddItem = function(){

    let input,newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      //2. Add the item to the budget Controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. Add the item the the UI
      UICtrl.addListItem(newItem, input.type);

      //4. Clear the fields
      UICtrl.clearFields();

      //5. Calculate and Update budget
      updateBudget();
    }
  };

  let ctrlDeleteItem = function (event){
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){
      //format of the ID: inc-1, or exp-0 etc...
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);
      // 2. Delete the item from the UI

      // 3. Update and show the new budget

    }

  };

  return{
    init: function(){
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  }

})(budgetController,UIController);

controller.init();