const numberFormat = new Intl.NumberFormat('pt-BR');
const percentageFormat = new Intl.NumberFormat('pt-BR', {
    style: 'percent', maximumFractionDigits: 1,
});

export const formatNumber = (number) => numberFormat.format(number);
export const formatPercentage = (fraction) => percentageFormat.format(fraction);

function selections(answer) {
    return new Set((Array.isArray(answer) ? answer : [answer])
        .filter((value) => typeof value === 'string' && value.trim()));
}

export function questionDistribution(question, answers) {
    const counts = new Map((question.Options || []).map(({ text }) => [text, 0]));
    let total = 0;
    for (const answer of answers) {
        for (const selection of selections(answer)) {
            counts.set(selection, (counts.get(selection) || 0) + 1);
            total += 1;
        }
    }

    return {
        total,
        rows: [...counts].map(([label, count]) => ({ label, count })),
    };
}

export function crossTabulation(rowAnswers, rowIds, columnAnswers, columnIds, rowLabels, columnLabels) {
    const columnsByInterview = new Map(columnIds.map((id, index) => [id, selections(columnAnswers[index])]));
    const columnPositions = new Map(columnLabels.map((label, index) => [label, index]));
    const rows = rowLabels.map((label) => ({ label, counts: Array(columnLabels.length).fill(0), base: 0 }));
    const rowsByLabel = new Map(rows.map((row) => [row.label, row]));
    let paired = 0;

    rowIds.forEach((id, index) => {
        const columnSelections = columnsByInterview.get(id);
        if (!columnSelections?.size) return;

        const rowSelections = selections(rowAnswers[index]);
        if (!rowSelections.size) return;
        paired += 1;
        for (const label of rowSelections) {
            const row = rowsByLabel.get(label);
            if (!row) continue;
            row.base += 1;
            for (const selection of columnSelections) {
                const column = columnPositions.get(selection);
                if (column !== undefined) row.counts[column] += 1;
            }
        }
    });
    return { rows, paired };
}
