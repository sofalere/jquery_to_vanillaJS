let inventory;

(function() {
  inventory = {
    lastId: 0,
    collection: [],
    setDate: function() {
      var date = new Date();
      document.querySelector("#order_date").innerText = date.toUTCString();
    },
    cacheTemplate: function() {
      let inventoryItem = document.querySelector("#inventory_item");
      this.template = inventoryItem.innerHTML;
      inventoryItem.remove();
    },
    add: function() {
      this.lastId++;
      var item = {
        id: this.lastId,
        name: "",
        stock_number: "",
        quantity: 1
      };
      this.collection.push(item);

      return item;
    },
    remove: function(idx) {
      this.collection = this.collection.filter(function(item) {
        return item.id !== idx;
      });
    },
    get: function(id) {
      var found_item;

      this.collection.forEach(function(item) {
        if (item.id === id) {
          found_item = item;
          return false;
        }
      });

      return found_item;
    },
    update: function(item) {
      var id = this.findID(item),
          collectionItem = this.get(id);

      collectionItem.name = item.querySelector('[name^=item_name]').value;
      collectionItem.stock_number = item.querySelector('[name^=item_stock_number]').value;
      collectionItem.quantity = item.querySelector('[name^=item_quantity]').value;
    },
    newItem: function(e) {
      e.preventDefault();
      let item = this.add();
      let itemTemplate = this.template.replace(/ID/g, item.id);
      let itemNode = document.createElement('tbody');
      itemNode.innerHTML = itemTemplate;
      document.querySelector("#inventory").appendChild(itemNode);
    },
    findParent: function(e) {
      return e.target.closest("tr");
    },
    findID: function(item) {
      return +item.querySelector('[type=hidden]').value;
    },
    deleteItem: function(e) {
      e.preventDefault();
      var item = this.findParent(e)
      this.remove(this.findID(item));
      item.remove();
    },
    updateItem: function(e) {
      e.stopPropagation();
      var item = this.findParent(e);

      this.update(item);
    },
    bindEvents: function() {
      document.querySelector("#add_item").addEventListener("click", this.newItem.bind(this));
      
      document.querySelector("#inventory").addEventListener("click", e => {
        [...e.currentTarget.querySelectorAll('a.delete')].forEach( input => {
          input.addEventListener('click', this.deleteItem.bind(this));
        })
      })

      document.querySelector("#inventory").addEventListener("focusout", e => { 
        [...e.currentTarget.querySelectorAll('input')].forEach( input => {
          input.addEventListener('focusout', this.updateItem.bind(this));
        });
      });
    },
    init: function() {
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    }
  };
})();

document.addEventListener("DOMContentLoaded", e => {
  inventory.init.call(inventory);
})