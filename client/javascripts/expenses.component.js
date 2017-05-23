(function() {
  'use strict'

  angular.module('app')
    .component('expenses', {
      controller: controller,
      template: `
        <h3>Expenses</h3>
        <form ng-submit="$ctrl.addExpense()">
          <div class="row">
            <p class="form-group col-md-3">
              <label for="new-expDate">Expense Date</label>
              <input type="date" id="new-expDate" class="form-control" ng-model="$ctrl.expense.expDate" >
            </p>
            <p class="form-group col-md-3">
              <label for="category">Business Name</label>
              <input type="text" id="new-bizName" class="form-control" ng-model="$ctrl.expense.bizName">
            </p>
            <p class="form-group col-md-3">
              <label for="new-amount">Amount</label>
              <input type="number" id="new-amount"  step=".01" class="form-control" ng-model="$ctrl.expense.amount">
            </p>
            <p class="form-group col-md-3">
              <label for="new-category">Category</label>
              <input type="text" id="new-category" class="form-control" ng-model="$ctrl.expense.category">
            </p>
          </div>
          <button type="submit" class="btn btn-primary">Add Expense</button>
        </form>
        <table class="table table-condensed">
          <thead>
            <th>Item No</th>
            <th>Date</th>
            <th>Business Name</th>
            <th>Amount</th>
            <th>Category</th>
          </thead>
          <tbody>
            <tr ng-repeat="expense in $ctrl.expenses | orderBy: 'category' ">
              <td>{{ $index + 1 }}</td>
              <td>{{ expense.expDate | amDateFormat:'L'}}
              <td>{{ expense.bizName }}
              <td>{{ expense.amount | number:2 }}</td>
              <td>{{ expense.category }}</td>
              <td>
                <a href="#" ng-click="$ctrl.editExpense($event, expense)">edit</a>
                <a href="#" ng-click="$ctrl.deleteExpense($event, expense)">delete</a>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td></td>
              <td>Total</td>
              <td>{{ $ctrl.expenses | sumByColumn: 'amount' }}</td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <form ng-submit="$ctrl.updateExpense()" ng-if="$ctrl.editingExpense">
          <p>
            Date: <input id="edit-expDate" ng-model="$ctrl.editingExpense.expDate">
          </p>
          <p>
            Business Name: <input type="text" id="edit-bizName" ng-model="$ctrl.editingExpense.bizName">
          </p>
          <p>
            Amount: <input  id="edit-amount" ng-model="$ctrl.editingExpense.amount">
          </p>
          <p>
            Category: <input type="text" id="edit-category" ng-model="$ctrl.editingExpense.category">
          </p>
          <p>
            <button type="submit" class="btn btn-info btn-sm">Update Expense</button>
          </p>
        </form>
      `
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
      .get('/api/expenses')
      .then((response) => {
        vm.expenses = response.data
      })
    }

    function addExpense() {
      if(vm.expense.expDate && vm.expense.bizName && vm.expense.amount && vm.expense.category) {
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
        const originalExpense =vm.expenses.find(e => e.id == expense.id)
        Object.assign(originalExpense, expense)
        delete vm.editingExpense
      })
    }

    function deleteExpense(e, expense) {
      if($window.confirm('Are you sure?')) {
        e.preventDefault()
        $http
        .delete(`/api/expenses/${expense.id}`)
        .then(() => {
          vm.expenses.splice(vm.expenses.indexOf(expense), 1)
      })
      }
    }

    function editExpense (e, expense) {
      e.preventDefault()
      vm.editingExpense = angular.copy(expense)
      vm.editingExpense.expDate = moment(vm.editingExpense.expDate).format("L");
    }
  }

}());