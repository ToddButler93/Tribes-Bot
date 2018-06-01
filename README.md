# Tribes-Bot
Node-js Discord bot for Tribes Ascend Stat Data

Data scheme:

MapName, Blood Eagle Score, Player1, Player2, Player3, Player4, Player5, Player6, Player7

MapName, Diamond Sword Score, Player1, Player2, Player3, Player4, Player5, Player6, Player7

Input data example bulk:
4/3/18	Game 1	mcoot	1	mcoot1	Arx Novena	Blood Eagle	0

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
| 				  	 | 				 		| REF players(playerID)	| 				  	| 						| score INTEGER  		| playerID INTEGER[pk] 	|
| 				  	 | 				 		| 					  	| 				  	| REF maps(mapID) 		| REF gameMap(gameID) 	| REF gameMap(gameID) 	|
| 				  	 | 				 		| 						| 				  	| 						| REF teams(teamID)  	| REF teams(teamID)		|
| 				  	 | 				 		| 						| 				  	| 						| 					  	| REF players(playerID)	|
