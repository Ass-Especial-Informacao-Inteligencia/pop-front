export const jsonToSheet = (data) => {
  const responsesByUser = groupResponsesByUser(data);
  const worksheetData = prepareWorksheetData(responsesByUser);
  const worksheet = createWorksheet(worksheetData);

  // Cria um objeto com várias abas (worksheets)
  const worksheets = {
    'Planilha de Respostas': worksheet
  };

  const workbook = createWorkbook(worksheets);
  downloadWorkbook(workbook);
};

// Funções existentes para criação de planilha Excel
const createWorksheet = (worksheetData) => {
  return XLSX.utils.aoa_to_sheet(worksheetData);
};

const createWorkbook = (worksheets) => {
  const sheetNames = Object.keys(worksheets);
  return {
    Sheets: worksheets,
    SheetNames: sheetNames,
  };
};

const downloadWorkbook = (workbook) => {
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lista_de_respostas.xlsx';
  a.click();
};

// Funções existentes para processamento de dados de entrada
const groupResponsesByUser = (data) => {
  const responsesByUser = {};

  data.forEach((item) => {
    const userName = item.User && item.User.name ? item.User.name : 'Entrevistador não encontrado!';
    const interviewed = item.interviewed;

    if (!responsesByUser[interviewed]) {
      responsesByUser[interviewed] = {
        userName: userName,
        responses: [],
      };
    }

    const similarResponse = findSimilarResponse(responsesByUser[interviewed].responses, interviewed);
    if (similarResponse) {
      addResponseToSimilarResponse(similarResponse, item);
    } else {
      createNewResponse(responsesByUser[interviewed].responses, item, interviewed);
    }
  });

  Object.keys(responsesByUser).forEach((interviewed) => {
    responsesByUser[interviewed].responses.sort((a, b) => a.createdAt - b.createdAt);
  });

  return responsesByUser;
};

const findSimilarResponse = (responses, interviewed) => {
  return responses.find((response) => {
    return response.interviewed === interviewed;
  });
};

const addResponseToSimilarResponse = (similarResponse, item) => {
  if (item.Question.type === 'Multipla Escolha') {
    const sameQuestion = similarResponse.perguntas.find((pergunta) => {
      return pergunta.pergunta === item.Question.body;
    });

    if (sameQuestion) {
      sameQuestion.resposta.push(item.answer);
    } else {
      similarResponse.perguntas.push({
        pergunta: item.Question.body,
        tipo: item.Question.type,
        resposta: [item.answer],
      });
    }
  } else {
    similarResponse.perguntas.push({
      pergunta: item.Question.body,
      tipo: item.Question.type,
      resposta: item.answer,
    });
  }
};

const createNewResponse = (responses, item, interviewed) => {
  responses.push({
    createdAt: new Date(item.created_at).getTime(),
    userName: item.User && item.User.name ? item.User.name : 'Entrevistador Não encontrado!',
    interviewed: interviewed,
    perguntas: [
      {
        pergunta: item.Question.body,
        tipo: item.Question.type,
        resposta: item.Question.type === 'Multipla Escolha' ? [item.answer] : item.answer,
      },
    ],
  });
};

const prepareWorksheetData = (responsesByUser) => {
  const worksheetData = [];

  const uniqueQuestions = new Set();
  Object.keys(responsesByUser).forEach((userName) => {
    responsesByUser[userName].responses.forEach((response) => {
      response.perguntas.forEach((pergunta) => {
        uniqueQuestions.add(pergunta.pergunta);
      });
    });
  });

  const headerRow = createHeaderRow(responsesByUser);
  worksheetData.unshift(headerRow); // Adiciona o cabeçalho no início do array

  Object.keys(responsesByUser).forEach((interviewed) => {
    responsesByUser[interviewed].responses.forEach((response) => {
      const row = createRow(response, Array.from(uniqueQuestions)); // Garante o alinhamento com o cabeçalho
      worksheetData.push(row);
    });
  });

  return worksheetData;
};

const createTypesRow = (responsesByUser) => {
  const typesRow = ['Tipo de Pergunta', '-']; // Cabeçalho para tipos de pergunta

  // Objeto para armazenar tipos de pergunta por pergunta
  const questionTypes = {};

  // Itera sobre as respostas para obter os tipos de pergunta únicos por pergunta
  Object.keys(responsesByUser).forEach((userName) => {
    responsesByUser[userName].responses.forEach((response) => {
      response.perguntas.forEach((pergunta) => {
        const questionKey = pergunta.pergunta; // Chave para identificar a pergunta
        if (!questionTypes[questionKey]) {
          questionTypes[questionKey] = new Set();
        }
        if (!questionTypes[questionKey].has(pergunta.tipo)) {
          questionTypes[questionKey].add(pergunta.tipo);
        }
      });
    });
  });

  // Adiciona os tipos de pergunta para cada pergunta única encontrada
  Object.keys(questionTypes).forEach((question) => {
    questionTypes[question].forEach((tipo) => {
      //typesRow.push(tipo);
    });
  });

  return typesRow.map((cell) => ({ v: cell, s: getHeaderStyle() }));
};

const createHeaderRow = (responsesByUser) => {
  const uniqueQuestions = new Set();
  Object.keys(responsesByUser).forEach((userName) => {
    responsesByUser[userName].responses.forEach((response) => {
      response.perguntas.forEach((pergunta) => {
        uniqueQuestions.add(pergunta.pergunta);
      });
    });
  });

  const headerRow = ['Entrevistador', 'Data de Resposta'];
  Array.from(uniqueQuestions).forEach((question) => {
    headerRow.push(question);
  });

  return headerRow.map((cell) => ({ v: cell, s: getHeaderStyle() }));
};

const createRow = (response, uniqueQuestions) => {
  const row = [
    response.userName,
    new Date(response.createdAt).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  ];

  // Garante que as perguntas únicas apareçam na mesma ordem do cabeçalho
  uniqueQuestions.forEach((question) => {
    const perguntaEncontrada = response.perguntas.find((p) => p.pergunta === question);
    if (perguntaEncontrada) {
      if (perguntaEncontrada.tipo === 'Multipla Escolha') {
        row.push(perguntaEncontrada.resposta.join(', '));
      } else {
        row.push(perguntaEncontrada.resposta);
      }
    } else {
      row.push(''); // Adiciona célula vazia se a pergunta não tiver sido respondida
    }
  });

  return row;
};

const getHeaderStyle = () => {
  return {
    font: { bold: true },
    alignment: { horizontal: 'center' },
    fill: { fgColor: { rgb: 'FFA07A' } },
    border: { top: { style: 'thin' }, bottom: { style: 'thin' } },
  };
};