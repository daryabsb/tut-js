// Budget Controller
var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(el => (sum += el.value));
    data.totals[type] = sum;
  };
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };
  return {
    addItem: function (type, des, val) {
      var newItem;
      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on exp or inc
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else {
        newItem = new Income(ID, des, val);
      }

      // Push the new element
      data.allItems[type].push(newItem);
      return newItem;
    },
    deleteItem: function (type, id) {
      var ids, index;
      // console.log(id);

      // ids = data.allItems[type].map(function (el) {
      //   return el.id;
      // });
      ids = data.allItems[type].map(el => el.id);
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }

      // console.log(ids);
      // console.log(index);
      // console.log(data.allItems[type]);
    },
    calculateBudget: function () {
      // Calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      // console.log(data.totals);
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentages: function () {
      // console.log(data.totals.inc);
      //
      data.allItems.exp.forEach(el => el.calcPercentage(data.totals.inc));
    },
    // getPercentages: function() {
    //     // CHECK HERE
    //     var allPerc = data.allItems.exp.map(el => {
    //         el.getPercentage();
    //         // console.log(el);
    //     });

    //     return allPerc;
    // },
    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testing: function () {
      console.log(data);
    }
  };
})();

// UI Controller
var UIController = (function () {
  var DOMstrings = {
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
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var formatNumber = function (num, type) {
    /*
      + or - before number
      exactly 2 decimal points
      comma separating the thousands

      2310.4567 -> + 2,310.46
      2000 -> - 2,000.00
      */
    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int =
        int.substr(0, int.length - 3) +
        "," +
        int.substr(int.length - 3, int.length);
    }
    dec = numSplit[1];

    type === "exp" ? (sign = "-") : (sign = "+");

    return sign + " " + int + "." + dec;
  };
  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;
      // Create HTM String with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%perc%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>`;
      }

      // Replace Placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      // Insert HTM into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: function (selectorId) {
      var el;
      el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },
    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(el => (el.value = ""));
      fieldsArr[0].focus();
    },
    displayBudget: function (obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        type
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, type);
      // console.log(obj.percentage);

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function (cur, index) {
        if (percentages[index] > 0) {
          cur.textContent = percentages[index] + "%";
        } else {
          cur.textContent = "---";
        }
      });
    },
    displayMonth: function () {
      var now, year, month, months;
      now = new Date();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent =
        months[month] + " " + year;
    },
    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue
      );

      nodeListForEach(fields, function (cur) {
        cur.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
    },

    getDOMstrings: function () {
      return DOMstrings;
    }
  };
})();

// Global App Controller
var controller = (function (budCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UIController.changeType);
  };

  var updateBudget = function () {
    // 1. Calculate the budget
    budgetController.calculateBudget();
    // 2. Return the budget
    var budget = budgetController.getBudget();
    // 3. Display the budget on the UI
    UIController.displayBudget(budget);
  };

  var updatePercentages = function () {
    // 1. Calculate percentages
    budgetController.calculatePercentages();
    // 2. read percentages from the budget controller
    var percentages = budgetController.getPercentages();
    // 3. Update the UI with the new percentages
    UIController.displayPercentages(percentages);
    // console.log(percentages);
  };

  var ctrlAddItem = function () {
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetController.addItem(
        input.type,
        input.description,
        input.value
      );

      // 3. Add the item to the UI
      UIController.addListItem(newItem, input.type);

      // 4. Clear the fields
      UIController.clearFields();

      // 5. Calculate and update budget
      updateBudget();
      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemId, splitId, type, ID;

    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    // console.log(itemId);
    if (itemId) {
      // inc-1
      splitId = itemId.split("-");
      type = splitId[0];
      ID = parseInt(splitId[1]);

      // 1. delete item from data structure
      budgetController.deleteItem(type, ID);
      // 2. delete item from user interface
      UIController.deleteListItem(itemId);
      // 3. Update and show the new budget
      updateBudget();
      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("Application has started.");

      UIController.displayMonth();

      UIController.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });

      setupEventListeners();
    }
  };
})(budgetController, UIController);
controller.init();
