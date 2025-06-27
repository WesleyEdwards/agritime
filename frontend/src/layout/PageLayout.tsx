import { Sheet, Stack, Typography } from "@mui/joy";

export const PageLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
}) => {
  return (
    <Stack sx={{ placeItems: "center", mt: "8rem" }}>
      <Sheet sx={{ borderRadius: 10, p: 2, minWidth: 400 }}>
        {typeof title === "string" ? (
          <Typography my={2} level="h1" textAlign={"center"}>
            {title}
          </Typography>
        ) : (
          title
        )}
        {children}
      </Sheet>
    </Stack>
  );
};
