import { memo, useEffect, useMemo, useState } from "react";
import {
  Box,
  Input,
  Text,
  Spinner,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";

import DataTable from "../components/DataTable";

const HomePage = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [selectedPurshaseIds, setSelectedPurshaseIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // New status filter state
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const columns = [
    "Timestamp",
    "Purchase_ID",
    "Mail",
    "Name",
    "Source",
    "Status",
    "Select",
  ];

  useEffect(() => {
    setIsLoading(true); // Set loading state to true before making the API call
    fetch("https://run.mocky.io/v3/156e169f-abda-4b3e-9168-92d14a94884f")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        return response.json();
      })
      .then((data) => {
        const updatedData = data.map((row: any) => {
          return { ...row, selected: "false" };
        });
        setRows(updatedData);
        console.log("rows", rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false after API call completes
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = useMemo(() => {
    let filteredRows = rows;
    if (searchQuery) {
      filteredRows = filteredRows.filter((row: any) =>
        row["mail"].toLocaleLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter) {
      filteredRows = filteredRows.filter((row: any) =>
        row["status"].toLocaleLowerCase().includes(statusFilter.toLowerCase())
      );
    }
    return filteredRows;
  }, [rows, searchQuery, statusFilter]);

  const statusOptions = ["Paid", "Failed", "Waiting"]; // Dropdown options

  const onItemSelected = (row: any) => {
    const updatedData = rows.map((rowData: any) => {
      if (rowData.purchase_id === row.purchase_id) {
        return { ...rowData, selected: "true" };
      }
      return { ...rowData };
    });
    setRows(updatedData);
    setSelectedPurshaseIds([...selectedPurshaseIds, String(row.purchase_id)]);
  };

  const onItemDeleted = (row: any) => {
    const updatedData = rows.map((rowData: any) => {
      if (rowData.purchase_id === row.purchase_id) {
        return { ...rowData, selected: "false" };
      }
      return { ...rowData };
    });
    setRows(updatedData);
    const updatedArray = selectedPurshaseIds.filter(
      (pId) => pId !== row.purchase_id
    );
    setSelectedPurshaseIds(updatedArray);
  };

  return (
    <>
      <Text fontSize="4xl" align={"center"}>
        Tryp.com
      </Text>
      <Box sx={{ ml: 4, mr: 4, mb: 5, mt: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Input
            value={searchQuery}
            maxWidth={"300"}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by mail"
            sx={{ mb: 2 }}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            maxWidth={"300"}
            placeholder="Filter by status"
            sx={{ mb: 2 }}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Box>
        {selectedPurshaseIds.length > 0 ? (
          <>
            <Text fontSize="2xl">Selected Purchase Orders:-</Text>
            <Box
              sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2, mb: 4 }}
            >
              {selectedPurshaseIds.map((purchase_id, index) => (
                <Tag size={"md"} key={index} variant="solid" colorScheme="teal">
                  <TagLabel>{purchase_id}</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      onItemDeleted(
                        rows.find((row) => row.purchase_id === purchase_id)
                      )
                    }
                  />
                </Tag>
              ))}
            </Box>
          </>
        ) : (
          <></>
        )}
        {isLoading ? ( // Conditional rendering based on the loading state
          <Box
            sx={{
              ml: 2,
              mr: 2,
              minHeight: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner size="xl" />
          </Box>
        ) : (
          <DataTable
            rows={filteredData}
            columns={columns}
            sorting
            pagination
            onSelectActionCallBack={onItemSelected}
            onDeselectActionCallBack={onItemDeleted}
          />
        )}
      </Box>
    </>
  );
};

export default memo(HomePage);
