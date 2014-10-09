function buscarIssues() {
	// url do repositorio--> https://api.github.com/repos/freedomsponsors/www.freedomsponsors.org/issues

	function GithubRepo(userName, repoName) {
		var _userName = userName;
		var _repoName = repoName;
		var _issues = [];

		function buscarIssuesEPopularTabela(tableId) {
			function popularTabela() {
				function criaLinha(issue) {
					var linha = '<tr>'; 
					linha += '<td>' + issue.number + '</td>';
					linha += '<td>' + issue.title + '</td>';
					linha += '</tr>';
					var $linha = $(linha);
					tabela.append($linha);
				}

				var url = 'https://api.github.com/repos/freedomsponsors/' + _repoName + '/issues';
				// AJAX para buscar as issues
				$.get(url).success(function(result) {
					if(typeof result == 'string') {
						result = JSON.parse(result);
					}
					_issues = result;
					console.table(_issues);
					$(_issues).each(function(i, issue) {
						criaLinha(issue);
					});
				});
			};

			if(_userName == '' || _repoName == '') {
				alert('Inserir nome de usuario e do repositorio');
				return;
			}

			var tabela = $(tableId);
			if(tabela) {
				popularTabela();
			}
		};

		return {'buscarIssuesEPopularTabela': buscarIssuesEPopularTabela};
	};

	var $userName = $('#user').val();
	var $repoName = $('#repo-name').val();
	var repo = new GithubRepo($userName, $repoName);
	repo.buscarIssuesEPopularTabela("#issues-table");
}