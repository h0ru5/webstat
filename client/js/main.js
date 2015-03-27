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

        //$locationProvider.html5Mode(true);
    })

    .controller('TestCtrl', ['$scope', '$window', function ($scope, $window) {
        //TBD I sshould move this to a new file
        'use strict';
        var sock = null;

        var notempty = function(string) {
          return string && string != ""
        }

        var splitAddr = function(addr) {
          var last_colon= addr.lastIndexOf(':');
          return {
            'port' : addr.substr(last_colon+1),
            'host' : addr.substring(0,last_colon)
          };
        }

        var parsetcp = function(arr) {
          var conn= {
            'proto': arr[0],
            'recv_q': arr[1],
            'send_q': arr[2],
            'state': arr[5]
          }

          var addr = splitAddr(arr[3]);
          conn.lport = addr.port;
          conn.lhost = addr.host;

          addr = splitAddr(arr[4]);
          conn.rport = addr.port;
          conn.rhost = addr.host;

          return conn;
        }

        var incoming = function (event) {
            $scope.$apply(function () {
                var line = event.data
                //$scope.log = line + '\n' + $scope.log;
                var tokens = line.split(' ').filter(notempty);
                if(tokens[0]=='tcp' || tokens[0]=='tcp6') {
                  var con = parsetcp(tokens);
                  var idx = _.findIndex($scope.conns, {'lport' : con.lport, 'rhost' : con.rhost, 'rport' : con.rport });
                  if(idx != -1)
                    $scope.conns[idx] = con;
                  else
                   $scope.conns.push(con);
                } else {
                  //new round, clean closed connections
                }
            });

        };

        $scope.log = '';
        $scope.conns = [];
        $scope.host = 'johanneshund.de';
        $scope.port = 8088;

        $scope.connect = function (host, port) {
            $scope.log += 'connecting to ws://' + host + ':' + port + '\n';
            sock = new WebSocket('ws://' + host + ':' + port);
            sock.onmessage = incoming;
            sock.onopen = function () { $scope.log += 'opened\n'; };
            sock.onclose = function () { $scope.log += 'closed\n'; };
        };

        $scope.disconnect = function () {
            $scope.log += 'closing...\n';
            sock.close();
        };
    }]);
