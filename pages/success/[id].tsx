import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { RootLayout } from "../_layout";
import { NextPageWithLayout } from "../_app";

const Success: NextPageWithLayout = observer(() => {
  const { query } = useRouter();
  console.log({ query });
  return (
    <div>
      <h1>hello</h1>
      <h1>{query.id}</h1>
    </div>
  );
});

Success.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Success;
