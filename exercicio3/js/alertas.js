var alertModule = angular.module('alertas', []);

alertModule.factory('AlertasFactory', ['$timeout', function($timeout){
	
	// objeto que guarda os estados do serviço
	var alertas = {
		shouldShowAlert: false,
		alertMessage: "",
		shouldShowError: false,
		errorTitle: "",
		errorMessage: "",
		isTimeoutError: false,
		alertTimeout: 1000
	};

	function resetAlert(alertas) {
		alertas.shouldShowAlert = false;
		alertas.alertTimeout = 1000;
	}

	function resetError(alertas) {
		alertas.shouldShowError = false;
		alertas.errorTimeout = null;
		alertas.isTimeoutError = false;
	}

	function executeTimeout(alertas, timeout, resetCallback) {
		$timeout(function(){
			resetCallback(alertas);
		}, timeout);
	}

	alertas.showAlert = function(msg, options) {
		if(options) {
			// é um numero maior que zero!
			if(options.timeout && !isNaN(Number(options.timeout)) && options.timeout > 0) {
				this.alertTimeout =  options.timeout;
			}
		}
		this.alertMessage = msg;
		this.shouldShowAlert = true;
		
		executeTimeout(this, this.alertTimeout, resetAlert);
	};

	alertas.showErrorPopup = function(title, content, options) {
		if(options) {
			if(options.timeout && !isNaN(Number(options.timeout)) && options.timeout > 0) {
				this.errorTimeout =  options.timeout;
			}
		}
		this.errorTitle = title;
		this.errorMessage = content;
		this.shouldShowError = true;
		// caso seja para aparecer temporariamente o erro (???)
		if(this.errorTimeout) {
			// seta esta propriedade para esconder o botao de close e o OK
			this.isTimeoutError = true;
			executeTimeout(this, this.errorTimeout, resetError);
		}
	}

	alertas.closeErrorPopup = function() {
		this.errorTitle = '';
		this.errorMessage = '';
		this.shouldShowError = false;
	}

	return alertas;
}]);

alertModule.directive('alertas', ['AlertasFactory', function(AlertasFactory) {
	return {
		restrict: 'E',
		scope: {},
		controller: ['$scope','AlertasFactory', function($scope, AlertasFactory) {
			// objeto do serviço
			$scope.model = AlertasFactory;

			$scope.closeErrorPopup = function() {
				AlertasFactory.closeErrorPopup();
			}
		}],
		templateUrl: 'js/alertas.html'
	}
}]);