function buscarIssues() {
	// url do repositorio--> https://api.github.com/repos/freedomsponsors/www.freedomsponsors.org/issues

	function GithubRepo(userName, repoName) {
		this.userName = userName;
		this.repoName = repoName;
		this.issues = [];
	};

	GithubRepo.prototype.buscarIssuesEPopularTabela = function(tableId) {
		// definir o this para poder acessar dentro de popularTabela()
		var _this = this;

		function popularTabela() {
			function criaLinha(issue) {
				var linha = '<tr>'; 
				linha += '<td>' + issue.number + '</td>';
				linha += '<td>' + issue.title + '</td>';
				linha += '</tr>';
				var $linha = $(linha);
				tabela.append($linha);
			}

			var url = 'https://api.github.com/repos/freedomsponsors/' + _this.repoName + '/issues';
			// AJAX para buscar as issues
			$.get(url).success(function(result) {
				if(typeof result == 'string') {
					result = JSON.parse(result);
				}
				_this.issues = result;
				console.table(_this.issues);
				$(_this.issues).each(function(i, issue) {
					criaLinha(issue);
				});
			});
		};

		if(_this.userName == '' || _this.repoName == '') {
			alert('Inserir nome de usuario e do repositorio');
			return;
		}

		var tabela = $(tableId);
		if(tabela) {
			popularTabela();
		}
	};

	var $userName = $('#user').val();
	var $repoName = $('#repo-name').val();
	var repo = new GithubRepo($userName, $repoName);
	repo.buscarIssuesEPopularTabela("#issues-table");
}