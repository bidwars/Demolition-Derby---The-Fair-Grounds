
var app = angular.module('derbyMain', ['ui.router'])

app.run( function() {
  console.log('New Derby App Started');
});

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $stateProvider
      .state('gdEndScreen', {
        url: '/gdEndScreen/end',
		 params: {
			endData: {},
			drivers: {},
			headers: {},
		},	
		templateUrl: 'modules/gdcommon/gdEndScreen/end.html',
        controller: 'gdEndController',
		backState: 'BACK_TO_MENU',
      })
	   .state('gdscenario-end', {
        url: '/gdEndScreen/end',
		 params: {
			endData: {},
			drivers: {},
			headers: {},
		},	
		templateUrl: 'modules/gdcommon/gdEndScreen/end.html',
        controller: 'gdEndController',
		backState: 'BACK_TO_MENU',
      })
	  .state('loading-gd',{
		  url: '/gdloading',
		  templateUrl: 'modules/gdcommon/gdStartScreen/gdloading.html',
		  backState: 'BLOCK',
	  })
	 .state('scenario-gdstart', {
		url: '/gdStartScreen/gdstart',
		params: {
		data: {}
		},
		templateUrl: 'modules/gdcommon/gdStartScreen/gdstart.html',
		 backState: 'BACK_TO_MENU',
	  })
	  .state('gdStartScreen', {
      url: '/gdStartScreen/gdstart',
      templateUrl: 'modules/gdcommon/gdStartScreen/gdstart.html',
	   backState: 'BACK_TO_MENU',
    })
	 .state('menu', {
    url: '/menu',
    templateUrl: '/ui/modules/menu/menu.html',
    controller: 'MenuController as menuCtrl',
    uiLayout: 'menu',
    uiAppsShown: true, // defaults to false
  })

   // .state('menu.vehiclesdetails', {
   //   url: '/vehicle-details/:model/:config/:mode/:event/{showAuxiliary:bool}',
    //  templateUrl: '/ui/modules/vehicleselect/vehicleselect-details.html',
    //  controller: 'VehicleDetailsController as vehicle',
    //  backState: 'menu.vehicles',
   // })

	 // .state('gdMapSelect', {
     // url: '/gdcommon/level',
     // templateUrl: 'modules/gdcommon/gdLevelSelect/levelSelect.html',
     // controller: 'gdLevelController',
    //})
	//.state('levels', {
     // url: '/levels',
     // templateUrl: 'modules/gdcommon/gdLevelSelect/levelselect.html',
     // controller:  'LevelSelectController as levels',
    //})
	//.state('gdlevelDetails', {
     // url: '/levels-details/:level/:spawnPoint',
     // templateUrl: 'modules/gdcommon/gdLevelSelect/levelselect-details.html',
     // controller:  'LevelSelectDetailsController as levelsDetails',
    //})
	  $urlRouterProvider.otherwise('/gdStartScreen/gdstart');
    },
]);



app.factory('gdSelectionsService' , function() {
  var selections= {};

  function set () {
	
	selections.levels = [];
    selections.level = 
	{
      name: '',
      file:null,
      preview: '/ui/images/appDefault.png',
      targetState:'gdMapSelect'
    };
    selections.track = {
      name: '',
      file:null,
      preview: '/ui/images/appDefault.png',
      targetState:'gdTrackselect',
      disabled: true
    };
    selections.vehicle = {
      name: '',
      file:null,
      preview: '/ui/images/appDefault.png',
      targetState: {state: 'vehicles', args: {mode: 'quickrace'}}
    };
  }

  //set();

  return {
    getSelections: function () 		{return selections;		},
    setLevel:       function(level)   { selections.level  = level;  },
    setTrack:       function(track)   { selections.track    = track;  },
    setVehicle:    function(vehicle)  { selections.vehicle   = vehicle; },
	setLevels: 	   function(levels)   {selections.levels = levels	},
    set : set,
    accessibility: function () {
      for (var key in selections) {
        selections[key].disabled = key === 'track';
      }
    }
  };
});
app.controller('gdTabsController', ['LocalStorage','$scope', function (LocalStorage,$scope) {
	'use strict';
	var vm = this;
	vm.parts = {};
	vm.devices = [];
	vm.players = [];
	
	vm.gdUnSelect = function(player){
		let test = LocalStorage.getObject('players');
		let dev = vm.players[player].device;
		if (!dev || Number(player) === 0 ){return};
		//console.log(vm.devices);
		Object.keys(vm.devices).forEach(function (device) {	
			if (vm.devices[device].name === dev){
				vm.devices[device].disabled = false;
				vm.players[player].device = "";
				
			}
		})
		LocalStorage.setObject('players', vm.players);
	}

	
	vm.loadTip = function (data){
		vm.settingsTip = data;
	}
	vm.tabItems = [
			{'name': 'Main', 'layout': 'start start', 'icon':'home'},
			{'name': 'Opponents','layout':'start start', 'icon':'group'},
			{'name':'Settings', 'layout':'center start', 'icon':'settings'},
			{'name':'Parts', 'layout':'end start', 'icon':'add_circle_outline'}
			];
	vm.activeTab = vm.tabItems[0].name;
    vm.setTab = function(newTab) {
		vm.activeTab = newTab;
		if (vm.activeTab === 'Main'){
			$scope.oppKey = null;
			LocalStorage.setObject('oppKey',$scope.oppKey);
			vm.parts = {};
		}
		if (vm.activeTab === 'Opponents'){
			$scope.oppKey = '1';
			LocalStorage.setObject('oppKey',$scope.oppKey);
			vm.parts = {};
		}
		if (vm.activeTab === 'Settings'){
				vm.parts = {};
		}
		if (vm.activeTab === 'Parts') {
			
		  bngApi.engineLua('gdcallback.getParts()',function (response) {
			  
			$scope.$evalAsync(function () {
				var errors = response.parts[0].msg;
				vm.parts = {};				
			if (errors) {
				vm.parts.partsGroup = errors;
				
			}else{
				var partsGroup = response.parts[0].partsGroup;
				var partsMap = response.parts[0].partsMap;
				var slotType = response.parts[0].slotType;
				vm.parts.partsGroup = partsGroup;
				vm.parts.partsMap = partsMap;
				vm.parts.slotType = slotType;
			
			};
			});
		});
	  }
    };
}]);
app.directive('gdSetupDevices', ['$rootScope','LocalStorage','ControlsUtils', function ($rootScope,LocalStorage, ControlsUtils ) {
	 return {
    template: `
		<div style="font-size: 1.5vh; text-align: left; flex:auto; display:flex;">
          	<md-select aria-label="controller" ng-click="filldevices()" ng-model="players[player].device" ng-change="gdSelect(player)"  >
				<md-option ng-value="device.name" ng-disabled="device.disabled" ng-repeat="device in devices track by device.name" >{{device.name}}</md-option>
			</md-select>
			<ng-md-icon class="material-icons" style="font-size: 2em;">
				{{ getIconName(players[player].device) }}
			</ng-md-icon>
		</div>
	`,

    scope: {
		player: "=",
		devices: "=",
		players: "=",
    },
    link: function (scope, elm, attr) {
		scope.players = LocalStorage.getObject('players');
		scope.filldevices = function(){
			scope.devices = []
			let deviceContents = ControlsUtils.deviceNames();
			if (!scope.devices[0]) {
				scope.devices[0] = {"name":'',"disabled":false};
				let add = 1;
				for (let i=0; i < deviceContents.length; i++) {
					if (!deviceContents[i].includes('mou')) {
						scope.devices[add] = {"name":deviceContents[i],"disabled":false};
						add++
					}
				}
			}
			if (scope.players) {
				for (let i = 0; i < scope.players.length; i++){
					let found = false;
					if (scope.players[i].device){
						Object.keys(scope.devices).forEach((device) => {	
							if (scope.devices[device].name === scope.players[i].device) {
								scope.devices[device].disabled = true;
								found = true;
							}
						})
						if (!found) {
							scope.players[i].device = ''
							LocalStorage.setObject('players', scope.players);
						}
					}	
				}
			}
		}
		scope.filldevices();
		//$rootScope.$on('ControllersChanged', function (event, data) {
			//scope.players = LocalStorage.getObject('players');
		//	scope.filldevices();
			
		//})
		
		scope.getIconName = function (devName) { return ControlsUtils.deviceIcon(devName); }
	 
		scope.gdSelect = function(player){
			let deviceContents = ControlsUtils.deviceNames();
			scope.devices = {};
					
			scope.devices[0] = { name: '', disabled: false };
			let add = 1;
				for (let i = 0; i < deviceContents.length; i++) {
					if (!deviceContents[i].includes('mou')) {
						if (scope.players && scope.players.length > 0) {
							let found = false
							for (let k = 0; k < scope.players.length; k++){
								if (scope.players[k].device === deviceContents[i]) {
									found = true
									break
								}
							}
							if (found){
								scope.devices[add] = {"name": deviceContents[i], "disabled": true };	
								add++
							}else{
								scope.devices[add]={"name":deviceContents[i],"disabled":false};
								add++
							}
						}else{
							scope.devices[player]={"name":deviceContents[i],"disabled":false};
						}
					
					}
				//console.log(scope.devices)
				}
				
				//players[player].device = scope.selected[player];
				LocalStorage.setObject('players', scope.players);
		}
    }
  }
	
}]);
app.directive('gdPlayerInfo', ['LocalStorage','Utils', '$rootScope', function (LocalStorage,Utils, $rootScope, ) {
	 return {
    template: `
          <input name="gdPlayerBox" type="text" ng-click="gdClick($event,player)" ng-blur="gdBlur(player)" style="font-size: 2vh; padding: 1px; text-align: left;" ng-model="gdplayer[player].name"/>
		<div>{{gdplayer[player].number}}</div>
	`,
    scope: {
		player: "=",
		players: "=",
    },
    link: function (scope, elm, attr) {
		const driverList = {
			name : ["The Big Buffoon","Mayhem Mike","Gentle Bud","Sir NoMercy","Rawhide Billie","Cushion Charlie","Mr. Gumby","Ms. Gumby","Monster","Collision Carbonara","Motor Man Jackson","Erwin the Eliminator","Softcore James","Morning Hollywood","Crash Test Tommy","Hurricane Houston","MrBeast","PewDiePie","Jacksepticeye","Markiplier","DanTDM","TheWillyrex","rezendeevil","VanossGaming","JuegaGerman","Fernanfloo","ElRubiusOMG","The Game Theorists","LazarBeam","GameGrumps","H2ODelirious","CaptainSparklez","AngryJoeShow","CinnamonToastKen","Daithi De Nogla","Gappa"],
			number : ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37"]
		}
		//var players = []
	
		scope.gdplayer = []
	
		scope.players = LocalStorage.getObject('players');
		//setup the gdplayer table with 17 slots 
	
		let dL = driverList;
		//remove already used 
		if (scope.players){
			for (let i = 0; i < driverList.name.length; i++){
				let k = scope.players.indexOf(driverList[i])
				dL.name.splice(i,1);
				dL.number.splice(i,1);
			}
		}
		//console.log(dL.name)
		for (let i = 0; i < 18; i++) {
			if(!scope.gdplayer[i]){
				scope.gdplayer[i] = {};
			}
			if (scope.players && scope.players[i]) {
				scope.gdplayer[i] = {name: scope.players[i].name, points: scope.players[i].points, number: scope.players[i].number, device: scope.players[i].device};
			}else{
				const random = Math.floor(Math.random() * dL.name.length);
				scope.gdplayer[i] =  {name: dL.name[random], points : 0, number: dL.number[random], device: ''}
				dL.name.splice(random,1);
				dL.number.splice(random,1);
			}
		}
		LocalStorage.setObject('players', scope.gdplayer);
		//console.log(scope.gdplayer);
	
		
		//When you exit the name field  
		scope.gdBlur = function(num){
			console.log(scope.gdplayer[num].name.length);
			console.log(scope.players);
			if (scope.gdplayer[num].name.length === 0 ) {
				scope.gdplayer = LocalStorage.getObject('players');
			}else{
				let player = scope.gdplayer[num];
				if (!player.device){
					player.device = scope.players[num].device;
				}
				scope.players[num] = player
				LocalStorage.setObject('players', scope.players);
			}
		}
		//When they click the name field
		scope.gdClick = function(e,num) {
			//if (e.x === 0 && e.y === 0) {
				scope.gdplayer[num].name = '';
			//}
		};
	  // account info for main player from steam
      scope.$on('SteamInfo', function (event, data) {
		  
        scope.$apply(function () {
		
			if (data && data.playerName){
				if (!scope.players){
					scope.players = [];
					scope.players[0] = {name: ''}
				}
				scope.gdplayer[0].name = data.playerName;4
				scope.players[0].name = data.playerName;
				scope.players[0].number = '00'
				LocalStorage.setObject('players', scope.players);
			}
        })
      })
	  
	  scope.onlineState = false
      scope.$on('OnlineStateChanged', function (event, data) {
        // console.log('OnlineStateChanged', data)
        scope.$apply(function () {
          scope.onlineState = data
        })
      })
      bngApi.engineLua('core_online.requestState()')
    }
  }
	
}]);
app.directive('gdTabs',  function() {
	return{
		restrict: 'EA',
		translate: true,
		templateUrl: "modules/gdcommon/gdStartScreen/gdtabs.html"
		
	};
});
app.controller('gdHeaderController', ['gdSelectionsService','$scope',function(gdSelectionsService,$scope) {
	'use strict';
	var vm = this;
	vm.heading = {};
	
	var filler = document.getElementsByClassName('filler')[0].style
	filler.backgroundImage = "radial-gradient(white 40%, black 70%),url('modules/gdcommon/gdcommonbg.jpg')";
	filler.backgroundSize = "100%";
	filler.backgroundRepeat = "no-repeat";
	filler.backgroundPosition = "center";
	filler.backgroundBlendMode = "multiply";
	
	bngApi.engineLua('gdcallback.getDesc()',function (header) {
		if (header) {
			console.log(header.name);
			vm.heading = header;
		}else{
			vm.heading.name = "Demolition Derby - The Fair Grounds v10.11.1";
			vm.heading.desc = "Race'em or Wreck'em";
		}
	});
		
}]);
app.directive('gdCardVehicles', ['LocalStorage', function(LocalStorage) {
  return {
    restrict: 'E',
	 replace: true,
    template: ` <div class="darkbg" layout="column" layout-align="start start" style="overflow: visible; position: fixed; height: 6vh; width: -webkit-fill-available; top: 0;">
		<md-list layout="row" style="width: -webkit-fill-available;">
			<md-list-item>
					<div style="text-transform: capitalize; align-items: center; font-size: 2vh;" class="color1">{{card.type}}</div>
			</md-list-item>
			<md-list-item   style="position: absolute; right:0; margin:0; align-items: center;">
				<md-button bng-nav-item focus-on-hover class="cardBtnUp" style=" min-width:auto; position:relative;" ng-click="vehMove('down')" >
				<md-icon class="material-icons color1" style="margin: 0 2px;">expand_more</md-icon></md-button>
				<md-button bng-nav-item focus-on-hover class="cardBtnDown" style=" min-width:auto; position:relative;" ng-click="vehMove('up')" >
				<md-icon class="material-icons color1" style="margin: 0 2px;">expand_less</md-icon></md-button>
			</md-list-item>
		</md-list>
	</div>
	`,
	link: function (scope){
		scope.vehMove = function(direction){
			let menuName = scope.card.alt;
			if (menuName === 'vehicles') {
				console.log(scope.card);
				list = scope.card.groups
				type = scope.card.type
				
				let records = list.length;
				let i = list.findIndex(x => x === type);
				if (direction === 'up') {
					i = i + 1;
					if (i === records) {i=0};
				}else if(direction === 'down') {
					i = i - 1;
					if (i < 0) {i = records - 1};
				}
				scope.card.type = list[i];
				scope.card.selected = scope.card.default.name;
				scope.card.url = scope.card.default.url;
				if(!scope.card.url){
					scope.card.url = 'modules/gdcommon/gdImages/noimage.jpg';
				}
				let savedMenu = {};
				savedMenu.selected = scope.card.selected;
				savedMenu.type = scope.card.type;
				savedMenu.url = scope.card.url;
				if (scope.oppKey) {
					LocalStorage.setObject('oppKey',scope.oppKey);
					LocalStorage.setObject(scope.oppKey + menuName, savedMenu);
				}else{
					LocalStorage.setObject(menuName,savedMenu);
				}
				let refresh = {tables : ['vehicles'], oppKey : scope.oppKey}
				scope.$emit('gdConfig', refresh);
			}
		}
	}
  };
}]);
app.directive('gdCardRacing', ['LocalStorage', function(LocalStorage) {
  return {
    restrict: 'E',
	 replace: true,
    template: ` <div class="darkbg" layout="column" layout-align="start start" style="overflow: visible; position: fixed; height: 6vh; width: -webkit-fill-available; top: 0;">
		<md-list layout="row" style="width: -webkit-fill-available;">
			<md-list-item>
				<md-icon   style="position: absolute; right: 90%; margin:0; align-items: center;" class="material-icons color1" >flag</md-icon>
					<div style="position: absolute; right: 75%; align-items: center; font-size: 2vh;" class="color1">{{card.type}}</div>
			</md-list-item>
			<md-list-item  ng-if="card.type === 'Racing'"  style="position: absolute; right: 50%; padding: 1%; align-items: center;">
					<div style="font-size: 2vh;">Laps</div>
			</md-list-item>
			<md-list-item ng-if="card.type === 'Racing'" style="position: absolute; right: 30%; align-items: center;">
					<div ng-if="card.type === 'Racing'" style="align-items: center; font-size: 2vh; font-style: italic; font-weight: bolder;">{{ card.laps }}</div>
			</md-list-item>
			<md-list-item  ng-if="card.type === 'Racing'"   style="position: absolute; right:0; margin:0; align-items: center;">
				<md-button bng-nav-item focus-on-hover class="cardBtnUp" style=" min-width:auto; position:relative;" ng-click="lapMove('down')" >
				<md-icon class="material-icons color1" style="margin: 0 2px;">expand_more</md-icon></md-button>
				<md-button bng-nav-item focus-on-hover class="cardBtnDown" style=" min-width:auto; position:relative;" ng-click="lapMove('up')" >
				<md-icon class="material-icons color1" style="margin: 0 2px;">expand_less</md-icon></md-button>
			</md-list-item>
		</md-list>
	</div>
	`,
	scope:{
		card: '=',
    },
	link: function (scope){
		scope.lapMove = function(direction){
			let menuName = scope.card.alt;
			if (scope.card.laps) {
					if(direction === 'up') {
						scope.card.laps++;
						if(scope.card.laps > 999) {
							scope.card.laps = 999;
						}
					}else if (direction === 'down'){
						scope.card.laps--;
						if (scope.card.laps < 1){
							scope.card.laps = 1;
						}
					}
				LocalStorage.setObject('laps',scope.card.laps);
			}
		}
	}
  };
}]);
app.directive('gdCard',  ['gdMenuService','LocalStorage' , function (gdMenuService,LocalStorage) {
  return {
    restrict: 'E',
	  replace: true,
    templateUrl: 'modules/gdcommon/gdCards/card.html',
   
    link: function (scope) {
	
		//console.log('gdCard link function')
		let levelData = gdMenuService.getLevels();
		 scope.cardMove = function(direction,okey){
			
			let menuName = scope.card.alt;
			let list = []
			let cardName;
			
			if(scope.card.listob) {
				list = scope.card.listob;
				cardName = scope.card.selected
			}
			if (scope.card.listng) {
				list = scope.card.listng;
				cardName = scope.card.selected
			}
	
			if (menuName === 'map'){
					let level = levelData[levelData.findIndex((x) => x.title === scope.card.selected)];
					cardName = level.title;
					levelData.sort((x,y) => x.levelName.localeCompare(y.levelName));	
			
					levelData.forEach((value,key) => {
						if (value.title && value.title !== 'gdcommon'){
							list.push(value.title);
						}
					})
			}else if (menuName === 'tracks' || menuName === 'vehicles'){
				if (scope.card.listg) {
					scope.card.listg.forEach((value,key) => {
					if (value.name){
						list.push(value.name);
						}
					})
					cardName = scope.card.selected;
				}
			}
			
			//console.log(list)
			let records = list.length;
			let i = list.findIndex(x => x === cardName);
			if (direction === 'right') {
				i = i + 1;
				if (i === records) {i=0};
			}else if(direction === 'left') {
				i = i - 1;
				if (i < 0) {i = records - 1};
			}
     
			if (menuName === 'map'){
					let level = levelData[levelData.findIndex((x) => x.title === list[i])];
					if(level && level.title ) {
						if(level.previews.length > 0) {
							scope.card.url = level.previews[Math.floor(Math.random() * level.previews.length)];
						}
						scope.card.selected = level.title;
						LocalStorage.setObject('map',level.levelName);
						LocalStorage.setObject('level',level.misFilePath);
					//console.log(level);
						
					}
			}else if (menuName === 'tracks' || menuName === 'vehicles'){
						
						if (scope.card.listg[i].name){
							scope.card.selected = scope.card.listg[i].name;
						}else{
							console.log(scope.card.listg[i]);
							scope.card.selected = 'Auto Select' 
						}
						
						scope.card.url = 'modules/gdcommon/gdImages/noimage.jpg';
						if (menuName === 'tracks'){
							scope.card.type = scope.card.listg[i].type;
							if (scope.card.selected !== 'Custom'){
								scope.card.url = scope.card.listg[i].url;
							}
							scope.card.objects = scope.card.listg[i].objects;
						}else{
							if (scope.card.listg[i].preview){
								scope.card.url = scope.card.listg[i].preview;
							}
						}
						 let savedMenu = {};
						savedMenu.selected = scope.card.selected;
						savedMenu.type = scope.card.type;
						savedMenu.url = scope.card.url;
						savedMenu.objects = scope.card.objects;
						
						//console.log(scope.card)
					
						if (scope.oppKey) {
							LocalStorage.setObject('oppKey',scope.oppKey);
							LocalStorage.setObject(scope.oppKey + menuName, savedMenu);
						}else{
							LocalStorage.setObject(menuName,savedMenu);
						}
			}else{
				scope.card.selected = list[i];
				scope.card.url = 'modules/gdcommon/gdImages/' + menuName + '/' + scope.card.selected + '.jpg';
				console.log(scope.card)
				if (scope.oppKey) {
					LocalStorage.setObject('oppKey',scope.oppKey);
					LocalStorage.setObject(scope.oppKey + menuName,list[i]);
				}else{
					LocalStorage.setObject(menuName,list[i]);
				}
			}
			
			//gdMenuService.saveMenus();
		
			//if (scope.card.refresh === 1 ) {
					//if (scope.card.alt !== 'config2') {

						if (scope.card.refresh && scope.card.refresh !== 'undefined'){
							if (scope.card.refresh[0] === 'tracks'){
								gdMenuService.setTracks();
							}
							 gdMenuService.setConfigs(scope.oppKey);
							 //if (scope.oppKey){
								// scope.oppKey = '0';
							 //}
							 let refresh = {tables : scope.card.refresh, oppKey : scope.oppKey};
								scope.$emit('gdConfig', refresh);
						};
				
					
					//}
			//}else if (scope.card.refresh === 2 ) {
			//	scope.$emit('gdConfig');
			//}

		};
		
		scope.$on('$destroy', function() {
		});
	}
  }
}]);
app.directive('derbyPartsTab', function() {
  return {
    restrict: 'E',
	replace: true,
    templateUrl: 'modules/gdcommon/gdTabs/parts.html',
  };
});
app.directive('derbySettingsTab', ['LocalStorage' , function (LocalStorage) { 
  return {
    restrict: 'E',
    templateUrl: 'modules/gdcommon/gdTabs/settings.html',
    scope: {
      settings: '=',
    },
	link: function (scope) {
	
	scope.loadTip = function (data){
		scope.settingsTip = data;
	}
	scope.update =  function(name,value){
		//console.log('save update Setting');
		//console.log(name);
		//console.log(value);
		LocalStorage.setObject(name,value);
		//gdMenuService.saveMenus();
	}

	},
  };
}]);	

app.directive('derbyOpponentsTab', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/gdcommon/gdTabs/opponents.html',
   
	link: function (scope) {
	scope.loadCard =  function(key, group){
		scope.oppKey = key;
		//scope.oppCard = group;
	}

	},
  };
});
app.directive('derbyMainTab', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/gdcommon/gdTabs/main.html',
  };
});	
app.factory('gdCardService', ['gdMenuService','LocalStorage',function(gdMenuService, LocalStorage){
	
	
	let cards = {};
	let levelData = [];
	let opponents = [];
	let trackData = {};
	
	function init () {

		levelData = gdMenuService.getLevels();
		gdMenuService.getTracks().then(function(tData){
			trackData = tData;
		})
	}
	function setup (menu, trackMenu, vconfig, oppKey) {
		let menuName = menu.alt;
		//if (refresh && refresh === menuName || !refresh){
		if (!cards || !cards[menuName] ) {
			cards[menuName] = {};
			cards[menuName] = menu;
		}
		if(!oppKey){
			oppKey = 0;
		}
		let savedMenu = LocalStorage.getObject(menuName);
		if (oppKey && oppKey > 0){
			savedMenu = LocalStorage.getObject(oppKey + menuName);
		}
	
		//if config 2 is not found in the listob table then reset to defaults
		if(vconfig && vconfig[0]){
			cards[menuName].default = vconfig[0].default;
			cards[menuName].listob = vconfig[0].listob;
				if(cards[menuName].listob[0]){
					if (savedMenu){ 
						let indexFound = cards[menuName].listob.findIndex(x => x === savedMenu );
						if (indexFound === -1 || indexFound === 'undefined'){
							savedMenu = cards[menuName].default;
						}
					}
				}else{
					return;
				}
		}
		if (savedMenu ){
			if (savedMenu.selected){
				cards[menuName].selected  = savedMenu.selected;
				cards[menuName].type = savedMenu.type;
				if (savedMenu.url){
					cards[menuName].url = savedMenu.url;
				}else{
					cards[menuName].url = 'modules/gdcommon/gdImages/noimage.jpg';
				}
			}else{
				cards[menuName].selected = savedMenu;
				cards[menuName].url = 'modules/gdcommon/gdImages/' + menuName + '/' + savedMenu + '.jpg';
			}
		}else{
			
			savedMenu = cards[menuName].default;
			if (cards[menuName].default.name){
				if (cards[menuName].default.type) {
					cards[menuName].type = cards[menuName].default.type;
				};
				cards[menuName].url = 'modules/gdcommon/gdImages/' + menuName  + '/' + cards[menuName].default.name + '.jpg';
				cards[menuName].selected = cards[menuName].default.name;
			}else{
				cards[menuName].url = 'modules/gdcommon/gdImages/' + menuName + '/' + cards[menuName].default + '.jpg';
				cards[menuName].selected = cards[menuName].default;
			}
		
		}		
		if(menuName === 'map'){
			let level = levelData[levelData.findIndex((x) => x.levelName === cards[menuName].selected)];
			if(level && level.title ) {
				if(level.previews.length > 0) {
					cards[menuName].url = level.previews[Math.floor(Math.random() * level.previews.length)];
				}
				cards[menuName].selected = level.title;
				savedMenu = level.levelName;
				LocalStorage.setObject('level',level.misFilePath);		
			}
		}
							
		if (menuName === 'tracks') {
							//console.log(menu);
			let levelName = LocalStorage.getObject('map');  //get current map
			let tracksList = trackMenu;  //get a list of tracks
			let tracks;
			if (levelName && tracksList) {
				tracks = tracksList[levelName];//derby is grass 
				//console.log(trackData);
				if ( trackData && trackData[levelName] && trackData[levelName].arenas){
					let customTracks = trackData[levelName].arenas;//this comes from mods
					if (customTracks) {
						if (tracks && tracks !== 'undefined') {				
							let arenas = customTracks.main.arena.listg
							arenas.forEach((value,key) => {
								let foundTrack = tracks.main.arena.listg[tracks.main.arena.listg.findIndex((x) => x.name === value)];
								if (!foundTrack && foundTrack !== 'undefined'){
									tracks.main.arena.listg.push(arenas[key]);
								}
							})
						}else{
							tracks = customTracks[levelName];
						}
					}
				}
			}
			if (!tracks || tracks === 'undefined') {
				tracks = tracksList.common;
			}
			cards[menuName].listg = tracks.main.arena.listg;
			let trackName = tracks.main.arena.listg[tracks.main.arena.listg.findIndex((x) => x.name === cards[menuName].selected)];//search the saved track to load it
			if (!trackName || cards[menuName].selected === 'Custom' ) {
				cards[menuName].selected =  tracks.main.arena.default.name;
				cards[menuName].type = tracks.main.arena.default.type;
				cards[menuName].objects = tracks.main.arena.default.objects;
			
				if (cards[menuName].selected === 'Custom'){
					cards[menuName].url = 'modules/gdcommon/gdImages/noimage.jpg';
				}else{
					cards[menuName].url = tracks.main.arena.default.url;
				}
			}else{
					cards[menuName].objects = trackName.objects;
			}
				cards[menuName].laps = tracks.main.arena.laps.default;
				if(!cards[menuName].laps){
					cards[menuName].laps = 1;
				}
				savedMenu.selected = cards[menuName].selected;
				savedMenu.type = cards[menuName].type;
				savedMenu.url = cards[menuName].url;
				savedMenu.objects = cards[menuName].objects;
				
				
				LocalStorage.setObject('laps', cards[menuName].laps);
			}	
			if (menuName === 'vehicles') {
				//type is the Model Group Selected = All Models , burnside, 
				let config2 = cards['config2'].selected;
				let classes = cards['classes'].selected;
				let mods = cards['mods'].selected;
				
				if (!cards[menuName][oppKey]) {
					cards[menuName][oppKey] = {};
					cards[menuName][oppKey].config2 = angular.copy(config2);
					cards[menuName][oppKey].classes = angular.copy(classes);
					cards[menuName][oppKey].mods = angular.copy(mods);
				}
				if (!cards[menuName].selected) {
					cards[menuName].type = cards[menuName].default.type;
					cards[menuName].selected = cards[menuName].default.name;
					cards[menuName].url = cards[menuName].default.url;
				}
				cards[menuName].groups = vconfig.group  //model groups
				let modelGroup = cards[menuName].groups[cards[menuName].groups.findIndex((x) => x === cards[menuName].type)];//search the saved track to load it
				
				if (!modelGroup || cards[menuName][oppKey].config2 !== config2 || cards[menuName][oppKey].classes !== classes || cards[menuName][oppKey].mods !== mods) {
					if (cards[menuName].groups[0] === 'No Vehicles Found --Defaults Listed--'){
						cards[menuName].type = cards[menuName].groups[0];
					}else{
						cards[menuName].type = cards[menuName].default.type;
					}
					console.log('model group not found reset to default')
					cards[menuName].selected = cards[menuName].default.name;
					cards[menuName].url = cards[menuName].default.url;
				}
				cards[menuName].listg = [];
				cards[menuName].listg.push(cards[menuName].default);
				cards[menuName].listg[0].config2 = 'All Config Groups';
				vconfig.model.forEach((value,key) => {
					if (value.name !== 'Auto Select'){
						if (value.config2 === config2 || value.config2 === 'All Config Groups' || config2 === 'All Config Groups') {   //example config2 = GD-Basic Class
							if (cards[menuName].type === value.type || cards[menuName].type === 'All Models' || cards[menuName].type === 'No Vehicles Found --Defaults Listed--'){
								cards[menuName].listg.push(value);
							}
						}
					}
				})
				if (savedMenu && savedMenu === 'Auto Select'){
					cards[menuName].selected = 'Auto Select'
				}else{
					let indexFound = cards[menuName].listg[cards[menuName].listg.findIndex(x => x.name === savedMenu.selected )];
					if (!indexFound){
						cards[menuName].selected = 'Auto Select'
					}
				}
				if (!cards[menuName].listg.length){
					vconfig.model.forEach((value,key) => {
						if (value.config2 === config2 || value.config2 === 'All Config Groups' || config2 === 'All Config Groups') {   //example config2 = GD-Basic Class
							cards[menuName].listg.push(value);
						}
					})
					cards[menuName].selected = 'Auto Select - None Found'
				}
				if(!cards[menuName].url){
					cards[menuName].url = 'modules/gdcommon/gdImages/noimage.jpg';
				}
				cards[menuName][oppKey].config2 = angular.copy(config2);
				cards[menuName][oppKey].classes = angular.copy(classes);
				cards[menuName][oppKey].mods = angular.copy(mods);
				savedMenu.selected = cards[menuName].selected;  
				savedMenu.type = cards[menuName].type;  //Model Selected
				savedMenu.url = cards[menuName].url;
			}
				
			
			if (oppKey && oppKey > 0){
				if (menuName == 'vehicles' || menuName == 'config2' || menuName == 'mods' || menuName == 'classes'){
					LocalStorage.setObject(oppKey + menuName,savedMenu);
				}
			}else{
				LocalStorage.setObject(menuName,savedMenu);
			}
			//console.log(cards)
			
	}
	function setCards(oldCard){
		cards = angular.copy(oldCard);
		//console.log(cards)
		//console.log('setCards')
	}
	function clearCards(){
		cards = {};
	}
	init();
	return{
		setup:setup,
		init: init,
		setCards: setCards,
		getCards: function ()   {return cards;},
		getOpponents: function () {return opponents;},
		clearCards: clearCards,
	};
		
}]);
/**
 * @ngdoc controller
 * @name beamng.stuff:gdStartController
 * @description Controller for the view that appears on scenario start
**/
app.controller('gdStartController', ['$q','LocalStorage','gdMenuService', 'gdCardService', '$scope', '$state', '$timeout', '$rootScope', 'ControlsUtils', 'Utils', '$ocLazyLoad', 'gamepadNav', '$sce', '$translate', 'VehicleSelectConfig', '$stateParams', 'gdSelectionsService', '$filter', 'translateService',
function ($q,LocalStorage,gdMenuService, gdCardService, $scope, $state, $timeout, $rootScope, ControlsUtils, Utils, $ocLazyLoad, gamepadNav, $sce, $translate, VehicleSelectConfig, $stateParams, gdSelectionsService, $filter, translateService ) {
	'use strict';
	var vm = this;

	//console.log('gdStartController reset vm.cards')
	vm.data = null;
	vm.config = { playerValid: true };
	vm.cards = [];
	vm.settings = {};
	let syncplayer = true;


	var crossfireEnabled = gamepadNav.crossfireEnabled()
  var gamepadNavEnabled = gamepadNav.gamepadNavEnabled()
  gamepadNav.enableCrossfire(true)
  gamepadNav.enableGamepadNav(false)
  $scope.$parent.app.stickyPlayState = 'scenario-gdstart'
	var cancelWaiting = Utils.waitForCefAndAngular(() => {
    // Start listening to the controls. Needed for starting the scenario without clicking
    // on the button (e.g. by throttle action)
    bngApi.engineLua('WinInput.setForwardRawEvents(true);')
    bngApi.engineLua('WinInput.setForwardFilteredEvents(true);')

    bngApi.engineLua('extensions.hook("onScenarioUIReady", "start")')
  })

	vm.checkNumber = function (num,str) {
		let num2 = str.replace(/\D/g, "")
		if (Number(num) <= Number(num2) ){
			return true;
		}else{
			return false;
		}
	}
	var menuSettings = null;
	
	
	if (!menuSettings){
		
		menuSettings = gdMenuService.getSettings();
	}
	
	function setupCards (resetCard, configs, oppKey){
			//adds more opponents to the menu
		gdCardService.clearCards();
		if (resetCard && resetCard.oppKey){
			oppKey = resetCard.oppKey;
		}
		//console.log(oppKey + ' setupCards oppKey')
		if (vm.cards[oppKey]) {
			gdCardService.setCards(vm.cards[oppKey])
		}else{
			if (!vm.cards[oppKey] && oppKey != 0){
				gdCardService.setCards(vm.cards[0])
			}
		}
		let trackMenu = angular.copy(menuSettings.tracks.arenas);
			Object.keys(menuSettings.menu.main).forEach(function (key){
				let menu = angular.copy(menuSettings.menu.main[key]);
				if (menu) {
					let vconfigs = null;
					if (configs && configs[menu.alt]){
						vconfigs = configs[menu.alt];
					}
					if(!resetCard || !Array.isArray(resetCard.tables)){
							
								if (oppKey) { 
									//gdCardService.setCards(vm.cards[oppKey])
								}else{
									//gdCardService.setCards(vm.cards[0])
								}
						gdCardService.setup(menu, trackMenu, vconfigs, oppKey);	// menu = classes:Large Cars
					}else{
						Object.keys(resetCard.tables).forEach(function (id){
							//console.log(resetCard.tables[id])
							if (menu.alt === resetCard.tables[id]){
								
								gdCardService.setup(menu, trackMenu, vconfigs, oppKey);	
							}
						});
					}
				}
			})
	}
	vm.gdOppReset = function (roption) {
		//console.log('gdOppReset')
		if (vm.cards[0]) {
			let count = vm.cards[0].opponents.selected.match(/\d+/)[0]  || 3
			
			for(var i=0;i<count;i++) {
				let oppKey = i + 1
				let player = {name: "Player Type", selected:"Computer(AI)", url:"modules/gdcommon/gdImages/player/Computer(AI).jpg", alt:"player", default:"AI", col:3,row:2, show: true, tooltip:"If this vehicle will be computer controlled or human controlled",listng:["Computer(AI)", "Human(MultiSeat)"]};
				let playerSelect = LocalStorage.getObject(oppKey + 'player');
				if (playerSelect) {
					if (playerSelect === 'Human(MultiSeat)'){
						player.url = "modules/gdcommon/gdImages/player/Human(MultiSeat).jpg"
					}
					player.selected = playerSelect
				}
				const options = ['classes','mods','config2','vehicles'];
				//all - sync with menu default  syncplayer - syncs with the player on startup and changes to player syncap - sync all opponents to player 
				if (!vm.cards[oppKey] || roption === 'syncplayer' || roption === 'all' || roption === oppKey || roption === 'syncap' || roption === (oppKey.toString() + 'syncop')){
					
						for (const id of options) {	
							if (roption === oppKey || roption === 'all') {
								LocalStorage.remove(oppKey + id)
							}else if (roption === 'syncap' || roption === (oppKey.toString() + 'syncop') || roption === 'syncplayer'){
								let savedMenu = LocalStorage.getObject(id);
								if (id === 'vehicles'){
									if (vm.cards[0][id] && vm.cards[0][id].listg) {
										let vehicle = LocalStorage.getObject(oppKey + id);
										if (!vm.cards[oppKey] || vm.cards[0][id].type === vm.cards[oppKey][id].type){
											let exists = vm.cards[0][id].listg[vm.cards[0][id].listg.findIndex(x => x.name === vehicle.selected )];
											if (exists) {
												//reformat to match values
												let savedMenu = {}
												savedMenu.selected = exists.name;  
												savedMenu.type = exists.type;  //Model Selected
												savedMenu.url = exists.preview;
												LocalStorage.setObject(oppKey + id, savedMenu);
											}else{
												LocalStorage.setObject(oppKey + id, 'Auto Select');
											}
										}else{
											let savedMenu = {}	
											savedMenu.selected = 'Auto Select';  
											savedMenu.type = vm.cards[0][id].type;  //Model Selected
											savedMenu.config2 = vm.cards[0][id].config2;
											LocalStorage.setObject(oppKey + id, savedMenu);
										}
									}else{
											LocalStorage.setObject(oppKey + id, 'Auto Select');
									}
								}else{
									LocalStorage.setObject(oppKey + id, savedMenu);
								}
							}		
														
						}
					
					//if ( roption === (oppKey.toString() + 'syncop' )){
					//		gdMenuService.setConfigs();
					//		gdMenuService.getConfigs().then(function(newconfigs){
								//reset the card to what the player is
					//			setupCards(null, newconfigs, 0);
						//		let card = gdCardService.getCards();
					//			let oppCards = {classes: card['classes'], mods: card['mods'], config2: card['config2'], vehicles: card['vehicles'], player: player};
					//			vm.cards[oppKey] = angular.copy(oppCards);
						//		LocalStorage.setObject(oppKey + 'player', player.selected);
						//	})
				//	}else{	
						gdMenuService.setConfigs(oppKey);
				
						gdMenuService.getConfigs().then(function(newconfigs){
							setupCards(null, newconfigs, oppKey);
							let card = gdCardService.getCards();
							let oppCards = {classes: card['classes'], mods: card['mods'], config2: card['config2'], vehicles: card['vehicles'], player: player};
							vm.cards[oppKey] = angular.copy(oppCards);
							LocalStorage.setObject(oppKey + 'player', player.selected);
						})
				//	}
					
				}
			}
				
			let overCount = (Object.keys(vm.cards).length - 1) - count;
			if (overCount > 0) {
				for(var i=0;i<overCount;i++) {
					let Index = Object.keys(vm.cards).length  
					delete vm.cards[Index - 1]; 
				}
			}
			//console.log(vm.cards)
		}else{
			$scope.$emit('gdConfig');
		};
	};
	
	function gdConfigResponse (resetCard){
		//console.log('gdConfigResponse ')
		//console.log(resetCard)
		
		gdMenuService.getConfigs().then(function(configs){
		
			
			setupCards(resetCard, configs, 0);
			
			let card = gdCardService.getCards();
			if (!vm.cards[0] ) {
				//console.log(card)
				//console.log('gdConfigRepsonse vmcards 0')
				vm.cards[0] = angular.copy(card);
				if (syncplayer === true){
					vm.gdOppReset('syncplayer');
				}else{	
					vm.gdOppReset('na');
				}
			}
			if (resetCard && resetCard.tables) {
				Object.keys(resetCard.tables).forEach(function (id){
					let cardName = resetCard.tables[id];   //vehicles cardname
					if (resetCard.oppKey) {
						vm.cards[resetCard.oppKey][cardName] = angular.copy(card[cardName]);
					}else{
						vm.cards[0][cardName] = angular.copy(card[cardName]);
						if (syncplayer === true){
							//console.log(syncplayer + ' Sync Player')
							vm.gdOppReset('syncplayer');
						}
					}
				})
			}
		
			//gdMenuService.saveMenus();
			//console.log(configs);
			//console.log(vm.cards);
		
		})
	}
	
	function gdConfigList (resetCard) {
			//console.log('gdConfigList')
			if (menuSettings && menuSettings.menu && menuSettings.menu.settings){
				Object.keys(menuSettings.menu.settings).forEach(function (key){
					let options = angular.copy(menuSettings.menu.settings[key]);
					let savedOptions = LocalStorage.getObject(key);
					if (savedOptions || typeof savedOptions == "boolean"){
						options.selected = savedOptions;
					}else{
						options.selected = options.default;
					}
					LocalStorage.setObject(key, options.selected);
					vm.settings[key] = options;
					if (key === 'syncplayer'){
						syncplayer = savedOptions;
					}
				})	
				
			}else{
				menuSettings = gdMenuService.getSettings();
				
			}
			//this will add vehicles to the opponents tab if they change the number of vehicles in the menu
			if (resetCard && resetCard.tables && resetCard.tables[0] === 'vehCount'){  
				if (syncplayer === true){
					let count = vm.cards[0].opponents.selected.match(/\d+/)[0]  || 3
					vm.gdOppReset(count.toString() + 'syncplayer');
				}else{	
					vm.gdOppReset('na');
				}
			}else{
				gdMenuService.setConfigs();
				gdConfigResponse(resetCard);
			}
			
			
			
			
	}
		
	
	$scope.$on('gdConfig', function(event, resetCard){
		gdConfigList(resetCard);
	});
	
	gdConfigList();
	
	
	//parts 
	vm.clear = function(menu){
		LocalStorage.remove(menu,'parts')
		vm.selected.parts[menu] = {}
	};
   vm.section = function(index) {
      var acc = document.getElementsByClassName('accordion')
      acc[index].classList.toggle("active");
      acc[index].nextElementSibling.classList.toggle("show");
    };
	
	
	
	
	vm.getPreview = function (name) {
		var menu = name.toLowerCase();
			if (menuSaved[menu] !== 'undefinded')
			{
				var img = 'modules/gdcommon/gdImages/' + menu + '/' + menuSaved[menu] + '.jpg';
				if (menu === 'map'){
					var level
					level = levelData[levelData.findIndex((x) => x.levelName === menuSaved[menu])];
					if(level && level.name ) {
						if(level.previews.length > 0) {
							img = level.previews 
							//level.previews[Math.floor(Math.random() * level.previews.length)];
							gdSelectionsService.setLevel({
								name: level.name,
								preview: img,
								file: level,
								targetState: 'gdMapSelect'
							});
						}
					}
				};
				return img;
			}
	};

	vm.setState = function (name) {
		if (state !== 'undefined'){
			state = 'gd' + state + 'Select'
			if (state === 'scenario-start'){
				return;
			}
			$state.go(state);
		}
	};
	
	//vm.isDisabled = function () {
		//return !vm.selections.level.file || !vm.selections.track.file || !vm.selections.vehicle.file;
	//};
	
	
	//vm.selectLevel = function(vm.selected, gameState, goToTrack) {
	 //var preview = null;
    //if(scenario.previews.length > 0) {
     // preview = scenario.previews[Math.floor(Math.random() * scenario.previews.length)];
    //}
    //gdSelectionsService.setLevel({
      //name: scenario.name,
     // preview: preview,
     // file:scenario,
     // targetState:'gdLevelSelect',
    //});
	//}
	
	//example card is selections.level targetState is gdLevelSelect
	
  // Run on launch ----------------------------------------------------------------

  // This is actually a request to the Lua engine to send a "ScenarioChange"
  // event through the HookManager, with information about the about-to-start scenario.
  // A listener is already registered.

  //var cancelWaiting = Utils.waitForCefAndAngular(() => {
   // $scope.$emit('ShowApps', false);
   // bngApi.engineLua("extensions.core_input_bindings.menuActive(true);");
    // Start listening to the controls. Needed for starting the scenario without clicking
    // on the button (e.g. by throttle action)
   // bngApi.engineLua('WinInput.setForwardRawEvents(true);');
    //bngApi.engineLua('WinInput.setForwardFilteredEvents(true);');

   // $scope.$emit('StickyState', $state.$current.name)

   // bngApi.engineLua('extensions.hook("onScenarioUIReady", "start")')
  //});

	
  /*
   * @ngdoc method
   * @name beamng.stuff:ScenarioStartController#play
   * @methodOf beamng.stuff:ScenarioGdstartController
   *
   * @description Informs Lua that we are ready to launch the loaded scenario
   */
   
    vm.startScenario = function() {
		//gdMenuService.saveMenus();
		//let vconfigs = [];
		
		let vconfigs = [];
		for (var key in vm.cards) {
			vconfigs[key] = angular.copy(vm.cards[key].vehicles.listg);
		}
		//let vconfigs = angular.copy(vm.cards[0].vehicles.listg)
		//angular.forEach(vm.cards, function(value, key) {
		//	console.log(vm.cards[key].vehicles.listg)
		//	vconfigs[key] = angular.copy(vm.cards[key].vehicles.listg)
		//});
		
		gdMenuService.saveConfigs(vconfigs);
		  vm.play();
		  //$scope.$emit('ShowApps', true);
  }
   vm.play = function () {
	   $scope.$parent.app.stickyPlayState = null
	 var luaCmd = 'scenario_gdscenariosLoader.scenarioStart()'
	
		bngApi.engineLua(luaCmd)
		$state.go('play')
  }
  
  vm.getIconName = function (devName) { return ControlsUtils.deviceIcon(devName); };


  $scope.$on('RawInputChanged', function (event, data) {
	  // When UI is focused, CEF swallows all filtered input events from keyboard
    // This means, when UI is focused, user cannot change keyboard multiseat vehicle with left/right steering bindings
    // To work around this, we check the raw inputs, and convert left/right arrow keys, to steering events for the multiseat scenario UI selection
		if (data.devName[0] == "m")                            return; 
		//if (data.devName[0] == "k")                            return; // only forward keyboard events                          return; // only forward keyboard events
		vm.rawdevice = data.devName;
  })


  // We no longer need to listen to the controls once the state is gone.
  $scope.$on('$destroy', function() {
	console.log('destroy contoller gd');
     cancelWaiting()
	 $state.go('play')
    bngApi.engineLua('WinInput.setForwardRawEvents(false);')
    bngApi.engineLua('WinInput.setForwardFilteredEvents(false);')
    gamepadNav.enableCrossfire(crossfireEnabled); // use old value from before opening the menu here
    gamepadNav.enableGamepadNav(gamepadNavEnabled); // use old value here
  });
}]);

app.controller('gdEndController', ['VehicleSelectConfig','translateService','$scope', '$state', '$stateParams', '$timeout', '$filter', 'gamepadNav',
function (VehicleSelectConfig, translateService, $scope,  $state, $stateParams, $timeout, $filter, gamepadNav) {
	var crossfireEnabled = gamepadNav.crossfireEnabled()
  var gamepadNavEnabled = gamepadNav.gamepadNavEnabled()
  gamepadNav.enableCrossfire(true)
  gamepadNav.enableGamepadNav(false)

  $scope.$parent.app.stickyPlayState = 'gdscenario-end'

  var data = $stateParams.endData;
  
  // debugger;
	if (data.options === undefined){
		 bngApi.engineLua("gdscenarios.endScreen();");
		 return
	}
 
	 
	var title = data.options.map + ' - ' + data.options.tracks.selected;
	
	//remove _ in titles
	$scope.eventTitle = title.replace(/_/g, ' ');
	
	$scope.drivers = $stateParams.drivers;
	$scope.headers = $stateParams.headers;
	
	$scope.filter = function(value, filter) {
   if(filter)
    {
      return $filter(filter)(value);
    }{
      
      return value
      }
  };
	// column to sort
	$scope.column = 'place';
	 
	 // sort ordering (Ascending or Descending). Set true for desending
	$scope.reverse = false; 
	
	// called on header click
	$scope.sortColumn = function(col){
	$scope.column = col;
	if($scope.reverse){
		$scope.reverse = false;
		$scope.reverseclass = 'arrow-up';
	}else{
		$scope.reverse = true;
		$scope.reverseclass = 'arrow-down';
		}
	};
	
	// remove and change class
	$scope.sortClass = function(col){
	if($scope.column == col ){
		if($scope.reverse){
			return 'arrow-down'; 
		}else{
			return 'arrow-up';
		}
	}else{
		return '';
	}
	}; 
 
	if(data.buttons != null) {
    for(var i = 0; i<data.buttons.length ; i=i+1) {
      data.buttons[i].label = translateService.contextTranslate(data.buttons[i].label)
    }
  }
  $scope.data = data;
 $scope.activeButton = $scope.data.buttons.length - 1

  for (var i = $scope.data.buttons.length - 1; i >= 0; i--) {
    if ($scope.data.buttons[i].active) {
      $scope.activeButton = i
    }
  }

  var cmds = {
    openMenu: function () {
      $scope.$emit('MenuToggle', true)
    },
     openScenarios:function(){
      //$scope.$emit('MenuToggle', true)
      setTimeout(function() {$state.go('menu.scenarios');})
    },
  };

  function execHelper (cmd) {
    var luaCmd = cmds[cmd] === undefined
    return {
      func: luaCmd ? () =>{$state.go('play'); bngApi.engineLua(cmd)} : cmds[cmd],
      exits: luaCmd
    }
  }

  $scope.executeCmd = function (cmdStr, showLoadingScreen) {
    console.log(cmdStr)
    var cmd = execHelper(cmdStr)
    $scope.$parent.app.stickyPlayState = null
    cmd.func()
  }

  $scope.getBarSound = function (i) {
    if (i === 0) {
      return {animationstart: 'event:>UI>Scenario End Counting'};
    }
    return {};
  };


   $scope.$on('$destroy', () => {
    gamepadNav.enableCrossfire(crossfireEnabled); // use old value from before opening the menu here
    gamepadNav.enableGamepadNav(gamepadNavEnabled); // use old value here
	VehicleSelectConfig.configs.default.hide =  {};
	VehicleSelectConfig.configs.default.filter = {}; 
  })

}]);
