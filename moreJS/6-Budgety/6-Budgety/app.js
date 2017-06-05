

let budgetController = (function(){

  let Expense = function(id, description, value){
    this.is = id;
    this.description = description;
    this.value = value;
  };

  let Income = function(id, description, value){
    this.is = id;
    this.description = description;
    this.value = value;
  };

  let data = {
    allItems:{
        exp:[],
        inc:[]
    },
    totals: {
        exp:0,
        inc:0
    }
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
    expensesContainer: ".expenses__list"
  };

  return {
    getInput: function(){
      return{
        // type will be either inc or exp
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    addListItem: function(obj,type){
      let html,newHtml,element;
      // Create html sting with placeholder text

      if(type === "inc"){
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" i4d="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }
      else if(type === "exp"){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
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
  };


  let ctrlAddItem = function(){

    let input,newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    //2. Add the item to the budget Controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //3. Add the item the the UI
    UICtrl.addListItem(newItem, input.type);

    //4. Clear the fields
    UICtrl.clearFields();
    //5. Calculate the budget

    //6. Display the budget on the UI

  };

  return{
    init: function(){
      setupEventListeners();
    }
  }

})(budgetController,UIController);

controller.init();
