// storage controller
const StorageCtrl = (function () {
    return {
        storeItem: function (item) {
            let items;

            // check if any items in ls
            if (localStorage.getItem('items') === null) {
                items = [];

                // push new item
                items.push(item);

                // set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function (item, i) {
                if (updatedItem.id === item.id) {
                    items.splice(i, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function (item, i) {
                if (item.id === id) {
                    items.splice(i, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function () {
            localStorage.removeItem('items');
        }
    }
})();


// item controller
const ItemCtrl = (function () {
    // item constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // data structure / state
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            let ID;

            // create id
            if (data.items.length > 0) {

                // first get the last index of id then add 1 to it.
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0;
            }

            // calories to number
            calories = parseInt(calories);

            // create new item
            newItem = new Item(ID, name, calories);

            // push new item to data structure
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function (id) {
            let found = null;
            // loop through items
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });

            return found;
        },
        updateItem: function (name, calories) {
            // calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function (id) {
            // get ids
            const ids = data.items.map(function (item) {
                return item.id;
            });

            // get index
            const index = ids.indexOf(id);

            // remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let totalCalories = 0;

            data.items.forEach(function (item) {
                totalCalories += item.calories;
            });

            data.totalCalories = totalCalories;

            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }
})();



// UI controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:</strong>
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `;
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {
            // show list 
            document.querySelector(UISelectors.itemList).style.display = 'block';

            // create li element
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;

            // add html
            li.innerHTML = `
                <strong>${item.name}:</strong>
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;

            // append
            // document.querySelector(UISelectors.itemList).appendChild(li);
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;

            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState();
        },
        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);
            listItems.forEach(function (item) {
                item.remove();
            });
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        updateListItem: function (updatedItem) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn nodelist into array
            listItems = Array.from(listItems);

            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${updatedItem.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${updatedItem.name}:</strong>
                    <em>${updatedItem.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    `;
                }
            });
        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline-block';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline-block';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline-block';
            document.querySelector(UISelectors.backBtn).style.display = 'inline-block';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        }
    }

})();



// app controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    // load even listeners
    const loadEventListeners = function () {
        // get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)

        // disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // edit item click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // delete item event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', function (e) {
            UICtrl.clearEditState();
            e.preventDefault();
        });

    }

    // add item submit
    const itemAddSubmit = function (e) {
        // get form input from ui controller
        const input = UICtrl.getItemInput();

        // check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // add item to UI list
            UICtrl.addListItem(newItem);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // store in localstorage
            StorageCtrl.storeItem(newItem);

            // clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // click edit item
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // get list item id
            const listId = e.target.parentElement.parentElement.id;

            // break into an array
            const listIdArr = listId.split('-'); // ['item', 0]

            // get actual id
            const id = parseInt(listIdArr[1]); // 0

            // get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // item update submit
    const itemUpdateSubmit = function (e) {
        // get item input
        const input = UICtrl.getItemInput();

        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // update ui
        UICtrl.updateListItem(updatedItem);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const itemDeleteSubmit = function (e) {
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // delete from ui
        UICtrl.deleteListItem(currentItem.id);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // delete from localstorage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick = function (e) {
        // delete all items from data structure
        ItemCtrl.clearAllItems();

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // remove from ui
        UICtrl.removeItems();

        // hide ul list
        UICtrl.hideList();

        // clear all from local storage
        StorageCtrl.clearItemsFromStorage();

        e.preventDefault();
    }

    return {
        init: function () {
            // clear edit state / set initial set
            UICtrl.clearEditState();

            // fetch items from data structure from itemctrl
            const items = ItemCtrl.getItems();

            // check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // populate list with items
                UICtrl.populateItemList(items);
            }

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

// initialize
App.init();