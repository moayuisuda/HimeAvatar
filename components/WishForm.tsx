import { useMoralis } from "react-moralis";
import { useOwnedSeeds } from "@/hooks";
import { Button, Form, Spin, Checkbox, Card, Space, Radio, Empty } from "antd";
import { ipfsToHttp } from "@/utils";
import { uniq, uniqBy } from "lodash";
import { Img } from "./Img";

export type WithInfo = {
  seed: number;
  features: string[];
};
const DEFAULT_PROMPT = ["flower"];
const PROMPT_MAP = {
  0: "royal",
  1: "smile",
  2: "jewelry",
  3: "Mononoke Hime",
  4: "wild",
};

export const mapPrompt = (seed: number) => {
  const indexes = Object.keys(PROMPT_MAP);
  // @ts-ignore
  return PROMPT_MAP[seed % indexes.length];
};

export const WishForm: React.FC<{ onSubmit: (wishInfo: WithInfo) => void }> = ({
  onSubmit,
}) => {
  const { account } = useMoralis();
  const { metaDataList = [], loading } = useOwnedSeeds(account as string);
  const uniqDataList = uniqBy(metaDataList, (item) => item.properties.seed);

  return (
    <Spin spinning={loading}>
      <Card>
        <Form onFinish={(values) => onSubmit(values)} layout="vertical">
          <Form.Item name="seed" label="Seed">
            {metaDataList.length ? (
              <Radio.Group>
                {uniqDataList.map((item) => {
                  const seed = item.properties.seed;
                  return (
                    <Radio key={seed} value={seed}>
                      <Space direction="vertical" align="center">
                        <Img
                          height={100}
                          width={100}
                          key={seed}
                          src={ipfsToHttp(item.image)}
                          alt={`seed img ${seed}`}
                        />
                      </Space>
                    </Radio>
                  );
                })}
              </Radio.Group>
            ) : (
              <Empty></Empty>
            )}
          </Form.Item>
          <Form.Item name="features" label="Features" initialValue={["flower"]}>
            <Checkbox.Group
              className="flex-wrap"
              options={DEFAULT_PROMPT.concat(
                uniqDataList.map((item) => mapPrompt(item.properties.seed))
              )}
            />
          </Form.Item>
          <Button className="w-full" type="primary" htmlType="submit">
            🙏 Make a wish
          </Button>
        </Form>
      </Card>
    </Spin>
  );
};
