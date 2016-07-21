module.exports = {

    validateEmail: function(email) {
        var valid = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

        if (!valid.test(email)) {
            return false;
        }

        if (valid.test(email)) {
            return true;
        }
    }

}