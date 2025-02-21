/**
 * @fileoverview This file groups together all the functions relating to the management of data on the local system
 */
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

//#region SQLite functions
let SQLiteDatabase = null

//SQLite is used for managing the flash cards that the user has saved
/**
 * Creates a new flashcard entry
 * @param string flashcardQuestion The flashcard question
 * @param string flashcardAnswer The flashcard answer
 * @param string category The category the flashcard belongs to 
 */
export async function CreateFlashCardEntry(flashcardQuestion, flashcardAnswer, category) {
    if(SQLiteDatabase == null)
        await CreateInStorageDatabase()

    var newFlashcardID = null
    const db = SQLiteDatabase

    try{
        const cardCreateStatement = await db.prepareAsync(
            `INSERT INTO Flashcard (Flashcard_Question, Flashcard_Answer, Flashcard_Type) VALUES ($question, $answer, $type);`
        );

        await cardCreateStatement.executeAsync({ $question: flashcardQuestion, $answer: flashcardAnswer, $type : category})

        newFlashcardID = (await db.getFirstAsync(`SELECT last_insert_rowid()`))["last_insert_rowid()"]
    }
    catch(err){
        console.log("Error in flashcard creation: \n" + err)
    }
    return newFlashcardID
}

/**
 * Update a specified flashcard
 * @param int flashcardID The ID of the flashcard to update
 * @param string newQuestion The updated question value
 * @param string newAnswer The updated answer value
 * @param string newCategory the categroy to change flashcard to
 */
export async function UpdateFlashcardEntry(flashcardID, newQuestion, newAnswer, newCategory) {
    if(SQLiteDatabase == null)
        await CreateInStorageDatabase()
    
    const db = SQLiteDatabase

    try{
        const statement = await db.prepareAsync(
            `UPDATE Flashcard SET Flashcard_Question=$question, Flashcard_Answer=$answer
            WHERE Flashcard.Flashcard_ID=$id`
        );

        await statement.executeAsync({$id: flashcardID, $question: newQuestion, $answer: newAnswer})
    }
    catch(err){
        console.log("Error occurred during flashcard update: \n" + err)
    }
}

/**
 * Create the static database object. Also runs the script to initialise the database schema
 */
export async function CreateInStorageDatabase() {
    if(SQLiteDatabase != null)
        return

    const db = await SQLite.openDatabaseAsync('FlashcardDB');
    try{
        await db.execAsync(
            `
            CREATE TABLE IF NOT EXISTS "Flashcard_Type" (
            "Type"  TEXT NOT NULL UNIQUE,
            PRIMARY KEY(Type));

            CREATE TABLE IF NOT EXISTS "Flashcard" (
            "Flashcard_ID"	        INTEGER NOT NULL UNIQUE,
            "Flashcard_Question"	TEXT NOT NULL,
            "Flashcard_Answer"	    TEXT NOT NULL,
            "Flashcard_Type"        TEXT NOT NULL,
            FOREIGN KEY(Flashcard_Type) REFERENCES Flashcard_Type(Type)
            PRIMARY KEY("Flashcard_ID" AUTOINCREMENT));

            CREATE UNIQUE INDEX IF NOT EXISTS Flashcard_Index ON Flashcard (Flashcard_ID);
            CREATE UNIQUE INDEX IF NOT EXISTS Type_Index ON Flashcard_Type (Type);
            
            INSERT INTO Flashcard_Type VALUES ("Word")      ON CONFLICT DO NOTHING;
            INSERT INTO Flashcard_Type VALUES ("Context")   ON CONFLICT DO NOTHING;
            INSERT INTO Flashcard_Type VALUES ("Grammer")   ON CONFLICT DO NOTHING;`)
        console.log("db initialised")
        SQLiteDatabase = db
    }
    catch (err){
        console.log("Error in DB initialisation: \n" + err)
    }
}

/**
 * Loads all flash cards from the sqlite database
 * @param string category Load all flashcards of a specified category
 * @param string search value to match the question field of a flashcard to
 * @returns A JSON array containing all loaded flashcards
 */
export async function LoadFlashCards(category = "All", search = "") {
    if(SQLiteDatabase == null)
        await CreateInStorageDatabase()

    var allFlashCards = []

    try{
        var whereStatement = ""
        if(category != "All" || search != "")
        {
            whereStatement = `WHERE `
            if(category != "All")
                whereStatement += `Flashcard.Flashcard_Type="${category}"`
            if(category != "All" && search != "")
                whereStatement += " AND "
            if(search != "")
                whereStatement += `Flashcard_Question LIKE '${search}%'`
        }

        const allFlashCardsResult = await SQLiteDatabase.getAllAsync(
            `
            SELECT Flashcard.Flashcard_ID, Flashcard_Question, Flashcard_Answer, Flashcard_Type
            FROM Flashcard
            ${whereStatement}
            ORDER BY Flashcard.Flashcard_ID DESC` //
        )
    
        for (const row of allFlashCardsResult) {
            allFlashCards.push({
                id: row.Flashcard_ID,
                question: row.Flashcard_Question,
                answer: row.Flashcard_Answer,
                category: row.Flashcard_Type
            })
        }
        return allFlashCards;
    }
    catch(err)
    {
        console.log("An error occurred in loading all flashcards: " + err)
    }
}

/**
 * Load everything related to a specific flashcard
 * @param int flashcard_ID The flashcard to load
 * @returns A JSON object containing the loaded flashcard
 */
export async function LoadFlashcard(flashcard_ID) {
    if(SQLiteDatabase == null)
        await CreateInStorageDatabase()
    try{
        var retrievedFlashcard = []

        const flashcardSelectResult = await SQLiteDatabase.getAllAsync(
            `SELECT Flashcard_ID, Flashcard_Question, Flashcard_Answer, Flashcard_Type
            FROM Flashcard WHERE Flashcard.Flashcard_ID = "${flashcard_ID}"`
        )

        retrievedFlashcard = {
            id: flashcardSelectResult[0].Flashcard_ID,
            question: flashcardSelectResult[0].Flashcard_Question,
            answer: flashcardSelectResult[0].Flashcard_Answer,
            type: flashcardSelectResult[0].Flashcard_Type}
        
        return retrievedFlashcard;
    }
    catch(err){
        console.log("Error in loading flashcard: " + err)

    }
}

/**
 * Delete a flashcard from the database
 * @param int flashcardID the id of the flashcard to delete
 */
export async function DeleteFlashcard(flashcardID) {
    if(SQLiteDatabase == null)
        await CreateInStorageDatabase()

    const db = SQLiteDatabase

    try
    {
        const deletionStatement = await db.prepareAsync(
            `DELETE FROM Flashcard
            WHERE Flashcard.Flashcard_ID = $id`
        )

        await deletionStatement.executeAsync({$id: flashcardID})
    }
    catch(err)
    {
        console.log("Error in flashcard deletion: " + err)
    }
}

/**
 * Retrieve a small number of random flashcards to be quized on
 * @param Array<string> categories the categories, if any, to limit the quiz to
 * @param int the number of cards to retrieve
 * @returns 
 */
export async function GetQuizCards(categories, count = 10)
{
    if(SQLiteDatabase == null)
        await CreateInStorageDatabase()

    var retrievedFlashcards = []

    try
    {
        var where = ""
        if(categories && categories.length > 0)
        {
            where = "WHERE "
            for(var i = 0; i < categories.length; i++)
            {
                if(i > 0)
                    where += " OR "
                where += `Flashcard_Type="${categories[i]}"`
            }
        }

        const randomRetrievalStatement = await SQLiteDatabase.getAllAsync(
            `SELECT *  FROM Flashcard
            ${where}
            ORDER BY random() LIMIT ${count};`
        )

        for (const row of randomRetrievalStatement) {
            retrievedFlashcards.push({
                id: row.Flashcard_ID,
                question: row.Flashcard_Question,
                answer: row.Flashcard_Answer
            })
        }
    }
    catch (err)
    {
        console.log("Error in getting random flashcards: " + err)
    }

    return retrievedFlashcards
}


/**
 * Retrieve the total number of flashcards contained in the database
 * @param Array<String> categories The categories, if any, to limit the count to
 * @returns The number of flashcards in the database
 */
export async function GetCardAmount(categories)
{
    if(SQLiteDatabase == null)
        await CreateInStorageDatabase()

    var count = 0
    try
    {
        if(categories && categories.length > 0)
        {
            where = "WHERE "
            for(var i = 0; i < categories.length; i++)
            {
                if(i > 0)
                    where += " OR "
                where += `Flashcard_Type="${categories[i]}"`
            }

            count = (await SQLiteDatabase.getFirstAsync(
                `SELECT COUNT(*) AS flashcardCount FROM Flashcard
                ${where};`
            )).flashcardCount
        }
    }
    catch (err)
    {
        console.log("Error in getting flashcard count: " + err)
    }

    return count
}

/**
 * For testing purposes 
 * @param {*} params 
 */
export async function WipeDB() {
    try {
        if(SQLiteDatabase == null)
            await CreateInStorageDatabase()
        await SQLiteDatabase.execAsync(
            `
            DROP TABLE Flashcard`)
        console.log("db initialised")
        SQLiteDatabase = db
    } catch (error) {
        console.log(error)
    }
}
//#endregion

//#region AsyncStorage functions
//Async storage is used for the app settings, such as what language the user has selected in the translate menu
/**
 * Set the value of a key in storage
 * @param string settingKey The key of the setting in storage to set
 * @param string settingValue The value of the setting
 */
export async function SetSettingValue(settingKey, settingValue)
{
    try {
      await AsyncStorage.setItem(settingKey, settingValue);
    } catch (err) {
      console.log("Error setting in storage value: " + err)
    }
}

/**
 * Load a value from async storage
 * @param string settingKey The key of the setting to load
 * @returns The value of the loaded setting.
 */
export async function LoadSettingValue(settingKey)
{
    var settingValue = null
    try {
      const value = await AsyncStorage.getItem(settingKey);
      if (value !== null) {
        settingValue = value
      }
    } catch (err) {
        console.log("Error loading in storage value: " + err)
    }
    return settingValue
}

//#endregion  