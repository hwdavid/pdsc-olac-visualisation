"use strict";angular.module("appApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngMaterial","underscore","leaflet"]).config(["$routeProvider","$logProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).otherwise({redirectTo:"/"}),b.debugEnabled(!1)}]),angular.module("appApp").controller("MainCtrl",["$scope","$http","$mdSidenav","$mdDialog",function(a,b,c,d){d.show({template:'<div aria-label="loading" layout="column" layout-align="center center">    <md-progress-circular md-mode="indeterminate"></md-progress-circular></div>',parent:angular.element(document.body),clickOutsideToClose:!1}),a.config={controlsOpen:!1},a.datasets={languages:void 0,countries:void 0,regions:void 0},b.get("data/index.json").then(function(b){a.datasets.languages=b.data,console.log("Languages",a.datasets.languages)}),b.get("data/countries.json").then(function(b){a.datasets.countries=b.data,console.log("Countries",a.datasets.countries)}),a.toggleSideNav=function(){c("right").toggle()}}]),angular.module("appApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("appApp").directive("markerLegend",["configuration",function(a){return{templateUrl:"views/marker-legend.html",restrict:"E",scope:{},link:function(b,c,d){b.colours=a.markerColours}}}]),angular.module("appApp").directive("browse",["$http","$mdSidenav","configuration",function(a,b,c){return{templateUrl:"views/browse.html",restrict:"E",scope:{countries:"=",languages:"=",isVisible:"="},link:function(d,e,f){d.$watch("isVisible",function(){d.isVisible?c.selectedLanguage?d.show("language",{code:c.selectedLanguage}):d.browseCountries():(delete c.selectedLanguage,delete d.languageData,delete d.country,delete d.items)}),d.show=function(b,c){"country"===b?(d.country=c.name,d.title="Browse languages in "+d.country,d.items={list:_.sortBy(d.countries[d.country].language_data,function(a){return a.name}),what:"language"},d.error=!1):"language"===b&&a.get("data/"+c.code+".json").then(function(a){d.title="";a.data;d.languageData=a.data,d.error=!1},function(a){delete d.items,delete d.languageData,d.error=!0})},d.browseCountries=function(){d.country=null,delete d.languageData,d.title="Browse countries",d.items={list:_.sortBy(d.countries,function(a){return a.name}),what:"country"}},d.browseLanguages=function(){d.title="Browse languages in "+d.country,delete d.languageData},d.back=function(){d.languageData?d.browseLanguages():d.country&&d.browseCountries()},d.close=function(){b("right").toggle()}}}}]),angular.module("underscore",[]).factory("_",function(){return window._}),angular.module("leaflet",[]).factory("leaflet",function(){return window.L}),angular.module("appApp").directive("leaflet",["leaflet","_","configuration","$compile","$mdDialog","$window","$mdSidenav",function(a,b,c,d,e,f,g){return{template:'<div id="map"></div>',restrict:"E",scope:{languages:"="},link:function(a,h,i){angular.element(document.getElementById("map"))[0].style.height=.9*f.innerHeight+"px";var j=L.map("map",{minZoom:1}).setView([0,0],2);L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',noWrap:!0}).addTo(j);var k=b.compact(b.map(a.languages,function(e){if(parseFloat(e.coords[0])&&parseFloat(e.coords[2])){var f=0;b.each(e.resources,function(a){f+=a});var g;g=20>f?c.markerColours[0].colour:150>f?c.markerColours[1].colour:c.markerColours[2].colour;var h=d("<span><h4>"+e.name+"<br/> ("+f+" resources)</h4><br/><a href='' ng-click='moreInfo(\""+e.code+"\")'>more information</a></span>")(a),i=L.marker(new L.LatLng(parseFloat(e.coords[0]),parseFloat(e.coords[2])),{clickable:!0,icon:L.MakiMarkers.icon({icon:"marker",color:g,size:"l"})});return i.bindPopup(h[0]),i}})),l=L.markerClusterGroup();l.addLayers(k),j.addLayer(l),e.cancel(),a.moreInfo=function(a){c.selectedLanguage=a,g("right").toggle()}}}}]),angular.module("appApp").constant("configuration",{languageArchives:"http://www.language-archives.org",map:{width:"100%",height:.95*window.innerHeight},markerColours:[{colour:"#ea1540",label:"less than 20 resources"},{colour:"#ff8c00",label:"between 20 and 150 resources"},{colour:"#2eb82e",label:"more than 150 resources"}]}),angular.module("appApp").directive("resourceRenderer",["$timeout","$rootScope","configuration","$mdDialog",function(a,b,c,d){return{templateUrl:"views/resource-renderer.html",restrict:"E",scope:{title:"@",resources:"="},link:function(c,e,f){c.config={pageSize:10,start:0,numberFrom:1,hide:!0,enablePagination:!1,me:!1},c.$on("close-item",function(){c.config.me||(c.config.hide=!0),c.config.me=!1}),c.$watch("searchResults",function(){c.searchResults&&(c.resources=c.searchResults),c.updateSet()},!0),c.resources.length>c.config.pageSize?(c.resourceSet=c.resources.slice(0,c.config.pageSize),c.enablePagination=!0):c.resourceSet=c.resources,c.updateSet=function(){c.config.numberFrom=c.config.start+1,c.resourceSet=c.resources.slice(c.config.start,c.config.start+c.config.pageSize)},c.jumpToStart=function(){c.config.start=0,c.updateSet()},c.back=function(){c.config.start-=c.config.pageSize,c.config.start<0&&(c.config.start=0),c.updateSet()},c.forward=function(){c.config.start<c.resources.length-c.config.pageSize&&(c.config.start+=c.config.pageSize),c.updateSet()},c.jumpToEnd=function(){c.config.start=c.resources.length-c.config.pageSize,c.updateSet()},c.toggleItem=function(){c.config.me=!0,b.$broadcast("close-item"),a(function(){c.config.hide=!c.config.hide},10)},c.moreInformation=function(a){d.show({controller:function(){},template:'<md-dialog>    <md-dialog-content><iframe src="'+a+'" class="item-information-dialog"/></md-dialog-content></md-dialog>',parent:angular.element(document.body),clickOutsideToClose:!0,fullscreen:!0})},c.close=function(){console.log("close the dialog")}}}}]),angular.module("appApp").directive("searchResources",function(){return{templateUrl:"views/search-resources.html",restrict:"E",scope:{resources:"=",searchResults:"="},link:function(a,b,c){a.originalResources=a.resources,a.search=function(){a.what.length<3?a.searchResults=a.originalResources:a.what.length>2&&(a.searchResults=_.compact(_.map(a.originalResources,function(b){var c=(a.what,RegExp(a.what,"im")),d=b.text.search(c);return-1!=d?b:void 0})))},a.reset=function(){delete a.what,a.searchResults=a.originalResources}}}}),angular.module("appApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/browse.html",'<md-toolbar layout="row" class="md-padding"> <md-button class="md-primary" ng-click="back()" ng-if="country">back</md-button> <h5>{{title}}</h5> <span flex></span> <md-button class="md-primary" ng-click="close()">close</md-button> </md-toolbar> <md-content ng-if="!languageData"> <md-list> <md-list-item ng-click="show(items.what, item)" ng-repeat="item in items.list"> {{item.name}}<!-- <span ng-if="item.count">&nbsp;({{item.count}} languages)</span> --> </md-list-item> </md-list> </md-content> <md-content ng-if="languageData"> <h4 class="md-title"><span ng-if="country">{{country}}:</span> {{languageData.name}}</h4> <p> <a href="{{languageData.url}}" target="_blank">{{languageData.url}}</a> </p> <md-list> <span ng-if="languageData.resources[\'Primary texts\']"> <resource-renderer title="Primary Texts" resources="languageData.resources[\'Primary texts\'].resources"></resource-renderer> </span> <span ng-if="languageData.resources[\'Lexical resources\']"> <resource-renderer title="Lexical Resources" resources="languageData.resources[\'Lexical resources\'].resources"></resource-renderer> </span> <span ng-if="languageData.resources[\'Language descriptions\']"> <resource-renderer title="Language Descriptions" resources="languageData.resources[\'Language descriptions\'].resources"></resource-renderer> </span> <span ng-if="languageData.resources[\'Other resources about the language\']"> <resource-renderer title="Other resources about the language" resources="languageData.resources[\'Other resources about the language\'].resources"></resource-renderer> </span> <span ng-if="languageData.resources[\'Other resources in the language\']"> <resource-renderer title="Other resources in the language" resources="languageData.resources[\'Other resources in the language\'].resources"></resource-renderer> </span> </md-list> </md-content> <md-content ng-if="error" layout="column" layout-align="center center"> <img src="images/error.6d052d18.svg"> Whatever your language and however you say it it doesn\'t change the fact that something went wrong! </md-content>'),a.put("views/main.html",'<div layout="column" ng-if="datasets.languages"> <md-content> <md-card> <md-card-content> <leaflet languages="datasets.languages" ng-if="datasets.languages"></leaflet> </md-card-content> </md-card> </md-content> <md-fab-speed-dial class="md-fab-bottom-right" style="z-index: 10000"> <md-fab-trigger> <md-button aria-label="menu" class="md-fab md-warn" ng-click="toggleSideNav()"> <i class="material-icons md-48">add</i> </md-button> </md-fab-trigger> </md-fab-speed-dial> </div> <md-sidenav class="md-sidenav-right md-whiteframe-z2" md-component-id="right" style="z-index: 10000" md-is-open="config.controlsOpen"> <md-content> <div layout="column" layout-padding> <md-content flex="50" layout-padding> <browse countries="datasets.countries" languages="datasets.languages" is-visible="config.controlsOpen"></browse> </md-content> </div> </md-content> </md-sidenav> <marker-legend class="marker-legend" ng-if="datasets.languages"></marker-legend>'),a.put("views/marker-legend.html",'<div layout="column" class="marker-legend-background"> <span ng-repeat="c in colours"> <div layout="row"> <div style="background-color: {{c.colour}}" class="marker-legend-item"></div> <div>{{c.label}}</div> </div> </span> </div>'),a.put("views/resource-renderer.html",'<div layout="column"> <md-list-item ng-click="toggleItem()"> {{title}} ({{resources.length}}) </md-list-item> <span ng-hide="config.hide"> <md-divider></md-divider> <search-resources resources="resources" search-results="searchResults"></search-resources> <div layout="column"> <ol class="no-margin" start="{{config.numberFrom}}"> <li ng-repeat="resource in resourceSet" class="md-padding"> <span> <span class="online_indicator" ng-if="resource.is_online">ONLINE</span> <span ng-bind-html="resource.text"></span> </span> <a href="" ng-click="moreInformation(resource.url)">{{resource.name}}</a> </li> </ol> </div> <div class="" layout="row" layout-align="center center" ng-if="enablePagination" flex> <md-button class="md-primary" ng-click="jumpToStart()"><i class="material-icons">fast_rewind</i></md-button> <md-button class="md-primary" ng-click="back()"><i class="material-icons">skip_previous</i></md-button> <md-button class="md-primary" ng-click="forward()"><i class="material-icons">skip_next</i></md-button> <md-button class="md-primary" ng-click="jumpToEnd()"><i class="material-icons">fast_forward</i></md-button> </div> <md-divider></md-divider> </span> </div>'),a.put("views/search-resources.html",'<div layout="row"> <md-input-container flex> <label>Filter the resources</label> <input type="text" ng-model="what" ng-change="search()"> </md-input-container> <md-button ng-click="reset()" class="md-primary">Reset</md-button> </div>')}]);