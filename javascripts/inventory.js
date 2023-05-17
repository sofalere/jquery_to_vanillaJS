var inventory;

(function() {
  inventory = {
    lastId: 0,
    collection: [],
    setDate: function() {
      var date = new Date();
      document.querySelector("#order_date").innerText = date.toUTCString();
      // $("#order_date").text(date.toUTCString());
    },
    cacheTemplate: function() {
      let inventoryItem = document.querySelector("#inventory_item");
      this.template = inventoryItem.innerHTML;
      inventoryItem.remove();
      // var $iTmpl = $("#inventory_item").remove();
      // this.template = $iTmpl.html(); 
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
    update: function($item) {
      var id = this.findID($item),
          item = this.get(id);

      item.name = $item.find("[name^=item_name]").val();
      item.stock_number = $item.find("[name^=item_stock_number]").val();
      item.quantity = $item.find("[name^=item_quantity]").val();
    },
    newItem: function(e) {
      e.preventDefault();
      let item = this.add();
      let itemTemplate = this.template.replace(/ID/g, item.id);
      let itemNode = document.createElement('tbody');
      itemNode.innerHTML = itemTemplate;
      document.querySelector("#inventory").appendChild(itemNode);
      
      // var item = this.add(),
      //     $item = $(this.template.replace(/ID/g, item.id));

      // $("#inventory").append($item);
    },
    findParent: function(e) {
      return $(e.target).closest("tr");
    },
    findID: function($item) {
      return +$item.find("input[type=hidden]").val();
    },
    deleteItem: function(e) {
      e.preventDefault();
      var $item = this.findParent(e).remove();

      this.remove(this.findID($item));
    },
    updateItem: function(e) {
      var $item = this.findParent(e);

      this.update($item);
    },
    bindEvents: function() {
      $("#add_item").on("click", $.proxy(this.newItem, this));
      $("#inventory").on("click", "a.delete", $.proxy(this.deleteItem, this));
      $("#inventory").on("blur", ":input", $.proxy(this.updateItem, this));
    },
    init: function() {
      this.setDate();
      this.cacheTemplate();
      this.bindEvents();
    }
  };
})();

$($.proxy(inventory.init, inventory));

/*
- remove jquery function 
  - initialize inventory ibject after DOM content loads

   proxy is similar to bind and we are passing in the `inventory.init` function with the context of inventory to jqueyr
 
- query selectors:
  lines 9, 62, all `bind events`

- $iTmpl: l
  cacheTemplate line 13 
  - removing the element `#inventory-item`
  - assigning the `template` variable the removed elements inner  HTML 
    - jquery html() === innerHTML
  newItem line 53
  - assigns $item var to jquery version of string `template` with new ids
  - new template value does not interfere

- $item
  newItem 13
  - append === createElement(x)
              x.innerHTML =  template
              whatever.appendChild(x)

  

  $item: change functions on lines: 56, 59, 65, 69, 74
  56 
          itemTemplate = document.createElement('script');
          itemTemplate.innerText = this.template.replace(/ID/g, item.id);

  
 */