# Tribes-Bot
Node-js Discord bot for Tribes Ascend Stat Data

Create a .env file in directory:

https://discordapp.com/developers/docs/topics/oauth2#bots

TOKEN={bot token} - https://discordapp.com/developers/docs/topics/oauth2#bots

SPREADSHEETID={spreadsheet to get data from ID}

Generate Google Sheets API client_secret, open link in log to to enable credentials. - https://developers.google.com/sheets/api/quickstart/nodejs

Data scheme:

MapName, Blood Eagle Score, Player1, Player2, Player3, Player4, Player5, Player6, Player7

MapName, Diamond Sword Score, Player1, Player2, Player3, Player4, Player5, Player6, Player7

Input data example bulk from google spreadsheet:
//Date, Map Name, Blood Eagle Score, BE Player1, BE Player2, BE Player3, BE Player4, BE Player5, BE Player6, BE Player7, Diamond Sword Score, DS Player1, DS Player2, DS Player3, DS Player4, DS Player5, DS Player6, DS Player7

Input data example:

TrCTF-DangerousCrossing,5,Caligula_,[LADs] Wandlimb,Superflewis,[LADs] Myster1on,Rogopotato,[Dodg] EasyBeingCheesy,SirVomitsalot

TrCTF-DangerousCrossing,4,B34NZ,[CVN7] Vend3tta,Bepo,Commutative,[015] Kutori,Aps2,[DMc] seldom

Input data example2:

Arx Novena,0,mcoot,Ragingmoose,BabyMonkey,Karan,Triick,PyrexJgreen,gredwa

Arx Novena,6,LordJojoT,Vend3tta,Greenishmilk,seldom,Crioca,Wandlimb,Snowierfudge

SQL Data Layout

| teams  			 | players				| smurfs				| maps				| gameMap				| gameScore				| gamePlayerTeam 		|
| ------------- 	 | ------------- 		| ------------- 		| ------------- 	| ------------- 		| ------------- 		| ------------- 		|
| teamID INTEGER[pk] | playerID INTEGER[pk] | smurfName text[pk]	| mapID INTEGER[pk]	| gameID INTEGER[pk]	| gameID INTEGER[pk]	| gameID INTEGER[pk]  	|
| teamName text  	 | playerName text 		| playerID INTEGER  	| mapName INTEGER  	| mapID INTEGER  		| teamID INTEGER[pk]	| teamID INTEGER  		|
| 				  	 | 				 		| REF players(playerID)	| 				  	| gameDate Date			| score INTEGER  		| playerID INTEGER[pk] 	|
| 				  	 | 				 		| 					  	| 				  	| REF maps(mapID)		| playerID INTEGER		| REF gameMap(gameID) 	|
| 				  	 | 				 		| 						| 				  	| 						| REF gameMap(gameID)   | REF teams(teamID)		|
| 				  	 | 				 		| 						| 				  	| 						| REF teams(teamID)		| REF players(playerID)	|
| 				  	 | 				 		| 						| 				  	| 						| REF players(playerID)	| 						|
