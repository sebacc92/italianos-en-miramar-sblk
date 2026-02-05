import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import HeroSlider from "~/components/HeroSlider/HeroSlider";
import { _ } from "compiled-i18n";

export default component$(() => {
    const title = _`home.title`;
    const subtitle = _`home.subtitle`;
    return (
        <>
            <HeroSlider
                description={subtitle}
                title={title}
            />
        </>
    );
});

export const head: DocumentHead = {
    title: _`home.metaTitle`,
    meta: [
        {
            name: "description",
            content: _`home.metaDescription`,
        },
    ],
};