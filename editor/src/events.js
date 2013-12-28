var myModule = angular.module('myModule', []);

myModule.controller('myController', function($scope, userRepository) {
    userRepository.getAllUsers().success(function(users) {$scope.users = users});
    
    $scope.changeFirstUsersFirstName = function() {
        $scope.users[0].firstName = 'Jill'
    };

});

myModule.factory('userRepository', function($http) {
    return {
        getAllUsers: function() {
            var url = "https://api.mongolab.com/api/1/databases/angularjs-intro/collections/users?apiKey=terrPcifZzn01_ImGsFOIZ96SwvSXgN9";
            return $http.get(url);
        }
    };
});