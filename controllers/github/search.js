const axios = require('axios')
const config = require('../../config')

const repositories = (q) => {
    return axios({
        method: config.github.actions.search.repositories.method,
        url: config.github.base_url + config.github.actions.search.repositories.path,
        params: {
            q: q,
            sort: 'stars',
            order: 'desc'
        }
    });
}
const users = (q) => {
    return axios({
        method: config.github.actions.search.users.method,
        url: config.github.base_url + config.github.actions.search.users.path,
        params: {
            q: q
        }
    });
}

module.exports = {
    repositories,
    users
}