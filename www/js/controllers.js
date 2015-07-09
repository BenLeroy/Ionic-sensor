angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, socket, ionicToast, $state) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});  
  
  // Form data for the login modal
  $scope.serverUrl = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/server.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.openModal = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.regServer = function() {
    LoopBackResourceProvider.setUrlBase($scope.serverUrl);
    console.log('Connecting to', $scope.serverUrl);
  };

  socket.on('newEvent', function (object) {
    ionicToast.show('A sensor has just gone ' + object.status, 'bottom', false, 5000);
    
    if ($state.current.name === 'app.events') {
      $state.reload();
    };
  });
})

.controller('ListCtrl', function (Sensor, $scope, $state, $stateParams, $filter, Errors){

  $scope.filteredItems = [];

  $scope.$on("$ionicView.enter", function () {
    $scope.sensors = [];

    Sensor.find().$promise.then(function (data){

      for (var i = 0; i < data.length; i++) {
        data[i].availability = (
          (
            new Date() - new Date(data[i].createdAt)
          ) / (
            new Date() - new Date(data[i].createdAt) + data[i].downtime
          )
        ) * 100;
        $scope.sensors.push(data[i]);
      }
    }, function (err) {
      if (err.status !== 200) {
        Errors.setError(err);
        $state.go('app.error');
      }
    });
  });
})

.controller('EventCtrl', function (Event, $timeout, $scope, $stateParams, Errors, $state){

  $scope.$on("$ionicView.enter", function () {

    $scope.events = [];

    Event.find({
        filter: {
          include: 'sensor'
          , order: 'loggedAt DESC'
        }
      }).$promise.then(function (data){

        for (var i = 0; i < data.length; i++) {
          $scope.events.push(data[i]);
        }
      }, function (err) {
        if (err.status !== 200) {
          Errors.setError(err);
          $state.go('app.error');
        };
      }
    );
  });
})

.controller('ErrCtrl', function ($scope, Errors) {
  $scope.errorCode = Errors.getError();  
})

.controller('EditCtrl', function (Sensor, $stateParams, $scope, $state, $ionicPopup, $ionicHistory) {
  
  $scope.sensor = [];

  Sensor.find({
    filter: {
      include: 'events'
      , where: {id: $stateParams.id}
    }
  }).$promise.then(function (data) {
    
    $scope.sensor = data[0];
    console.log($scope.sensor);
    if ($scope.sensor.status !== 'OFF') {
      $scope.sensor.isMonitored = true;
    }
    else {
      $scope.sensor.isMonitored = false;
    }
    
  });

  $scope.SaveMod = function () {
    
    if ($scope.sensor.isMonitored === false) {
      console.log('go OFF');
      $scope.sensor.status = 'OFF'
    }
    else {
      console.log('go ON');
      $scope.sensor.status = 'Missing'
    }

    $scope.sensor.modifiedAt = Date.now();
    $scope.sensor.$save();
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.list');
  };

  $scope.delAlert = function () {

    var confirmPopup = $ionicPopup.confirm({
      
      title: 'Delete '+ $scope.sensor.key + '?',
      template: 'Are you sure you want to delete this sensor and all related informations?'
    });
   
    confirmPopup.then(function(res) {
      if(res) {
        $scope.deleteSensor();  
      }
    });
  };

  $scope.deleteSensor = function () {
    $scope.sensor.$delete({id: $scope.sensor.id}
      ,$ionicHistory.nextViewOptions({disableBack: true})
      ,$state.go('app.list')
    );
  };
})

/*.controller('RealCtrl', function (socket, $scope, ionicToast) {
  socket.on('newEvent', function (object) {
    console.log(object);
    ionicToast.show('A sensor has just gone ' + object.status, 'bottom', false, 5000);
  });  
})*/;
