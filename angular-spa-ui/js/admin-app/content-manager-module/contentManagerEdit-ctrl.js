"use strict";

module.exports = function ($scope, contentStorage, $stateParams) {
    
    var vm = this;
    
    vm.model = {
        rowsList: {}
    };
    
    var privateApi = {
        convertDetails: function (details) {
            var data = [];
            for (var x in details) {
                data.push({
                    title: x,
                    value: details[x]
                })
            }
            return data;
        }
    };
    
    if (_.isEmpty(contentStorage.params)) {

    } else {
        vm.model.rowsList = privateApi.convertDetails(contentStorage.params);        
    }
    console.log(contentStorage.params);
};
