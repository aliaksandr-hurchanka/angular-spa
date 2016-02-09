module.exports = function ($sce, $compile, $templateRequest, $q) {

    return {
        getByTrustedUrl: function (url, element, scope) {
            var deferred = $q.defer();
            var templateUrl = $sce.getTrustedResourceUrl(url);
            $templateRequest(templateUrl)
                .then(
                    function (template) {
                        $compile(element.html(template).contents())(scope);
                        deferred.resolve()
                    },
                    function () {
                        deferred.reject('Can not get template!');
                    }
                );
            return deferred.promise;
        }
    }

};
