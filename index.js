var fs = require('fs')
var protobuf = require('protocol-buffers')
var uuidV4 = require('uuid/v4');
var request = require('request');
var parser = require('osu-parser');
var Q = require("q");
var ytdl = require('ytdl-core');
var prompt = require('prompt');
var unzip = require('unzip');

var messages = protobuf(fs.readFileSync('soundboxing.proto')) /*load the protobuf prototype */

/* Creates a perfomance object that contains details from youtube video scraping */
function CreatePerformanceStubWithYoutubeDetails(data){
    var deferred = Q.defer();
    ytdl.getInfo(data.youtube_url,{}, function(err,info){
        if (err){
            console.log(err)
            deffered.reject(err)
        }
        performance = {}
        performance.YoutubeId = info.video_id
        performance.SongName = "[Osu Import] " + info.title
        performance.SongLength = info.length_seconds
        performance.Seconds = info.length_seconds
        performance.SongChannel = info.author.name
        performance.SongThumbnail = info.thumbnail_url
        performance.SongThumbnailWidth = 120 /* probably shouldn't presume these */
        performance.SongThumbnailHeight = 90
        performance.frames = [] /* we don't subsmit frames - maybe we could later */
        performance.punches = data.punches
        data.performance = performance
        deferred.resolve(data);
    })
    return deferred.promise;
}


/* Loads in an Osu file and return bunches */
function loadOsu(settings){
    var deferred = Q.defer();

     fs.createReadStream(settings.path)
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
        var fileName = entry.path;
        var type = entry.type; // 'Directory' or 'File'
        var size = entry.size;
        if (fileName == settings.filename){
                parser.parseStream(entry, function(err, beatmap) {
                    var render = [];
                    var left = false;
                    var performance_id = uuidV4();
                    for (var i = 0; i < beatmap.hitObjects.length; i++) {
                        var hit = beatmap.hitObjects[i]
                        var new_punch = single_punch_factory(performance_id);
                        new_punch.punch_id = uuidV4()
                        new_punch.timestamp = hit.startTime / 1000;
                        new_punch.x = (hit.position[0] - 256) / settings.x_div;
                        new_punch.y = (hit.position[1] / settings.y_div) + settings.height_offset;
                        if (settings.use_combo==true){
                            if (hit.newCombo == true){
                            left = !left;
                            }
                            new_punch.is_left = left;
                        } else {
                            if (hit.soundTypes.indexOf("whistle") != -1) {
                                new_punch.is_left = true
                            }
                            if (hit.soundTypes.indexOf("clap") != -1) {
                                new_punch.is_left = true
                            }
                            if (hit.soundTypes.indexOf("finish") != -1) {
                                new_punch.is_left = true
                            }
                        }
                        render.push(new_punch)
                    }
                    settings.punches = render;
                    deferred.resolve(settings);
            });      
        } else {
            entry.autodrain();
        }
    })
    //var stream = fs.createReadStream(filename);
 return deferred.promise;

}

/* creates a stub object for a punch */
function single_punch_factory(performance_id) {
    return {
        performance_id: performance_id,
        timestamp: 10,
        z: 0,
        v_x: 0,
        v_y: 0,
        v_z: 0,
        is_left: false
    }
}



function uploadBeatMap(data){
    var deferred = Q.defer();
    var buf = messages.Performance.encode(data.performance);
    var options = {
        url: "https://api.soundboxing.co/performance/v2",
        headers: {
            "X-Auth-Token-Id": data.api_key
        }
    };
    var req = request.post(options, function(err, resp, body) {
        if (err) {
            console.log('Error!');
            console.log(err);
            deferred.reject(err);
        } else {
            deferred.resolve(JSON.parse(body));
        }
    });    
    var form = req.form();
    form.append('data', buf, {
        filename: 'data',
        contentType: 'application/octet-stream'
    });
    return deferred.promise;
}


function getUserInput(){
    var deferred = Q.defer();
    prompt.message = ""
    var schema = {
        properties: {
        youtube_url: {
            description: "URL for the YouTube Video",
            default: "https://www.youtube.com/watch?v=RNMyjTGGqdY"
        },
        api_key: {
            description: "X-Auth-Token-Id - can be found by playing soundboxing with fiddler open"
        },
        x_div: {
            description: "X Divisor (small number further apart orbs)",
            default: 500,
            type: "number"
        },
        y_div: {
            description: "Y Divisor (small number further apart orbs)",
            default: 1000,
            type: "number"
        },    
        height_offset: {
            description: "Offset the Y height so that it's at standing level (in meters)",
            default: 0.9,
            type: "number"
        },
        path:{
            description: "Path to osz file",
            default: "18260 Masayoshi Minoshima feat. nomico - Bad Apple!!.osz"
        },
        use_combo:{
            description: "Use Combo to switch hands rather than sound type",
            type: 'boolean',
            default: false
        }
        }
    };

    prompt.get(schema, function (err, result) {
        deferred.resolve(result)
    });
    return deferred.promise;
}

function getFileName(settings){
    var deferred = Q.defer();
    var getFileNames = []
    fs.createReadStream(settings.path)
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
        var fileName = entry.path;
        var type = entry.type; // 'Directory' or 'File'
        var size = entry.size;
        if (/\.osu$/i.test(fileName)){
            getFileNames.push(fileName);
        }
        entry.autodrain();
    }).on('close', function () {
        prompt.start();
        console.log(getFileNames.join("\r\n"));
        prompt.get(["filename"], function(err, result){
            settings.filename = result.filename
            deferred.resolve(settings)
        });
    });
    return deferred.promise;
}
getUserInput()
    .then(getFileName)
    .then(loadOsu)
    .then(CreatePerformanceStubWithYoutubeDetails)
    .then(uploadBeatMap)
    .then(function(data){
        console.log("Uplaoded to SoundBoxing - link to challenge https://www.soundboxing.co/challenge/" + data.id)
    });