"use strict";

module.exports = function (rdeService) {
    return {
        restrict: "E",
        templateUrl: '/recordsEdit.html',
        scope: {
            rows: '=rowsList'
        },
        controller: function ($scope) {
        
        },
        link: function (scope, element, attrs) {
            scope.$watchCollection('rows', function (newValue, oldValue) {

                if (newValue !== undefined) {
                    console.log(newValue)
                }
            })

        }
    }
};
