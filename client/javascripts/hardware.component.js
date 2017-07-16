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

    vm.getCPU = function() {
      getMachineStats();
      return [vm.time, vm.cpu]
    };

    vm.getRAM = function() {
      return [vm.time, vm.ram];
    };

    function onInit() {
      vm.cpu = 0;
      vm.ram = 0;
    }

    function getMachineStats() {
      $http.get('/api/hwvalues').then((response) => {
        vm.time = response.data.time;
        vm.cpu = response.data.cpu;
        vm.ram = response.data.ram;
      })
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
