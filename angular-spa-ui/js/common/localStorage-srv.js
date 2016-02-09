module.exports = function () {

    return {
        getItem: function (item) {
            var result = JSON.parse(localStorage.getItem(item));

            return result;
        },
        setItem: function (value, item) {
            localStorage.setItem(value, JSON.stringify(item));
        }
    }

};
