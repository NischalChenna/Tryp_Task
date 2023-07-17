import { Box, Text } from "@chakra-ui/react";

interface RenderStatusProps {
  status: string;
}

export const RenderStatus = (props: RenderStatusProps): JSX.Element => {
  return (
    <>
      {(() => {
        switch (props.status) {
          case "paid":
            return (
              <Box
                sx={{
                  backgroundColor: "#C6F6D5",
                  borderRadius: "20px",
                  padding: 2,
                }}
              >
                <Text align={"center"} color={"#4C8066"} fontWeight={"medium"}>
                  Paid
                </Text>
              </Box>
            );
          case "waiting":
            return (
              <Box
                sx={{
                  backgroundColor: "#FEFCC0",
                  borderRadius: "20px",
                  padding: 2,
                }}
              >
                <Text align={"center"} color={"#936B40"} fontWeight={"medium"}>
                  Waiting
                </Text>
              </Box>
            );
          case "failed":
            return (
              <Box
                sx={{
                  backgroundColor: "#FED7D7",
                  borderRadius: "20px",
                  padding: 2,
                }}
              >
                <Text align={"center"} color={"red.600"} fontWeight={"medium"}>
                  Failed
                </Text>
              </Box>
            );
          default:
            return <></>;
        }
      })()}
    </>
  );
};

export default RenderStatus;
