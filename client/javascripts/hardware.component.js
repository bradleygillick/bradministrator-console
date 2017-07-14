(function () {
  'use strict'

  angular.module('app')
    .component('hardware', {
      templateUrl: '/javascripts/hwr.html',
      controller: controller,
    })
    .filter('sumByColumn', function () {
      return function (collection, column) {
        var total = 0;
        
        if (collection) {
          collection.forEach(function (item) {
            total += parseFloat(item[column]);
          });
        }

        return total.toFixed(2);
      };

    })

  controller.$inject = ['$http', '$window', 'moment']

  function controller($http, $window) {
    const vm = this

    vm.$onInit = onInit
    vm.addExpense = addExpense
    vm.deleteExpense = deleteExpense
    vm.editExpense = editExpense
    vm.updateExpense = updateExpense

    function onInit() {
      $http
        .get('/api/hwvalues')
        .then((response) => {
          vm.expenses = response.data
        })
    }

    function addExpense() {
      if (vm.expense.expDate && vm.expense.bizName && vm.expense.amount && vm.expense.category) {
        $http
          .post('/api/expenses', vm.expense)
          .then((response) => {
            vm.expenses.push(response.data)
            delete vm.expense
          })
      }
    }

    function updateExpense() {
      $http
        .patch(`/api/expenses/${vm.editingExpense.id}`, vm.editingExpense)
        .then((response) => {
          const expense = response.data
          const originalExpense = vm.expenses.find(e => e.id == expense.id)
          Object.assign(originalExpense, expense)
          delete vm.editingExpense
        })
    }

    function deleteExpense(e, expense) {
      if ($window.confirm('Are you sure?')) {
        e.preventDefault()
        $http
          .delete(`/api/expenses/${expense.id}`)
          .then(() => {
            vm.expenses.splice(vm.expenses.indexOf(expense), 1)
          })
      }
    }

    function editExpense(e, expense) {
      e.preventDefault()
      vm.editingExpense = angular.copy(expense)
      vm.editingExpense.expDate = moment(vm.editingExpense.expDate).format("L");
    }
  }

}());
