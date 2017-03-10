Installing
--

1. Ensure you have a fairly modern version of nodejs (I'm using v6.5.0)
2. Download/unzip or ```git clone``` the repo
3. Run ```npm install```

Running
--

 - I don't know how the community feels about steal beat maps from Osu and uploading them under your own name on Soundboxing - it's probably best to just stick to uploading your own Osu files, and not others
 - I don't know how the Soundboxing team feel about this tool - don't be surprised if they delete your beatmaps or what not - I'm sure it won't be a problem we don't abuse their servers
 - You need a YouTube video that matches the Osu file to the second. I've been downloading and decompressing the Osz files and looking at the MP3 to ensure the YouTube video length matches the MP3 length 
 - I've only tested this on Windows - your milage may vary
 - By default right hand has everything that has a "normal" sound in Osu, and left hand gets everything else. You can set the "Use Combo" if you want the hands to alternate every time there is a new combo.

Run ```npm start``` from within the directory and follow the prompts

A successful run looks like this:

```
C:\Users\micha\Dropbox\soundboxing-hacking\osu-soundboxing-importer>node index.js
URL for the YouTube Video:  (https://www.youtube.com/watch?v=RNMyjTGGqdY) https://www.youtube.com/watch?v=iBv3bkZ_4Q4
X-Auth-Token-Id - can be found by playing soundboxing with fiddler open:  (xxxxxx-xxxx-xxxxxx-xxxx-xxxxxxxxxxx)
X Divisor (small number further apart orbs):  (500) 420
Y Divisor (small number further apart orbs):  (1000) 900
Offset the Y height so that it's at standing level (in meters):  (0.9)
Path to osz file:  (18260 Masayoshi Minoshima feat. nomico - Bad Apple!!.osz) 107979 Subkulture feat. Klayton of Celldweller - Erasus.osz
Use Combo to switch hands rather than sound type:  (false)
Subkulture feat. Klayton of Celldweller - Erasus (ErunamoJAZZ) [Easy].osu
Subkulture feat. Klayton of Celldweller - Erasus (ErunamoJAZZ) [EraseUs v2].osu
Subkulture feat. Klayton of Celldweller - Erasus (ErunamoJAZZ) [EraseUs].osu
Subkulture feat. Klayton of Celldweller - Erasus (ErunamoJAZZ) [Inner'Us].osu
Subkulture feat. Klayton of Celldweller - Erasus (ErunamoJAZZ) [Insane].osu
Subkulture feat. Klayton of Celldweller - Erasus (ErunamoJAZZ) [Kurokami's Rain].osu
Subkulture feat. Klayton of Celldweller - Erasus (ErunamoJAZZ) [Normal].osu
Subkulture feat. Klayton of Celldweller - Erasus (ErunamoJAZZ) [Nyu's Hard].osu
filename:  Subkulture feat. Klayton of Celldweller - Erasus (ErunamoJAZZ) [EraseUs v2].osu
Uplaoded to SoundBoxing - link to challenge https://www.soundboxing.co/challenge/ac94b39e-0592-11e7-8e35-0a580a200003
```