const express = require('express')
const app = express()
const cors = require('cors')
const fs = require('fs')
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
        res.set({
            'etag': events_res.headers.etag,
          })
        return res.json({old_etag:etag,etag:events_res.headers.etag,events:events_res.data});
    } catch (error) {
        console.log(error)
        try { // send mock
            const events_res = await restore_from_local('none')
            return res.status(202).json({old_etag:req.query.etag,etag:req.query.etag,events:events_res});
        } catch (error) {
            console.log(error) 
        }
        return res
            .status(500)
            .json({msg: error.message});
    }

})

const restore_from_local = (etag) => {
    return new Promise((resolve, reject) => {
        try {
            fs
            .readFile(`./data/${etag}.json`, 'utf8', function (err, data) {
                if (err) 
                    reject(err)
                    else
                resolve(JSON.parse(data))
            });  
        } catch (error) {
            reject(error) 
        }

    })
}

const save_local = (etag, data) => {
    return new Promise((resolve, reject) => {
        try {
            fs
            .writeFile(`./data/${etag}.json`, JSON.stringify(data), function (err) {
                if (err) {
                    console.log(err);
                    reject(err)
                }
                console.log("The file was saved!");
                resolve("The file was saved!")
            }); 
        } catch (error) {
            reject(error)
        }

    })
}

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Example app listening on port ' + port))