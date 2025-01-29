import React from "react";
import { Table, Pagination, Select, Checkbox, Group, Text } from "@mantine/core";

interface Column {
  key: string;
  label: string;
}

interface Row {
  id: number;
  [key: string]: any;
}

interface DataTableProps {
  columns: Column[];
  rows: Row[];
  selectedRows: number[];
  onSelectRow: (id: number) => void;
  totalElements: number;
  activePage: number;
  elementsPerPage: number;
  onPageChange: (page: number) => void;
  onElementsPerPageChange: (value: string | null) => void;
}

const DataTable: React.FC<DataTableProps> = ({ columns, rows, selectedRows, onSelectRow, totalElements, activePage, elementsPerPage, onPageChange, onElementsPerPageChange }) => {
  return (
    <>
      <Table.ScrollContainer minWidth={500}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              {columns.map((col) => (
                <Table.Th key={col.key}>{col.label}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => (
              <Table.Tr key={row.id} bg={selectedRows.includes(row.id) ? "var(--mantine-color-blue-light)" : undefined}>
                <Table.Td>
                  <Checkbox checked={selectedRows.includes(row.id)} onChange={() => onSelectRow(row.id)} />
                </Table.Td>
                {columns.map((col) => (
                  <Table.Td key={col.key}>{row[col.key]}</Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {rows.length > 0 && (
        <Group justify="space-between" mt="lg">
          <Text>
            A mostrar {Math.min((activePage - 1) * elementsPerPage + 1, totalElements)} a {Math.min(activePage * elementsPerPage, totalElements)} de {totalElements} elementos
          </Text>
          <Pagination total={Math.ceil(totalElements / elementsPerPage)} value={activePage} onChange={onPageChange} />
          <Select data={["10", "20", "30", "50"]} value={elementsPerPage.toString()} onChange={onElementsPerPageChange} />
        </Group>
      )}
    </>
  );
};

export default DataTable;
