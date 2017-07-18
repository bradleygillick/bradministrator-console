const express = require('express')
const router = express.Router()
const knex = require('../db')
var os = require('os');
var cpuStat = require('cpu-stat');

router.get('/size', (req, res, next) => {
  require('child_process').exec("df -h ~ | grep -vE '^Filesystem|shm|boot' |  awk '{ print +$2 }'", function(err, resp) {
    res.json(resp);
  });
})

router.get('/used', (req, res, next) => {
  require('child_process').exec("df -h ~ | grep -vE '^Filesystem|shm|boot' |  awk '{ print +$3 }'", function(err, resp) {
    res.json(resp);
  });
})

router.get('/', (req, res, next) => {
  let new_reading = {
    time: new Date().getTime(),
    cpu: '',
    ram: (((os.totalmem() - os.freemem()) / os.totalmem()) * 100 - 30),
    network: (os.networkInterfaces().en0[1]),
    hostname: os.hostname(),
    model: os.cpus()[0].model,
    speed: os.cpus()[0].speed,
    arch: os.arch(),
    platform: os.platform(),
    release: os.release(),
    type: os.type(),
    uptime: os.uptime()
  }


  cpuStat.usagePercent(function (err, percent, seconds) {
    if (err) {
      return console.log(err);
    }

    new_reading.cpu = percent;
    res.json(new_reading);
  })
})

router.post('/', (req, res, next) => {
  knex('hw_values')
    .insert({
      name: req.body.name,
      value: req.body.value,
      date: req.body.date
    })
    .returning('*')
    .then(hw_values => res.json(hw_values[0]))
    .catch(err => next(err))
})

router.patch('/:id', (req, res, next) => {
  knex('hw_values')
    .update({
      name: req.body.name,
      value: req.body.value,
      date: req.body.date
    })
    .where({
      id: req.params.id
    })
    .returning('*')
    .then(hw_values => res.json(hw_values[0]))
    .catch(err => next(err))
})

router.delete('/:id', (req, res, next) => {
  knex('hw_values')
    .del()
    .where({
      id: req.params.id
    })
    .then(hw_values => res.end())
    .catch(err => next(err))
})


module.exports = router