const express = require('express')
const app = express()
const cors = require('cors')
const search = require('./controllers/github/search')
const events = require('./controllers/github/events')

app.use(cors())

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
        const etag = req.query.etag || "";
        const events_res = await events.public(etag)
        return res.json({etag:events_res.headers.etag,events:events_res.data});
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({msg: error.message});
    }

})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Example app listening on port ' + port))