import database from "./data.js";

const carregarAvaliacao = (idEmpreendimento, idCategoria) => {
  const dadosAvaliacao = database.getEntidade("avaliacao");
  return dadosAvaliacao?.filter(
    ({ categorias_analise_id, empreendimento_id }) =>
      categorias_analise_id === idCategoria &&
      empreendimento_id === idEmpreendimento
  );
};

const calcularAvaliacao = (idEmpreendimento, idCategoria) => {
  const avaliacao = carregarAvaliacao(idEmpreendimento, idCategoria);

  const avaliacaoNivelB = avaliacao.filter(
    ({ resultado_char }) => resultado_char === "B"
  );

  const somaPontos = avaliacao.reduce((acc, cur) => {
    return cur.resultado_numerico ? acc + cur.resultado_numerico : acc;
  }, 0);

  const hitNivelB = avaliacaoNivelB.length === 4;
  const hitNivelBP = hitNivelB && somaPontos >= 1;
  const hitNivelMP = hitNivelB && somaPontos >= 3;

  return {
    nivelB: hitNivelB ? "Atingido" : "Não atingido",
    nivelBP: hitNivelBP ? "Atingido" : "Não atingido",
    nivelMP: hitNivelMP ? "Atingido" : "Não atingido",
  };
};

const registrarAvaliacao = (idEmpreendimento, idCategoria, avaliacoes) => {
  const dadosAvaliacao = database.getEntidade("avaliacao");
  const dadosCriterios = database.getEntidade("criterios");
  let registrosCount = dadosAvaliacao.length + 1;

  const arrAvaliacao = dadosAvaliacao.filter(
    ({ empreendimento_id, categorias_analise_id }) =>
      empreendimento_id !== idEmpreendimento ||
      categorias_analise_id !== idCategoria
  );

  const novasAvaliacoes = avaliacoes.map((idCriterio) => {
    let registro = {
      id: registrosCount,
      empreendimento_id: idEmpreendimento,
      categorias_analise_id: idCategoria,
      criterio_id: idCriterio,
      resultado_numerico: null,
      resultado_char: null,
    };

    const valorCriterio = dadosCriterios.find(({ id }) => id === idCriterio);

    if (valorCriterio.nivel) {
      registro.resultado_char = valorCriterio.nivel;
    } else {
      registro.resultado_numerico = valorCriterio.pontos;
    }

    registrosCount++;

    return registro;
  });

  arrAvaliacao.push(...novasAvaliacoes);

  database.salvarAlteracoesEntidade("avaliacao", arrAvaliacao);
};

export default {
  registrarAvaliacao,
  carregarAvaliacao,
  calcularAvaliacao,
};
