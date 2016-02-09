"use strict";

module.exports = function ($rootScope, promises, configService, appLocalStorage, commonService, getTemplate, $q) {

    var config = configService.getConfig('appConfig');
    var paths = config.paths;
    var userData = appLocalStorage.getItem('userData') || {};

    userData.userId = GLOBAL_USER_ID;
    paths.userPath += GLOBAL_USER_ID;

    return {
        checkAllSteps: function () {
            var deferred = $q.defer();
            userData = {};
            config = configService.getConfig('appConfig');
            paths = config.paths;
            paths.userPath += GLOBAL_USER_ID;

            promises.getAsyncData('GET', paths.userPath)
                .then(
                    function (data) {
                        if (data.status === 'error') {
                            var errObject = {
                                code: data.error.name,
                                data: data.error.message
                            };
                            return $q.reject(errObject);
                        }
                        userData = commonService.initUserData(data, userData);
                        paths.rolePath += userData.userId;
                        paths.tokenPath += userData.userId;
                        return promises.getAll('GET', [paths.rolePath, paths.tokenPath])
                    })
                .then(
                    function (data) {
                        userData = commonService.getToken(data, userData, paths.tokenPath);
                        userData = commonService.getPermissions(data, userData);
                        paths.validatePath += userData.userId + '/' + userData.userToken;
                        return promises.getAsyncData('GET', paths.validatePath);
                    })
                .then(
                    function (data) {
                        if (data.status === 'ok' && data.data.result) {
                            var scope = $rootScope.$new(true);
                            deferred.resolve({
                                userData: userData,
                                scope: scope
                            });
                        } else {
                            var errorObj = {
                                code: 'Validation Error',
                                data: 'Validation of user data failed!'
                            };

                            return $q.reject(errorObj);
                        }
                    })
                .catch(
                    function (error) {
                        deferred.reject(error);
                    });

            return deferred.promise;
        },
        checkRegistration: function () {
            var deferred = $q.defer();
            var that = this;

            if (_.has(userData, 'userId') && _.has(userData, 'userToken')) {
                paths.validatePath += userData.userId + '1/' + userData.userToken;
                promises.getAsyncData('GET', paths.validatePath)
                    .then(function (responce) {
                        if (responce.status === 'ok' && responce.data.result && commonService.checkLocalStorageUserData(userData)) {
                            var scope = $rootScope.$new(true);
                            deferred.resolve({
                                userData: userData,
                                scope: scope
                            });
                        } else {
                            that.checkAllSteps()
                                .then(function (responce) {
                                    deferred.resolve(responce);
                                })
                                .catch(function (error) {
                                    deferred.reject(error);
                                })
                        }
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    })
            } else {
                that.checkAllSteps()
                    .then(function (responce) {
                        deferred.resolve(responce);
                    })
                    .catch(function (error) {
                        deferred.reject(error);
                    });

            }
            return deferred.promise;
        }
    }

};
