var lifeApp = angular.module('life', []);
lifeApp.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

function lifeController($scope, $timeout) {
	var _this = this;
	_this.scope = $scope;
	_this.timeout = $timeout;

	_this.scope.rows = 50;
	_this.scope.columns = 50;
	_this.scope.iterations = 0;

	_this.minimumInterval = 50;

	_this.getNewGrid = function() {
		var lifeGrid = [];
		for(var i = 0; i < $scope.rows; i++) {
			lifeGrid[i] = new Array($scope.columns);
			for(var j = 0; j < $scope.columns; j++) {
				lifeGrid[i][j] = false;
			}
		}
		return lifeGrid;
	};
	_this.scope.lifeGrid = _this.getNewGrid();

	_this.resetGrid = function() {
		$scope.lifeGrid.forEach(function(row) {
			for(var i = 0; i < row.length; i++) {
				row[i] = false;
			}
		});
	};

	_this.getNeighborsInfo = function(x, y) {
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

	_this.getNewState = function(x, y) {
		var info = this.getNeighborsInfo(x, y);
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
		_this.toggleState(i, j);
	};

	$scope.step = function($event) {
		_this.step($event);
	};

	$scope.set = function() {
		_this.set();
	};

	$scope.reset = function() {
		_this.reset();
	};

	$scope.autoStep = function() {
		_this.autoStep();
	};

	$scope.auto = function() {
		_this.auto();
	};

	$scope.stopAuto = function() {
		_this.stopAuto();
	};

}

lifeController.prototype.toggleState = function(i, j) {
	if(i >= 0 && i < this.scope.rows && j >= 0 && j < this.scope.columns) {
		this.scope.lifeGrid[i][j] = !this.scope.lifeGrid[i][j];
	}
}

lifeController.prototype.step = function($event) {
	var newGrid = this.getNewGrid();
	for(var i = 0; i < this.scope.rows; i++) {
		for(var j = 0; j < this.scope.columns; j++) {
			newGrid[i][j] = this.getNewState(i, j);
		}
	}
	this.scope.lifeGrid = newGrid;
	this.scope.iterations++;
}

lifeController.prototype.set = function() {
	var modifiedRows = false;
	var modifiedColumns = false;
	if(this.scope.rowNumber && this.scope.rowNumber != this.scope.rows) {
		this.scope.rows = this.scope.rowNumber;
		modifiedRows = true;
	}
	if(this.scope.columnNumber && this.scope.columnNumber != this.scope.columns) {
		this.scope.columns = this.scope.columnNumber;
		modifiedColumns = true;
	}
	if(modifiedRows || modifiedColumns) {
		this.scope.lifeGrid = this.getNewGrid();
	}
	this.scope.interval = (this.scope.intervalNumber >= minimumInterval) ? this.scope.intervalNumber : 500;
	alert('Linhas: ' + this.scope.rows + '\nColunas: ' + this.scope.columns + '\nIntervalo(ms): ' + this.scope.intervalNumber);
}

lifeController.prototype.reset = function() {
	this.scope.iterations = 0;
	this.resetGrid();
}

lifeController.prototype.autoStep = function() {
	if(this.scope.intervalNumber >= this.minimumInterval) {
		this.scope.step();
		this.scope.timer = this.timeout(this.scope.autoStep, this.scope.intervalNumber);
	}
}

lifeController.prototype.auto = function() {
	var _this = this;
	if(this.scope.timer != null) {
		this.timeout.cancel(this.scope.timer);
	}
	if(this.scope.intervalNumber >= this.minimumInterval) {
		this.scope.step();
		this.scope.timer = this.timeout(function() {
			_this.scope.autoStep();
		}, this.scope.intervalNumber);
	}
}

lifeController.prototype.stopAuto = function() {
	this.timeout.cancel(this.scope.timer);
}