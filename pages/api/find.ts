// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { isKanji } from "../../utils/isKanji";
type Data = {
  OK: Boolean;
  meaning: string | null;
  reading: string | null;
  kanji: string | null;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("finding...");
  const { word, used } = req.query;
  const usedKanji = used ? used.toString().split(",") : [];
  // console.log(usedKanji);
  const param = word ? word[word.length - 1] + "*" : "*";
  fetch(`https://jisho.org/api/v1/search/words?keyword=${param}`)
    .then((response) => response.json())
    .then((data) => {
      const resList = data["data"];
      let kanji = null;
      let isOkay = false;
      let meaning = null;
      let reading = null;
      // add the type

      const choice: { meaning: string; reading: string; kanji: string }[] = [];
      const max_choice = 50;

      resList.forEach((element: any) => {
        if (
          isKanji(element.slug) &&
          element.slug.split("-")[0].length > 1 &&
          element.slug[0] == param[0] &&
          choice.length <= max_choice
        ) {
          // console.log(element);
          // isOkay = true;
          // kanji = element.slug.split("-")[0];
          // meaning = element.senses[0].english_definitions[0];
          // reading = element.japanese[0].reading;
          if (usedKanji.indexOf(element.slug.split("-")[0]) == -1)
            choice.push({
              kanji: element.slug.split("-")[0],
              meaning: element.senses[0].english_definitions[0],
              reading: element.japanese[0].reading,
            });
        }
      });
      if (choice.length != 0) {
        let idx = Math.floor(Math.random() * choice.length);
        meaning = choice[idx].meaning;
        reading = choice[idx].reading;
        kanji = choice[idx].kanji;
        isOkay = true;
      }
      res
        .status(200)
        .json({ OK: isOkay, meaning: meaning, reading: reading, kanji: kanji });
    })
    .catch((err) => {
      res.status(400);
      console.log(err);
    });
}
