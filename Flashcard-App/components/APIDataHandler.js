/**
 * @fileoverview This file groups together all the functions relating to the APIs used by the app
 */
import axios from 'axios';
import languageCodes from '@/assets/languageCodes';

/**
 * Use the Deepl api to translate 
 * @param {string} sourceText The text to be translated
 * @param {string} sourceLanguage A two letter string that indicates the language the source text is in 
 * @param {string} targetLanguage A two letter string that indicates the language the source text should be translated to
 * @returns The source text translated to the target language
 */
export async function TranslateText(sourceText, sourceLanguage, targetLanguage){
    if(sourceText == null || sourceText.length == 0)
      return;

    const auth_key = "YOUR DEEPL API"
    
    try{
        const deeplAPIResponse = await axios.get("https://api-free.deepl.com/v2/translate", {
            params: {
             auth_key : auth_key,
             text: sourceText,
             sourceLanguage : sourceLanguage,
             target_lang : targetLanguage
            },
         },)

        return deeplAPIResponse.data.translations[0].text
    }
    catch(err)
    {
        console.log(err.message)
    }    
}

/**
 * Generate 5 context examples for a provided word.
 * @param {string} ContextSource The word to generate context examples for
 * @param {string} sourceLanguage A two letter string that indicates the language the source text is in 
 * @param {string} targetLanguage A two letter string that indicates the language the source text should be translated to
 * @returns A json array with containing the generated examples
 */
export async function GenerateContextExamples(ContextSource, sourceLanguage, targetLanguage)
{
    if(ContextSource == null || ContextSource.length == 0)
        return;

    var fullTarget = "";
    var fullSource = "";

    for(var i = 0; i < languageCodes.length; i++)
    {
        //change the language code to a full string decipherable by chatgpt
        if(languageCodes[i].value == sourceLanguage)
        {
            fullSource = languageCodes[i].label
        }
        if(languageCodes[i].value == targetLanguage)
        {
            fullTarget = languageCodes[i].label
        }
    }

    const APIKey = "YOUR CHATGPT API KEY"
    const AIPrompt = `I want you to generate 5 flashcards. Generate these flashcards in a json format.
    The first field is called "question" and will be in ${fullSource.toUpperCase()},
    this field MUST contain the word "${ContextSource}" (and NOT be conjugated differently) with a surrounding context created for it. The second field is called "answer".
    This field will contain the same sentence as is contained in "question" HOWEVER, it must be in ${fullTarget.toUpperCase()}. 
    If possible vary the context provided in the question field.
    Provide the response only in json.`
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${APIKey}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": AIPrompt}],
        })
    });

                //regex for anything outside "[]" because chatgpt still returns a string portion outside the json
    return JSON.parse((await response.json()).choices[0].message.content.replace(/^[^\[\]]*|[^\[\]]*$/g, ""))
}