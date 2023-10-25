const {
  RekognitionClient,
  DetectLabelsCommand,
} = require("@aws-sdk/client-rekognition");
const rekognitionClient = new RekognitionClient({ region: "us-east-2" });
const {
  promises: { readFile },
} = require("fs");
const {
  TranslateClient,
  TranslateTextCommand,
} = require("@aws-sdk/client-translate");
const { get } = require("axios");
const translate = new TranslateClient({ region: "us-east-2" });

async function translateParams(text) {
  const params = {
    SourceLanguageCode: "en", // Idioma de origem (por exemplo, inglês)
    TargetLanguageCode: "pt", // Idioma de destino (por exemplo, português)
    Text: text,
  };

  const translateCommand = new TranslateTextCommand(params);

  const resultTranslate = await translate.send(translateCommand);

  return resultTranslate.TranslatedText.split(" e ");
}

async function detectImageLabels(buffer) {
  const command = new DetectLabelsCommand({
    Image: {
      Bytes: buffer,
    },
  });
  try {
    const result = await rekognitionClient.send(command);
    const workingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 90
    );
    const names = workingItems.map(({ Name }) => Name).join(" and ");

    const resultNameTranslate = await translateParams(names);
    const resultWorkingItemsTranslate = await Promise.all(
      workingItems.map(async (item) => {
        const translatedItem = await translateParams(item.Name);
        return { ...item, translatedItem };
      })
    );
    return { resultNameTranslate, resultWorkingItemsTranslate };
  } catch (error) {
    console.error(
      "Deu error alguma coisa deu errada no detecImageLabels",
      error
    );
  }
}

async function formatResult(names, workingItems) {
  const finalText = [];

  for (const indexText in names) {
    const nameInPortuguese = names[indexText];

    const confidence = workingItems[indexText].Confidence;

    finalText.push(
      `A confiança e de ${confidence}% de ser do tipo ${nameInPortuguese}`
    );
  }
  return finalText;
}

async function getImageBuffer(imageURL) {
  const response = await get(imageURL, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(response.data, "base64");
  return buffer;
}

async function main(event) {
  try {
    //pegar a url da imagem por parametro
    const { imageUrl } = event.queryStringParameters;
    //Aqui no imgBuffer e uma maneira de ver a imagem localmente sera comentado
    //const imgBuffer = await readFile("./img/witcher.png");
    console.log("fazendo download da imagem");
    const buffer = await getImageBuffer(imageUrl);
    const {
      resultNameTranslate: names,
      resultWorkingItemsTranslate: workingItems,
    } = await detectImageLabels(buffer);
    const finalText = await formatResult(names, workingItems);
    return {
      statusCode: 200,
      body: `A imagem tem\n `.concat(finalText),
    };
  } catch (error) {
    console.log("Error *** mostrando no console.log", error.stack);
    return {
      statusCode: 500,
      body: "Error 500 error de servidor em teoria",
    };
  }
}

module.exports.main = main;
