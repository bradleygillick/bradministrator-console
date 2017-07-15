const express = require('express')
const router = express.Router()
const knex = require('../db')
var os = require('os');
var cpuStat = require('cpu-stat');
var cpuPercent = 0.0;

router.get('/', (req, res, next) => {
  console.log('right here');
  child_process.execFile('../shellscripts/hello.sh')
  knex('hw_values')
    .then(hw_values => res.json(hw_values))
    .catch(err => next(err))
})

router.post('/', (req, res, next) => {
  console.log('req.body is', req.body);
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

// var myInt = setInterval(function () {
//   getAndSaveValuesToDB();
// }, 5000);

// function getAndSaveValuesToDB() {
//   var today = new Date();
//   var dd = today.getDate();
//   var mm = today.getMonth() + 1; //January is <0!></0!>
//   var yyyy = today.getFullYear();
//   if (dd < 10) {
//     dd = '0' + dd;
//   }
//   if (mm < 10) {
//     mm = '0' + mm;
//   }
//   // var insert_date = dd+'/'+mm+'/'+yyyy;
//   var insert_date = yyyy + '-' + mm + '-' + dd;

//   let values_to_insert = {
//     name: "cpu_usage",
//     value: cpuStat.usagePercent(),
//     date: insert_date,
//   }
//   console.log('values to insert = ', values_to_insert);

//   knex('hw_values')
//     .insert(values_to_insert)
//     .then(console.log("inserted"))
//     .done()
// }