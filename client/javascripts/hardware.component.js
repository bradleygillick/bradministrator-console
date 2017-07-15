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
    vm.addValue = addValue
    vm.deleteValue = deleteValue
    vm.editValue = editValue
    vm.updateValue = updateValue
    var x = 15001596853140;

    var y = 4.200681554712058

    vm.foo = function() {
      // return [2, 7];
      let t = new Date().getTime();
      let n = Math.random() * 30;
      let j = [t, n];
      console.log('j is ', j);
      // return j;
      x++;
      y++;
      return j;
    };

    vm.goo = function() {
      return [new Date().getTime(), Math.random() * 30.0];
    };

    function onInit() {
      $http
        .get('/api/hwvalues')
        .then((response) => {
          vm.values = response.data
          console.log('vm.values is :', vm.values);
        })
    }

    function getCPUChartValues() {
      var x1;
        $http
          .get('/api/hwvalues')
          .then((response) => {
            x1 = response.data;
          })
        return [new Date().getTime(), x1]
      }

    function addValue() {
      if (vm.value.expDate && vm.value.bizName && vm.value.amount && vm.value.category) {
        $http
          .post('/api/values', vm.value)
          .then((response) => {
            vm.values.push(response.data)
            delete vm.value
          })
      }
    }

    function updateValue() {
      $http
        .patch(`/api/values/${vm.editingValue.id}`, vm.editingValue)
        .then((response) => {
          const value = response.data
          const originalValue = vm.values.find(e => e.id == value.id)
          Object.assign(originalValue, value)
          delete vm.editingValue
        })
    }

    function deleteValue(e, value) {
      if ($window.confirm('Are you sure?')) {
        e.preventDefault()
        $http
          .delete(`/api/values/${value.id}`)
          .then(() => {
            vm.values.splice(vm.values.indexOf(value), 1)
          })
      }
    }

    function editValue(e, value) {
      e.preventDefault()
      vm.editingValue = angular.copy(value)
      vm.editingValue.expDate = moment(vm.editingValue.expDate).format("L");
    }
  }

}());
