import { Button, Forms, TextInput, React, useState } from "@webpack/common";
import { Flex } from "@components/Flex";
import { DeleteIcon, OwnerCrownIcon } from "@components/Icons";
import { DataStore } from "@api/index";
import { changeToRandomWallpaper } from "../utils/videoUtils";

interface VideosProps {
    title: string;
    urls: string[];
    update: () => void;
}

const Input = ({ initialValue, onChange, placeholder }: { initialValue: string; onChange(value: string): void; placeholder: string; }) => {
    const [value, setValue] = useState(initialValue);

    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChange={setValue}
            spellCheck={false}
            onBlur={() => value !== initialValue && onChange(value)}
        />
    );
};

const Videos = ({ title, urls, update }: VideosProps) => {
    const onClickRemove = async (index: number) => {
        if (index === urls.length - 1) return;
        urls.splice(index, 1);
        await DataStore.set("videos", urls);
        update();
    };

    const onChange = async (e: string, index: number) => {
        if (index === urls.length - 1) urls.push("");
        urls[index] = e;
        if (urls[index] === "" && index !== urls.length - 1) urls.splice(index, 1);
        await DataStore.set("videos", urls);
        update();
    };

    return (
        <>
            <Forms.FormTitle tag="h4">{title}</Forms.FormTitle>
            <Flex flexDirection="column" style={{ gap: "0.5em" }}>
                {urls.map((url, index) => (
                    <React.Fragment key={`${url}-${index}`}>
                        <Flex flexDirection="row" style={{ gap: 0 }}>
                            <Flex flexDirection="row" style={{ flexGrow: 1, gap: "0.5em" }}>
                                <Input
                                    placeholder="URL"
                                    initialValue={url}
                                    onChange={(e) => onChange(e, index)}
                                />
                            </Flex>
                            <Button
                                size={Button.Sizes.MIN}
                                onClick={() => changeToRandomWallpaper(url)}
                                style={{
                                    background: "none",
                                    color: "var(--text-warning)",
                                    ...(index === urls.length - 1 ? { visibility: "hidden", pointerEvents: "none" } : {})
                                }}
                            >
                                <OwnerCrownIcon />
                            </Button>
                            <Button
                                size={Button.Sizes.MIN}
                                onClick={() => onClickRemove(index)}
                                style={{
                                    background: "none",
                                    color: "var(--status-danger)",
                                    ...(index === urls.length - 1 ? { visibility: "hidden", pointerEvents: "none" } : {})
                                }}
                            >
                                <DeleteIcon />
                            </Button>
                        </Flex>
                    </React.Fragment>
                ))}
            </Flex>
        </>
    );
};

export default Videos;
