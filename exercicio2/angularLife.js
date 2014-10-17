var lifeApp = angular.module('life', []);
lifeApp.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

function lifeController($scope, $timeout) {
	$scope.rows = 50;
	$scope.columns = 50;
	$scope.iterations = 0;

	function getNewGrid() {
		var lifeGrid = [];
		for(var i = 0; i < $scope.rows; i++) {
			lifeGrid[i] = new Array($scope.columns);
			for(var j = 0; j < $scope.columns; j++) {
				lifeGrid[i][j] = false;
			}
		}
		return lifeGrid;
	};
	$scope.lifeGrid = getNewGrid();

	function resetGrid() {
		$scope.lifeGrid.forEach(function(row) {
			for(var i = 0; i < row.length; i++) {
				row[i] = false;
			}
		});
	};

	function getNeighborsInfo(x, y) {
		var neighbors = [];
		var neighborsInfo = {'alive' : 0, 'dead' : 0};
		for(var i = x - 1; i < x + 2; i++) {
			for(var j = y - 1; j < y + 2; j++) {
				// nao deve ultrapassar o grid, nem contar a propria celula
				if((i != x || j != y) && i >= 0 && i < $scope.rows && j >= 0 && j < $scope.columns) {
					if($scope.lifeGrid[i][j]) {
						neighborsInfo.alive++;
					}
					else {
						neighborsInfo.dead++;
					}
				}
			}
		}
		return neighborsInfo;
	};

	function getNewState(x, y) {
		var info = getNeighborsInfo(x, y);
		// qualquer celula viva com menos de dois ou mais de três vizinho vivos, morre
		if($scope.lifeGrid[x][y] && (info.alive < 2 || info.alive > 3) ) {
			return false;
		}
		// qualquer celula viva com dois ou tres vizinho permanece viva
		// qualquer celula morta com 3 vizinho se torna viva
		else if($scope.lifeGrid[x][y] || (!$scope.lifeGrid[x][y] && info.alive == 3)) {
			return true;
		}
		// mantém o mesmo estado
		return $scope.lifeGrid[x][y];
	}

	$scope.toggleState = function(i, j) {
		if(i >= 0 && i < $scope.rows && j >= 0 && j < $scope.columns) {
			$scope.lifeGrid[i][j] = !$scope.lifeGrid[i][j];
		}
	};

	$scope.step = function($event) {
		var newGrid = getNewGrid();
		for(var i = 0; i < $scope.rows; i++) {
			for(var j = 0; j < $scope.columns; j++) {
				newGrid[i][j] = getNewState(i, j);
			}
		}
		$scope.lifeGrid = newGrid;
		$scope.iterations++;
	};


	$scope.set = function() {
		var modifiedRows = false;
		var modifiedColumns = false;
		if($scope.rowNumber && $scope.rowNumber != $scope.rows) {
			$scope.rows = $scope.rowNumber;
			modifiedRows = true;
		}
		if($scope.columnNumber && $scope.columnNumber != $scope.columns) {
			$scope.columns = $scope.columnNumber;
			modifiedColumns = true;
		}
		if(modifiedRows || modifiedColumns) {
			$scope.lifeGrid = getNewGrid();
		}
		$scope.interval = ($scope.intervalNumber >= 500) ? $scope.intervalNumber : 500;
		alert('Linhas: ' + $scope.rows + '\nColunas: ' + $scope.columns + '\nIntervalo(ms): ' + $scope.interval);
	};

	$scope.reset = function() {
		$scope.iterations = 0;
		resetGrid();
	};

	$scope.autoStep = function() {
		if($scope.interval >= 500) {
			$scope.step();
			$scope.timer = $timeout($scope.autoStep, $scope.interval);
		}
	};

	$scope.auto = function() {
		if($scope.timer != null) {
			$timeout.cancel($scope.timer);
		}
		if($scope.interval >= 500) {
			$scope.step();
			$scope.timer = $timeout(function() {
				$scope.autoStep();
			}, $scope.interval);
		}
	};

	$scope.stopAuto = function() {
		$timeout.cancel($scope.timer);
	};

}