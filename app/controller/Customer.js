/*
 * File: app/controller/Customer.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.2.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('MyApp.controller.Customer', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            mainView: 'mainview',
            customerList: 'mainview list',
            customerForm: 'customerform',
            customerMap: 'customermap',
            customerDetail: 'customerdetail',
            addButton: '[action=Add]',
            deleteButton: 'customerform button[action=Delete]'
        },

        control: {
            "list": {
                itemtap: 'onListItemTap'
            },
            "[action=Save]": {
                tap: 'onSaveTap'
            },
            "[action=Delete]": {
                tap: 'onDeleteTap'
            },
            "navigationview": {
                activeitemchange: 'onNavigationviewActiveItemChange'
            },
            "[action=Add]": {
                tap: 'onAddTap'
            },
            "tabpanel": {
                activeitemchange: 'onTabpanelActiveItemChange',
                initialize: 'onTabpanelInitialize'
            },
            "map": {
                maprender: 'onMapRender'
            }
        }
    },

    onListItemTap: function(dataview, index, target, record, e, eOpts) {
        var form = Ext.create("MyApp.view.CustomerDetail", {
            title: record.data.Name,
            record: record
        });

        this.getMainView().push(form);
    },

    onSaveTap: function(button, e, eOpts) {
        var me = this,
            form = this.getCustomerForm(),
            values = form.getValues(),
            record = form.getRecord(),
            newRecord = record.phantom,
            store = Ext.data.StoreManager.lookup("Customers");

        record.beginEdit();

        record.set(values);

        if (record.isValid()) {
            record.save({
                success: function() {
                    record.endEdit();

                    if (newRecord) {
                        store.add(record);
                    }

                    me.getMainView().pop();
                }
            });
        }
        else {
            record.cancelEdit();

            Ext.Msg.alert("Error", "There are errors with the record.");
        }
    },

    onDeleteTap: function(button, e, eOpts) {
        var me = this,
            form = this.getCustomerForm(),
            record = form.getRecord();

        Ext.Msg.confirm("Confirm deletion", "Are you sure you want to permanently delete this Customer?", function(buttonId) {
            if (buttonId == "yes") {
                record.erase({
                    success: function(){
                        me.getMainView().pop();
                    },
                    failure: function(){
                        Ext.Msg.alert("Linked data", "Unable to delete this Customer as they have previous Orders.");
                    }
                });
            }
        });
    },

    onNavigationviewActiveItemChange: function(container, value, oldValue, eOpts) {
        var newView = value;

        switch (value.xtype) {
            case "customerlist":
            this.getAddButton().show();
            break;

            default:
            this.getAddButton().hide();
            break;
        }
    },

    onAddTap: function(button, e, eOpts) {
        var record = Ext.create("MyApp.model.Customer"),
            form = Ext.create("MyApp.view.CustomerDetail",
            {
                title: "New Customer",
                record: record
            });

        this.getMainView().push(form);
    },

    onTabpanelActiveItemChange: function(container, value, oldValue, eOpts) {
        var newView = value,
            record = container.getRecord();

        if (newView.xtype == "customerchart") {
            newView.getStore().load({ 
                params: { 
                    CustomerID: record.data.ID
                }
            });
        }
    },

    onMapRender: function(map, gmap, eOpts) {
        var geocoder = new google.maps.Geocoder(),
            record = this.getCustomerForm().getRecord(),
            address = record.data.Address,
            mapContainer = this.getCustomerMap(),
            map = mapContainer.getMap();

        geocoder.geocode({"address": address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);

            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            Ext.Msg.alert("Invalid address", "Unable to locate this Customer from the provided address.");
        }
    });
    },

    onTabpanelInitialize: function(component, eOpts) {
        var customerDetail = this.getCustomerDetail(),
            record = customerDetail.getRecord(),
            newRecord = record.phantom;

        this.getCustomerForm().setRecord(record);

        if (newRecord) {
            customerDetail.getTabBar().items.items[1].hide();
            customerDetail.getTabBar().items.items[2].hide();
            this.getDeleteButton().hide();    
        }
    }

});