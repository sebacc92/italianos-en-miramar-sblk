import { apiPlugin } from "@storyblok/js";
import StoryblokClient from "storyblok-js-client";

export const storyblokConfig = {
    accessToken: import.meta.env.PUBLIC_STORYBLOK_TOKEN,
    use: [apiPlugin],
    components: {
        // Component mapping will go here eventually
    },
};

export const getStoryblokApi = () => {
    return new StoryblokClient({
        accessToken: import.meta.env.PUBLIC_STORYBLOK_TOKEN,
    });
};
