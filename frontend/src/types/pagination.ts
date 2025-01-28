export interface Pagination
{
    page: number;
    limit: number;
    orderBy: string;
    order: 'ASC' | 'DESC' | string;
    total?: number;
}
