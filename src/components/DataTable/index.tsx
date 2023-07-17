import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import RenderStatus from "../RenderStatus";
import { getTimeDifference } from "@/utils/dateConversion";

interface DataTableProps {
  rows: any[];
  columns: string[];
  caption?: string;
  sorting?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  onSelectActionCallBack?: (row: any) => void;
  onDeselectActionCallBack?: (row: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  rows,
  columns,
  caption,
  sorting,
  pagination = false,
  itemsPerPage = 10,
  onSelectActionCallBack,
  onDeselectActionCallBack,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder((prevSortOrder) =>
        prevSortOrder === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (sortColumn && sorting) {
      return [...rows].sort((a, b) => {
        const columnA = a[sortColumn.toLocaleLowerCase()];
        const columnB = b[sortColumn.toLocaleLowerCase()];

        if (typeof columnA === "string" && typeof columnB === "string") {
          const lowerCaseColumnA = columnA.toLowerCase();
          const lowerCaseColumnB = columnB.toLowerCase();
          return sortOrder === "asc"
            ? lowerCaseColumnA.localeCompare(lowerCaseColumnB)
            : lowerCaseColumnB.localeCompare(lowerCaseColumnA);
        } else if (columnA instanceof Date && columnB instanceof Date) {
          return sortOrder === "asc"
            ? columnA.getTime() - columnB.getTime()
            : columnB.getTime() - columnA.getTime();
        } else if (typeof columnA === "number" && typeof columnB === "number") {
          return sortOrder === "asc" ? columnB - columnA : columnA - columnB;
        } else {
          // For other rows types, do not perform sorting
          return 0;
        }
      });
    }
    return rows;
  }, [rows, sortColumn, sortOrder, sorting]);

  const pageCount = Math.ceil(sortedData.length / itemsPerPage);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Box overflowX="auto">
      {/* Add overflowX property to enable horizontal scrolling */}
      {caption ? <h3 style={{ marginBottom: "10px" }}>{caption}</h3> : null}
      <Box borderWidth="1px" borderRadius="md" overflow="hidden">
        {paginatedData.length > 0 ? (
          <Table variant="simple" minWidth="100%">
            {" "}
            {/* Set minWidth to 100% */}
            <Thead>
              <Tr>
                {columns.map((column) => (
                  <Th
                    key={column}
                    {...(["status", "select"].includes(
                      column.toLocaleLowerCase()
                    )
                      ? { textAlign: "center", pr: 9 }
                      : {})}
                    {...(sorting ? { onClick: () => handleSort(column) } : {})}
                    cursor={sorting ? "pointer" : "default"}
                  >
                    {column}
                    {sortColumn === column ? (
                      sortOrder === "asc" ? (
                        <TriangleUpIcon ml="2" />
                      ) : (
                        <TriangleDownIcon ml="2" />
                      )
                    ) : null}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData.map((row, index) => (
                <Tr key={index}>
                  {columns.map((column) =>
                    column.toLocaleLowerCase() === "status" ? (
                      <Td key={column}>
                        <RenderStatus
                          status={row[
                            column.toLocaleLowerCase()
                          ].toLocaleLowerCase()}
                        />
                      </Td>
                    ) : column.toLocaleLowerCase() === "select" ? (
                      <>
                        <Td key={column}>
                          <Button
                            sx={{ width: "100%" }}
                            {...(onSelectActionCallBack &&
                            onDeselectActionCallBack
                              ? {
                                  onClick: () => {
                                    {
                                      {
                                        row.selected === "false"
                                          ? onSelectActionCallBack(row)
                                          : onDeselectActionCallBack(row);
                                      }
                                    }
                                  },
                                }
                              : {})}
                          >
                            {row.selected === "false" ? "Select" : "Deselect"}
                          </Button>
                        </Td>
                      </>
                    ) : column.toLocaleLowerCase() === "timestamp" ? (
                      <>
                        <Td key={column}>
                          <Text>
                            {getTimeDifference(Number(row["timestamp"]))}
                          </Text>
                        </Td>
                      </>
                    ) : (
                      <>
                        <Td key={column}>
                          <Text>{row[column.toLocaleLowerCase()]}</Text>
                        </Td>
                      </>
                    )
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Box p={4} textAlign="center">
            No data available
          </Box>
        )}
      </Box>
      {pagination && (
        <Box mt="4" textAlign="left">
          {pageCount > 1 && (
            <Button
              isDisabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              mr="2"
            >
              Previous
            </Button>
          )}
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (page) => (
              <Button
                key={page}
                colorScheme={currentPage === page ? "blue" : undefined}
                onClick={() => handlePageChange(page)}
                mr="2"
              >
                {page}
              </Button>
            )
          )}
          {pageCount > 1 && (
            <Button
              isDisabled={currentPage === pageCount}
              onClick={() => handlePageChange(currentPage + 1)}
              mr="2"
            >
              Next
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DataTable;
