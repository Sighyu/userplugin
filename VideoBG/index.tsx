import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { disableStyle, enableStyle } from "@api/Styles";
import { useForceUpdater } from "@utils/react";
import { DataStore } from "@api/index";
import Videos from "./components/Videos";
import styles from "./styles.css?managed";
import { Promisable } from "type-fest";
import { changeToRandomWallpaper, startVideoInterval, stopVideoInterval, setVideos, getVideos } from "./utils/videoUtils";

const settings = definePluginSettings({
    replace: {
        type: OptionType.COMPONENT,
        description: "",
        component: () => {
            const update = useForceUpdater();
            return (
                <Videos
                    title="Video URLs"
                    urls={getVideos()}
                    update={update}
                />
            );
        }
    },
    delay: {
        description: "How long to wait before the video changes (in min)",
        type: OptionType.SLIDER,
        markers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        default: 1,
        stickToMarkers: true,
    },
    EnableRandomVideoChange: {
        description: "Enable random video change",
        type: OptionType.BOOLEAN,
        default: false,
    },
});

export default definePlugin({
    name: "Video Background",
    description: "Set a video as your background!",
    authors: [
        {
            id: 586633092379443200n,
            name: "Ryu.",
        },
    ],
    settings,
    beforeSave(options: Record<string, any>): Promisable<string | true> {
        stopVideoInterval();
        if (options.EnableRandomVideoChange) {
            startVideoInterval(options.delay);
        }
        return true;
    },
    start() {
        enableStyle(styles);
        DataStore.get("videos").then((v) => {
            if (v) {
                const videodatastore = v as string[];
                if (videodatastore.length > 0) {
                    setVideos(videodatastore);
                    changeToRandomWallpaper();
                    if (settings.store.EnableRandomVideoChange) {
                        startVideoInterval(settings.store.delay);
                    }
                }
            }
        });

        const findVideoClass = document.getElementsByClassName("fullscreen-bg");
        const findAppMount = document.getElementById("app-mount");
        if (findVideoClass.length === 0 && findAppMount) {
            findAppMount.style.backgroundColor = "transparent";

            const newDiv = document.createElement("div");
            newDiv.id = "fullscreen-bg";
            newDiv.className = "fullscreen-bg";

            const newVideo = document.createElement("video");
            newVideo.id = "fullscreen-bg-video";
            newVideo.className = "fullscreen-bg-video";
            newVideo.setAttribute("autoplay", "true");
            newVideo.setAttribute("loop", "true");
            newVideo.setAttribute("muted", "true");
            newVideo.setAttribute("playsinline", "true");

            const source = document.createElement("source");
            newVideo.appendChild(source);
            newDiv.insertAdjacentElement("beforeend", newVideo);

            findAppMount.insertAdjacentElement("beforeend", newDiv);
        } else {
            console.log("Fullscreen-bg class already exists!");
            changeToRandomWallpaper();
        }
    },
    stop() {
        disableStyle(styles);
        const findVideoClass = document.getElementsByClassName("fullscreen-bg");
        if (findVideoClass.length > 0) {
            findVideoClass[0].remove();
        }
    },
});
