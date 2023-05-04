import { useRouter } from "next/router";
import { RootLayout } from "../_layout";
import { NextPageWithLayout } from "../_app";
import { Button, Alert, Tag, Space } from "antd";
import { useRequest } from "ahooks";
import { ipfsToHttp } from "@/utils";
import { MetaData } from "@/typings";
import { mapPrompt } from "@/components";
import { Img } from "@/components/Img";

const CHAIN_SCAN_BASE = "https://polygonscan.com/tx";

const Success: NextPageWithLayout = () => {
  const { query, back } = useRouter();
  const { data: metaData } = useRequest(
    () => {
      const url = ipfsToHttp(query["uri"] as string);
      return fetch(url).then((res) => res.json());
    },
    {
      ready: !!query["uri"],
    }
  ) as { data: MetaData; loading: boolean };

  return (
    <div className="flex flex-col items-center gap-2">
      <Img
        width={256}
        height={256}
        src={metaData && ipfsToHttp(metaData.image)}
      />

      {metaData && (
        <Space align="center">
          <p>
            &quot; Mononoke Kami gifted an feature{" "}
            <Tag className="text-base m-0" color="#17b4ff">
              {mapPrompt(metaData.properties.seed)}
            </Tag>{" "}
            &quot;
          </p>
        </Space>
      )}

      <Alert
        className="break-all"
        type="success"
        message="Mint Success"
        showIcon
        description={
          <div>
            <div>ID: {query.id}</div>
            <div>
              Transaction:{" "}
              <a
                className="bold"
                href={`${CHAIN_SCAN_BASE}/${query["tx-hash"]}`}
                target="_blank"
              >
                {query["tx-hash"]}
              </a>
            </div>
            <div>
              URI:{" "}
              <a className="bold" href={query["uri"] as string} target="_blank">
                {query["uri"]}
              </a>
            </div>
          </div>
        }
        action={
          <Button type="primary" onClick={() => back()}>
            Back
          </Button>
        }
      />
    </div>
  );
};

Success.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Success;
