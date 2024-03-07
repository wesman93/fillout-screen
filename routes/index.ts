import express, {Request, Response} from 'express';
import axios from 'axios';
import {FilterClauseType, ResponseFiltersType} from "../filterClause";

const app = express();
const port = process.env.PORT || 3000;
const BASE_URL = "https://api.fillout.com";

app.use(express.json());

function dateValueCheck(q) {
    if (q.value && q.type === "DatePicker") {
        return Date.parse(q.value.toString());
    }
    return q.value;
}

function applyFilter(data: { questions: any[] }, filter: FilterClauseType, fValue: string | number) {
    switch (filter.condition) {
        case "equals":
            return data.questions.some(q => {
                const qValue = dateValueCheck(q);
                return q.id === filter.id && qValue === fValue;
            });
        case "does_not_equal":
            return data.questions.some(q => {
                const qValue = dateValueCheck(q);
                return q.id === filter.id && qValue !== fValue;
            });
        case "greater_than":
            return data.questions.some(q => {
                const qValue = dateValueCheck(q);
                return q.id === filter.id && qValue > fValue;
            });
        case "less_than":
            return data.questions.some(q => {
                const qValue = dateValueCheck(q);
                return q.id === filter.id && qValue < fValue;
            });
        default:
            break;
    }
}

function dateFilterCheck(f: FilterClauseType): string|number {
    if (typeof f.value === 'string' && f.value.includes('-')) {
        const date = Date.parse(f.value);
        if (!isNaN(date)) {
            return date;
        }
    } else if(typeof f.value === 'string' && !isNaN(parseInt(f.value))) {
        return +f.value;
    }
    return f.value;
}

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.get('/:formId/filteredResponses', async (req: Request<any, any, any, { filters: ResponseFiltersType }>, res: Response) => {
    const formId = req.params.formId;
    const filters: ResponseFiltersType = req.query.filters;

    const result: any = await axios.get(`${BASE_URL}/v1/api/forms/${formId}/submissions`, {
        ...req.params,
        ...req.query,
        headers: {"Authorization": `${req.headers.authorization}`}
    })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            return error;
        });

    let data: any = result.responses
    filters.forEach(f => {
        const fValue = dateFilterCheck(f);
        data = data.filter(d => applyFilter(d, f, fValue))
    });

    result.responses = data;
    res.send(result);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
