module.exports = function ($injector) {

    return {
        getData: function (configName, keysPath) {

            var config = this.getConfig(configName),
                keysPathArray = keysPath.split('.'),
                lastKeyIndex = keysPathArray.length - 1;
            if (!keysPathArray.length && !_.isEmpty(config)) {
                return false;
            }

            var obj = config;

            for (var index in keysPathArray) {
                var data = keysPathArray[index];
                if (!_.has(obj, data)) {
                    console.warn('Element \'' + keysPath + '\' not found in ' + configName);
                    obj = false;

                    return false;
                }
                obj = obj[data];

                if (index == lastKeyIndex) {
                    return angular.copy(obj);
                }
            }

            return angular.copy(obj);
        },
        getConfig: function (configName) {

            try {
                return angular.copy($injector.get(configName));
            } catch (err) {
                throw Error('Can not get config ' + configName);
            }

        }
    }
};
