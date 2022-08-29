import * as Http from "http";
import * as Https from "https";
import * as Url from "url";
import * as tar from "tar";
import mkdirp from "mkdirp";

/*
Download and unzip (Macbool m1:max)
100 connections

┌─────────┬───────┬───────┬───────┬────────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5%  │ 50%   │ 97.5% │ 99%    │ Avg      │ Stdev    │ Max    │
├─────────┼───────┼───────┼───────┼────────┼──────────┼──────────┼────────┤
│ Latency │ 23 ms │ 40 ms │ 93 ms │ 123 ms │ 44.12 ms │ 19.14 ms │ 198 ms │
└─────────┴───────┴───────┴───────┴────────┴──────────┴──────────┴────────┘
┌───────────┬────────┬────────┬────────┬────────┬─────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg     │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼─────────┼─────────┼────────┤
│ Req/Sec   │ 1672   │ 1672   │ 2269   │ 2751   │ 2238.85 │ 313.18  │ 1672   │
├───────────┼────────┼────────┼────────┼────────┼─────────┼─────────┼────────┤
│ Bytes/Sec │ 211 kB │ 211 kB │ 286 kB │ 347 kB │ 282 kB  │ 39.4 kB │ 211 kB │
└───────────┴────────┴────────┴────────┴────────┴─────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.
# of samples: 20

45k requests in 20.02s, 5.64 MB read
------------------------------------------------------------------------------
*/

const customAgents = {
  http: new Http.Agent({ keepAlive: true }),
  https: new Http.Agent({ keepAlive: true }),
};

const userAgent = "nodejs";

export const downloadTar = async (url: string, output: string) =>
  new Promise((resolve, reject) => {
    console.log("widget download");

    const uri = Url.parse(url);
    if (!uri.protocol || !["https:", "http:"].includes(uri.protocol)) {
      return reject("protocol not supported");
    }

    const get = uri.protocol === "https:" ? Https.get : Http.get;
    const agent =
      uri.protocol === "https:" ? customAgents.https : customAgents.http;

    const tarPipe = tar.extract({
      C: output,
    });

    console.log("url", url, output);

    get(url, { agent, headers: { "user-agent": userAgent } }, (response) => {
      response
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .pipe(tarPipe)
        .on("error", (err) => {
          console.log('error', err);
          reject("Error tar");
        })
        .on("finish", () => {
          resolve(output);
        });
    });
  });

export const downloadWidget = async (url: string, output: string) => {
  await mkdirp(output);
  await downloadTar(url, output);
};
