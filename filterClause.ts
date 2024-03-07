export type FilterClauseType = {
    id: string;
    condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
    value: number | string;
}

// each of these filters should be applied like an AND in a "where" clause
// in SQL
export type ResponseFiltersType = FilterClauseType[];
