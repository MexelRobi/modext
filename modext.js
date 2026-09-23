(() => {
    const mods = [
        {
            name: "Example",
            code: "Y29uc29sZS5sb2coJ21vZGV4dCBleHRlbnNpb24gcnVubmluZycpOw=="
        },
        {
            name: "Page Test",
            code: "ZG9jdW1lbnQuYm9keS5zdHlsZS5vdXRsaW5lID0gJzJweCBzb2xpZCByZWQnOw=="
        }
    ];

    const hostId = "modext-host";
    const toolbarId = "modext-toolbar";

    const modext = {
        version: "1.0.0",
        document,
        window,
        body: document.body,
        query: selector => document.querySelector(selector),
        queryAll: selector => document.querySelectorAll(selector),
        createElement: tag => document.createElement(tag),
        alert,
        log: (...args) => console.log("[modext]", ...args)
    };

    const decode = value => {
        const binary = atob(value);
        const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    };

    const execute = async code => {
        const source = decode(code);
        const fn = new Function("modext", `"use strict";\n${source}`);
        const result = fn(modext);

        if (result instanceof Promise) {
            await result;
        }
    };

    const createToolbar = () => {
        document.getElementById(hostId)?.remove();

        const host = document.createElement("div");
        const toolbar = document.createElement("div");

        host.id = hostId;
        toolbar.id = toolbarId;

        Object.assign(host.style, {
            display: "block",
            width: "100%",
            height: "48px",
            margin: "0",
            padding: "0",
            position: "relative",
            zIndex: "2147483647"
        });

        Object.assign(toolbar.style, {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "48px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            background: "rgba(20,20,20,.98)",
            borderBottom: "1px solid rgba(255,255,255,.15)",
            boxShadow: "0 2px 10px rgba(0,0,0,.25)",
            fontFamily: "system-ui,sans-serif"
        });

        host.appendChild(toolbar);

        document.body.insertBefore(host, document.body.firstChild);

        return toolbar;
    };

    const createButton = (toolbar, mod) => {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = mod.name;
        button.title = mod.name;

        Object.assign(button.style, {
            appearance: "none",
            border: "0",
            borderRadius: "7px",
            padding: "7px 11px",
            background: "#2d2d2d",
            color: "#fff",
            cursor: "pointer",
            fontSize: "13px",
            lineHeight: "1",
            transition: "background .15s, transform .1s"
        });

        button.addEventListener("mouseenter", () => {
            button.style.background = "#414141";
        });

        button.addEventListener("mouseleave", () => {
            button.style.background = "#2d2d2d";
        });

        button.addEventListener("mousedown", () => {
            button.style.transform = "scale(.96)";
        });

        button.addEventListener("mouseup", () => {
            button.style.transform = "scale(1)";
        });

        button.addEventListener("click", async () => {
            button.disabled = true;

            try {
                await execute(mod.code);
            } catch (error) {
                console.error(`[modext] ${mod.name}:`, error);
            } finally {
                button.disabled = false;
            }
        });

        toolbar.appendChild(button);
    };

    const init = () => {
        const toolbar = createToolbar();

        for (const mod of mods) {
            createButton(toolbar, mod);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
