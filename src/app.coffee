StoreKit = require('jp.masuidrive.ti.storekit')

productIds = [
  "co.saiten.tistorekitsample.product1"
  "co.saiten.tistorekitsample.product2"
  "co.saiten.tistorekitsample.product3"
]

products = []

updateTable = (_products = null) ->
  products = _products if _products?
  data = for product in products
    count = Ti.App.Properties.getInt(product.id, 0)
    title: "#{product.title} (#{product.price}) : #{count}"
    productId: product.id

  table.setData data

win = Ti.UI.createWindow
  title: "TiStoreKit Sample"

table = Ti.UI.createTableView
  style: Ti.UI.iPhone.TableViewStyle.GROUPED

activity = Ti.UI.createActivityIndicator
  style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK

win.addEventListener 'open', ->
  unless StoreKit.canMakePayments
    alert = Ti.UI.createAlertDialog title: "Error", message: "Cannot make payments"
    alert.show()
  else
    activity.show()
    StoreKit.findProducts productIds, (_products, invalid) ->
      activity.hide()
      updateTable(_products)

table.addEventListener 'click', (e) ->
  payment = StoreKit.createPayment()
  payment.product = e.rowData.productId
  payment.quantity = 1
  StoreKit.defaultPaymentQueue.addPayment(payment)

  activity.show()

StoreKit.defaultPaymentQueue.addEventListener 'purchasing', (e) ->
  Ti.API.log "purchasing"

StoreKit.defaultPaymentQueue.addEventListener 'purchased', (e) ->
  Ti.API.log "purchased"
  activity.hide()

  productId = e.transaction.payment.product

  count = Ti.App.Properties.getInt(productId, 0)
  count += 1
  Ti.App.Properties.setInt(productId, count)

  updateTable()

  StoreKit.defaultPaymentQueue.finishTransaction(e.transaction)

StoreKit.defaultPaymentQueue.addEventListener 'failed', (e) ->
  Ti.API.log "purchase failed"
  activity.hide()

  alert = Ti.UI.createAlertDialog title: "Purchase Failed", message: e.transaction.error.message
  alert.show()

  StoreKit.defaultPaymentQueue.finishTransaction(e.transaction)

win.add table
win.add activity
win.open()
