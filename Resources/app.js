(function() {
  var StoreKit, activity, productIds, table, updateTable, win;
  StoreKit = require('jp.masuidrive.ti.storekit');
  productIds = ["co.saiten.tistorekitsample.product1", "co.saiten.tistorekitsample.product2", "co.saiten.tistorekitsample.product3"];
  this.products = [];
  updateTable = function(_products) {
    var count, data, product;
    if (_products == null) {
      _products = null;
    }
    if (_products != null) {
      this.products = _products;
    }
    data = (function() {
      var _i, _len, _ref, _results;
      _ref = this.products;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        product = _ref[_i];
        count = Ti.App.Properties.getInt(product.id, 0);
        _results.push({
          title: "" + product.title + " (" + product.price + ") : " + count,
          productId: product.id
        });
      }
      return _results;
    }).call(this);
    return table.setData(data);
  };
  win = Ti.UI.createWindow({
    title: "TiStoreKit Sample"
  });
  table = Ti.UI.createTableView({
    style: Ti.UI.iPhone.TableViewStyle.GROUPED
  });
  activity = Ti.UI.createActivityIndicator({
    style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
  });
  win.addEventListener('open', function() {
    var alert;
    if (!StoreKit.canMakePayments) {
      alert = Ti.UI.createAlertDialog({
        title: "Error",
        message: "Cannot make payments"
      });
      return alert.show();
    } else {
      activity.show();
      return StoreKit.findProducts(productIds, function(_products, invalid) {
        activity.hide();
        return updateTable(_products);
      });
    }
  });
  table.addEventListener('click', function(e) {
    var payment;
    payment = StoreKit.createPayment();
    payment.product = e.rowData.productId;
    payment.quantity = 1;
    StoreKit.defaultPaymentQueue.addPayment(payment);
    return activity.show();
  });
  StoreKit.defaultPaymentQueue.addEventListener('purchasing', function(e) {
    return Ti.API.log("purchasing");
  });
  StoreKit.defaultPaymentQueue.addEventListener('purchased', function(e) {
    var count, productId;
    Ti.API.log("purchased");
    activity.hide();
    productId = e.transaction.payment.product;
    count = Ti.App.Properties.getInt(productId, 0);
    count += 1;
    Ti.App.Properties.setInt(productId, count);
    updateTable();
    return StoreKit.defaultPaymentQueue.finishTransaction(e.transaction);
  });
  StoreKit.defaultPaymentQueue.addEventListener('failed', function(e) {
    var alert;
    Ti.API.log("purchase failed");
    activity.hide();
    alert = Ti.UI.createAlertDialog({
      title: "Purchase Failed",
      message: e.transaction.error.message
    });
    alert.show();
    return StoreKit.defaultPaymentQueue.finishTransaction(e.transaction);
  });
  win.add(table);
  win.add(activity);
  win.open();
}).call(this);
