let videointerval: NodeJS.Timeout | null = null;
let videos: string[] = [""];

export const changeToRandomWallpaper = (url?: string | null) => {
    let randomWallpaper: string;

    if (url && url !== "") {
        console.log("URL is set");
        randomWallpaper = url;
    } else {
        const validVideos = videos.filter((v) => v !== "");
        const randomIndex = Math.floor(Math.random() * validVideos.length);
        randomWallpaper = validVideos[randomIndex];
    }

    const videoElement = document.getElementById("fullscreen-bg-video") as HTMLVideoElement;
    if (videoElement) {
        videoElement.setAttribute("src", randomWallpaper);
        videoElement.volume = 0; // Mute the video
        console.log("Changed wallpaper to", randomWallpaper);
    }
};

export const startVideoInterval = (delay: number) => {
    stopVideoInterval(); // Clear any existing interval
    videointerval = setInterval(() => {
        changeToRandomWallpaper();
    }, delay * 60 * 1000); // Convert minutes to milliseconds
    console.log("Started video interval");
};

export const stopVideoInterval = () => {
    if (videointerval) {
        clearInterval(videointerval);
        videointerval = null;
        console.log("Stopped video interval");
    }
};

export const setVideos = (newVideos: string[]) => {
    videos = newVideos;
};

export const getVideos = () => videos;
