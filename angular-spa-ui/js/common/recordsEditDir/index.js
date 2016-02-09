"use strict";

module.exports = function (parentModule) {
    var recordsEditDir = require('./recordsEdit-dir'),
        recordsEditSrv = require('./recordsEdit-srv'),
        recordsEditCtrl = require('./recordsEdit-ctrl');
    
    parentModule
        .directive('recordsEdit', recordsEditDir)
        .controller('recordsEditCtrl', recordsEditCtrl)
        .service('rdeService', recordsEditSrv)
};
