/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        //alert(window.device.platform)
        // Détecter le type d'appareil
        if (typeof window.device != "undefined")
            $("body").addClass(window.device.platform);
        else
            $("body").addClass("desktop");


    },
};

app.initialize();

app.eventBus = _({}).extend(Backbone.Events);
app.templateList = ['search-page', 'report-list', 'employee-details', 'employee-list-item', 'first-use', 'edit-car', 'bottom-nav', 'header', 'notification', 'dashboard', 'car', 'car-details', 'send-complaint', 'config', 'complaint-info'];
app.appState = new AppState({ current_view: '' });
app.headerModel = new HeaderModel();
app.bottomNav = null;
app.header = null;
app.router = null;
app.strings = new AppStringsModel();
app.notificationModel = null;
app.notification = null;
app.cars = new CarCollection();
app.complaints = new ComplaintCollection();
app.config = null;
app.configCollection = new ConfigCollection();






// Init 
window.addEventListener('load', function() {
    FastClick.attach(document.body);
}, false);

app.initEvent = (app.appState.isMobile()) ? "pagecreate" : "ready";
$(document).one(app.initEvent, function () {
    tpl.loadTemplates(app.templateList,
        function () {
            // Top navigation view
            app.header = new HeaderView({model: app.headerModel});
            app.header.render(); 
            $('body').append($(app.header.el));
            //$('[data-role="header"]').trigger('create');


            // Bottom navigation view
            /*app.bottomNav = new BottomNavView();
            app.bottomNav.render(); 
            $('body').append($(app.bottomNav.el));
            $('[data-role="footer"]').trigger('create');*/


            // Notifications placeholder
            app.notificationModel = new NotificationModel();
            app.notification = new NotificationView({model: app.notificationModel});
            app.notification.render();
            $('body').append($(app.notification.el));
            $('[data-role="header"]').trigger('create');

            // Loader les configs du user
            if (app.configCollection.fetch() && app.configCollection.models.length > 0){
                app.config = app.configCollection.models[0];
            }
            else{
                app.config = new ConfigModel();
                app.configCollection.add(app.config);
            }

            console.log(app.configCollection);

            // Loader les véhicules
            app.cars.fetch();

            // Loader les plaintes
            app.complaints.fetch();

            // Checker les jobs accumulées offline
            app.appState.checkOfflineJobs();

            // Instanciation du router
            if (typeof unitTesting == "undefined"){
                app.router = new AppRouter();
                Backbone.history.start();
            }


            // Load Bing Maps if not on Windows
            if (!app.appState.isWindows()){
                $(function(){
                    $.getScript("js/bing.maps.js");
                });
            }




        });
    }
);





/*  
/   Hook to destroy a View when we change view, preventing "Ghost Views"
/   Source : http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/
*/
Backbone.View.prototype.close = function () {
    if (this.beforeClose) {
        this.beforeClose();
    }
    //this.remove();
    this.stopListening();
    this.unbind();

    // On enlève aussi les sous-vues
    if (typeof this.childViews != "undefined"){
        _.each(this.childViews, function(childView){
            if (childView.close){
                childView.close();
            }
            childView.stopListening();
            childView.unbind();
        })
    }
};

