module.exports = function ($q, $http) {

    return {
        getAsyncData: function (method, url, param) {
            var params = param || {};
            var deferred = $q.defer();
            var request = {
                method: method,
                url: url
            };

            if (method === 'POST')
                request.data = params;

            $http(request)
                .success(
                    function (data) {
                        data.url = url;
                        deferred.resolve(data);
                    }
                )
                .error(
                    function (data, status) {
                        deferred.reject({
                            data: data,
                            status: status
                        });
                    }
                );

            return deferred.promise;
        },
        getAll: function (method, urlList) {
            var promiseList = [];
            var deferred = $q.defer();

            _.each(urlList, function (urlItem) {
                promiseList.push(this.getAsyncData(method, urlItem));
            }, this);

            $q.all(promiseList)
                .then(
                    function (values) {
                        deferred.resolve(values)
                    },
                    function (values) {
                        deferred.reject(values);
                    }
                );

            return deferred.promise;
        }
    };

};
