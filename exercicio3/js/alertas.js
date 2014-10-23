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

	function executeTimeout(alertas, type) {
		var timeout;
		if(type == 'alert') {
			timeout = alertas.alertTimeout;
		}
		else if(type == 'popupError') {
			timeout = alertas.errorTimeout;
		}
		$timeout(function(){
			if(type == 'alert') {
				alertas.shouldShowAlert = false;
				alertas.alertTimeout = 1000;
			}
			else if(type == 'popupError') {
				alertas.shouldShowError = false;
				alertas.errorTimeout = null;
				alertas.isTimeoutError = false;
			}
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
		
		executeTimeout(this, 'alert')
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
			executeTimeout(this, 'popupError')
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