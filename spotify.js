console.log("welcome!!")
let currentsong = new Audio;
let songs;
let currfolder;

async function getsongs(folder) {

    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currfolder}/`)[1])
        }
    }
    let songul = document.querySelector(".slist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div style="font-size: 10px;">${song.replaceAll("%20"," ")} </div>
                                <div style="font-size: 12px;">krishna</div>

                            </div>
                            <div class="playnow"> <span>Play Now</span>
                                <img class="invert" src="play.svg">
                            </div>
                        </li>`;
    }
    Array.from(document.querySelector(".slist").getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", element => {

            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    });
    return songs

}

const playMusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track
        //let audio = new Audio("/songs/" + track)
    if (!pause) {
        currentsong.play();
    }
    currentsong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = '00:00/00:00'

}
async function displayalbums() {
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    Array.from(anchors).forEach(e => {
        if (e.target.href.starWith("/songs")) {

        }
    })
}

async function main() {


    await getsongs("songs/ncs/shaky")
    playMusic(songs[0], true)

    // disply all albums


    //for play and pause the song
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg"
        } else {
            currentsong.pause();
            play.src = "play.svg"
        }
    })


    //listen for timeupdate 
    currentsong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = currentsong.currentTime / currentsong.duration * 100 + "%";
    });

    // Helper function to format seconds to MM:SS
    function secondsToMinutesSeconds(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }


    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })


    // add an hamburger
    document.querySelector(".ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = '0'
    })


    // add an event to close btn
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = '-90%'
    })

    // add an event for p
    prev.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0])

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })

    // add an event to nxt
    nxt.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0])

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",
        (e) => {

            currentsong.volume = parseInt(e.target.value) / 100
        })

    // load the card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async() => {
            const folder = e.dataset.folder;
            // Assuming `data-folder="..."` is set in HTML

            try {
                const songs = await getsongs(`songs/${folder}`);
                // Do something with songs here

            } catch (error) {

            }
            playMusic(songs[0])

        });
    });


    document.querySelector(".vol > img").addEventListener("click", e => {
        if (e.target.src.includes("vol.svg")) {
            e.target.src = e.target.src.replace("vol.svg", "mute.svg");
            currentsong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "vol.svg");
            currentsong.volume = 0.1;
            document.querySelector(".range input").value = 10;
        }
    });




    var audio = new Audio(songs[0]);
    audio.play();
    audio.addEventListener("ontimeupdate", () => {
        let duration = audio.duration;

    });
}

main()