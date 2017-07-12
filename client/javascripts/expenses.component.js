(function () {
  'use strict'

  angular.module('app')
    .component('expenses', {
      controller: controller,
      template: `
         <form>
          <input type="radio" name="current-page" value="male" checked> Resources
          <input type="radio" name="current-page" value="female"> Tasks
        </form>
        <h3>Hardware Resources</h3>
        <div class="row">
          <div class="col-md-4">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h3 class="panel-title">CPU</h3>
              </div>
              <div class="panel-body">
                Panel content
              </div>
            </div>
          </div>
        </div>
        <div className="row"></div>
        <form name="expenseForm" ng-submit="$ctrl.addExpense(expenseForm.$valid)" novalidate>
          <div class="row">
            <p class="form-group col-md-3" ng-class="{ 'has-error' : expenseForm.new-expDate.$invalid && !expenseForm.new-expDate.$pristine ,'has-success' : expenseForm.new-expDate.$valid }">
              <label for="new-expDate">Expense Date</label>
              <input type="date" id="new-expDate" name="new-expDate" class="form-control" ng-required="true" ng-model="$ctrl.expense.expDate" >
              <p ng-show="expenseForm.new-expDate.$error.required" class="help-block">Date is required.</p>
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
        <div class="expense-table">
          <p>Sort by
          <select ng-model="$ctrl.propertyToOrderBy" ng-init="$ctrl.propertyToOrderBy='expDate'">
            <option value="expDate">Date</option>
            <option value="bizName">Business Name</option>
            <option value="1*amount">Amount</option>
            <option value="category">Category</option>
          </select>
          </p>
        </div>
        <table class="table table-condensed">
          <thead>
            <th>Item No</th>
            <th>Date</th>
            <th>Business Name</th>
            <th>Amount</th>
            <th>Category</th>
          </thead>
          <tbody>
            <tr ng-repeat="expense in $ctrl.expenses | orderBy: $ctrl.propertyToOrderBy">
              <td>{{ $index + 1 }}</td>
              <td>{{ expense.date | amDateFormat:'L'}}</td>
              <td>{{ expense.name }}</td>
              <td>{{ expense.value }} bytes</td>
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