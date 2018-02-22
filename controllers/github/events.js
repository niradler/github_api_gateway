const axios = require('axios')
const config = require('../../config')

const public = (etag) => {
    const options ={
        method: config.github.actions.events.public.method,
        url: config.github.base_url + config.github.actions.events.public.path
    }
    if (etag) options['If-None-Match'] = etag;
    return axios(options);
}

module.exports = {
    public
}