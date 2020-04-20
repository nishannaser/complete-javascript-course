/*
------------------------------------------------------------------------------------------------------------------------
                                               BUDGET Controller
------------------------------------------------------------------------------------------------------------------------
*/
const budgetController = (function () {
    // Private

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }

        calcPercentage(totalIncome) {
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            } else {
                this.percentage = -1;
            }
        }

        getPercentage() {
            return this.percentage;
        }
    }


    let data = {
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

    let calculateTotal = type => {
        let sum = 0;
        if (data.allItems[type].length > 0) {
            data.allItems[type].forEach(cur => sum += cur.value);
        }
        data.total[type] = sum;
    };

    // Public
    return {
        addItem: function (type, desc, value) {
            let newItem, id, lastItem;

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

        deleteItem: (type, id) => {
            let allIds, index;
            allIds = data.allItems[type].map((item, index) => item.id);
            index = allIds.indexOf(id);
            data.allItems[type].splice(index, 1);
        },

        calculateBudget: () => {
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget = data.total['inc'] - data.total['exp'];
            if (data.total['inc'] > 0) {
                data.percentage = Math.round(data.total['exp'] / data.total['inc'] * 100);
            } else {
                data.percentage = -1;
            }
        },

        fetchBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.total['inc'],
                totalExp: data.total['exp'],
                percentage: data.percentage
            }
        },

        calculatePercentages() {
            data.allItems.exp.forEach(item => item.calcPercentage(data.total.inc));
        },

        fetchPercentages() {
            return data.allItems.exp.map(item => item.getPercentage());
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
const uiController = (() => {
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

    function nodeListForEach(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }

    const formatNumber = (num, type) => {
        let numSplit, int, dec;

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
        getInput: () => {
            return {
                type: document.querySelector(domStrings.inputType).value,
                description: document.querySelector(domStrings.inputDesc).value,
                value: parseFloat(document.querySelector(domStrings.inputValue).value)
            }
        },

        getDomStrings: () => {
            return domStrings;
        },

        addListItem: (itemObj, type) => {
            let element, html;

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

        deleteListItem: itemId => {
            const element = document.getElementById(itemId);
            element.parentNode.removeChild(element);
        },

        clearFields: () => {
            let fields, fieldsArray;

            fields = document.querySelectorAll(domStrings.inputDesc + ',' + domStrings.inputValue);
            fieldsArray = Array.from(fields);

            fieldsArray.forEach(currentElement => currentElement.value = '');
            fieldsArray[0].focus();
        },

        updateBudget: budgetObj => {
            const budgetType = budgetObj.budget >= 0 ? 'inc' : 'exp';
            document.querySelector(domStrings.budgetValue).textContent = formatNumber(budgetObj.budget, budgetType);
            document.querySelector(domStrings.budgetIncomeValue).textContent = formatNumber(budgetObj.totalInc, 'inc');
            document.querySelector(domStrings.budgetExpensesValue).textContent = formatNumber(budgetObj.totalExp, 'exp');
            if (budgetObj.percentage > 0) {
                document.querySelector(domStrings.budgetExpensesPercentage).textContent = budgetObj.percentage + '%';
            } else {
                document.querySelector(domStrings.budgetExpensesPercentage).textContent = '---';
            }
        },

        updatePercentages: percentages => {
            const fields = document.querySelectorAll(domStrings.expensesPercentageLabel);

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: () => {
            let now, months, month, year;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();

            document.querySelector(domStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: () => {

            const fields = document.querySelectorAll(domStrings.inputType + ',' +
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
const controller = ((budgetCtrl, uiCtrl) => {

    // Private
    // =======
    const setupEventListeners = () => {
        const domStrings = uiCtrl.getDomStrings();

        document.querySelector(domStrings.inputBtn).addEventListener('click', addItem);

        document.addEventListener('keydown', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });

        document.querySelector(domStrings.container).addEventListener('click', deleteItem);

        document.querySelector(domStrings.inputType).addEventListener('change', uiCtrl.changedType);
    };

    const addItem = () => {
        // 1. Capture input fields
        const inputData = uiCtrl.getInput();

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

    const deleteItem = (event) => {
        let itemId, type, id;
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
        init: () => {
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