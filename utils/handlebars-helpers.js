const truncate = (text, length) => {
    if (text.length <= length) {
        return text;
    }
    return text.substr(0, length).concat("...");
};

const ifeq = (a, b, options) => {
    if (typeof b === 'object') {
        return b.indexOf(a) >= 0 ? options.fn(this) : options.inverse(this);
    }
    return a === b ? options.fn(this) : options.inverse(this);
}

/* Exports */
module.exports = {
    truncate: truncate,
    isIndexPage: (url, options) => ifeq(url, '/', options),
    isLogInPage: (url, options) => ifeq(url, '/login', options),
    isSignUpPage: (url, options) => ifeq(url, '/signup', options),
    isTasksPage: (url, options) => ifeq(url, '/tasks', options)
};
