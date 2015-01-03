angular.module('scg.controller').controller('IndexCtrl', function($scope, $state) {
    'use strict';

    $scope.search = function() {
        $state.go('search', {
            query: $scope.query,
        });
    }
});
