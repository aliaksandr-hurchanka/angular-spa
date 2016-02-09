"use strict";

module.exports = function () {

    var defaultModule = 'simple'
    var currentModule = defaultModule;
    var searchModulesList = [];
    var searchModulesMethods = {};

    /**
     * [[return list of inited modules]]
     * @returns {[[Array]]} [[modules names list]]
     */
    var getSearchModulesList = function () {
        return searchModulesList;
    };

    /**
     * [[get current module name ]]
     * @returns {[[string]]} [[returns module name]]
     */
    var getCurrentModule = function () {
        return currentModule;
    };

    /**
     * [[Change current module state]]
     * @param   {[[string]]} moduleName [[Description]]
     * @returns {boolean}  [[returns true, if current module was changed, false - if module was not found]]
     */
    var setCurrentModule = function (moduleName) {
        if (!hasModule(moduleName)) {
            console.warn('Can\'t find module ' + moduleName + ' in registered modules list!');
            return false;
        }

        currentModule = moduleName;
        return true;
    };

    /**
     * [[hasModule - check, if module registered or not]]
     * @param   {[[string]]} moduleName [[Description]]
     * @returns {[[boolean]]} [[true - if module already registered, false - if not]]
     */
    var hasModule = function (moduleName) {
        return searchModulesList.some(function (module) {
            return module === moduleName;
        })
    };

    /**
     * [[initModule - init new module in modules list]]
     * @param   {[[string]]} moduleName    [[name of new module]]
     * @param   {[[object]]} methodsObject [[object with module methods. Looks like 
     *                                     { 
     *                                      method1: function(),
     *                                      method2: function(),
     *                                      ...
     *                                     }
     }]]
     * @returns {boolean}  [[returns true if module was added, and false if not]]
     */
    var initModule = function (moduleName, methodsObject) {
        if (hasModule(moduleName)) {
            console.warn('Module ' + moduleName + ' is already exist');
            return false;
        }
        searchModulesList.push(moduleName);
        if (methodsObject.type !== moduleName)
            methodsObject.type = moduleName;
        searchModulesMethods[moduleName] = methodsObject;
        setCurrentModule(moduleName);
        return true;
    }

    /**
     * [[getMethod - returns function (method) from searchModulesMethods]]
     * @param   {[[string]]} moduleName [[name of module, for whom we find function]]
     * @param   {[[string]]} methodName [[name of method, thats we find]]
     * @returns {[[function]]} [[returns founded function from module methods list, or from default module or empty function]]
     */
    var getMethod = function (moduleName, methodName) {
        if (!hasModule(moduleName)) {
            console.warn('Can\'t find ' + moduleName + ' in search observer modules list');
            return new Function();
        }
        var found = false;
        if (searchModulesMethods[moduleName] && searchModulesMethods[moduleName].hasOwnProperty(methodName)) {
            found = true;
            return searchModulesMethods[moduleName][methodName];
        }
        if (!found) {
            console.warn('Cant find method ' + methodName + ' in ' + moduleName);
            if (currentModule === defaultModule) return new Function();
            console.warn('Try to find ' + moduleName + ' in default module (' + defaultModule + ')');
            getMethod(defaultModule, methodName);

        }
    };

    return {
        initModule: initModule,
        getMethod: getMethod,
        getCurrentModule: getCurrentModule,
        setCurrentModule: setCurrentModule,
        getModulesList: getSearchModulesList,
        hasModule: hasModule
    }


};
