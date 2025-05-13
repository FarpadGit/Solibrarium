import { cleanup, render, screen } from "@testing-library/react";
import { AllWrapper } from "./wrappers";

export function matchByText(text, options) {
    const {...getByTextOptions} = options ?? {}
    return screen.getByText(text, {exact: false, ...getByTextOptions});
}

export async function renderAsync(component, ...params) {
    const ComponentToTest = await component({
    params: Promise.resolve(...params),
    });
    cleanup();
    return render(ComponentToTest, { wrapper: AllWrapper });
}