import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { RootLayout } from "../_layout";
import { NextPageWithLayout } from "../_app";
import { Button } from "@/components";

const Success: NextPageWithLayout = observer(() => {
  const { query, back } = useRouter();
  console.log({ query });
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">Mint Success!</h1>
      <h1>tokenId: {query.id}</h1>
      <div>
        <a className="bold">transaction: </a>
      </div>
      <Button onClick={() => back()} className="mt-4 w-24">
        Back
      </Button>
    </div>
  );
});

Success.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Success;
