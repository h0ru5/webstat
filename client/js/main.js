angular.module('remoteDev', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        'use strict';
        $routeProvider
            .when('/netstat', {
                templateUrl: 'partials/netstat.html', 
                controller: 'TestCtrl'
            })
            .otherwise({
                templateUrl: 'partials/home.html'
            });
            
        $locationProvider.html5Mode(true);
    })
    .controller('TestCtrl', ['$scope', '$window', function ($scope, $window) {
        'use strict';
        var sock = null; 
        
        var incoming = function (event) {
            $scope.$apply(function () {
                $scope.log += event.data + '\n';
            });
        };
        
        $scope.log = '';
        $scope.host = 'johanneshund.de';
        $scope.port = 8088;
        
        $scope.connect = function (host, port) {
            $scope.log += 'connecting to ws://' + host + ':' + port + '\n';
            sock = new WebSocket('ws://' + host + ':' + port);
            sock.onmessage = incoming;
            sock.onopen = function () { $scope.log += 'opened\n'; };
        };
        
        $scope.disconnect = function () {
            sock.close();
        };
    }]);