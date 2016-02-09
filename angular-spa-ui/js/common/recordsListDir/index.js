"use strict";

module.exports = function (parentModule) {

    var recordsListDir = require('./recordsList-dir');
    var recordsListSrv = require('./recordsList-srv');
    var recordsListCtrl = require('./recordsList-ctrl');

    parentModule
        .constant('recordsListConfig', require('./recordsList-config'))
        .controller('recordsListCtrl', recordsListCtrl)
        .directive('recordsList', recordsListDir)
        .service('rlService', recordsListSrv)

};
