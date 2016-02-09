"use strict";

module.exports = function ($scope, contentStorage) {
    
    function convertDetails(details) {
        var data = [];
        for (var x in details) {
            data.push({
                title: x,
                value: details[x]
            })
        }
        return data;
    }
    
    $scope.rowsList = convertDetails(contentStorage.params);
};
