// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  OK: Boolean;
  meaning: string | null;
  reading: string | null;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { word } = req.query;

  fetch(`https://jisho.org/api/v1/search/words?keyword=${word}`)
    .then((response) => response.json())
    .then((data) => {
      const resList = data["data"];
      let isOkay = false;
      let meaning = null;
      let reading = null;
      // add the type
      resList.forEach((element: any) => {
        if (word == element.slug.split("-")[0] && !isOkay) {
          isOkay = true;
          meaning = element.senses[0].english_definitions;
          reading = element.japanese[0].reading;
        }
      });
      res.status(200).json({ OK: isOkay, meaning: meaning, reading: reading });
    })
    .catch((err) => {
      res.status(400);
      console.log(err);
    });
}
