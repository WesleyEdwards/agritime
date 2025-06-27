import {Divider, Stack} from "@mui/joy"
import {PageLayout} from "../layout/PageLayout"

export const Profile = () => {
  return (
    <>
      <PageLayout title={"Profile"}>
        <Stack alignItems={"center"} gap={4}>
          <p>
            Welcome
          </p>

          <Divider />

          <img
            // src={user.athlete.profile}
            width={100}
            height={100}
            style={{borderRadius: "10px"}}
          />
        </Stack>
      </PageLayout>
    </>
  )
}
