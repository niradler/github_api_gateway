const express = require('express')
const app = express()
const search = require('./controllers/github/search')
const events = require('./controllers/github/events')
let etag = null;

//serach github by user and by repositories
app.get('/github/search', async(req, res) => {
    const q = req.query.q;
    try {
        const repos_res = await search.repositories(q)
        const users_res = await search.users(q)
        return res.json({users: users_res.data, repositories: repos_res.data});
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({msg: error.message});
    }

})

//get events from github public api
app.get('/github/events', async(req, res) => {
    try {
        const events_res = await events.public(etag)
        etag = events_res.headers.etag // use the HTTP caching review
        return res.json(events_res.data);
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({msg: error.message});
    }

})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Example app listening on port ' + port))