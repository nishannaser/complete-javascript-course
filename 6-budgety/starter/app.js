/*
------------------------------------------------------------------------------------------------------------------------
                                               BUDGET Controller
------------------------------------------------------------------------------------------------------------------------
*/
var budgetController = (function () {
    // Private

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

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

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        total: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function (type) {
        var sum = 0;
        if (data.allItems[type].length > 0) {
            data.allItems[type].forEach(function (cur) {
                sum += cur.value;
            })
        }
        data.total[type] = sum;
    };

    // Public
    return {
        addItem: function (type, desc, value) {
            var newItem, id, lastItem;

            // Generate id. New id = id of last element + 1
            if (data.allItems[type].length > 0) {
                lastItem = data.allItems[type][data.allItems[type].length - 1];
                id = lastItem.id + 1;
            } else {
                id = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(id, desc, value);
            } else {
                newItem = new Income(id, desc, value);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function (type, id) {
            var allIds, index;
            allIds = data.allItems[type].map(function (item, index) {
                return item.id;
            });
            index = allIds.indexOf(id);
            data.allItems[type].splice(index, 1);
        },

        calculateBudget: function () {
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget = data.total['inc'] - data.total['exp'];
            if (data.total['inc'] > 0) {
                data.percentage = Math.round(data.total['exp'] / data.total['inc'] * 100);
            } else {
                data.percentage = -1;
            }
        },

        fetchBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.total['inc'],
                totalExp: data.total['exp'],
                percentage: data.percentage
            }
        },

        calculatePercentages() {
            data.allItems.exp.forEach(function (item) {
                item.calcPercentage(data.total.inc);
            });
        },

        fetchPercentages() {
            return data.allItems.exp.map(function (item) {
                return item.getPercentage();
            });
        },

        testing: function () {
            console.log(data);
        }
    }
})();

/*
------------------------------------------------------------------------------------------------------------------------
                                                  UI Controller
------------------------------------------------------------------------------------------------------------------------
*/
var uiController = (function () {
    // Private
    const domStrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncomeValue: '.budget__income--value',
        budgetExpensesValue: '.budget__expenses--value',
        budgetExpensesPercentage: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');

        // Integer part
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        // Decimal part
        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    // Public
    return {
        getInput: function () {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDesc).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
            }
        },

        getDomStrings: function () {
            return domStrings;
        },

        addListItem: function (itemObj, type) {
            var element, html;

            if (type === 'inc') {
                element = domStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = domStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            html = html.replace('%id%', itemObj.id);
            html = html.replace('%description%', itemObj.description);
            html = html.replace('%value%', formatNumber(itemObj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        deleteListItem: function (itemId) {
            var element = document.getElementById(itemId);
            element.parentNode.removeChild(element);
        },

        clearFields: function () {
            var fields, fieldsArray;

            fields = document.querySelectorAll(domStrings.inputDesc + ',' + domStrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (currentElement, index, array) {
                currentElement.value = '';
            });

            fieldsArray[0].focus();
        },

        updateBudget: function (budgetObj) {
            var budgetType = budgetObj.budget >= 0 ? 'inc' : 'exp';
            document.querySelector(domStrings.budgetValue).textContent = formatNumber(budgetObj.budget, budgetType);
            document.querySelector(domStrings.budgetIncomeValue).textContent = formatNumber(budgetObj.totalInc, 'inc');
            document.querySelector(domStrings.budgetExpensesValue).textContent = formatNumber(budgetObj.totalExp, 'exp');
            if (budgetObj.percentage > 0) {
                document.querySelector(domStrings.budgetExpensesPercentage).textContent = budgetObj.percentage + '%';
            } else {
                document.querySelector(domStrings.budgetExpensesPercentage).textContent = '---';
            }
        },

        updatePercentages(percentages) {
            var fields = document.querySelectorAll(domStrings.expensesPercentageLabel);

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function () {
            var now, months, month, year;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(domStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function () {

            var fields = document.querySelectorAll(domStrings.inputType + ',' +
                domStrings.inputDesc + ',' +
                domStrings.inputValue);

            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(domStrings.inputBtn).classList.toggle('red');

        },
    }
})();

/*
------------------------------------------------------------------------------------------------------------------------
                                               Global App Controller
------------------------------------------------------------------------------------------------------------------------
*/
var controller = (function (budgetCtrl, uiCtrl) {

    // Private
    // =======
    var setupEventListeners = function () {
        var domStrings = uiCtrl.getDomStrings();

        document.querySelector(domStrings.inputBtn).addEventListener('click', addItem);

        document.addEventListener('keydown', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });

        document.querySelector(domStrings.container).addEventListener('click', deleteItem);

        document.querySelector(domStrings.inputType).addEventListener('change', uiCtrl.changedType);
    };

    function addItem() {
        // 1. Capture input fields
        var inputData = uiCtrl.getInput();

        if (inputData.description !== '' && !isNaN(inputData.value) && inputData.value > 0) {
            // 2. Add new item to budget controller
            var newItem = budgetCtrl.addItem(inputData.type, inputData.description, inputData.value);

            // 3. Add the new item to the UI
            uiCtrl.addListItem(newItem, inputData.type);

            // 4. Clear the input fields
            uiCtrl.clearFields();

            // 5. Update the budget
            updateAndDisplayBudget();

            // 6. Update percentages
            updateAndDisplayPercentages();
        }
    }

    function deleteItem(event) {
        var itemId, type, id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            var idSplit = itemId.split('-');
            type = idSplit[0];
            id = idSplit[1];

            // 1. Delete item from data
            budgetCtrl.deleteItem(type, id);

            // 2. Delete item from UI
            uiCtrl.deleteListItem(itemId);

            // 3. Update the budget
            updateAndDisplayBudget();

            // 4. Update percentages
            updateAndDisplayPercentages();
        }
    }

    function updateAndDisplayBudget() {
        // 1. Calculate Budget
        budgetCtrl.calculateBudget();

        // 2. Fetch budget details
        let budget = budgetCtrl.fetchBudget();

        // 3. Update budget in UI
        uiCtrl.updateBudget(budget);
    }

    function updateAndDisplayPercentages() {
        // 1. Calculate Percentages
        budgetCtrl.calculatePercentages();

        // 2. Fetch percentages array
        let percentages = budgetCtrl.fetchPercentages();

        // 3. Update percentages in UI
        uiCtrl.updatePercentages(percentages);
    }

    // Public
    // ======
    return {
        init: function () {
            console.log('Application has started...');
            uiCtrl.displayMonth();
            uiCtrl.updateBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, uiController);

// Start the app
controller.init();