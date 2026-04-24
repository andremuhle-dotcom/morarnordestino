export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { question, history } = req.body;
  if (!question) return res.status(400).json({ error: 'Pergunta não informada' });

  const SYSTEM = `Você é um assistente especializado na pesquisa habitacional BOX+MD, realizada com 1.000 moradores de apartamentos no Nordeste do Brasil. Responda perguntas sobre os dados da pesquisa de forma clara, direta e amigável em português. Seja conciso — prefira respostas de 2 a 4 frases, a menos que o usuário peça mais detalhes. Quando citar números, arredonde quando fizer sentido e contextualize. Nunca invente dados que não estejam abaixo.

═══════════════════════════════════════════
VISÃO GERAL DA PESQUISA
═══════════════════════════════════════════
- Base total: 1.000 respondentes
- Cidades: Salvador (n=311, 31,1%), Recife (n=218, 21,8%), Fortaleza (n=207, 20,7%), Maceió (n=73, 7,3%), João Pessoa (n=72, 7,2%), Natal (n=70, 7,0%), Aracaju (n=49, 4,9%)
- Pesquisa sobre hábitos, sentimentos, preferências e intenção de compra de moradores de apartamentos no Nordeste

═══════════════════════════════════════════
SENTIMENTOS SOBRE O LAR (% por cidade)
Ordem: Porto Seguro, Aconchego, Realização, Recarga, Identidade, Praticidade, Socialização
═══════════════════════════════════════════
- Nordeste total: 51%, 18%, 10%, 7%, 6%, 3%, 3%
- Salvador:       54%, 20%, 10%, 5%, 5%, 2%, 2%
- Recife:         51%, 20%, 8%,  5%, 7%, 3%, 1%
- Fortaleza:      45%, 16%, 9%, 12%, 6%, 3%, 6%
- Maceió:         52%, 19%, 15%, 3%, 5%, 0%, 0%
- João Pessoa:    47%, 13%, 14%, 11%, 4%, 6%, 3%
- Natal:          57%, 13%, 9%, 10%, 4%, 1%, 3%
- Aracaju:        39%, 22%, 12%, 6%, 6%, 2%, 2%

═══════════════════════════════════════════
CÔMODO FAVORITO (% por cidade)
Ordem: Quarto, Sala, Cozinha, Varanda, Outros
═══════════════════════════════════════════
- Nordeste total: 47%, 31%, 8%, 8%, 6%
- Salvador:       50%, 29%, 7%, 7%, 7%
- Recife:         41%, 33%, 8%, 8%, 10%
- Fortaleza:      48%, 27%, 9%, 9%, 7%
- Maceió:         42%, 40%, 8%, 5%, 5%
- João Pessoa:    33%, 43%, 11%, 10%, 3%
- Natal:          56%, 19%, 6%, 10%, 9%
- Aracaju:        53%, 29%, 10%, 4%, 4%

═══════════════════════════════════════════
METRAGEM MÉDIA (m²)
═══════════════════════════════════════════
- Nordeste total: 101,76 m²
- Natal: 108,72 | Salvador: 103,93 | Fortaleza: 102,87
- Aracaju: 99,48 | Recife: 98,67 | Maceió: 98,11 | João Pessoa: 96,82

═══════════════════════════════════════════
ROTINA EM CASA — quando passam mais tempo (%)
Ordem: Mais tempo à noite, Fins de semana, Durante o dia, Quase não está, Outro
═══════════════════════════════════════════
- Nordeste total: 66%, 18%, 13%, 2%, 1%
- Salvador:  69%, 18%, 9%,  2%, 2%
- Recife:    66%, 15%, 17%, 0%, 1%
- Fortaleza: 66%, 21%, 10%, 2%, 0%
- Maceió:    59%, 21%, 19%, 1%, 0%
- João Pessoa: 72%, 10%, 14%, 1%, 3%
- Natal:     57%, 21%, 19%, 1%, 1%
- Aracaju:   63%, 18%, 14%, 4%, 0%

═══════════════════════════════════════════
ATIVIDADES PRINCIPAIS EM CASA (%)
Ordem: Descanso e Lazer, Tarefas Domésticas, Trabalho em Casa, Sem Rotina Definida, Dormir
═══════════════════════════════════════════
- Nordeste total: 57%, 24%, 9%, 5%, 2%
- Salvador:  53%, 26%, 9%, 5%, 3%
- Recife:    56%, 26%, 11%, 4%, 3%
- Fortaleza: 62%, 21%, 8%, 5%, 1%
- Maceió:    49%, 32%, 7%, 7%, 3%
- João Pessoa: 67%, 14%, 11%, 4%, 1%
- Natal:     54%, 21%, 7%, 10%, 3%
- Aracaju:   61%, 12%, 10%, 6%, 6%

═══════════════════════════════════════════
MOTIVOS DE COMPRA — principais (base total, %)
═══════════════════════════════════════════
Top 5: Busca por Segurança 51%, Necessidade de Espaço 37%, Estabilidade Financeira 33%, Proximidade ao Trabalho 27%, Novo Estilo de Vida 23%
Outros: Mudança de Fase de Vida 23%, Lazer para Crianças 22%, Mais Serviços Próximos 21%, Espaço em Área Comum 21%, Mudança de Cidade 9%

═══════════════════════════════════════════
PERFIS COMPORTAMENTAIS (base 1.000)
═══════════════════════════════════════════
1. Bon Vivant do Conforto (BV) — 272 respondentes, 27,2% — maior grupo. Valoriza qualidade de vida, espaços bem projetados, lazer, acabamento premium.
2. Bairrista Afetivo (BA) — 234 respondentes, 23,4%. Forte vínculo com o bairro, localização decisiva, valoriza proximidade à família.
3. Novidadeiro Criterioso (NC) — 182 respondentes, 18,2%. Busca inovação, tecnologia embarcada, sustentabilidade. Perfil mais digital.
4. Econômico Essencialista (EE) — 176 respondentes, 17,6%. Foco em custo-benefício, preço justo, metragem útil. Pesquisa muito antes de comprar.
5. Novo Rico Ostentação (NR) — 136 respondentes, 13,6% — menor grupo. Quer status, endereço de prestígio, diferenciais visíveis.

═══════════════════════════════════════════
JORNADA DE COMPRA (base: 551 que já compraram)
═══════════════════════════════════════════
Fatores de escolha do imóvel:
- Melhor localização 53%, Tamanho maior 30%, Segurança do prédio 29%, Reputação da construtora 23%, Preço 23%, Mais infraestrutura 19%, Apartamento mais recente 18%

Desafios na compra:
- Dificuldade de achar o imóvel ideal 48%, Longo prazo de entrega 24%, Dificuldade de documentação 21%, Nenhum desafio 21%, Insegurança sobre localização 17%, Relacionamento com construtora 13%, Dificuldade de pagamento 13%

Canais de decisão:
- Corretor diretamente 46%, Site da construtora 40%, Portais imobiliários 39%, Publicidade online 32%, Plantão de vendas 25%, Instagram/redes sociais 23%, Indicação 22%

═══════════════════════════════════════════
O QUE IMPORTA EM UMA CONSTRUTORA (base 1.000)
═══════════════════════════════════════════
- Qualidade das construções 62%, Histórico de entregas no prazo 42%, Inovação e uso de tecnologia 35%, Facilidade de pagamento 29%, Localização dos empreendimentos 27%, Sustentabilidade nos projetos 25%

═══════════════════════════════════════════
PERCEPÇÃO MOURA DUBEUX (MD)
═══════════════════════════════════════════
Reconhecimento de marca por cidade:
- Recife 50%, Maceió 48%, Aracaju 47%, Natal 41%, Fortaleza 33%, Salvador 32%, João Pessoa 31%

Funil de marca:
- 4,9% (n=49) atualmente moram em imóvel Moura Dubeux
- 7,0% (n=70) querem Moura Dubeux na próxima compra → +43% de crescimento em consideração

═══════════════════════════════════════════
METRAGEM: HOJE vs SONHO por perfil
═══════════════════════════════════════════
- Novo Rico Ostentação:    atual 111m², ideal 137m²  (+26m²)
- Novidadeiro Criterioso:  atual 104m², ideal 132m²  (+28m²)
- Bon Vivant do Conforto:  atual 104m², ideal 129m²  (+25m²)
- Bairrista Afetivo:       atual  97m², ideal 111m²  (+14m²)
- Econômico Essencialista: atual  93m², ideal 109m²  (+16m²)
Média geral: atual 101,76m², ideal 123,04m² → gap de +21m²

═══════════════════════════════════════════
DISTRIBUIÇÃO POR CLASSE SOCIAL E FAIXA ETÁRIA
═══════════════════════════════════════════
Classe social: Classe A 36,1%, Classe B 37,0%, Classe C 26,9%
Faixa etária: 25–34 anos 42,1%, 35–44 anos 29,5%, 45–54 anos 15,9%, 55+ anos 12,5%`;

  const messages = [];
  if (history && Array.isArray(history)) {
    history.forEach(({ role, content }) => {
      if (role === 'user' || role === 'assistant') {
        messages.push({ role, content });
      }
    });
  }
  messages.push({ role: 'user', content: question });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 512,
        system: SYSTEM,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(500).json({ error: err.error?.message || 'Erro na API' });
    }

    const data = await response.json();
    res.json({ answer: data.content[0].text });
  } catch (e) {
    res.status(500).json({ error: 'Erro ao conectar com a API' });
  }
}
