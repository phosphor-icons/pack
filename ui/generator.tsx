"use client";

import { ReactNode } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { FontEditor } from "fonteditor-core";
import { IconStyle } from "@phosphor-icons/core";

import { generateFont } from "#/app/api/packer";
import { configurationAtom, requestStateAtom, selectionAtom } from "#/state";
import { Button } from "./button";
import { Loader } from "./loader";
import { Table } from "./table";
import {
  downloadFile,
  copyToClipboard,
  createZip,
  mimeTypeForFont,
} from "#/utils/files";
import * as styles from "#/styles/generator.css";
import { SerialFontPack } from "#/utils/packer";

export const Generator = () => {
  const { status, result, error } = useRecoilValue(requestStateAtom);

  return status === "pending" ? (
    <div className={styles.centered}>
      <Loader />
    </div>
  ) : status === "error" ? (
    <div className={styles.centered}>{error}</div>
  ) : !!result ? (
    <div className={styles.container}>
      <p></p>
      <Table>
        <Table.Row
          cells={[
            {
              data: <i className="ph-bold ph-file"></i>,
            },
            { data: "Phosphor.css" },
            {
              data: <CopyLink label="Copy" text={result.css} />,
              align: "right",
              width: "100%",
            },
            {
              data: (
                <DownloadLink
                  label="Download"
                  data={result.css}
                  mimeType="text/css"
                  filename="Phosphor.css"
                />
              ),
              align: "right",
            },
          ]}
        />
        {Object.entries(result.fonts).map(([fmt, data]) => (
          <Table.Row
            key={fmt}
            cells={[
              {
                data: <i className="ph-bold ph-file"></i>,
              },
              { data: `Phosphor.${fmt}`, span: 2 },
              {
                data: (
                  <DownloadLink
                    label="Download"
                    data={data}
                    mimeType={mimeTypeForFont(fmt as FontEditor.FontType)}
                    filename={`Phosphor.${fmt}`}
                  />
                ),
                align: "right",
              },
            ]}
          />
        ))}
        <Table.Row
          cells={[
            {
              data: <i className="ph-bold ph-file-archive"></i>,
            },
            { data: "Phosphor.zip" },
            {
              data: <ZipLink label="Download all" kit={result} />,
              align: "right",
              span: 2,
            },
          ]}
        />
      </Table>
    </div>
  ) : null;
};

const CopyLink = (props: { label: ReactNode; text: string }) => {
  async function handleCopyToClipboard() {
    return copyToClipboard(props.text);
  }

  return (
    <Button text link onClick={handleCopyToClipboard}>
      {props.label}
    </Button>
  );
};

const DownloadLink = (props: {
  label: ReactNode;
  data: Uint8Array | string;
  mimeType: string;
  filename: string;
}) => {
  function handleDownloadFile() {
    const type = props.mimeType;
    const data = new Blob([props.data], { type });
    downloadFile(data, props.filename);
  }

  return (
    <Button text link onClick={handleDownloadFile}>
      {props.label}
    </Button>
  );
};

const ZipLink = (props: { label: ReactNode; kit: SerialFontPack }) => {
  async function handleZipAndDownload() {
    const zip = await createZip(props.kit);
    downloadFile(zip, "Phosphor.zip");
  }

  return (
    <Button text link onClick={handleZipAndDownload}>
      {props.label}
    </Button>
  );
};

export const GeneratorActions = () => {
  const selections = useRecoilValue(selectionAtom);
  const { ttf, otf, woff2, woff, eot, svg, output } =
    useRecoilValue(configurationAtom);
  const [request, setRequestState] = useRecoilState(requestStateAtom);

  async function requestSubfont() {
    setRequestState({ status: "pending" });

    const icons = Object.entries(selections).reduce<
      Partial<Record<IconStyle, string[]>>
    >((acc, [weight, names]) => {
      acc[weight as IconStyle] = Array.from(names);
      return acc;
    }, {});
    try {
      const result = await generateFont({
        icons,
        formats: Object.entries({ ttf, otf, woff2, woff, eot, svg })
          .filter(([_, v]) => v)
          .map(([k]) => k as FontEditor.FontType),
        inline: output === "inline",
      });
      if ("error" in result) {
        setRequestState({
          status: "error",
          error: result.error,
        });
      } else {
        setRequestState({ status: "done", result });
      }
    } catch (e) {
      setRequestState({
        status: "error",
        error: (e as Error).message ?? e,
      });
    }
  }

  return (
    <Button disabled={request.status === "pending"} onClick={requestSubfont}>
      Generate
    </Button>
  );
};
